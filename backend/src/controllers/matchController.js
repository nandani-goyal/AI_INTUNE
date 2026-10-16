import User from "../models/User.js";
import Match from "../models/Match.js";
import cosineSimilarity from "compute-cosine-similarity";

/**
 * Stage 1: Candidate Shortlist Retrieval
 * Leverages MongoDB Atlas Vector Search ($vectorSearch) to query the top-K
 * nearest candidate profiles in O(log N) time using the 384-dim overall embedding.
 * Falls back safely to indexed query if Atlas vector search index is not yet initialized.
 */
const retrieveCandidates = async (currentUser, limit = 30) => {
  try {
    const rawCandidates = await User.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: currentUser.embedding,
          numCandidates: Math.max(limit * 3, 50),
          limit: limit + 1
        }
      }
    ]);

    // Exclude the current user from the returned vector neighbors
    const vectorCandidates = rawCandidates.filter(
      (c) => c._id.toString() !== currentUser._id.toString()
    );

    if (vectorCandidates && vectorCandidates.length > 0) {
      console.log(`Vector search retrieved ${vectorCandidates.length} candidates using index 'vector_index'`);
      return vectorCandidates;
    }
  } catch (err) {
    console.warn(
      "Atlas $vectorSearch fallback active (index 'vector_index' may need creation in Atlas):",
      err.message
    );
  }

  // Graceful fallback: retrieve candidate users with embeddings
  return await User.find({
    _id: { $ne: currentUser._id },
    embedding: { $exists: true, $ne: [] }
  }).limit(limit * 2);
};

/**
 * Stage 2: Multi-Axis Re-Ranking & Compatibility Scoring
 * Applies the 5 domain-specific compatibility weights to the retrieved shortlist:
 * - Cleanliness: 25%
 * - Sleep Schedule: 25%
 * - Lifestyle / Routine: 20%
 * - Social Life: 15%
 * - Cooking / Food: 15%
 */
const scoreAndRankCandidates = (currentUser, candidates) => {
  const scoredMatches = [];

  const safeSimilarity = (vecA, vecB, fallbackVecA, fallbackVecB) => {
    if (
      !vecA ||
      !vecB ||
      !Array.isArray(vecA) ||
      !Array.isArray(vecB) ||
      vecA.length === 0 ||
      vecB.length === 0
    ) {
      if (fallbackVecA && fallbackVecB && fallbackVecA.length > 0 && fallbackVecB.length > 0) {
        const fallbackSim = cosineSimilarity(fallbackVecA, fallbackVecB);
        return Number.isNaN(fallbackSim) || fallbackSim === null ? 0.5 : fallbackSim;
      }
      return 0.5;
    }
    const sim = cosineSimilarity(vecA, vecB);
    return Number.isNaN(sim) || sim === null ? 0.5 : sim;
  };

  const userEmbeddings = currentUser.embeddings || {};

  for (const candidate of candidates) {
    if (!candidate.embedding) continue;

    const candEmbeddings = candidate.embeddings || {};

    const cleanliness = safeSimilarity(
      userEmbeddings.cleanliness,
      candEmbeddings.cleanliness,
      currentUser.embedding,
      candidate.embedding
    );

    const sleep = safeSimilarity(
      userEmbeddings.sleepSchedule,
      candEmbeddings.sleepSchedule,
      currentUser.embedding,
      candidate.embedding
    );

    const social = safeSimilarity(
      userEmbeddings.socialLife,
      candEmbeddings.socialLife,
      currentUser.embedding,
      candidate.embedding
    );

    const lifestyle = safeSimilarity(
      userEmbeddings.dailyRoutine,
      candEmbeddings.dailyRoutine,
      currentUser.embedding,
      candidate.embedding
    );

    const food = safeSimilarity(
      userEmbeddings.cookingHabits,
      candEmbeddings.cookingHabits,
      currentUser.embedding,
      candidate.embedding
    );

    const overall =
      cleanliness * 0.25 +
      sleep * 0.25 +
      social * 0.15 +
      lifestyle * 0.20 +
      food * 0.15;

    scoredMatches.push({
      user1: currentUser._id,
      user2: candidate._id,
      score: Math.round(overall * 100),
      criteriaScores: {
        cleanliness: Math.round(cleanliness * 100),
        sleep_schedule: Math.round(sleep * 100),
        social_habits: Math.round(social * 100),
        lifestyle: Math.round(lifestyle * 100),
        food: Math.round(food * 100)
      }
    });
  }

  // Sort descending by overall score
  scoredMatches.sort((a, b) => b.score - a.score);

  // Return top 5
  return scoredMatches.slice(0, 5);
};

export const generateMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser || !currentUser.embedding || currentUser.embedding.length === 0) {
      return res.status(400).json({
        msg: "User embedding not found. Please complete your voice profile first."
      });
    }

    // Stage 1: Vector Search candidate retrieval (Top 30 semantically closest users)
    const candidates = await retrieveCandidates(currentUser, 30);

    // Stage 2: Re-rank candidates using the 5-axis weighted compatibility formula
    const topMatches = scoreAndRankCandidates(currentUser, candidates);

    // Clear previous matches for this user
    await Match.deleteMany({
      $or: [
        { user1: currentUser._id },
        { user2: currentUser._id }
      ]
    });

    // Bidirectional storage so both users can query their matches in O(1)
    const finalMatches = [];
    for (const match of topMatches) {
      finalMatches.push(match);
      finalMatches.push({
        user1: match.user2,
        user2: match.user1,
        score: match.score,
        criteriaScores: match.criteriaScores
      });
    }

    if (finalMatches.length > 0) {
      await Match.insertMany(finalMatches);
    }

    res.json(topMatches);
  } catch (err) {
    console.error("Generate matches error:", err);
    res.status(500).json({
      msg: err.message
    });
  }
};

export const getMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      user1: req.user._id
    }).populate(
      "user2",
      "name anonymousId voiceProfile"
    );

    res.json(matches);
  } catch (err) {
    res.status(500).json({
      msg: err.message
    });
  }
};
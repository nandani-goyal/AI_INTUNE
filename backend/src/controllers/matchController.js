import User from "../models/User.js";
import Match from "../models/Match.js";
import cosineSimilarity from "compute-cosine-similarity";

export const generateMatches = async (req, res) => {

  try {

    const currentUser = await User.findById(
      req.user._id
    );

    if (!currentUser.embedding) {
      return res.status(400).json({
        msg: "User embedding not found"
      });
    }

    const users = await User.find({
      _id: { $ne: currentUser._id }
    });

    const matches = [];

    for (const user of users) {

      if (!user.embedding) continue;

//       const overall =
//  cosineSimilarity(
//   currentUser.embedding,
//   user.embedding
//  );

//       const score = Math.round(
//         overall * 100
//       );
      const cleanliness =
 cosineSimilarity(
  currentUser.embeddings.cleanliness,
  user.embeddings.cleanliness
 );

const sleep =
 cosineSimilarity(
  currentUser.embeddings.sleepSchedule,
  user.embeddings.sleepSchedule
 );

const social =
 cosineSimilarity(
  currentUser.embeddings.socialLife,
  user.embeddings.socialLife
 );

const lifestyle =
 cosineSimilarity(
  currentUser.embeddings.dailyRoutine,
  user.embeddings.dailyRoutine
 );

const food =
 cosineSimilarity(
  currentUser.embeddings.cookingHabits,
  user.embeddings.cookingHabits
 );

const overall =

(cleanliness * 0.25) +
(sleep * 0.25) +
(social * 0.15) +
(lifestyle * 0.20) +
(food * 0.15);
      matches.push({



 user1:currentUser._id,

 user2:user._id,

 

 score:
   Math.round(overall*100),

 criteriaScores:{

   cleanliness:
    Math.round(cleanliness*100),

   sleep_schedule:
    Math.round(sleep*100),

   social_habits:
    Math.round(social*100),

   lifestyle:
    Math.round(lifestyle*100),

   food:
    Math.round(food*100)
}
});
    }

    matches.sort(
      (a, b) => b.score - a.score
    );

    const topMatches =
      matches.slice(0, 5);

    await Match.deleteMany({
  $or: [
    { user1: currentUser._id },
    { user2: currentUser._id }
  ]
});

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

await Match.insertMany(finalMatches);

    res.json(topMatches);

  } catch (err) {

    res.status(500).json({
      msg: err.message
    });

  }

};

export const getMatches = async (
  req,
  res
) => {

  try {

    const matches =
      await Match.find({
        user1: req.user._id
      })
      .populate(
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
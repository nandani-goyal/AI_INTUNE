import User from "../models/User.js";

const getEmbeddingFromService = async (text) => {
  const serviceUrls = [
    process.env.AI_SERVICE_URL,
    "http://127.0.0.1:7860/embed",
    "http://localhost:7860/embed",
    "https://nanda-ai-intune-ai-service.hf.space/embed"
  ].filter(Boolean);

  let lastError = null;

  for (const url of serviceUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.embedding)) {
          return data.embedding;
        }
      }
    } catch (err) {
      lastError = err;
    }
  }

  console.warn("Could not generate embedding from AI service:", lastError?.message || "Service unavailable");
  return null;
};

export const saveVoiceProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        msg: "User not found"
      });
    }

    // 1. Assign voice profile answers immediately
    user.voiceProfile = {
      roommatePreference: req.body.roommatePreference || "",
      sleepSchedule: req.body.sleepSchedule || "",
      cleanliness: req.body.cleanliness || "",
      socialLife: req.body.socialLife || "",
      cookingHabits: req.body.cookingHabits || "",
      dailyRoutine: req.body.dailyRoutine || ""
    };

    user.profileText = `
${user.voiceProfile.roommatePreference}
${user.voiceProfile.sleepSchedule}
${user.voiceProfile.cleanliness}
${user.voiceProfile.socialLife}
${user.voiceProfile.cookingHabits}
${user.voiceProfile.dailyRoutine}
`.trim();

    // 2. Fetch overall embedding
    const overallEmbedding = await getEmbeddingFromService(user.profileText);
    if (overallEmbedding) {
      user.embedding = overallEmbedding;
    }

    // 3. Fetch per-field embeddings
    const fields = {
      roommatePreference: user.voiceProfile.roommatePreference,
      sleepSchedule: user.voiceProfile.sleepSchedule,
      cleanliness: user.voiceProfile.cleanliness,
      socialLife: user.voiceProfile.socialLife,
      cookingHabits: user.voiceProfile.cookingHabits,
      dailyRoutine: user.voiceProfile.dailyRoutine
    };

    user.embeddings = user.embeddings || {};

    for (const key in fields) {
      if (fields[key]) {
        const fieldEmbedding = await getEmbeddingFromService(fields[key]);
        if (fieldEmbedding) {
          user.embeddings[key] = fieldEmbedding;
        }
      }
    }

    // 4. Save to MongoDB - this ensures voiceProfile is ALWAYS saved!
    await user.save();
    console.log("Voice profile and embeddings saved to MongoDB for user:", user._id);

    // 5. Trigger match generation if local port is available
    const port = process.env.PORT || 5000;
    try {
      if (req.headers.authorization && user.embedding) {
        await fetch(`http://127.0.0.1:${port}/api/matches/generate`, {
          method: "POST",
          headers: {
            Authorization: req.headers.authorization
          }
        });
      }
    } catch (matchErr) {
      console.warn("Auto match generation warning:", matchErr.message);
    }

    res.status(200).json({
      msg: "Voice profile saved successfully",
      voiceProfile: user.voiceProfile,
      hasEmbeddings: Boolean(user.embedding && user.embedding.length > 0)
    });

  } catch (err) {
    console.error("Error in saveVoiceProfile:", err);
    res.status(500).json({
      msg: err.message
    });
  }
};

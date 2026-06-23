import User from "../models/User.js";

export const saveVoiceProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        msg: "User not found"
      });
    }

    user.voiceProfile = {
      roommatePreference: req.body.roommatePreference,
      sleepSchedule: req.body.sleepSchedule,
      cleanliness: req.body.cleanliness,
      socialLife: req.body.socialLife,
      cookingHabits: req.body.cookingHabits,
      dailyRoutine: req.body.dailyRoutine
    };

    user.profileText = `
${req.body.roommatePreference}
${req.body.sleepSchedule}
${req.body.cleanliness}
${req.body.socialLife}
${req.body.cookingHabits}
${req.body.dailyRoutine}
`;
const response = await fetch(
  "http://localhost:8000/embed",
  {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      text:user.profileText
    })
  }
);

const data = await response.json();
console.log("Embedding length:", data.embedding?.length);
console.log("First 5 values:", data.embedding?.slice(0,5));
user.embedding = data.embedding;
console.log("Modified paths:", user.modifiedPaths());

    await user.save();
    const updatedUser = await User.findById(user._id);

console.log(
  "Saved embedding length:",
  updatedUser.embedding?.length
);
    console.log(
  "Saved user embedding"
);

    res.status(200).json({
      msg: "Voice profile saved successfully"
    });

  } catch (err) {

    res.status(500).json({
      msg: err.message
    });

  }
};
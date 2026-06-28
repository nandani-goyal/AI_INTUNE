import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    score: {
      type: Number,
      required: true
    },
    criteriaScores:{
  cleanliness:Number,
  sleep_schedule:Number,
  social_habits:Number,
  lifestyle:Number,
  food:Number
}
  },
  { timestamps: true }
);

export default mongoose.model("Match", matchSchema);
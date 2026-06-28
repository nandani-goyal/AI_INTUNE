import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    email:       { type: String, required: true, unique: true },
    password:    { type: String, required: true },
    anonymousId: { type: String, required: true, unique: true }, 
    voiceProfile: {
   roommatePreference: String,
   sleepSchedule: String,
   cleanliness: String,
   socialLife: String,
   cookingHabits: String,
   dailyRoutine: String,
   } ,
   profileText: String,
   embedding:[Number],
   embeddings:{
   roommatePreference:[Number],
   sleepSchedule:[Number],
   cleanliness:[Number],
   socialLife:[Number],
   cookingHabits:[Number],
   dailyRoutine:[Number]
}
  },

  { timestamps: true },
  
);


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPwd) {
  return bcrypt.compare(enteredPwd, this.password);
};


export default mongoose.model('User', userSchema);

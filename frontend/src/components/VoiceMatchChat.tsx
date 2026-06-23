
import { useState } from "react";



const questions = [
  "Describe your ideal roommate.",
  "What time do you usually sleep?",
  "How clean do you like your room?",
  "How social are you?",
  "Do you cook frequently?",
  "Describe your daily routine."
];

const VoiceMatchChat = () => {
const [current, setCurrent] = useState(0);

const [answer, setAnswer] = useState("");

const [answers, setAnswers] = useState<string[]>([]);
const [completed, setCompleted] = useState(false);

const startListening = () => {

 const SpeechRecognition =
  (window as any).SpeechRecognition ||
  (window as any).webkitSpeechRecognition;

 const recognition =
  new SpeechRecognition();

 recognition.onresult = (event:any) => {

   setAnswer(
     event.results[0][0].transcript
   );

 };

 recognition.start();

};
const handleNext = async () => {
   if (!answer.trim()) {
    alert("Please enter an answer");
    return;
  }
  const updatedAnswers = [...answers, answer];

  setAnswers(updatedAnswers);

  setAnswer("");

  if (current < questions.length - 1) {
    setCurrent(current + 1);
  } else {

    try {

  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://localhost:5000/api/profile/voice-profile",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        roommatePreference: updatedAnswers[0],
        sleepSchedule: updatedAnswers[1],
        cleanliness: updatedAnswers[2],
        socialLife: updatedAnswers[3],
        cookingHabits: updatedAnswers[4],
        dailyRoutine: updatedAnswers[5]
      })
    }
  );

  const data = await res.json();

  console.log(data);

  alert("Voice Profile Saved!");

} catch(err) {

  console.error(err);

}
    setCompleted(true);
    
  }
};
if (completed) {
  return (
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-green-600">
        Voice Profile Completed ✅
      </h2>

      <p className="mt-4">
        Thank you for completing your roommate profile.
      </p>
    </div>
  );
}

  return (
    <div className="p-6 bg-white rounded-lg">

      <h2 className="text-xl font-bold mb-4">
        {questions[current]}
      </h2>

      <textarea
        value={answer}
        onChange={(e)=>setAnswer(e.target.value)}
        className="w-full border p-3"
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 mt-4"
       onClick={handleNext}>

        Next
      </button>

      <button
  onClick={startListening}
  className="bg-green-500 text-white px-4 py-2 mt-2 mr-2"
>
 🎤 Speak
</button>

    </div>
  );
};

export default VoiceMatchChat;
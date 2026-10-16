import { useState } from "react";
import { BACKEND_URL } from "@/lib/api";

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
  const [loading, setLoading] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your answer.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.onresult = (event: any) => {
      setAnswer(event.results[0][0].transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  const handleNext = async () => {
    if (!answer.trim()) {
      alert("Please enter an answer");
      return;
    }

    const updatedAnswers = [...answers, answer.trim()];
    setAnswers(updatedAnswers);
    setAnswer("");

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("You are not logged in! Please log in first so your profile can be saved.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${BACKEND_URL}/api/profile/voice-profile`, {
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
        });

        const contentType = res.headers.get("content-type") || "";
        let data: any = {};
        if (contentType.includes("application/json")) {
          data = await res.json();
        } else {
          const text = await res.text();
          throw new Error(
            `Backend returned non-JSON response (${res.status} ${res.statusText}). Check your backend URL or server logs.`
          );
        }

        if (!res.ok) {
          throw new Error(data.msg || "Failed to save voice profile");
        }

        console.log("Profile saved response:", data);
        alert("Voice Profile Saved Successfully!");
        setCompleted(true);
      } catch (err: any) {
        console.error("Save voice profile error:", err);
        alert(`Error saving profile: ${err.message || "Something went wrong"}`);
      } finally {
        setLoading(false);
      }
    }
  };

  if (completed) {
    return (
      <div className="p-6 bg-white rounded-lg">
        <h2 className="text-2xl font-bold text-green-600">
          Voice Profile Completed ✅
        </h2>
        <p className="mt-4 text-gray-700">
          Thank you for completing your roommate profile! Your preferences have been saved to the database.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Question {current + 1} of {questions.length}
        </span>
      </div>

      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {questions[current]}
      </h2>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={loading}
        placeholder="Type or speak your answer here..."
        className="w-full border p-3 rounded min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={startListening}
          disabled={loading}
          type="button"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
        >
          🎤 Speak
        </button>

        <button
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded font-medium transition-colors"
          onClick={handleNext}
          disabled={loading}
          type="button"
        >
          {loading
            ? "Saving Profile..."
            : current < questions.length - 1
            ? "Next"
            : "Finish & Save"}
        </button>
      </div>
    </div>
  );
};

export default VoiceMatchChat;
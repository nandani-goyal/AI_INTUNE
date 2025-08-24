# 🎧 InTune – AI Roommate Compatibility Platform

A SheBuilds 2025 Hackathon Project by Team Saarthi

**React | Firebase | AI | Status Hackathon**

---

## 🚀 What is InTune?

InTune is a **voice-powered AI platform** that helps users find emotionally and practically compatible roommates. Built for the real world — where trust, comfort, and communication matter — InTune ensures secure onboarding, AI-powered matching, anonymous chatting, room decor suggestions, and expense tracking, all in one seamless flow.

**Think Tinder meets LinkedIn, but for roommates — with AI listening to your vibe.**

---

## ✨ Key Features

| Feature                | 🧩 Description                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------- |
| **Secure Onboarding**  | OCR Verification to block fake users                                                  |
| **VoiceMatch**         | Voice-based onboarding using Omnidim assistant                                        |
| **AI Matching Engine** | Uses AI embeddings + cosine similarity + custom logic to suggest compatible roommates |
| **MatchMeter**         | Top 5 matches with visual score breakdown                                             |
| **ChatterBox**         | Anonymous, passkey-protected real-time chat                                           |
| **StyleMatch**         | AI-powered room decor suggestions using uploaded room photos                          |
| **Roommate Gallery**   | Upload happy stories + photos post-match                                              |
| **SplitMate**          | Expense tracker to fairly split shared costs                                          |
| **Admin Dashboard**    | Moderation, reports, match control                                                    |
| **GuideBot**           | GPT-powered conflict resolution assistant                                             |

---

## 🧠 How It Works (User Flow)

```mermaid
flowchart TD
    A[Register & Verify] --> B[Voice Onboarding]
    B --> C[AI Matching Engine]
    C --> D[Browse Matches on MatchMeter]
    D --> E[Start Secure Chats via ChatterBox]
    E --> F{Roommate Chosen?}
    
    F -->|Yes| G[StyleMatch Decor Suggestions]
    F -->|No| D   %% Loop back to browsing matches

    G --> H[SplitMate Tracks Expenses]
    H --> I[GuideBot Conflict Resolution]

```



---

## 🛠️ Tech Stack

| Layer          | Technology Used                                          |
| -------------- | -------------------------------------------------------- |
| Frontend       | React.js, Tailwind CSS, Framer Motion                    |
| Backend        | Express.js (Node.js)                                     |
| Authentication | Firebase Auth + Anonymous ID Generator                   |
| Voice Survey   | Omnidim.io + Webhook                                     |
| OCR            | EasyOCR + OpenCV                                         |
| Database       | MongoDB Atlas                                            |
| AI Matching    | AI embeddings + cosine similarity + custom scoring logic |
| Chat System    | Firebase Realtime DB + chatroom passkey system           |
| Decor AI       | Replicate API + OpenAI GPT                               |
| Conflict Bot   | GPT 3.5 (GuideBot)                                       |
| Deployment     | Vercel (Frontend), Render/Railway (Backend)              |

---

## 🔐 Security & Privacy

✅ Aadhaar-based real name verification
✅ Anonymous user IDs until match is confirmed
✅ Chat encryption and access control
✅ Admin monitoring for reports and issues

---

## 📂 Project Structure

```
/frontend    - React app
/backend     - Express API + webhook + AI logic
/AI_Model    - Matching engine (Python: embeddings + logic)
/utils       - OCR, matching helpers
/artifacts   - Saved embeddings and scoring data
```

---

## 🧪 Run Locally

```bash
# clone repo
git clone https://github.com/YOUR_USERNAME/InTune.git

# frontend
cd frontend
npm install
npm run dev

# backend
cd ../backend
npm install
node server.js

# AI model (Python)
cd ../AI_Model
pip install -r requirements.txt
python match.py
```

---

## 💡 Future Plans

* 📱 Add mobile-first PWA
* 🌍 Multi-language voice onboarding
* 🎯 Personalized roommate tips after match
* 🛡️ Video KYC + AI moderation

---

## 📬 Feedback?

Feel free to open issues or drop feedback! Let’s make AI roommate matching **emotional, ethical, and exciting! 💜**


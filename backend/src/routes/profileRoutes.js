import express from "express";

import { saveVoiceProfile }
from "../controllers/profileController.js";

import { protect }
from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/voice-profile",
  protect,
  saveVoiceProfile
);

export default router;

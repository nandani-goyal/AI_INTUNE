import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// GET /api/auth/me  → returns the logged-in user (except password)
router.get('/me', protect, async (req, res) => {
  res.json(req.user);     // req.user comes from protect middleware
});

export default router;

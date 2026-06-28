import express from "express";

import {
  generateMatches,
  getMatches
}
from "../controllers/matchController.js";

import {
  protect
}
from "../middleware/authMiddleware.js";

const router =
  express.Router();

router.post(
  "/generate",
  protect,
  generateMatches
);

router.get(
  "/",
  protect,
  getMatches
);

export default router;
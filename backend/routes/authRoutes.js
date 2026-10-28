import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} from "../controllers/authController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import {
  authLimiter,
} from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// Public authentication routes
router.post(
  "/register",
  authLimiter,
  registerUser
);

router.post(
  "/login",
  authLimiter,
  loginUser
);

// Protected authentication routes
router.get(
  "/me",
  protect,
  getMe
);

router.post(
  "/logout",
  protect,
  logoutUser
);

export default router;
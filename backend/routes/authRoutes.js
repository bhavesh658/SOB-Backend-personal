import express from "express";
import {
  register,
  login,
  logout,
  changePassword,
  refreshToken,
} from "../controllers/User/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (require authentication)
router.post("/logout", protect, logout);
router.post("/change-password", protect, changePassword);
router.post("/refresh-token", protect, refreshToken);

export default router;

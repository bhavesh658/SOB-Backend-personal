import express from "express";
import {
  register,
  login,
  logout,
  changePassword,
  getProfile,
  refreshToken,
} from "../controllers/UserController/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (require authentication)
router.post("/logout", protect, logout);
router.post("/change-password", protect, changePassword);
router.get("/profile", protect, getProfile);
router.post("/refresh-token", protect, refreshToken);

export default router;

import express from "express";
import { login, register,logoutUser } from "../controllers/UserController/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout",logoutUser)

export default router;
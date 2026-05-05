import express from "express";
import {
  getSalesReport,
  getUserReport
} from "../../controllers/Admin/reportController.js";
import { protect } from "../../middleware/authMiddleware.js";
import { isAdmin } from "../../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/sales", protect, isAdmin, getSalesReport);
router.get("/users", protect, isAdmin, getUserReport);

export default router;
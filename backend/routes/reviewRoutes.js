import express from "express";
import {
  getReviews,
  approveReview,
  rejectReview,
  deleteReview
} from "../controllers/reviewController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect, isAdmin);

router.get("/", getReviews);
router.put("/:id/approve", approveReview);
router.put("/:id/reject", rejectReview);
router.delete("/:id", deleteReview);

export default router;
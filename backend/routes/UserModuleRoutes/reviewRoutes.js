import express from "express";
import {
  addReview,
  getReviews
} from "../../controllers/UserController/reviewController.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/:productId", getReviews);

export default router;
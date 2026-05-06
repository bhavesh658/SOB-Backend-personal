import express from "express";
import {
  addToCart,
  getCart,
  updateCart,
  removeItem
} from "../../controllers/User/UsercartController.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/", protect, updateCart);
router.delete("/:productId", protect, removeItem);

export default router;
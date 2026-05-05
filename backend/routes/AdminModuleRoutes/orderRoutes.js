import express from "express";
import {
  getOrders,
  updateOrderStatus
} from "../../controllers/Admin/orderController.js";

import { protect } from "../../middleware/authMiddleware.js";
import { isAdmin } from "../../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect, isAdmin);

router.get("/", getOrders);
router.patch("/:id/status", updateOrderStatus);

export default router;
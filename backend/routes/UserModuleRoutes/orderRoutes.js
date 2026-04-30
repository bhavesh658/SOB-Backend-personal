import express from "express";
import { checkout,getMyOrders,getOrderDetails,cancelOrder } from "../../controllers/UserController/orderController.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/checkout", protect, checkout);


router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderDetails);
router.put("/cancel/:id", protect, cancelOrder);    
export default router;
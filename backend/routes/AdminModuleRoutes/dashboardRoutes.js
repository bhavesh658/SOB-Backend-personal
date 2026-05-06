import express from "express";
import { getDashboardData } from "../../controllers/Admin/dashboardController.js";

import { protect } from "../../middleware/authMiddleware.js";
import { isAdmin } from "../../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect, isAdmin);

router.get("/", getDashboardData);

export default router;
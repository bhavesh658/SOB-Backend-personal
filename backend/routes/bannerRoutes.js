import express from "express";
import {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner
} from "../controllers/bannerController.js";

import { upload } from "../middleware/uploadMiddleware.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect, isAdmin);

router.post("/upload", upload.single("images"), createBanner);
router.get("/", getBanners);
router.put("/:id", updateBanner);
router.delete("/:id", deleteBanner);

export default router;
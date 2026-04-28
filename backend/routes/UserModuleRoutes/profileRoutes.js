import express from "express";
import {
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
  setDefaultAddress
} from "../../controllers/UserController/profileController.js";

import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Profile
router.get("/", getProfile);
router.put("/", updateProfile);

// Address
router.post("/address", addAddress);
router.delete("/address/:index", deleteAddress);
router.put("/address/default/:index", setDefaultAddress);

export default router;
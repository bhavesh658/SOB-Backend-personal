import express from "express";
import {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress,
  checkHasAddress
} from "../../controllers/UserController/profileController.js";

import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All routes require authentication

// Profile
router.get("/", getProfile);
router.put("/", updateProfile);

// Address Management
router.post("/address", addAddress);
router.put("/address/:index", updateAddress);
router.delete("/address/:index", deleteAddress);
router.put("/address/default/:index", setDefaultAddress);
router.get("/address/default/get/current", getDefaultAddress);
router.get("/address/check/exists", checkHasAddress);

export default router;
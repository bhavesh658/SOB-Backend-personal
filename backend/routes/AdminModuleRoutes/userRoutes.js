import express from "express";
import {
  getAllUsers,
  toggleBlockUser,
  searchUsers,
  filterUsers
} from "../../controllers/Admin/userController.js";

import { protect } from "../../middleware/authMiddleware.js";
import { isAdmin } from "../../middleware/adminMiddleware.js";

const router = express.Router();

// All routes protected + admin only
router.use(protect, isAdmin);

router.get("/", getAllUsers);
router.put("/:id/block", toggleBlockUser);
router.get("/search", searchUsers);
router.get("/filter", filterUsers);

export default router;
// backend/routes/productRoutes.js
import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,    // ← ADD THIS IMPORT
} from "../../controllers/productController.js"; // adjust path as needed
import { protect, isAdmin } from "../../middleware/authMiddleware.js"; // your existing auth middleware
import { upload } from "../../middleware/uploadMiddleware.js"; // your existing upload middleware
import { getProductById } from "../../controllers/UserController/productController.js"; // ← ADD THIS IMPORT
const router = express.Router();

// PUBLIC routes (no auth needed)
router.get("/", getProducts);       // GET /api/products
router.get("/:id",getProductById);    // GET /api/products/:id  ← ADD THIS

// ADMIN routes
// router.post("/",   protect, isAdmin, upload, createProduct);
router.put("/:id", protect, isAdmin, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

export default router;
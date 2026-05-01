// backend/routes/productRoutes.js
import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,    // ← ADD THIS IMPORT
} from "../../controllers/productController.js"; // adjust path as needed
// import { protect, isAdmin } from "../../middleware/authMiddleware.js"; // your existing auth middleware
import { protect, isAdmin } from "../../middleware/authMiddleware.js"; // your existing auth middleware
// import { uploadMiddleware } from "../middleware/uploadMiddleware.js"; // your existing upload
import { upload } from "../../middleware/uploadMiddleware.js"; // your existing upload middleware
import { getProductById } from "../../controllers/UserController/productController.js"; // ← ADD THIS IMPORT
// import {getProductById} from "../controllers/UserController/productController.js"; // ← ADD THIS IMPORT
import {browseProducts,getProductByIdd, getCategoriesWithSubs,searchSuggestions } from "../../controllers/UserController/productBrowseController.js"; // ← ADD THIS IMPORT
const router = express.Router();

// PUBLIC routes (no auth needed)
router.get("/", getProducts);       // GET /api/products
router.get("/:id",getProductById);    // GET /api/products/:id  ← ADD THIS

// ADMIN routes
// router.post("/",   protect, isAdmin, upload, createProduct);
router.put("/:id", protect, isAdmin, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);


// category routes
// GET /api/user/products/categories
// → Returns all categories nested with subcategories
// ⚠️ Must be defined BEFORE /:id to avoid "categories" being treated as an ID
router.get("/categories", getCategoriesWithSubs);
 
// GET /api/user/products/search/suggestions?q=iphone
// → Returns quick name suggestions for autocomplete
router.get("/search/suggestions", searchSuggestions);
 
// GET /api/user/products?search=&category=&minPrice=&maxPrice=&minRating=&sort=&page=&limit=
// → Main product browsing with all filters & sorting
router.get("/", browseProducts);
 
// GET /api/user/products/:id
// → Single product detail with reviews & avg rating
router.get("/:id", getProductByIdd);
export default router;
import express from "express";
import {
  browseProducts,
  getProductByIdd,
  getCategoriesWithSubs,
  searchSuggestions,
} from "../../controllers/UserController/productBrowseController.js";

const router = express.Router();

// ─────────────────────────────────────────────
// USER product browsing routes
// BASE: /api/user/products
// All routes are PUBLIC — no auth needed
//
// ⚠️ ORDER MATTERS — keep /categories and
// /search/suggestions ABOVE /:id, otherwise
// Express reads "categories" as a product ID
// ─────────────────────────────────────────────

// GET /api/user/products/categories
router.get("/categories", getCategoriesWithSubs);

// GET /api/user/products/search/suggestions?q=shirt
router.get("/search/suggestions", searchSuggestions);

// GET /api/user/products?search=&category=&minPrice=&maxPrice=&minRating=&sort=&page=&limit=
router.get("/", browseProducts);

// GET /api/user/products/:id
router.get("/:id", getProductByIdd);

export default router;
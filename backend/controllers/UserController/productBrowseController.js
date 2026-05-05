import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import Review from "../../models/Review.js";

// ─────────────────────────────────────────────
// Helper: Calculate average rating for a product
// We pull approved reviews and compute average
// ─────────────────────────────────────────────
const getAvgRating = async (productId) => {
  const result = await Review.aggregate([
    {
      $match: {
        productId: productId,
        status: "approved" // only approved reviews count
      }
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
  return result[0] || { avgRating: 0, totalReviews: 0 };
};


// ─────────────────────────────────────────────
// @route   GET /api/user/products
// @desc    Browse products with search, filter & sort
// @access  Public
// ─────────────────────────────────────────────
export const browseProducts = async (req, res) => {
  try {
    const {
      search,        // search by name
      category,      // filter by category ID
      minPrice,      // filter: minimum price
      maxPrice,      // filter: maximum price
      minRating,     // filter: minimum avg rating (1-5)
      sort,          // sort: "price_asc" | "price_desc" | "latest"
      page = 1,      // pagination: current page
      limit = 12     // pagination: products per page
    } = req.query;

    // ── Build the filter object ──────────────────
    const filter = { isDeleted: false }; // never show soft-deleted products

    // Search by product name (case-insensitive)
    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Filter by category (supports subcategories too)
    if (category) {
      // Find the category + all its children (subcategories)
      const subCategories = await Category.find({ parentCategory: category }).select("_id");
      const categoryIds = [category, ...subCategories.map((c) => c._id)];
      filter.category = { $in: categoryIds };
    }

    // ── Build the sort object ────────────────────
    let sortOption = { createdAt: -1 }; // default: latest first

    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "latest") sortOption = { createdAt: -1 };

    // ── Pagination ───────────────────────────────
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit))); // cap at 50
    const skip = (pageNum - 1) * limitNum;

    // ── Fetch products from DB ───────────────────
    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate("category", "name parentCategory") // include category name
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(), // lean() = plain JS object, faster
      Product.countDocuments(filter) // total for pagination info
    ]);

    // ── Edge case: No products found ─────────────
    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No products found matching your criteria",
        data: [],
        pagination: {
          currentPage: pageNum,
          totalPages: 0,
          totalProducts: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    }

    // ── Attach avg rating to each product ────────
    const productsWithRating = await Promise.all(
      products.map(async (product) => {
        const { avgRating, totalReviews } = await getAvgRating(product._id);
        return {
          ...product,
          avgRating: parseFloat(avgRating.toFixed(1)), // round to 1 decimal
          totalReviews
        };
      })
    );

    // ── Filter by minimum rating AFTER computing ─
    // (we do this after DB fetch because rating is computed, not stored)
    const filteredByRating = minRating
      ? productsWithRating.filter((p) => p.avgRating >= Number(minRating))
      : productsWithRating;

    // ── Send response ────────────────────────────
    res.status(200).json({
      success: true,
      count: filteredByRating.length,
      data: filteredByRating,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalProducts: totalCount,
        hasNextPage: pageNum * limitNum < totalCount,
        hasPrevPage: pageNum > 1
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message
    });
  }
};


// ─────────────────────────────────────────────
// @route   GET /api/user/products/:id
// @desc    Get single product details with reviews
// @access  Public
// ─────────────────────────────────────────────
export const getProductByIdd = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: false
    })
      .populate("category", "name parentCategory")
      .lean();

    // Edge case: product not found or deleted
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Get approved reviews for this product
    const reviews = await Review.find({
      productId: product._id,
      status: "approved"
    })
      .populate("userId", "name") // show reviewer's name
      .sort({ createdAt: -1 })
      .lean();

    // Compute avg rating
    const { avgRating, totalReviews } = await getAvgRating(product._id);

    res.status(200).json({
      success: true,
      data: {
        ...product,
        avgRating: parseFloat(avgRating.toFixed(1)),
        totalReviews,
        reviews
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message
    });
  }
};


// ─────────────────────────────────────────────
// @route   GET /api/user/products/categories
// @desc    Get all categories with their subcategories (nested)
// @access  Public
// ─────────────────────────────────────────────
export const getCategoriesWithSubs = async (req, res) => {
  try {
    // Get all categories at once
    const allCategories = await Category.find().lean();

    // Separate parent categories (no parentCategory) from subcategories
    const parentCategories = allCategories.filter((c) => !c.parentCategory);
    const subCategories = allCategories.filter((c) => c.parentCategory);

    // Nest subcategories under their parent
    const nested = parentCategories.map((parent) => ({
      ...parent,
      subCategories: subCategories.filter(
        (sub) => String(sub.parentCategory) === String(parent._id)
      )
    }));

    res.status(200).json({
      success: true,
      count: parentCategories.length,
      data: nested
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message
    });
  }
};


// ─────────────────────────────────────────────
// @route   GET /api/user/products/search/suggestions
// @desc    Quick search suggestions as user types (autocomplete)
// @access  Public
// ─────────────────────────────────────────────
export const searchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    // Need at least 2 chars to give suggestions
    if (!q || q.trim().length < 2) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Return top 8 matching product names only (fast & lightweight)
    const suggestions = await Product.find({
      name: { $regex: q.trim(), $options: "i" },
      isDeleted: false
    })
      .select("name images") // only fetch what we need
      .limit(8)
      .lean();

    res.status(200).json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching suggestions",
      error: error.message
    });
  }
};
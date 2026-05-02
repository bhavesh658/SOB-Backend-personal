import Product from "../../models/Product.js";

export const browseProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      rating,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    let filter = {
      isDeleted: false
    };

    //  Search (name + description)
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ];
    }

    //  Category / Subcategory
    if (category) {
      filter.category = category;
    }

    //  Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    //  Rating filter (avgRating field hona chahiye)
    if (rating) {
      filter.avgRating = { $gte: Number(rating) };
    }

    //  Query
    let query = Product.find(filter);

    //  Sorting
    switch (sort) {
      case "price_low":
        query = query.sort({ price: 1 });
        break;
      case "price_high":
        query = query.sort({ price: -1 });
        break;
      case "latest":
        query = query.sort({ createdAt: -1 });
        break;
      default:
        query = query.sort({ createdAt: -1 });
    }

    //  Pagination
    const skip = (page - 1) * limit;

    const products = await query.skip(skip).limit(Number(limit));

    const total = await Product.countDocuments(filter);

    //  No product
    if (!products.length) {
      return res.json({
        success: true,
        message: "No products found",
        data: []
      });
    }

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      count: products.length,
      data: products
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
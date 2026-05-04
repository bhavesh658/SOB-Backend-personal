import Product from "../models/Product.js";

export const browseProducts = async (query) => {
  const {
    keyword,
    category,
    subCategory,
    minPrice,
    maxPrice,
    rating,
    sort = "latest",
    page = 1,
    limit = 10
  } = query;

  // 🔍 FILTER
  let filter = { isDeleted: false };

  
  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } }
    ];
  }

  
  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;

  
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  
  if (rating) {
    filter.avgRating = { $gte: Number(rating) };
  }

  
  let sortOption = {};
  switch (sort) {
    case "price_low":
      sortOption = { price: 1 };
      break;
    case "price_high":
      sortOption = { price: -1 };
      break;
    case "rating":
      sortOption = { avgRating: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const skip = (page - 1) * limit;

   const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Product.countDocuments(filter)
  ]);

  return {
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  };
};
import Product from "../models/Product.js";


// ================= HELPER: BUILD FILTER =================
const buildFilter = (query) => {
  const {
    keyword,
    category,
    subCategory,
    minPrice,
    maxPrice,
    rating
  } = query;

  const filter = { isDeleted: false };

  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } }
    ];
  }

  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;

  if (minPrice || maxPrice) {
    filter.price = {
      ...(minPrice && { $gte: Number(minPrice) }),
      ...(maxPrice && { $lte: Number(maxPrice) })
    };
  }

  if (rating) {
    filter.avgRating = { $gte: Number(rating) };
  }

  return filter;
};


// ================= HELPER: BUILD SORT =================
const buildSort = (sort) => {
  const sortMap = {
    price_low: { price: 1 },
    price_high: { price: -1 },
    rating: { avgRating: -1 },
    latest: { createdAt: -1 }
  };

  return sortMap[sort] || sortMap.latest;
};


// ================= HELPER: AVG RATING =================
const calculateAverageRating = (reviews) => {
  if (!reviews.length) return 0;

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return parseFloat((total / reviews.length).toFixed(1));
};


// ================= GET PRODUCT DETAIL =================
export const getProductDetail = async (productId) => {
  const product = await Product.findOne({
    _id: productId,
    isDeleted: false
  })
    .populate("category", "name")
    .populate({
      path: "rating",
      select: "user rating comment createdAt",
      populate: { path: "user", select: "name" }
    });

  if (!product) throw new Error("Product not found");

  const reviews = product.rating || [];

  return {
    _id: product._id,
    name: product.name,
    price: product.price,
    description: product.description,
    images: product.images,
    stock: product.stock,
    isInStock: product.stock > 0,
    category: product.category,
    reviews,
    averageRating: calculateAverageRating(reviews),
    totalReviews: reviews.length
  };
};


// ================= BROWSE PRODUCTS =================
export const browseProducts = async (query) => {
  const { sort = "latest", page = 1, limit = 10 } = query;

  const filter = buildFilter(query);
  const sortOption = buildSort(sort);

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
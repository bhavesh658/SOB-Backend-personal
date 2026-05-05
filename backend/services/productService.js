// backend/services/productDetailService.js
// NEW FILE — place in: backend/services/productDetailService.js

import Product from "../models/Product.js";

export const getProductDetail = async (productId) => {
  // Fetch product — skip soft-deleted ones
  const product = await Product.findOne({ _id: productId, isDeleted: false })
    .populate("category", "name")     // category name for display
    .populate({
      path: "rating",                 // rating[] = array of Review refs (your schema)
      select: "user rating comment createdAt",
      populate: { path: "user", select: "name" }, // reviewer name
    });

  if (!product) throw new Error("Product not found");

  const reviews = product.rating || [];

  // Average rating across all reviews
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return {
    _id:           product._id,
    name:          product.name,
    price:         product.price,         // ✅ Price
    description:   product.description,  // ✅ Description
    images:        product.images,        // ✅ Multiple images (string[])
    stock:         product.stock,         // ✅ Stock count
    isInStock:     product.stock > 0,     // ✅ Edge case: out of stock = false
    category:      product.category,
    reviews:       reviews,               // ✅ Reviews list
    averageRating: parseFloat(averageRating.toFixed(1)), // ✅ Rating
    totalReviews:  reviews.length,
  };
};
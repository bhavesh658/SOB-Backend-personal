import Review from "../models/Review.js";
import Order from "../models/Order.js";

// Add Review
export const addReview = async (userId, productId, rating, comment) => {

  const order = await Order.findOne({
    userId,
    "products.productId": productId,
    status: "delivered"
  });

  if (!order) {
    throw new Error("You can review only purchased products");
  }

  
  const existing = await Review.findOne({ userId, productId });

  if (existing) {
    throw new Error("You already reviewed this product");
  }

  const review = await Review.create({
    userId,
    productId,
    rating,
    comment
  });

  return review;
};

//  Get Reviews
export const getProductReviews = async (productId) => {
  return await Review.find({ productId })
    .populate("userId", "name")
    .sort({ createdAt: -1 });
};
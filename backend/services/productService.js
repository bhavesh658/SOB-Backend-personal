import Product from "../models/Product.js";
import Review from "../models/Review.js";

//  Get Product by ID
export const getProductById = async (id) => {
  return await Product.findById(id)
    .populate("category", "name")
    .populate("rating", "rating comment user");
};
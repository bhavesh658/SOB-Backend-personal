// backend/controllers/productController.js
// ADD these lines to your existing productController.js

import * as productDetailService from "../../services/productService.js"; // add at top

// GET /api/products/:id  — public route, no auth needed
export const getProductById = async (req, res) => {
  try {
    const product = await productDetailService.getProductById(req.params.id);

    res.status(200).json({ success: true, data: product });

  } catch (error) {
    // Invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }
    // Product not found / deleted
    res.status(404).json({ success: false, message: error.message });
  }
};
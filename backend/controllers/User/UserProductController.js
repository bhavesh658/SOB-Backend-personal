// backend/controllers/productController.js
// ADD these lines to your existing productController.js

import * as productDetailService from "../../services/productService.js";

// GET /api/products/:id  — public route, no auth needed
export const getProductById = async (req, res) => {
  try {
    const product = await productDetailService.getProductDetail(req.params.id);

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



export const browseProducts = async (req, res) => {
  try {
    const result = await productDetailService.browseProducts(req.query);

    if (!result.products.length) {
      return res.status(200).json({
        success: true,
        message: "No products found",
        data: []
      });
    }

    res.status(200).json({
      success: true,
      total: result.total,
      page: result.page,
      pages: result.pages,
      count: result.products.length,
      data: result.products
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
import * as productService from "../../services/browseService.js";

export const browseProducts = async (req, res) => {
  try {
    const result = await productService.browseProducts(req.query);

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
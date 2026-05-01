import * as reviewService from "../../services/reviewService.js";

// add review
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const review = await reviewService.addReview(
      req.user.id,
      productId,
      rating,
      comment
    );

    res.status(201).json({
      success: true,
      data: review
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// get reviews
export const getReviews = async (req, res) => {
  const reviews = await reviewService.getProductReviews(
    req.params.productId
  );

  res.json({
    success: true,
    data: reviews
  });
};
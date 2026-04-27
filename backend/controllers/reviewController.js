import Review from "../models/Review.js";


//  Get All Reviews
export const getReviews = async (req, res) => {
  try {
    const { status } = req.query;

    let query = {};
    if (status) query.status = status;

    const reviews = await Review.find(query)
      .populate("userId", "name email")
      .populate("productId", "name");

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message
    });
  }
};


//  Approve Review
export const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    review.status = "approved";
    await review.save();

    res.status(200).json({
      success: true,
      message: "Review approved successfully",
      data: review
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error approving review",
      error: error.message
    });
  }
};


//  Reject Review
export const rejectReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    review.status = "rejected";
    await review.save();

    res.status(200).json({
      success: true,
      message: "Review rejected successfully",
      data: review
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error rejecting review",
      error: error.message
    });
  }
};


//  Delete Review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message
    });
  }
};
import prisma from "..prisma.js";

// Get Product Reviews
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

// Add Product Review
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating should be between 1 and 5",
      });
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        productId,
        rating,
        comment,
      },
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding review",
      error: error.message,
    });
  }
};

// Update Product Review
export const updateReview = async (req, res) => {
  try {
    const { reviewId, rating, comment } = req.body;

    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview || existingReview.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own reviews",
      });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { rating, comment },
    });

    res.status(200).json({
      success: true,
      message: "Review updated",
      review: updatedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error.message,
    });
  }
};

// Delete Product Review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.body;

    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview || existingReview.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own reviews",
      });
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    res.status(200).json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
};

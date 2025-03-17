import express from "express";
import {
  addReview,
  deleteReview,
  getProductReviews,
  updateReview,
} from "../controllers/reviewController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET : Product Reviews
router.get("/review/:productId", protectedRoute, getProductReviews);
// POST : Add Review
router.post("/review", protectedRoute, addReview);
// PUT : Update Review
router.put("/review/:id", protectedRoute, updateReview);
// DELETE : Delete Review
router.delete("/review/:id", protectedRoute, deleteReview);

export default router;
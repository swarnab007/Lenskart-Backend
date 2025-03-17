import express from "express";
import {
  createReview,
  deleteReview,
  updateReview,
  getProductReviews,
} from "../controllers/reviewController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET : Product Reviews
router.get("/review/:productId", protectedRoute, getProductReviews);
// POST : Add Review
router.post("/review", protectedRoute, createReview);
// PUT : Update Review
router.put("/review/:id", protectedRoute, updateReview);
// DELETE : Delete Review
router.delete("/review/:id", protectedRoute, deleteReview);

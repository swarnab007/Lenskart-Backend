import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import {
  addProductToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

// GET: Get all wishlist products
router.get("/all", protectedRoute, getWishlist);
// POST: Add product to wishlist
router.post("/add-wishlist", protectedRoute, addProductToWishlist);
// DELETE: Remove product from wishlist
router.delete("/remove-wishlist/:id", protectedRoute, removeFromWishlist);

export default router;
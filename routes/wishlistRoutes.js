import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import {
  getWishlistProducts,
  addProductToWishlist,
  removeProductFromWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

// GET: Get all wishlist products
router.get("/all", protectedRoute, getWishlistProducts);
// POST: Add product to wishlist
router.post("/add-wishlist", protectedRoute, addProductToWishlist);
// DELETE: Remove product from wishlist
router.delete("/remove-wishlist/:id", protectedRoute, removeProductFromWishlist);
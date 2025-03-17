import express from "express";
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateProductQuantity,
} from "../controllers/cartController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET : All Cart Products
router.get("/", protectedRoute, getCartProducts);
// POST : Add Product to Cart
router.post("/", protectedRoute, addToCart);
// DELETE : Remove all Products from Cart
router.delete("/", protectedRoute, removeAllFromCart);
// PUT : Update Quantity of a Product in Cart
router.put("/:id", protectedRoute, updateProductQuantity);

export default router;

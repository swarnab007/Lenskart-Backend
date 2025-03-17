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
router.get("/get-cart", protectedRoute, getCartProducts);
// POST : Add Product to Cart
router.post("/add-cart", protectedRoute, addToCart);
// DELETE : Remove all Products from Cart
router.delete("/delete-cart", protectedRoute, removeAllFromCart);
// PUT : Update Quantity of a Product in Cart
router.put("/add/:id", protectedRoute, updateProductQuantity);

export default router;

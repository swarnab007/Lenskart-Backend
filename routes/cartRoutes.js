import express from "express";
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity,
} from "../controllers/cartController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET : All Cart Products
router.get("/", protectRoute, getCartProducts);
// POST : Add Product to Cart
router.post("/", protectRoute, addToCart);
// DELETE : Remove all Products from Cart
router.delete("/", protectRoute, removeAllFromCart);
// PUT : Update Quantity of a Product in Cart
router.put("/:id", protectRoute, updateQuantity);

export default router;

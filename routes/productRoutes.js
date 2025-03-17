import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductsByCategory,
} from "../controllers/productController.js";
import { adminAccess, protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET : All Products
router.get("/", protectedRoute, adminAccess, getProducts);
// GET : CATEGORY Products
router.get("/category/:category", getProductsByCategory);
// POST : Create a Product
router.post("/", protectedRoute, adminAccess, createProduct);
// DELETE : Delete a Product
router.delete("/:id", protectedRoute, adminAccess, deleteProduct);

export default router;

import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  validateCoupon,
} from "../controllers/couponController.js";
import { protectedRoute, adminAccess } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST: Create a new coupon (Admin Only)
router.post("/create-coupon", protectedRoute, adminAccess, createCoupon);

// GET: Get all coupons (Admin Only)
router.get("/", protectedRoute, adminAccess, getCoupons);

// POST: Validate a coupon (User)
router.post("/validate", protectedRoute, validateCoupon);

// DELETE: Delete a coupon (Admin Only)
router.delete("/:id", protectedRoute, adminAccess, deleteCoupon);

export default router;

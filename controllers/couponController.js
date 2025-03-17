import prisma from "../prisma.js";

// Get All Coupons (Admin Only)
export const getCoupons = async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      where: {
        expiryDate: { gte: new Date() }, // Only active coupons
      },
    });

    if (!coupons.length) {
      return res.status(404).json({ success: false, message: "No active coupons found" });
    }

    res.status(200).json({ success: true, coupons });
  } catch (error) {
    console.error("Error fetching coupons:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Validate and Apply Coupon
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: "Coupon has expired" });
    }

    // If `usageLimit` exists in schema, reduce its value
    if (coupon.usageLimit !== undefined && coupon.usageLimit <= 0) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
    }

    if (coupon.usageLimit !== undefined) {
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usageLimit: coupon.usageLimit - 1 },
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon is valid",
      discount: coupon.discount,
      expiryDate: coupon.expiryDate,
    });
  } catch (error) {
    console.error("Error validating coupon:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Create a New Coupon (Admin Only)
export const createCoupon = async (req, res) => {
  try {
    const { code, discount, expiryDate, usageLimit } = req.body;

    // const existingCoupon = await prisma.coupon.findUnique({ where: { code } });
    // if (existingCoupon) {
    //   return res.status(400).json({ success: false, message: "Coupon code already exists" });
    // }

    const newCoupon = await prisma.coupon.create({
      data: {
        code,
        discount,
        expiryDate: new Date(expiryDate),
        usageLimit: usageLimit || null, // Optional field
      },
    });

    res.status(201).json({ success: true, message: "Coupon created", coupon: newCoupon });
  } catch (error) {
    console.error("Error creating coupon:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete a Coupon (Admin Only)
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await prisma.coupon.findUnique({ where: { id: parseInt(id) } });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    await prisma.coupon.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    console.error("Error deleting coupon:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

import prisma from "../prisma.js";

// Get Active Coupon for User
export const getCoupon = async (req, res) => {
  try {
    const coupon = await prisma.coupon.findFirst({
      where: {
        userId: req.user.id,
        expiresAt: { gte: new Date() }, // Ensure coupon is not expired
        usageLimit: { gt: 0 }, // Ensure coupon is still valid
      },
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "No active coupons found" });
    }

    res.status(200).json({ success: true, coupon });
  } catch (error) {
    console.error("Error fetching coupon:", error.message);
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

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, message: "Coupon has expired" });
    }

    if (coupon.usageLimit <= 0) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
    }

    // Reduce usage count if it's a single-use coupon
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: { usageLimit: coupon.usageLimit - 1 },
    });

    res.status(200).json({
      success: true,
      message: "Coupon is valid",
      discount: coupon.discount,
      expiresAt: coupon.expiresAt,
    });
  } catch (error) {
    console.error("Error validating coupon:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Create a New Coupon
export const createCoupon = async (req, res) => {
  try {
    const { code, discount, expiresAt, usageLimit } = req.body;

    const existingCoupon = await prisma.coupon.findUnique({ where: { code } });
    if (existingCoupon) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" });
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        code,
        discount,
        expiresAt: new Date(expiresAt),
        usageLimit,
      },
    });

    res.status(201).json({ success: true, message: "Coupon created", coupon: newCoupon });
  } catch (error) {
    console.error("Error creating coupon:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete a Coupon
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

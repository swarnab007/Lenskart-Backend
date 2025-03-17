import prisma from "../prisma.js";

// Get Cart Items
export const getCartProducts = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.userId },
      include: { product: true },
    });

    if (!cartItems.length) {
      return res
        .status(200)
        .json({ success: true, message: "Cart is empty", cart: [] });
    }

    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching cart",
        error: error.message,
      });
  }
};

// Add Product to Cart
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const existingItem = await prisma.cartItem.findFirst({
      where: { userId: req.user.userId, productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + 1 },
      });
    } else {
      await prisma.cartItem.create({
        data: { userId: req.user.userId, productId, quantity: 1 },
      });
    }

    res.status(200).json({ success: true, message: "Product added to cart" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error adding product",
        error: error.message,
      });
  }
};

// Remove Product from Cart
export const removeProductFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    await prisma.cartItem.deleteMany({
      where: { userId: req.user.userId, productId },
    });

    res
      .status(200)
      .json({ success: true, message: "Product removed from cart" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error removing product",
        error: error.message,
      });
  }
};

// Update Product Quantity
export const updateProductQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    await prisma.cartItem.updateMany({
      where: { userId: req.user.userId, productId },
      data: { quantity },
    });

    res.status(200).json({ success: true, message: "Cart updated" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating quantity",
        error: error.message,
      });
  }
};

// Clear Cart
export const removeAllFromCart = async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.userId } });

    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error clearing cart",
        error: error.message,
      });
  }
};

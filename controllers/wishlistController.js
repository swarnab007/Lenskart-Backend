import prisma from "../prisma.js";

// Get Wishlist Items
export const getWishlist = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { wishlist: true },
    });

    if (!user || !user.wishlist || user.wishlist.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "Wishlist is empty", wishlist: [] });
    }

    const productIds = user.wishlist.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    res.status(200).json({ success: true, wishlist: products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching wishlist",
      error: error.message,
    });
  }
};

// Add Product to Wishlist
export const addProductToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { wishlist: true },
    });

    let updatedWishlist = user.wishlist || [];

    if (!updatedWishlist.find((item) => item.productId === productId)) {
      updatedWishlist.push({ productId });
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { wishlist: updatedWishlist },
    });

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: updatedWishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding to wishlist",
      error: error.message,
    });
  }
};

// Remove Product from Wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { wishlist: true },
    });

    let updatedWishlist = user.wishlist.filter(
      (item) => item.productId !== productId
    );

    await prisma.user.update({
      where: { id: req.user.id },
      data: { wishlist: updatedWishlist },
    });

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: updatedWishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing from wishlist",
      error: error.message,
    });
  }
};

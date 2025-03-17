import prisma from "../prisma.js";
import cloudinary from "../lib/cloudinary.js";

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({});
    res.status(200).json({ success: true, message: "All products", products });
  } catch (error) {
    console.error("Error in finding products", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Single Product
export const getProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product found", product });
  } catch (error) {
    console.error("Error in finding product", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Products by Category
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { category: req.params.category },
    });
    res
      .status(200)
      .json({ success: true, message: "Products by category", products });
  } catch (error) {
    console.error("Error in finding products by category", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, shape } = req.body;

    // check if product with same name exists

    const existingProduct = await prisma.product.findFirst({
      where: { name },
    });

    if (existingProduct) {
      return res
        .status(400)
        .json({ success: false, message: "Product already exists" });
    }

    let uploadedImage = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
      uploadedImage = uploadResponse.secure_url;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        category,
        shape,
        image: uploadedImage || "",
      },
    });
    res
      .status(201)
      .json({ success: true, message: "Product created", product });
  } catch (error) {
    console.error("Error in creating product", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, shape } = req.body;
    const productId = parseInt(req.params.id);

    let uploadedImage = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
      uploadedImage = uploadResponse.secure_url;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
        category,
        shape,
        image: uploadedImage || undefined,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Product updated", updatedProduct });
  } catch (error) {
    console.error("Error in updating product", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    await prisma.product.delete({ where: { id: productId } });
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Error in deleting product", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

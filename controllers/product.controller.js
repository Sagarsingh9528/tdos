import Product from "../models/product.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import fs from "fs";


export const addProduct = async (req, res) => {
  try {
    const { productId, productName, description, price } = req.body;
    let imageUrl = "";

    
    const existingProduct = await Product.findOne({ productId });
    if (existingProduct) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Product already exists" });
    }

    
    if (req.file) {
      imageUrl = await uploadOnCloudinary(req.file.path);
    }

    const product = new Product({
      productId,
      productName,
      description,
      price,
      image: imageUrl || "",
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: `Add product error: ${error.message}` });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: `Get products error: ${error.message}` });
  }
};


export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: `Get product error: ${error.message}` });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, description, price } = req.body;

    let updatedData = { productName, description, price };

    
    if (req.file) {
      const imageUrl = await uploadOnCloudinary(req.file.path);
      updatedData.image = imageUrl;
    }

    const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ success: false, message: `Update product error: ${error.message}` });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: `Delete product error: ${error.message}` });
  }
};

import Product from "../../models/Product.js";

import cloudinary from "../../config/cloudinary.js";


const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};


// Add Product
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;


   let imageUrls = [];
   

    if (req.files) {
      for (let file of req.files) {
        const result = await uploadToCloudinary(file.buffer);
        imageUrls.push(result.secure_url);
      }
    }
  

    const product = await Product.create({
      name,
      price,
      description,
      stock,
      images:imageUrls
    });

    res.status(201).json({
      success: true,
      message: "Product created",
      data: product
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


//  Get All Products
export const getProducts = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;

    const products = await Product.find({ isDeleted: false })
      .populate("category")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json(products);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch products" });
  }
};


//  Update Product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).json({ msg: "Product updated", product });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update product" });
  }
};


//  Soft Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    product.isDeleted = true;
    await product.save();

    res.status(200).json({ msg: "Product deleted (soft)" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete product" });
  }
};
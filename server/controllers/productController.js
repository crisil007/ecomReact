const users = require('../db/models/users');
const user_type = require("../db/models/user_type"); 
const bcrypt = require('bcrypt');
const { success_function, error_function } = require("../utils/responseHandler"); 
const mongoose = require("mongoose");
const category = require('../db/models/category');
const { uploadBase64Images } = require("../utils/fileUpload");
const AddData = require("../db/models/product");

exports.addProducts = async function (req, res) {
    try {
        console.log("Request Body:", req.body);
        console.log("Seller ID:", req.params.id);

        const sellerID = req.params.id;

        // Validate seller ID
        if (!sellerID) {
            return res.status(400).send({ success: false, message: "Seller ID is required" });
        }

        // Validate category
        console.log("Category from request:", req.body.category);

        // Find the category (case-insensitive search)
        const matchedCategory = await category.findOne({
            category: new RegExp(`^${req.body.category}$`, "i")
        });

        console.log("Matched category:", matchedCategory);

        if (!matchedCategory) {
            return res.status(400).json({
                success: false,
                message: "Invalid category: No matching category found in the database.",
            });
        }

        // Handle base64-encoded images
        let images = [];
        if (req.body.images && Array.isArray(req.body.images)) {
            images = await uploadBase64Images(req.body.images, sellerID, req.body.altText);
        } else {
            return res.status(400).send({ success: false, message: "No images provided" });
        }

        // Validate stock
        if (typeof req.body.stock !== "number" || req.body.stock < 0) {
            return res.status(400).send({ success: false, message: "Invalid stock value" });
        }

        // Validate brand
        if (!req.body.brand || typeof req.body.brand !== "string") {
            return res.status(400).send({ success: false, message: "Brand is required and must be a string" });
        }

        // Create the new product
        const newProduct = new AddData({
            sellerID,
            name: req.body.name,
            price: req.body.price,
            category: matchedCategory.category,
            images,
            brand: req.body.brand,
            stock: req.body.stock,
        });

        // Save to database
        const productDetails = await newProduct.save();
        return res.status(200).send({
            success: true,
            message: "Product added successfully",
            data: productDetails,
        });
    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).send({ success: false, message: "Product adding failed, please try again." });
    }
};

exports.getProducts = async function (req, res) {
    try {
        // Extract category and brand from query parameters
        const { category, brand } = req.query;

        // Create a filter object
        let filter = { status: { $ne: "blocked" } }; // Exclude blocked products

        if (category) {
            filter.category = category; // Filter by category if provided
        }

        if (brand) {
            filter.brand = brand; // Filter by brand if provided
        }

        // Fetch the latest 10 products (New Arrivals)
        const latestProducts = await AddData.find(filter).sort({ createdAt: -1 }) .limit(4); 
    

        // Fetch all other products that match the filters
        const allProducts = await AddData.find(filter)
            .sort({ createdAt: 1 }); // Sort by creation date in descending order

        console.log("Filtered Latest Products:", latestProducts);
        console.log("Filtered All Products:", allProducts);

        if (!latestProducts.length && !allProducts.length) {
            const response = error_function({
                success: false,
                statusCode: 400,
                message: "No products found with the specified filters",
            });
            return res.status(response.statusCode).send(response);
        }

        // Create response structure
        const response = success_function({
            success: true,
            statusCode: 200,
            message: "Products fetched successfully",
            data: {
                newArrivals: latestProducts,
                allProducts: allProducts,
            },
        });

        return res.status(response.statusCode).send(response);

    } catch (error) {
        console.error("Error fetching products:", error);
        const response = error_function({
            success: false,
            statusCode: 500,
            message: "Something went wrong",
        });
        return res.status(response.statusCode).send(response);
    }
};




exports.viewSingleProduct=async function (req,res) {
    try {
        let id = req.params.id;
        console.log("id : ", id);
    
        let productData = await AddData.findOne({_id : id});
        console.log("productdata : ", productData);
    
        res.status(200).send(productData);
        return;
    } catch (error) {
        console.log("error : ", error);
        res.status(400).send(error.message ? error.message : error);
    }
}// 

// Controller method for getting products by seller
exports.getProductsBySeller = async (req, res) => {
    try {
      const sellerId = req.params.sellerId;
      console.log("Seller ID received:", sellerId); // Log received sellerId
      const products = await AddData.find({ sellerID: sellerId });
  
      if (products.length === 0) {
        return res.status(404).json({ message: "No products found for this seller." });
      }
  
      return res.status(200).json({ success: true, products });
    } catch (error) {
      console.error("Error fetching products:", error); // Log error details
      return res.status(500).json({ message: "Server error", error });
    }
  };
  
  exports.deleteProduct = async function (req, res) {
    try {
        // Log the product ID and seller ID for debugging
        console.log("Product ID:", req.params.productId);
        console.log("Seller ID:", req.params.sellerId);

        const { productId, sellerId } = req.params;

        // Validate product ID
        if (!productId) {
            return res.status(400).send({ success: false, message: "Product ID is required" });
        }

        // Validate seller ID
        if (!sellerId) {
            return res.status(400).send({ success: false, message: "Seller ID is required" });
        }

        // Check if the product exists and belongs to the seller
        const product = await AddData.findOne({ _id: productId, sellerID: sellerId });

        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found or you do not have permission to delete this product",
            });
        }

        // Delete the product
        await AddData.deleteOne({ _id: productId });

        return res.status(200).send({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).send({
            success: false,
            message: "Product deletion failed, please try again.",
        });
    }
};

// Function to fetch categories
exports.fetchCategories = async function (req, res) {
    try {
        const categories = await category.find({}, { category: 1, _id: 0 });

        return res.status(200).send({
            success: true,
            message: "Categories fetched successfully",
            data: { categories },
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).send({ success: false, message: "Failed to fetch categories." });
    }
};

// Function to fetch products for a specific brand
// Updated fetchBrands function in the backend
exports.fetchBrands = async function (req, res) {
    try {
        const { brand } = req.query;

        if (brand) {
            // Fetch products of a specific brand
            const products = await AddData.find({ brand });
            return res.status(200).send({
                success: true,
                message: "Products fetched successfully",
                data: { products },
            });
        } else {
            // Fetch all unique brands
            const brands = await AddData.distinct("brand");
            return res.status(200).send({
                success: true,
                message: "Brands fetched successfully",
                data: { brands },
            });
        }
    } catch (error) {
        console.error("Error fetching brands or products:", error);
        return res.status(500).send({ success: false, message: "Failed to fetch data." });
    }
};




exports.blockproducts = async (req, res) => {
    try {
        const productId = req.params.id; // Extract product ID from request parameters
        const product = await AddData.findById(productId);

        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found"
            });
        }

        // Toggle the product's status
        const newStatus = product.status === "active" ? "blocked" : "active";
        product.status = newStatus;

        // Save the updated product
        await product.save();

        return res.status(200).send({
            success: true,
            message: `Product has been ${newStatus === "active" ? "unblocked" : "blocked"} successfully`,
            data: product
        });
    } catch (error) {
        console.error("Error toggling product status:", error);
        return res.status(500).send({
            success: false,
            message: "Failed to toggle product status",
            error
        });
    }
};

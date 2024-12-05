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
        const matchedCategory = await category.findOne({ category: req.body.category });
        if (!matchedCategory) {
            return res.status(400).send({ success: false, message: "Invalid category" });
        }

        // Handle base64-encoded images
        
        let images = [];
        if (req.body.images && Array.isArray(req.body.images)) {
            images = await uploadBase64Images(req.body.images, sellerID, req.body.altText);
        } else {
            return res.status(400).send({ success: false, message: "No images provided" });
        }

        // Create the new product
        const newProduct = new AddData({
            sellerID,
            name: req.body.name,
            price: req.body.price,
            category: matchedCategory._id,
            images,
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

exports.getProducts = async function(req, res) {
    try {
        const productData = await AddData.find();
        console.log("Product Data:", productData);

        if (!productData || productData.length === 0) {
            const response = error_function({
                success: false,
                statusCode: 400,
                message: "No products found",
            });
            return res.status(response.statusCode).send(response);
        }

        const response = success_function({
            success: true,
            statusCode: 200,
            message: "Fetching successful",
            data: productData,
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

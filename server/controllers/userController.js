const users = require('../db/models/users');
const user_type = require("../db/models/user_type"); 
const AddData=require("../db/models/product")
const bcrypt = require('bcrypt');
const { success_function, error_function } = require("../utils/responseHandler"); 
const mongoose = require("mongoose");
const fileUpload=require("../utils/fileUpload").fileUpload;
const category = require('../db/models/category');
const UpgradeRequest=require('../db/models/upgradeRequest')

const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authorizationHeader = req.header('Authorization');
    console.log("Authorization Header:", authorizationHeader);

    // Extract token from header
    const token = authorizationHeader?.replace(/^Bearer\s+/i, '').trim();
    console.log("Extracted Token:", token);

    if (!token) {
        return res.status(401).json({ message: "No token provided. Please log in." });
    }

    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        req.user = { id: decoded.user_id }; // Add user ID to the request
        console.log("Decoded User ID:", req.user.id);
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        console.error("Token Verification Error:", error.message);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

exports.createuser = async (req, res) => {
    try {
        let body = req.body;
        console.log("Received body:", body);

        let password = body.password;
        let user_type_value = body.user_type; 

        
        if (!user_type_value) {
            return res.status(400).send(error_function({
                statusCode: 400,
                message: "User type is required"
            }));
        }

        
        user_type_value = user_type_value.toLowerCase().trim();

        
        const UserType = await user_type.findOne({user_type:user_type_value }); 

        if (!UserType) {
            console.log("User type not found:", user_type_value); 
            return res.status(400).send(error_function({
                statusCode: 400,
                message: "Invalid user type"
            }));
        }

        console.log("UserType found:", UserType);

        
        let salt = bcrypt.genSaltSync(10);
        let hashed_password = bcrypt.hashSync(password, salt);

        
        let randombody = {
            name: body.name,
            email: body.email,
            password: hashed_password,
            phoneno: body.phoneno,
            user_type: UserType._id, 
        };

    
        let new_user = await users.create(randombody);

        if (new_user) {
            const response = success_function({
                statusCode: 200,
                message: "User created successfully",
                data: new_user
            });
            res.status(response.statusCode).send(response);
            return;
        } else {
            console.log("User creation failed");
            res.status(400).send(error_function({
                statusCode: 400,
                message: "User creation failed"
            }));
            return;
        }

    } catch (error) {
        console.log("Error in createuser:", error);
        res.status(500).send(error_function({
            statusCode: 500,
            message: error.message || "Something went wrong"
        }));
        return;
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users and populate the 'user_type' field to include user type details
        const Users = await users.find().populate('user_type', 'user_type'); // Adjust fields to populate as needed

        if (Users.length === 0) {
            return res.status(404).send({
                statusCode: 404,
                message: "No users found",
            });
        }

        // Return the fetched users
        return res.status(200).send({
            statusCode: 200,
            message: "Users retrieved successfully",
            data: Users,
        });
    } catch (error) {
        console.error("Error in getAllUsers:", error);

        return res.status(500).send({
            statusCode: 500,
            message: error.message || "Something went wrong",
        });
    }
};
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).send({
                statusCode: 400,
                message: "User ID is required",
            });
        }
        const user = await users.findById(userId).populate('user_type', 'user_type'); 

        if (!user) {
            return res.status(404).send({
                statusCode: 404,
                message: "User not found",
            });
        }

        return res.status(200).send({
            statusCode: 200,
            message: "User retrieved successfully",
            data: user,
        });
    } catch (error) {
        console.error("Error in getUserById:", error);

        return res.status(500).send({
            statusCode: 500,
            message: error.message || "Something went wrong",
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id; // Extract User ID from request parameters
        const body = req.body; // Updated fields from the request body

        // Validate User ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({
                statusCode: 400,
                message: "Invalid User ID",
            });
        }

        // Ensure there is data to update
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).send({
                statusCode: 400,
                message: "Update data is required",
            });
        }

        // Validate email format
        if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
            return res.status(400).send({
                statusCode: 400,
                message: "Invalid email format",
            });
        }

        // Validate password length
        if (body.password && body.password.length < 8) {
            return res.status(400).send({
                statusCode: 400,
                message: "Password must be at least 8 characters long",
            });
        }

        // If updating password, hash it
        if (body.password) {
            const salt = bcrypt.genSaltSync(10);
            body.password = bcrypt.hashSync(body.password, salt);
        }

        // Validate user_type and convert it to ObjectId
        if (body.user_type) {
            const userType = await user_type.findOne({ _id: body.user_type });
            if (!userType) {
                return res.status(400).send({
                    statusCode: 400,
                    message: "Invalid user type",
                });
            }
            body.user_type = userType._id; // Ensure it's the correct ObjectId
        }

        // Perform the update operation
 const updatedUser = await users.findByIdAndUpdate(userId, body, { new: true }).populate('user_type', 'user_type'); // Populate user_type for clarity

        if (!updatedUser) {
            return res.status(404).send({
                statusCode: 404,
                message: "User not found",
            });
        }

        // Respond with the updated user details
        return res.status(200).send({
            statusCode: 200,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error in updateUser:", error);
        return res.status(500).send({
            statusCode: 500,
            message: error.message || "Something went wrong",
        });
    }
};
exports.blockUser = async (req, res) => {
    try {
        const userId = req.params.id;  // Get user ID from the URL
        const { action } = req.body;  // The action (block or unblock) from the request body

        // Validate the action
        if (!['block', 'unblock'].includes(action)) {
            return res.status(400).send({
                statusCode: 400,
                message: "Invalid action. Use 'block' or 'unblock'.",
            });
        }

        // Find the user by ID
        const user = await users.findById(userId);

        // If the user doesn't exist, return an error
        if (!user) {
            return res.status(404).send({
                statusCode: 404,
                message: "User not found",
            });
        }

        // If action is 'block', set the status to 'blocked'
        if (action === 'block') {
            user.status = 'blocked';
        } else if (action === 'unblock') {
            user.status = 'active';
        }

        // Save the updated user object
        await user.save();

        // Return a success response
        return res.status(200).send({
            statusCode: 200,
            message: `User ${action}ed successfully`,
            data: user,
        });
    } catch (error) {
        console.error("Error in blockUser:", error);
        return res.status(500).send({
            statusCode: 500,
            message: error.message || "Something went wrong",
        });
    }
};


exports.getDashboardStats = async (req, res) => {
    try {
        // Count all users
        const totalUsers = await users.countDocuments();

        // Find user type IDs for 'buyer' and 'seller'
        const buyerType = await user_type.findOne({ user_type: 'buyer' });
        const sellerType = await user_type.findOne({ user_type: 'seller' });

        if (!buyerType || !sellerType) {
            return res.status(400).send(error_function({
                statusCode: 400,
                message: "User types not found"
            }));
        }

        // Count buyers and sellers
        const totalBuyers = await users.countDocuments({ user_type: buyerType._id });
        const totalSellers = await users.countDocuments({ user_type: sellerType._id });

        // Respond with the statistics
        return res.status(200).send(success_function({
            statusCode: 200,
            message: "Dashboard stats retrieved successfully",
            data: {
                totalUsers,
                totalBuyers,
                totalSellers,
            }
        }));
    } catch (error) {
        console.error("Error in getDashboardStats:", error);
        return res.status(500).send(error_function({
            statusCode: 500,
            message: error.message || "Something went wrong"
        }));
    }
};


exports.requestUpgrade =[authenticate, async (req, res) => {
    try { const userId = req.user.id;
        const { companyName, license } = req.body;
        const newRequest = new UpgradeRequest({ userId, companyName, license, status: 'pending' });
        const savedRequest = await newRequest.save();
        res.status(201).send({ message: 'Upgrade request submitted successfully', data: savedRequest });
    } 
    catch (error) {
         res.status(500).send({ message: 'Something went wrong', error: error.message });
    } 
}];

// approve upgrade
exports.approveupgrade = async (req, res) => {
    try {
        const { userId } = req.params;

        // Log the userId for debugging
        console.log('Received userId:', userId);
        console.log('Request params:', req.params);  // Log entire request params for debugging

        // Ensure userId matches correctly and query the UpgradeRequest collection
        const request = await UpgradeRequest.findOne({ userId: String(userId) });

        if (!request) {
            console.log('No request found with userId:', userId);
            return res.status(404).json({ message: 'Request not found' });
        }

        // Update request status
        request.status = 'approved';
        await request.save();

        // Find the seller type from user_type collection
        const sellerType = await user_type.findOne({ user_type: 'seller' });
        if (!sellerType) {
            return res.status(400).json({ message: "Seller user type not found" });
        }

        // Update the user to have the 'seller' role
        const user = await users.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(userId) }, // Correctly using ObjectId
            { user_type: sellerType._id },  // Assign the correct ObjectId for 'seller' user type
            { new: true }
        );

        if (!user) {
            console.log('User not found with userId:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        // Prepare upgrade details for email
        const upgradeDetails = {
            upgradeType: 'Manual Upgrade from Admin',  // You can change this depending on the upgrade type
        };

        // Try sending the email
        try {
            const emailTemplate = await BuyerUpgarde(user.name, upgradeDetails);
            await sendemail(user.email, 'Seller Upgrade Notification', emailTemplate);
            console.log('Email sent successfully.');
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }

        // Send the updated user information back
        res.status(200).json({ message: 'Request approved and role updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error });
    }
};









//view request upgrades
exports.getAllUpgradeRequests =[authenticate, async (req, res) => { 
    try { 
        const requests = await UpgradeRequest.find().populate('userId', 'name email'); 
        res.status(200).send({ message: 'Upgrade requests fetched successfully', data: requests });
    } 
    catch (error) 
    { res.status(500).send({ message: 'Something went wrong', error: error.message }); 
    } 
}];
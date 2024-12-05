const users = require('../db/models/users');
const user_type = require("../db/models/user_type"); 
const AddData=require("../db/models/product")
const bcrypt = require('bcrypt');
const { success_function, error_function } = require("../utils/responseHandler"); 
const mongoose = require("mongoose");
const fileUpload=require("../utils/fileUpload").fileUpload;
const category = require('../db/models/category');

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

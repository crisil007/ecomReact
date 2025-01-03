const Admin = require("../db/models/Admin");
const users = require("../db/models/users");
const { success_function, error_function } = require("../utils/responseHandler");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        console.log("email:", email);

        let user = await Admin.findOne({ email });
        console.log("admin user:", user);

        if (user) {
            // Check if admin is blocked
            if (user.status === 'blocked') {
                return res.status(403).send(error_function({
                    statusCode: 403,
                    message: "Admin account is blocked. Please contact support."
                }));
            }

            const passwordMatch = bcrypt.compareSync(password, user.password);
            console.log("admin passwordMatch:", passwordMatch);

            if (passwordMatch) {
                const _id = user._id;
                const userType = user.user_type;
                const token = jwt.sign({ user_id: _id }, process.env.PRIVATE_KEY, { expiresIn: "1h" });
                const data = {
                    token: token,
                    _id,
                    user_type: userType
                };

                const response = success_function({
                    statusCode: 200,
                    data,
                    message: "Admin login successful"
                });

                return res.status(response.statusCode).send(response);
            } else {
                return res.status(400).send(error_function({
                    statusCode: 400,
                    message: "Invalid admin password"
                }));
            }
        }

        // Step 2: If Admin login fails, try logging in as a regular user (buyer/seller)
        user = await users.findOne({ email }).populate('user_type');
        console.log("regular user:", user);

        if (user) {
            // Check if user is blocked
            if (user.status === 'blocked') {
                return res.status(403).send(error_function({
                    statusCode: 403,
                    message: "Your account is blocked. Please contact support."
                }));
            }

            // Compare passwords for regular user (buyer/seller)
            const passwordMatch = bcrypt.compareSync(password, user.password);
            console.log("user passwordMatch:", passwordMatch);

            if (passwordMatch) {
                const _id = user._id;
                const userType = user.user_type; // Assuming user_type is stored in the User model
                const token = jwt.sign({ user_id: _id }, process.env.PRIVATE_KEY, { expiresIn: "30d" });
                const data = {
                    token: token,
                    _id,
                    user_type: userType
                };

                const response = success_function({
                    statusCode: 200,
                    data,
                    message: "User login successful"
                });

                return res.status(response.statusCode).send(response);
            } else {
                return res.status(400).send(error_function({
                    statusCode: 400,
                    message: "Invalid user password"
                }));
            }
        }

        // If both admin and user login fail
        return res.status(400).send(error_function({
            statusCode: 400,
            message: "User not found"
        }));

    } catch (error) {
        console.error("error:", error); // For errors
        return res.status(500).send(error_function({
            statusCode: 500,
            message: error.message || "Something went wrong"
        }));
    }
};

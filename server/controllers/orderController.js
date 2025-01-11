const Order = require('../db/models/order');
const jwt = require('jsonwebtoken');
const Product = require('../db/models/product');
const success_function = require('../utils/responseHandler').success_function;
const error_function = require('../utils/responseHandler').error_function;
const  sendEmail= require('../utils/send-email').sendEmail
const orderPlaced =require('../utils/email-templates/orderplaced').orderPlaced
const users=require('../db/models/users')

const authenticate = (req, res, next) => {
    const authorizationHeader = req.header('Authorization');
    console.log("Authorization Header:", authorizationHeader);

    const token = authorizationHeader?.replace(/^Bearer\s+/i, '').trim();
    console.log("Extracted Token:", token);

    if (!token) {
        return res.status(401).json({ message: "No token provided. Please log in." });
    }

    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        req.user = { id: decoded.user_id }; // Attach user ID to the request
        console.log("Decoded User ID:", req.user.id);
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        console.error("Token Verification Error:", error.message);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};
// Adjust the path as needed

exports.createOrder = [
    authenticate,
    async (req, res) => {
        try {
            const userId = req.user.id;
            const { products, address, total, paymentMethod } = req.body;

            if (!products || !Array.isArray(products) || products.length === 0) {
                return res.status(400).json({ message: 'Products are required and must be an array.' });
            }

            if (!total || total <= 0) {
                return res.status(400).json({ message: 'Invalid total amount.' });
            }

            for (const item of products) {
                const product = await Product.findById(item.productId);

                if (!product) {
                    return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
                }

                if (!product.sellerID) {
                    return res.status(400).json({
                        message: `Product with ID ${item.productId} does not have a valid seller (sellerID).`,
                    });
                }

                if (product.sellerID.toString() === userId) {
                    return res.status(400).json({
                        message: `You cannot purchase your own product: ${product.name}.`,
                    });
                }

                if (product.stock < item.quantity) {
                    return res.status(400).json({
                        message: `Not enough stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
                    });
                }
            }

            const newOrder = new Order({
                userId,
                products,
                address,
                total,
                paymentMethod,
                status: 'pending',
            });

            const savedOrder = await newOrder.save();

            for (const item of products) {
                await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { stock: -item.quantity } },
                    { new: true }
                );
            }

            // Fetch the user's email
            const user = await users.findById(userId); // Ensure `User` is imported correctly
            const userEmail = user.email;

            // Prepare the email content
            const emailContent = await orderPlaced(user.name, products);

            // Send the email
            sendEmail(userEmail, 'Order Confirmation - Your Order is Placed!', emailContent)
                .then(() => {
                    console.log('Order confirmation email sent successfully');
                })
                .catch((err) => {
                    console.error('Error sending order confirmation email:', err);
                });

            res.status(201).json({ message: 'Order created successfully', order: savedOrder });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
];

exports.viewUserOrders = [
    authenticate,
    async (req, res) => {
        try {
            const userId = req.user.id;

            const userOrders = await Order.find({ userId })
                .populate('products.productId', 'name price')
                .populate('userId', 'name email');

            if (!userOrders || userOrders.length === 0) {
                return res.status(404).json({ message: 'No orders found for this user.' });
            }

            res.status(200).json({ message: 'Orders fetched successfully', orders: userOrders });
        } catch (error) {
            console.error('Error fetching user orders:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
];

exports.viewAllOrders = async (req, res) => {
    try {
        const orderData = await Order.find()
            .populate('userId', 'name email phone')
            .populate('products.productId', 'name price category brand');

        console.log(orderData);

        const response = success_function({
            statusCode: 200,
            data: orderData,
            message: 'Orders fetched successfully',
        });

        res.status(response.statusCode).send(response);
    } catch (error) {
        console.error("Error fetching all orders:", error);

        const response = error_function({
            statusCode: 400,
            message: error.message ? error.message : 'Something went wrong',
        });

        res.status(response.statusCode).send(response);
    }
};

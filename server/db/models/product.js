const mongoose = require('mongoose');

const AddData = new mongoose.Schema({

    
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // Ensure this matches your users model
        required: true
    },
    
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    images: [
        {
            url: { type: String, required: true },
            alt: { type: String }
        }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    }
});

module.exports = mongoose.model("products", AddData);

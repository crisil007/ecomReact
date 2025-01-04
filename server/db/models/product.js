
const mongoose=require('mongoose')
const AddData = new mongoose.Schema({
    
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
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
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ["active", "blocked"],
        default: "active" // Default status is active
    }
});

module.exports = mongoose.model("products", AddData);

const jwt=require('jsonwebtoken');

const Cart=require('../db/models/cart');
const AddData=require('../db/models/product')
const mongoose=require('mongoose')

const authenticate=(req,res,next)=>{
const token=req.header('Authorization')?.replace('Bearer','').trim();
console.log("token",token)

if(!token){
    return res.status(401).json({message:"no token..please login"});
}

try{
    const decoded=jwt.verify(token,process.env.PRIVATE_KEY);
    req.user={id:decoded.user_id};
    console.log("decode",req.user.id)
    next();
}
catch(error){
    return res.status(401).send({ message: 'Invalid or expired token.' });
}
};

exports.addToCart=[authenticate,async(req,res)=>{

try{
    const userId=req.user.id;
    const{productId}=req.body;


    const product=await AddData.findById(productId);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
  }
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      } 

      let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const existingProduct = cart.items.find(item => item.productId.toString() === productId);
    if (existingProduct) {
      return res.status(400).json({ message: 'Product already in cart' });
    }

    cart.items.push({ productId, });
    await cart.save();

    return res.status(200).json({ message: 'Product added to cart', cart });

    
}
catch(error){
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
}

}  
];

// view cart
exports.getCart = [
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user.id;

      // Fetch the user's cart and populate the productId field
      const cart = await Cart.findOne({ userId }).populate("items.productId");

      if (!cart || cart.items.length === 0) {
        return res.status(200).json({ message: "Cart is empty", items: [] });
      }

      // Filter out items where productId is null or product status is "blocked"
      const validItems = cart.items.filter(
        (item) =>
          item.productId !== null && item.productId.status === "active"
      );

      return res.status(200).json({
        message: "Cart fetched successfully",
        items: validItems,
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  },
];


exports.deleteCart = [authenticate, async (req, res) => {
  try {
    console.log('Request Params:', req.params);
    console.log('Request User:', req.user);
    const userId = req.user.id;
    const productId = new mongoose.Types.ObjectId(req.params.id); // Convert string to ObjectId
    console.log('User ID:', userId); 
    console.log('Product ID:', productId);

    if (!userId || !productId) {
      const response = error_function({
        statusCode: 400,
        message: "Invalid user or product ID.",
      });
      return res.status(response.statusCode).send(response);
    }

    // Find and update the cart, removing the specified product
    const updatedCart = await Cart.findOneAndUpdate(
      { userId }, // Match the cart for the logged-in user
      { $pull: { items: { productId } } }, // Remove the item with the specified product ID
      { new: true } // Return the updated cart
    );

    if (updatedCart) {
      const response = success_function({
        statusCode: 200,
        message: "Item Removed From Cart",
        data: updatedCart,
      });
      return res.status(response.statusCode).send(response);
    } else {
      const response = error_function({
        statusCode: 400,
        message: "Failed to remove item from cart.",
      });
      return res.status(response.statusCode).send(response);
    }
  } catch (error) {
    console.error("Error:", error);
    const response = error_function({
      statusCode: 500,
      message: error.message || "An error occurred while removing the item.",
    });
    res.status(response.statusCode).send(response);
  }
}];

exports.updateCartQuantity = [
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user.id; // Extract user ID from token
      const { productId, quantity } = req.body; // Extract productId and new quantity from request body

      if (!productId || quantity < 1) {
        return res
          .status(400)
          .json({ message: "Invalid product ID or quantity must be at least 1." });
      }

      // Find the user's cart and update the quantity
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found." });
      }

      const item = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (!item) {
        return res.status(404).json({ message: "Product not found in cart." });
      }

      // Update the quantity
      item.quantity = quantity;
      await cart.save();

      return res.status(200).json({
        message: "Quantity updated successfully.",
        cart,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      return res.status(500).json({ message: "Server error." });
    }
  },
];
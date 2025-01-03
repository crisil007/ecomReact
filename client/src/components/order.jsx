import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import jwt_decode from "jwt-decode"; // Correct import

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { product, selectedSize, quantity } = location.state || {};
  const [address, setAddress] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Validate the token on page load
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      navigate("/signin");
      return;
    }

    try {
      const decoded = jwt_decode(token); // Use `jwt_decode` correctly
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        alert("Your session has expired. Please log in again.");
        navigate("/signin");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      alert("Invalid token. Please log in again.");
      navigate("/signin");
    }
  }, [navigate]);

  useEffect(() => {
    if (product && quantity) {
      setTotal(product.price * quantity);
    } else {
      toast.error("Product details are missing. Redirecting...");
      navigate("/home");
    }
  }, [product, quantity, navigate]);

  const handlePlaceOrder = async () => {
    if (!address) {
      toast.error("Please enter a delivery address.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:3005/createOrder",
        {
          products: [
            {
              productId: product._id,
              selectedSize,
              quantity,
            },
          ],
          address,
          total,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Order placed successfully!");
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error placing order");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Details */}
        <div className="border rounded-md p-4">
          <img
            src={`http://localhost:3005/${product.images[0].url.replace(/\\/g, "/")}`}
            alt={product.name}
            className="w-full h-48 object-cover rounded-md"
          />
          <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
          <p className="text-gray-600">{product.category}</p>
          <p>
            <strong>Size:</strong> {selectedSize}
          </p>
          <p>
            <strong>Quantity:</strong> {quantity}
          </p>
          <p>
            <strong>Total Price:</strong> ₹{total}
          </p>
        </div>

        {/* Address and Payment */}
        <div className="border rounded-md p-4">
          <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
          <textarea
            className="w-full border p-2 rounded-md"
            rows="4"
            placeholder="Enter your delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-md mt-4 w-full"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OrderPage;

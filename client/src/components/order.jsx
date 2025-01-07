import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import "react-toastify/dist/ReactToastify.css"; // Ensure this is imported

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { product, selectedSize, quantity } = location.state || {};
  const [address, setAddress] = useState("");
  const [total, setTotal] = useState(0);

  // Validate token function
  const validateToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      navigate("/signin");
      return false;
    }

    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        toast.error("Session expired. Please log in again.");
        navigate("/signin");
        return false;
      }
    } catch (error) {
      console.error("Invalid token:", error);
      toast.error("Invalid session. Please log in again.");
      navigate("/signin");
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (!validateToken()) return;
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
    if (!validateToken()) return;

    try {
      await axios.post(
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

      // Delay navigation to allow toast to show
      setTimeout(() => {
        navigate("/home");
      }, 2000); // 2-second delay
    } catch (error) {
      toast.error(error.response?.data?.message || "Error placing order");
    }
  };

  if (!product) {
    return <div className="loading">Loading...</div>;
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
            aria-label="Place Order"
          >
            Place Order
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default OrderPage;

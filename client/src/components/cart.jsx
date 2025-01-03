import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./nav";
import Footer from "./footer";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const backendUrl = "http://localhost:3005";

  useEffect(() => {
    const fetchCartItems = async () => {
      const tokenData = localStorage.getItem("Data");

      if (!tokenData) {
        setError("Please log in to view the cart.");
        setLoading(false);
        return;
      }

      const token = JSON.parse(tokenData).token;

      try {
        const response = await axios.get(`${backendUrl}/viewCart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.items) {
          setCartItems(response.data.items);
        } else {
          setError("Failed to fetch cart items.");
        }
      } catch (err) {
        const status = err.response?.status;
        if (status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("Data");
          navigate("/signin");
        } else {
          setError("Error fetching cart data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [navigate]);

  const handleBuyNow = (productId) => {
    navigate(`/order/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartItems.map((item) => (
              <div
                key={item.productId._id}
                className="bg-white shadow rounded-lg p-4 flex flex-col justify-between"
              >
                <Link
                  to={`/product/${item.productId._id}`}
                  className="mb-4 block"
                >
                  {item.productId.images && item.productId.images.length > 0 ? (
                    <img
                      src={`http://localhost:3005/${item.productId.images[0].url.replace(/\\/g, "/")}`}
                      alt={item.productId.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/150"
                      alt="Placeholder"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}
                </Link>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">{item.productId.name}</h2>
                  <p className="text-gray-700 mb-1">
                    <strong>Price:</strong> ${item.productId.price}
                  </p>
                  <p className="text-gray-700">
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => handleBuyNow(item.productId._id)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;

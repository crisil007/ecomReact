import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"; // Import the Trash Icon
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./nav";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = "http://localhost:3005";
  const navigate = useNavigate();

  // Fetch Wishlist
  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);

    try {
      const tokenData = localStorage.getItem("Data");
      if (tokenData) {
        const token = JSON.parse(tokenData).token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${backendUrl}/viewWishlist`, config);

        if (response.status === 200 && response.data.items) {
          setWishlist(response.data.items);
        } else {
          setWishlist([]);
          toast.info(response.data.message || "Your wishlist is empty.");
        }
      } else {
        toast.info("Please log in to view your wishlist.");
      }
    } catch (err) {
      setError("Failed to fetch wishlist.");
      toast.error("Error fetching wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Remove Item from Wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const tokenData = localStorage.getItem("Data");
      if (!tokenData) {
        toast.info("Please log in to modify your wishlist.");
        return;
      }

      const token = JSON.parse(tokenData).token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(
        `${backendUrl}/deleteWishlist/${productId}`,
        config
      );

      if (response.data.success) {
        setWishlist((prevWishlist) =>
          prevWishlist.filter((item) => item.productId._id !== productId)
        );
        toast.success("Removed from wishlist.");
      } else {
        toast.error(response.data.message || "Failed to remove item.");
      }
    } catch (err) {
      toast.error("Error removing item. Please try again.");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Handle image click to navigate to product details page
  const handleImageClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center">Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <NavBar/>
      <h1 className="text-4xl font-extrabold text-indigo-600 mb-8 text-center">
        Your Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-gray-500 text-center">Your wishlist is empty!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlist.map((item) => (
            <div
              key={item.productId._id}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-between relative transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <div className="relative">
                <img
                  src={
                    item.productId.images && item.productId.images.length > 0
                      ? `${backendUrl}/${item.productId.images[0].url.replace(
                          /\\/g,
                          "/"
                        )}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={item.productId.name}
                  className="w-full h-56 object-cover rounded-md mb-4 cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => handleImageClick(item.productId._id)}
                />
              </div>

              <h2 className="text-xl font-semibold mb-2 text-gray-800 text-center">
                {item.productId.name}
              </h2>
              <p className="text-lg text-gray-600 mb-4 text-center">
                ₹{item.productId.price || "N/A"}
              </p>

              {/* Trash Bin Icon (placed below the price) */}
              <button
                onClick={() => removeFromWishlist(item.productId._id)}
                className="bg-white p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all duration-300 mx-auto"
              >
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="w-6 h-6 text-gray-600"
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

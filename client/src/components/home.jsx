import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faHeart } from "@fortawesome/free-solid-svg-icons";
import NavBar from "./nav";
import Footer from "./footer";
import CarouselComponent from "./Carousel";
import { toast, ToastContainer } from "react-toastify"; // Import both toast and ToastContainer

// Ensure to import the CSS for react-toastify
import 'react-toastify/dist/ReactToastify.css';

const ProductList = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const backendUrl = "http://localhost:3005";

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/getProducts`);
      if (response.data.success) {
        setNewArrivals(response.data.data.newArrivals);
        setAllProducts(response.data.data.allProducts);
      } else {
        setError(response.data.message);
        toast.error(response.data.message); // Show toast on error
      }
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
      toast.error("Failed to fetch products. Please try again later."); // Show toast on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Cart
 // Fetch Cart
// Fetch Cart
const fetchCart = useCallback(async () => {
  try {
    const tokenData = localStorage.getItem("Data");
    if (tokenData) {
      const token = JSON.parse(tokenData).token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${backendUrl}/viewCart`, config);

      if (response.data.success) {
        const filteredCart = response.data.cart.filter(
          (item) => item.productId && !item.productId.isBlocked // Ensure valid productId and exclude blocked products
        );
        const cartProductIds = filteredCart.map((item) => item.productId._id.toString());
        setCart(cartProductIds);
        }  // } else {
      //   toast.error(response.data.message || "Failed to fetch cart.");
      // }
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    toast.error("Error fetching cart. Please try again.");
  }
}, []);

// Fetch Wishlist
const fetchWishlist = useCallback(async () => {
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
        // Exclude blocked products
        const wishlistProductIds = response.data.items
          .filter((item) => !item.productId.isBlocked) // Exclude blocked products
          .map((item) => item.productId._id);
        setWishlist(wishlistProductIds);
      } else {
        setWishlist([]);
        toast.info(response.data.message || "Wishlist is empty.");
      }
    } else {
      setWishlist([]);
      toast.info("Please login to view your wishlist.");
    }
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    setWishlist([]);
    toast.error("Error fetching wishlist. Please try again.");
  }
}, []);



  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchWishlist();
  }, [fetchProducts, fetchCart, fetchWishlist]);

  // Add to Cart
  const addToCart = async (productId) => {
    if (cart.includes(productId)) {
      toast.warn("Product is already in the cart."); // Show warning toast
      return;
    }

    try {
      const tokenData = localStorage.getItem("Data");
      if (!tokenData) {
        alert("Please login to add items to the cart."); // Show info toast
        navigate("/signin");
        return;
      }

      const token = JSON.parse(tokenData).token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(`${backendUrl}/addCart`, { productId }, config);
      if (response.status === 200) {
        setCart((prevCart) => [...prevCart, productId]);
        toast.success("Added to cart"); // Show success toast
      } else {
        toast.error(response.data.message || "Failed to add item to cart."); // Show error toast
      }
    } catch (error) {
      toast.error("Error adding item to cart. Please try again."); // Show error toast
    }
  };

  // Add to Wishlist
  const addToWishlist = async (productId) => {
    try {
      const tokenData = localStorage.getItem("Data");
      if (!tokenData) {
        alert("Please login to add items to the wishlist.");
        navigate("/signin");
        return;
      }
  
      const token = JSON.parse(tokenData).token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
  
      console.log("Attempting to add product to wishlist. Current Wishlist:", wishlist);
  
      const response = await axios.post(`${backendUrl}/addWishlist`, { productId }, config);
  
      if (response.data.success) {
        // Ensure wishlist state is updated before checking includes
        const updatedWishlist = [...wishlist, productId];
        setWishlist(updatedWishlist);
        

      } else {
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      toast.error("Already in wishlist");
    }
  };
  
  

  // Remove from Wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const tokenData = localStorage.getItem("Data");
      if (!tokenData) {
        toast.info("Please login to remove items from the wishlist."); // Show info toast
        navigate("/signin");
        return;
      }

      const token = JSON.parse(tokenData).token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(`${backendUrl}/deleteWishlist/${productId}`, config);
      if (response.data.success) {
        setWishlist((prevWishlist) => prevWishlist.filter((item) => item !== productId));
        toast.success("Removed from wishlist"); // Show success toast
      } else {
        toast.error(response.data.message || "Failed to remove item from wishlist."); // Show error toast
      }
    } catch (error) {
      toast.error("Error removing item from wishlist. Please try again."); // Show error toast
    }
  };

  // Render Products Section
  const renderProductSection = (products, heading) => (
    <div className="my-10">
      <h2 className="text-2xl font-bold mb-6 text-center">{heading}</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {products
          .filter((product) => !product.isBlocked) // Exclude blocked products
          .map((product) => {
            // Truncate name to 25 characters with ellipses if needed
            const shortName = product.name.length > 25 ? product.name.slice(0, 25) + "..." : product.name;
  
            return (
              <div
                key={product._id}
                className="w-60 h-96 p-4 border rounded-lg shadow-lg relative"
              >
                <Link
                  to={`/product/${product._id}`}
                  className="block mb-4 text-center text-blue-500 text-lg font-semibold"
                >
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={`http://localhost:3005/${product.images[0].url.replace(/\\/g, "/")}`}
                      alt={product.images[0].alt || product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/150"
                      alt="Placeholder"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </Link>
                <h2 className="text-xl font-medium">{shortName}</h2>
                <p className="text-lg text-gray-700 mt-2">
                  <strong>Price:</strong>₹{product.price}
                </p>
  
                {cart.includes(product._id.toString()) ? (
                  <button
                    onClick={() => navigate("/cart")}
                    className="absolute bottom-4 left-4 bg-green-500 text-white py-2 px-4 rounded-lg"
                  >
                    Go to Cart <FontAwesomeIcon icon={faCartPlus} />
                  </button>
                ) : (
                  <button
                    onClick={() => addToCart(product._id)}
                    className="absolute bottom-4 left-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
                  >
                    <FontAwesomeIcon icon={faCartPlus} />
                  </button>
                )}
  
                {wishlist.includes(product._id.toString()) ? (
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute bottom-4 right-4 bg-gray-300 text-white p-2 rounded-full"
                  >
                    <FontAwesomeIcon icon={faHeart} color="red" />
                  </button>
                ) : (
                  <button
                    onClick={() => addToWishlist(product._id)}
                    className="absolute bottom-4 right-4 bg-gray-300 text-white p-2 rounded-full"
                  >
                    <FontAwesomeIcon icon={faHeart} color="gray" />
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
  
  
  
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <NavBar />
      <CarouselComponent />
      {renderProductSection(newArrivals, "New Arrivals")}
      {renderProductSection(allProducts, "Products")}
      <Footer />
      <ToastContainer /> {/* Add ToastContainer here */}
    </>
  );
};

export default ProductList;

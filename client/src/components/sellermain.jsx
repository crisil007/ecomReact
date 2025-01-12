import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faHeart } from '@fortawesome/free-solid-svg-icons';
import Footer from "./footer";
import CarouselComponent from "./Carousel";
import SellerNavBar from "./sellernav";

const ProductList = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const backendUrl = "http://localhost:3005";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/getProducts`);
        if (response.data.success) {
          setNewArrivals(response.data.data.newArrivals);
          setAllProducts(response.data.data.allProducts);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCart = async () => {
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
            const cartProductIds = response.data.cart.map((item) => item.productId.toString());
            setCart(cartProductIds);
          }
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    const fetchWishlist = async () => {
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
          if (response.data.success) {
            setWishlist(response.data.items.map((item) => item.productId._id));
          }
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchProducts();
    fetchCart();
    fetchWishlist();
  }, []);

  const addToCart = async (productId) => {
    if (cart.includes(productId)) {
      alert("Product is already in the cart.");
      return;
    }

    try {
      const tokenData = localStorage.getItem("Data");
      if (!tokenData) {
        alert("Please login to add items to the cart.");
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
        alert("Added to cart");
      } else {
        alert(response.data.message || "Failed to add item to cart.");
      }
    } catch (error) {
      alert("Error adding item to cart. Please try again.");
    }
  };

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
        },
      };

      const response = await axios.post(`${backendUrl}/addWishlist`, { productId }, config);

      if (response.data.success) {
        setWishlist((prevWishlist) => [...prevWishlist, productId]);
        alert("Added to wishlist");
      } else {
        alert(response.data.message || "Already in wishlist.");
      }
    } catch (error) {
      alert("Error adding item to wishlist. Please try again.");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const tokenData = localStorage.getItem("Data");
      if (!tokenData) {
        alert("Please login to remove items from the wishlist.");
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
        alert("Removed from wishlist");
      } else {
        alert(response.data.message || "Failed to remove item from wishlist.");
      }
    } catch (error) {
      alert("Error removing item from wishlist. Please try again.");
    }
  };

  const renderProductSection = (products, heading) => (
    <div className="my-10">
      <h2 className="text-2xl font-bold mb-6 text-center">{heading}</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {products.map((product) => {
          // Truncate name if it's longer than 25 characters
          const truncatedName = product.name.length > 25 ? `${product.name.slice(0, 25)}...` : product.name;
  
          return (
            <div key={product._id} className="w-60 h-96 p-4 border rounded-lg shadow-lg relative">
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
              <h2 className="text-xl font-medium">{truncatedName}</h2>
              <p className="text-lg text-gray-700 mt-2">
                <strong>Price:</strong> ₹{product.price}
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
      <SellerNavBar />
      <CarouselComponent />
      {renderProductSection(newArrivals, "New Arrivals")}
      {renderProductSection(allProducts, "Products")}
      <Footer />
    </>
  );
};
export default ProductList;

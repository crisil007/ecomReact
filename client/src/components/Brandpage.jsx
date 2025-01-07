import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate,Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faHeart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "./nav";

const ProductsPage = () => {
  const { brand } = useParams(); // Fetch the dynamic brand parameter
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Check if products were passed via state
    const stateProducts = location.state?.products;

    if (stateProducts) {
      setProducts(stateProducts);
      setLoading(false);
    } else {
      // If no products in state, fetch from API
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`http://localhost:3005/brands?brand=${encodeURIComponent(brand)}`);
          if (response.data.success) {
            setProducts(response.data.data.products);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error("Error fetching products.");
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [brand, location.state]);

  // Fetch Cart
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

        const response = await axios.get(`http://localhost:3005/viewCart`, config);
        if (response.data.success) {
          const cartProductIds = response.data.cart.map((item) => item.productId.toString());
          setCart(cartProductIds);
        }
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Fetch Wishlist
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

        const response = await axios.get(`http://localhost:3005/viewWishlist`, config);
        if (response.status === 200 && response.data.items) {
          setWishlist(response.data.items.map((item) => item.productId._id));
        }
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchWishlist();
  }, []);

  // Add to Cart
  const addToCart = async (productId) => {
    if (cart.includes(productId)) {
      toast.warn("Product is already in the cart.");
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

      const response = await axios.post(`http://localhost:3005/addCart`, { productId }, config);
      if (response.status === 200) {
        setCart((prevCart) => [...prevCart, productId]);
        toast.success("Added to cart");
      } else {
        toast.error("Failed to add item to cart.");
      }
    } catch (error) {
      toast.error("Error adding item to cart. Please try again.");
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

      const response = await axios.post(`http://localhost:3005/addWishlist`, { productId }, config);
      if (response.data.success) {
        setWishlist((prevWishlist) => [...prevWishlist, productId]);
      } else {
        toast.error("Failed to add item to wishlist.");
      }
    } catch (error) {
      toast.error("Error adding item to wishlist.");
    }
  };

  // Render Products Section
  const renderProductSection = (products, heading) => (
    <div className="my-10">
      <NavBar />
      <h2 className="text-2xl font-bold mt-20 mb-6 text-center">{heading}</h2> {/* Add margin-top here */}
      <div className="flex flex-wrap justify-center gap-6">
        {products.map((product) => (
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
            <h2 className="text-xl font-medium">{product.name}</h2>
            <p className="text-lg text-gray-700 mt-2">
              <strong>Price:</strong> ${product.price}
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
        ))}
      </div>
    </div>
  );
  

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {/* <h1>Products for {brand}</h1> */}
      {renderProductSection(products, "Available Products")}
      <ToastContainer />
    </>
  );
};

export default ProductsPage;

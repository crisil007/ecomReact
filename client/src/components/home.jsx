import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // For displaying success/error messages
  const [cart, setCart] = useState([]); // Use an empty array for cart items initially
  const navigate = useNavigate();
  const backendUrl = "http://localhost:3005"; // Replace with your backend URL

  // Logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    navigate("/signin");
  };

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/getProducts`);
        console.log("API Response:", response.data.data);
        if (response.data.success) {
          setProducts(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add to Cart function
  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please login to add items to the cart.");
        navigate("/signin");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Include productId and quantity in the payload
      const response = await axios.post(
        `${backendUrl}/addCart`,
        { productId, quantity },
        config
      );

      // Update cart and show success message
      setCart(response.data.cart);
      setMessage(response.data.message || "Item added to cart!");
    } catch (error) {
      const status = error.response?.status;
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";

      if (status === 401) {
        // Token invalid or expired
        localStorage.removeItem("authToken");
        alert("Session expired. Please log in again.");
        navigate("/signin");
      } else if (status === 400) {
        setMessage("Invalid request. Please check the product.");
      } else if (status === 500) {
        // Server error
        setMessage("Server error. Please try again later.");
      } else {
        // Other errors
        setMessage(errorMessage);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Products</h1>
      <button onClick={logout}>Logout</button>
      {message && <div className="message">{message}</div>} {/* Show success/error messages */}
      <div
        className="containerr"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="container-a"
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              width: "250px",
              height: "350px",
            }}
          >
            <div>
              {product.images && product.images.length > 0 ? (
                <img
                  src={`http://localhost:3005/${product.images[0].url.replace(
                    /\\/g,
                    "/"
                  )}`} // Replace backslashes with forward slashes
                  alt={product.images[0].alt || product.name}
                  style={{ width: "100%", borderRadius: "5px", height: "200px" }}
                />
              ) : (
                <img
                  src="https://via.placeholder.com/150"
                  alt="Placeholder"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              )}
            </div>
            <h2>{product.name}</h2>
            <p>
              <strong>Price:</strong> ${product.price}
            </p>
            <button
              className="button-a"
              onClick={() => addToCart(product._id)}
            >
              Add to Cart
            </button>

            <Link
              to={`/product/${product._id}`}
              style={{
                display: "block",
                marginTop: "10px",
                textAlign: "center",
                color: "#007bff",
                textDecoration: "none",
              }}
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

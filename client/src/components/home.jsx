import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import './style.css'

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // For displaying success/error messages
  const [cart, setCart] = useState(null);  

  const backendUrl = "http://localhost:3005"; // Replace with your backend URL

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem("authToken"); // Assume user is authenticated and token is stored
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `${backendUrl}/addCart`,
        { productId },
        config
      );

      // Handle success
      setCart(response.data.cart); // Update cart in state
      setMessage(response.data.message); // Display success message
    } catch (error) {
      // Handle error
      const errorMsg = error.response?.data?.message || "Server error";
      setMessage(errorMsg);
    }
  };


  return (
    <div>
      <h1>Products</h1>
      <div className="container" style={{ display: "flex", flexWrap: "wrap", gap: "20px",justifyContent:"center" }}>
        {products.map((product) => (
          <div 
            key={product._id} className="container-a"
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
           
              width: "250px", height:"350px"}}
          >
           
            <div>
  {product.images && product.images.length > 0 ? (
    <img
      src={`http://localhost:3005/${product.images[0].url.replace(/\\/g, '/')}`} // Replace backslashes with forward slashes
      alt={product.images[0].alt || product.name}
      style={{ width: "100%", borderRadius: "5px",height:"200px" }}
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
<p><strong>Price:</strong> ${product.price}</p>
<button onClick={() => addToCart(product._id)}>Add to Cart</button>

<Link to={`/product/${product._id}`} 
              style={{ 
                display: 'block', 
                marginTop: '10px', 
                textAlign: 'center', 
                color: '#007bff', 
                textDecoration: 'none'
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

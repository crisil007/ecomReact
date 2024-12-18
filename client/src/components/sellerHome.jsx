import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./css/style.css";
import NavBar from "./nav";
import Footer from "./footer";


const SellerHomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const backendUrl = "http://localhost:3005"; // Replace with your backend URL

  // Fetch products added by the seller
  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const storedUserData = localStorage.getItem("Data");

        // Check if storedUserData exists and is valid
        if (!storedUserData) {
          alert("Please login to access your products.");
          navigate("/signin");
          return;
        }

        const parsedData = JSON.parse(storedUserData);
        const token = parsedData?.token;
        const sellerId = parsedData?._id;

        // Ensure sellerId and token are available
        if (!sellerId || !token) {
          alert("No valid seller ID or token found. Please login again.");
          navigate("/signin");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch products using sellerId dynamically
        const response = await axios.get(`${backendUrl}/getProducts/${sellerId}`, config);

        if (response.data.success) {
          setProducts(response.data.products || []); // Ensure fallback to empty array
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products. Please try again later.");
        navigate('/add')
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProducts();
  }, [navigate]);

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      const storedUserData = localStorage.getItem("Data");
      const token = JSON.parse(storedUserData).token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(`${backendUrl}/product/${productId}`, config);
      if (response.data.success) {
        setProducts(products.filter((product) => product._id !== productId));
        setMessage("Product deleted successfully.");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Failed to delete product. Please try again later.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <NavBar />
      
      <div>
        <h1>Seller Dashboard</h1>
        {message && <div className="message">{message}</div>}
        <div
          className="containerr"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="container-a"
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  width: "250px",
                  height: "400px",
                  textAlign: "center",
                }}
              >
                {product.images && product.images.length > 0 ? (
                  <img
                    src={`${backendUrl}/${product.images[0].url.replace(/\\/g, "/")}`}
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

                <h2>{product.name}</h2>
                <p>
                  <strong>Price:</strong> ${product.price}
                </p>

                <div style={{ display: "flex", justifyContent: "space-around", marginTop: "10px" }}>
                  <Link to={`/edit-product/${product._id}`} className="button-a">
                    Update
                  </Link>
                  <button className="button-a" onClick={() => deleteProduct(product._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No products found.</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SellerHomePage;

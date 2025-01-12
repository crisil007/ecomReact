import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./footer";
import SellerNavBar from "./sellernav";

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

        if (!storedUserData) {
          alert("Please login to access your products.");
          navigate("/signin");
          return;
        }

        const parsedData = JSON.parse(storedUserData);
        const token = parsedData?.token;
        const sellerId = parsedData?._id;

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

        const response = await axios.get(`${backendUrl}/getProducts/${sellerId}`, config);
        if (response.data.success) {
          setProducts(response.data.products || []);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products. Please try again later.");
        navigate("/add");
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

  if (loading) return <div className="text-center text-lg mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 text-lg mt-10">Error: {error}</div>;

  return (
    <>
      <SellerNavBar />
      <div className="mt-16">
        <h1 className="text-3xl font-bold text-center mb-6">Seller Dashboard</h1>
        {message && (
          <div className="text-center text-green-600 font-medium mb-4">{message}</div>
        )}

        <div className="flex flex-wrap justify-center gap-8 px-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="w-64 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col items-center"
              >
                {product.images && product.images.length > 0 ? (
                  <img
                    src={`${backendUrl}/${product.images[0].url.replace(/\\/g, "/")}`}
                    alt={product.images[0].alt || product.name}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/150"
                    alt="Placeholder"
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                )}

                <h2 className="text-lg font-semibold mb-2">
                  {product.name.slice(0, 20)}{product.name.length > 20 ? "..." : ""}
                </h2>
                <p className="text-gray-700 mb-4">
                  <strong>Price:</strong> ${product.price}
                </p>

                <div className="flex gap-4">
                  <Link
                    to={`/edit-product/${product._id}`}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-lg text-gray-700">No products found.</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SellerHomePage;

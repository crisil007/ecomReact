import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavBar from "./adminNav";

const UserView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    user_type: "",
    status: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/getuser/${id}`);
        const userData = response.data.data;
        setUser(userData);
        setFormData({
          email: userData.email || "",
          user_type: userData.user_type?.user_type || "",
          status: userData.status || "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.response?.data?.message || "Error fetching user details");
      }
    };
    fetchUser();
  }, [id]);

  const fetchSellerProducts = async () => {
    if (!user || !user._id) {
      toast.error("User ID is invalid. Cannot fetch products.");
      return;
    }
    try {
      if (!showProducts) {
        setLoadingProducts(true);
        const response = await axios.get(`http://localhost:3005/getProducts/${user._id}`);
        setProducts(response.data.products);
      }
      setShowProducts(!showProducts);
    } catch (err) {
      console.error("Error fetching seller products:", err);
      toast.error("Error fetching seller products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleBlockToggle = async () => {
    try {
      const action = user.status === "active" ? "block" : "unblock";
      await axios.patch(`http://localhost:3005/users/${id}/block`, { action });
      toast.success(`User ${action}ed successfully!`);
      setUser((prev) => ({
        ...prev,
        status: action === "block" ? "blocked" : "active",
      }));
    } catch (err) {
      console.error("Error blocking/unblocking user:", err);
      toast.error(err.response?.data?.message || "Error blocking/unblocking user");
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <div className="relative max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      
        <h1 className="text-2xl font-bold text-gray-800 mb-4">User Details</h1>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="block w-full p-3 border border-gray-300 rounded-md"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
          <input
            type="text"
            className="block w-full p-3 border border-gray-300 rounded-md"
            value={formData.user_type}
            disabled
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <input
            type="text"
            className="block w-full p-3 border border-gray-300 rounded-md"
            value={user.status}
            disabled
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={handleBlockToggle}
            className={`py-2 px-4 rounded-md ${
              user.status === "active"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {user.status === "active" ? "Block" : "Unblock"}
          </button>
        </div>
        {user.user_type?.user_type === "seller" && (
          <button
            onClick={fetchSellerProducts}
            className="absolute bottom-4 right-4 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 shadow-md"
          >
            {showProducts ? "Hide Products" : "View Products"}
          </button>
        )}
      </div>

      {showProducts && (
        <div className="mt-8 max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 style={{ textAlign: "center", margin: "10px" }}>Seller Dashboard</h1>
          {products.length > 0 ? (
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
                    height: "450px",
                    textAlign: "center",
                    padding: "10px",
                  }}
                >
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={`http://localhost:3005/${product.images[0].url.replace(/\\/g, "/")}`}
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
                  {product.brand && <p><strong>Brand:</strong> {product.brand}</p>}
                  <p>
                    <strong>Price:</strong> ${product.price}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No products found for this seller.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserView;

import React, { useState, useEffect } from "react";// Optional, if you want custom styles apart from Tailwind
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    images: [],
    altText: "",
    stock: "",
  });
  const [message, setMessage] = useState("");
  const [sellerId, setSellerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("Data");
    if (!storedUserData) {
      console.error("No user data found. Ensure login saves data to localStorage.");
      setMessage("No user data found. Please log in again.");
      return;
    }
    try {
      const parsedData = JSON.parse(storedUserData);
      if (parsedData?._id) {
        setSellerId(parsedData._id);
      } else {
        console.error("Seller ID not found in parsed data.");
        setMessage("Seller ID not found. Please log in again.");
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      setMessage("Error retrieving seller data. Please log in again.");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "stock" || name === "price" ? Number(value) : value;

    setProductData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setProductData((prevData) => ({
          ...prevData,
          images: [...prevData.images, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sellerId = JSON.parse(localStorage.getItem("Data"))._id;

    try {
      const response = await fetch(`http://localhost:3005/addProduct/${sellerId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        navigate('/seller');
      } else {
        const errorResponse = await response.json();
        alert(errorResponse.message || "Failed to add product.");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      setMessage("Error submitting product. Please try again.");
    }
  };

  const isFormValid = () => {
    return productData.name && productData.price && productData.category && productData.brand && productData.stock && productData.altText;
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">Add Product</h2>
      {message && <p className="text-red-500 text-center mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Product Name:</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-2">Price:</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Category:</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium mb-2">Brand:</label>
          <input
            type="text"
            name="brand"
            value={productData.brand}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium mb-2">Stock:</label>
          <input
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleInputChange}
            required
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Alt Text */}
        <div>
          <label className="block text-sm font-medium mb-2">Alt Text (for images):</label>
          <input
            type="text"
            name="altText"
            value={productData.altText}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Choose Product Images:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full text-gray-500 py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-4 flex gap-3 overflow-x-auto">
            {productData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Preview ${index}`}
                className="w-16 h-16 object-cover border border-gray-300 rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid()}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

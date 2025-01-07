import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import NavBar from "./nav";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartAdded, setCartAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        setError("Failed to fetch product details. Please try again later.");
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="loading">Loading...</div>;

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }
    setCartAdded(true);
  };

  const handleQuantityChange = (event) => {
    const value = Math.max(1, Number(event.target.value));
    setQuantity(value);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("Please select a size before proceeding.");
      return;
    }
  
    const token = localStorage.getItem("token");
    console.log("Token retrieved from localStorage:", token); // Log the token
  
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/signin");
      return;
    }
  
    const isValidJWT = (token) => token && token.split(".").length === 3;
    if (!isValidJWT(token)) {
      alert("Invalid session token. Please log in again.");
      navigate("/signin");
      return;
    }
  
    try {
      const decoded = jwt_decode(token);
      console.log("Decoded Token:", decoded); // Log the decoded token
  
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        alert("Your session has expired. Please log in again.");
        navigate("/signin");
        return;
      }
    } catch (error) {
      console.error("Error decoding token:", error.message); // Log the error
      alert("Invalid session. Please log in again.");
      navigate("/signin");
      return;
    }
  
    // Navigate to /order/:id with the product id
    navigate(`/order/${product.id}`, {
      state: {
        product,
        selectedSize,
        quantity,
      },
    });
  };
  
  
  

  const sizes = ['9', '8', '7', '6'];

  return (
    <>
      <NavBar />
      <div className="product-details container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Product Image and Carousel */}
          <div className="col-span-12 md:col-span-5 flex">
            <div className="flex flex-col items-start space-y-4 mr-4">
              {product.images && product.images.length > 0 && product.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:3005/${image.url.replace(/\\/g, "/")}`}
                  alt={image.alt || `Thumbnail ${index + 1}`}
                  className={`w-24 h-24 object-cover rounded cursor-pointer border ${currentSlide === index ? 'border-blue-500' : 'border-gray-300'}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>

            <div className="relative w-full">
              <div
                className="carousel-inner overflow-hidden rounded-lg"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                  display: "flex",
                  transition: "transform 0.5s ease-in-out",
                }}
              >
                {product.images && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <img
                        src={`http://localhost:3005/${image.url.replace(/\\/g, "/")}`}
                        alt={image.alt || `Product image ${index + 1}`}
                        className="rounded-lg w-full"
                      />
                    </div>
                  ))
                ) : (
                  <div className="carousel-item">No images available</div>
                )}
              </div>
              <button
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                onClick={handlePrevSlide}
                aria-label="Previous Slide"
              >
                &#8249;
              </button>
              <button
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                onClick={handleNextSlide}
                aria-label="Next Slide"
              >
                &#8250;
              </button>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="col-span-12 md:col-span-7">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg text-gray-500 mb-4">{product.category}</p>
            <p className="text-xl font-semibold text-gray-900 mb-4">₹{product.price}</p>

            {/* Size Selection */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Select Size</h3>
              <div className="flex space-x-4">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`py-2 px-4 border rounded-lg ${selectedSize === size ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Quantity</h3>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-20 p-2 border rounded-lg"
                min="1"
              />
            </div>

            {/* Static Offer, Ratings, and EMI Options */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Offers & EMI</h3>
              <p className="text-gray-700 mb-2">10% off on your first purchase! (Use code FIRSTBUY)</p>
              <p className="text-gray-700 mb-2">EMI options available starting from ₹250/month.</p>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-2">&#9733;</span>
                <span className="text-lg font-semibold">4.5</span>
                <span className="text-sm text-gray-500 ml-1">(200 ratings)</span>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Specifications</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Brand: {product.brand}</li>
                <li>stock: {product.stock}</li>
                <li>Color: White</li>
                <li>Category: {product.category}</li>
                <li>Weight: {500} gm</li>
              </ul>
            </div>

            {/* Delivery & Payment Options Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Delivery & Payment Options</h3>
              <p className="text-gray-700">Free delivery on orders above ₹500. Estimated delivery time: 2-5 days.</p>
              <p className="text-gray-700 mb-2">Cash on Delivery (COD) available for select locations.</p>
              <p className="text-gray-700">Secure payment methods available: Credit/Debit Card, Net Banking, UPI.</p>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-green-500 text-white py-2 px-4 rounded-lg mr-4"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;

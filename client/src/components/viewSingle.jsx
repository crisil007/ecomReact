import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavBar from "./nav";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartAdded, setCartAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div className="loading">Loading...</div>;

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
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

  return (
    <><NavBar />
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
                  whiteSpace: 'nowrap',
                }}
              >
                {product.images && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <div key={index} className="inline-block w-full">
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
              <button className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full" onClick={handlePrevSlide}>
                &#8249;
              </button>
              <button className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full" onClick={handleNextSlide}>
                &#8250;
              </button>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="col-span-12 md:col-span-7">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg text-gray-500 mb-4">{product.category}</p>

            {/* Pricing and Offers */}
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
              <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
              <span className="text-lg text-green-500">{product.discount}% off</span>
            </div>

            {/* Ratings and Reviews */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">{product.rating}★</span>
              <span className="text-gray-600">{product.reviewsCount} ratings and {product.reviews} reviews</span>
            </div>

            {/* Available Offers */}
            <div className="mb-4">
              <h2 className="font-semibold text-lg mb-2">Available Offers</h2>
              <ul className="list-disc list-inside text-gray-700">
                <li>5% Unlimited Cashback on Flipkart Axis Bank Credit Card</li>
                <li>10% Off on HDFC Bank Credit Card EMI Transactions</li>
                <li>Special Price: Get extra 10% off on select products</li>
                <li>Combo Offer: Buy 2 items and save an additional ₹50</li>
              </ul>
            </div>

            {/* Size Selector */}
            <div className="mb-4">
              <h2 className="font-semibold text-lg mb-2">Select Size</h2>
              <div className="flex items-center space-x-4">
                {product.sizes && product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded border ${selectedSize === size ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border-gray-400'}`}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons for Cart and Buy */}
            <div className="flex items-center space-x-4 mb-6">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>

              <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                Buy Now
              </button>
            </div>

            {/* Quantity Selector */}
            {cartAdded && (
              <div className="flex items-center space-x-4 mt-4">
                <label htmlFor="quantity" className="text-gray-700">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  className="w-16 border px-2 py-1 rounded"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './style.css';  // Import the CSS file

const ProductDetails = () => {
  const { id } = useParams(); // Retrieve the product id from the URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/product/${id}`); // Fetch the product data
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="product-details">
      <div className="product-images">
        {product.images && product.images.length > 0 ? (
          product.images.map((image, index) => (
            <div key={index} className="product-image-container">
              <img
                src={`http://localhost:3005/${image.url.replace(/\\/g, '/')}`}
                alt={image.alt || `Product image ${index + 1}`}
                className="product-image"
              />
            </div>
          ))
        ) : (
          <div className="no-image">No images available</div>
        )}
      </div>

      <div className="product-info">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-price"><strong>Price:</strong> ${product.price}</p>
        <p className="product-category"><strong>Category:</strong> {product.category}</p>
        <p className="product-description">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetails;

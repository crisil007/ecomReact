import React, { useState, useEffect } from 'react';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the wishlist on page load
  useEffect(() => {
    fetchWishlist();
  }, []);

  // Fetch wishlist from the server
  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await fetch('/viewWishlist', {
        headers: {
          'Authorization': `bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      if (data.items) {
        setWishlist(data.items);
      } else {
        setError(data.message || 'An error occurred.');
      }
    } catch (err) {
      setError('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  // Add product to the wishlist
  const addToWishlist = async (productId) => {
    try {
      const response = await fetch('/addWishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (data.wishlist) {
        setWishlist(data.wishlist.fav); // Update the wishlist after adding a product
      } else {
        setError(data.message || 'Failed to add product.');
      }
    } catch (err) {
      setError('Failed to add product to wishlist.');
    }
  };

  // Remove product from the wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(`/deleteWishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      if (data.wishlist) {
        setWishlist(data.wishlist.fav); // Update the wishlist after removing a product
      } else {
        setError(data.message || 'Failed to remove product.');
      }
    } catch (err) {
      setError('Failed to remove product from wishlist.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-6">
        <h1 className="text-3xl text-center">Your Wishlist</h1>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-green-600">{error}</p>}

        <div className="flex justify-center mb-8">
          <button
            className="bg-orange-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-orange-400"
            onClick={() => addToWishlist('someProductId')}
          >
            Add Product to Wishlist
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.length === 0 ? (
            <p className="text-center text-gray-600">Your wishlist is empty!</p>
          ) : (
            wishlist.map((item) => (
              <div key={item.productId._id} className="bg-white p-4 rounded-lg shadow-lg">
                <img
                  className="w-full h-48 object-cover rounded-lg"
                  src={item.productId.imageUrl}
                  alt={item.productId.name}
                />
                <h3 className="text-xl font-semibold mt-4">{item.productId.name}</h3>
                <p className="text-gray-600 mt-2">{item.productId.description}</p>
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-400"
                    onClick={() => removeFromWishlist(item.productId._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

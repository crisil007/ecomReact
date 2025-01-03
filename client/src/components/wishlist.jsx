import React, { useState, useEffect } from 'react';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the wishlist from the server
  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/viewWishlist', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (data.items) {
        setWishlist(data.items);
      } else {
        setError(data.message || 'Failed to load wishlist.');
      }
    } catch (err) {
      setError('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const removeItem = async (productId) => {
    try {
      const response = await fetch(`/removeFromWishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setWishlist(wishlist.filter(item => item.productId !== productId)); // Update wishlist state
      } else {
        setError(data.message || 'Failed to remove item.');
      }
    } catch (err) {
      setError('Failed to remove item.');
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Your Wishlist</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {wishlist.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.productId}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={item.productId.image || '/placeholder.jpg'}
                alt={item.productId.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{item.productId.name}</h2>
                <p className="text-gray-600">{item.productId.description}</p>
                <p className="text-lg font-semibold text-blue-500 mt-2">${item.productId.price}</p>
                <button
                  onClick={() => removeItem(item.productId._id)}
                  className="mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 focus:outline-none"
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

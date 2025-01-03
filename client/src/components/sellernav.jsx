import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faHeart, faUserCircle, faPlusSquare, faBoxes } from '@fortawesome/free-solid-svg-icons';

export default function SellerNavBar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const sellerData = localStorage.getItem("Data");
    console.log("Seller data from localStorage:", sellerData);
    if (sellerData) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sellerData");
    setIsLoggedIn(false); // Ensure the logout process updates state
    navigate("/signin");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md w-full z-20 fixed top-0">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/seller/home")}>
          <span className="text-yellow-400">Seller</span>Portal
        </div>

        {/* Menu Items */}
        <div className="hidden md:flex space-x-6 ml-auto">
          <Link to="/addproduct" className="text-lg hover:text-yellow-400 flex items-center">
            <FontAwesomeIcon icon={faPlusSquare} className="mr-2" /> Add Products
          </Link>
          <Link to="/seller" className="text-lg hover:text-yellow-400 flex items-center">
            <FontAwesomeIcon icon={faBoxes} className="mr-2" /> My Products
          </Link>
        </div>

        {/* Cart, Wishlist, and Profile Icons */}
        <div className="flex space-x-4 ml-auto">
          <Link to="/cart" className="text-white hover:text-yellow-400">
            <FontAwesomeIcon icon={faCartPlus} size="lg" />
          </Link>
          <Link to="/wishlist" className="text-white hover:text-yellow-400">
            <FontAwesomeIcon icon={faHeart} size="lg" />
          </Link>
          <div className="relative">
            <FontAwesomeIcon 
              icon={faUserCircle} 
              size="lg" 
              className="cursor-pointer hover:text-yellow-400"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            {isDropdownOpen && isLoggedIn && (
              <div className="absolute right-0 bg-white text-black rounded-md shadow-md mt-2 w-40 z-30">
                <ul>
                  <li 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                  <li 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/seller/profile")}
                  >
                    My Profile
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-600 text-white p-4 space-y-4">
          <Link to="/seller/add-product" className="block hover:text-yellow-400 text-lg">Add Products</Link>
          <Link to="/seller/my-products" className="block hover:text-yellow-400 text-lg">My Products</Link>
          <Link to="/cart" className="block hover:text-yellow-400 text-lg">Cart</Link>
          <Link to="/wishlist" className="block hover:text-yellow-400 text-lg">Wishlist</Link>
          <button 
            className="block w-full text-left px-4 py-2 bg-blue-600 hover:bg-yellow-400"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Profile
          </button>
          {isDropdownOpen && isLoggedIn && (
            <div className="bg-white text-black rounded-md shadow-md mt-2 w-full">
              <ul>
                <li 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
                <li 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate("/seller/profile")}
                >
                  My Profile
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

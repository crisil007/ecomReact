import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './css/NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faHeart } from '@fortawesome/free-solid-svg-icons';

export default function NavBar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');  // State to store selected brand
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);

  useEffect(() => {
    // Check if user data exists in localStorage to determine login status
    const userData = localStorage.getItem("Data");
    setIsLoggedIn(!!userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("Data");
    setIsLoggedIn(false);
    navigate("/signin"); // Redirect to login after logout
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    // Optionally, navigate to filtered products page with the selected brand
    navigate(`/products?brand=${brand}`);
    setIsBrandDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          Shoe<span className="highlight">Mart</span>
        </div>

        {/* Links */}
        <div className={`menu ${isMenuOpen ? "open" : ""}`}>
          <Link to="/mens" className="menu-item">
            Men's
          </Link>
          <Link to="/womens" className="menu-item">
            Women's
          </Link>
          <Link to="/cart" className="menu-item">
            Cart
          </Link>
        </div>

        {/* Brand Dropdown */}
        <div className="brand-container relative">
          <button 
            className="brand-dropdown-btn" 
            onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
          >
            Brand {selectedBrand && `(${selectedBrand})`}
          </button>
          {isBrandDropdownOpen && (
            <div className="dropdown-menu absolute bg-white border rounded shadow-md">
              <ul className="dropdown-list text-black text-xs">
                <li 
                  className="dropdown-item cursor-pointer hover:bg-gray-200 px-4 py-2"
                  onClick={() => handleBrandSelect("Nike")}
                >
                  Nike
                </li>
                <li 
                  className="dropdown-item cursor-pointer hover:bg-gray-200 px-4 py-2"
                  onClick={() => handleBrandSelect("Adidas")}
                >
                  Adidas
                </li>
                <li 
                  className="dropdown-item cursor-pointer hover:bg-gray-200 px-4 py-2"
                  onClick={() => handleBrandSelect("Puma")}
                >
                  Puma
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div
          className="profile-container relative"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <img
            src="../public/images/icons8.png" // Replace with the actual profile icon path
            className="profile-icon cursor-pointer"
          />
          {isDropdownOpen && (
            <div className="dropdown-menu absolute right-0 bg-white border rounded shadow-md">
              <ul className="dropdown-list text-black text-xs">
                {isLoggedIn ? (
                  <>
                    <li className="dropdown-item cursor-pointer hover:bg-gray-200 px-4 py-2" onClick={handleLogout}>
                      Sign Out
                    </li>
                    <li
                      className="dropdown-item cursor-pointer hover:bg-gray-200 px-4 py-2"
                      onClick={() => navigate("/profile")}
                    >
                      My Profile
                    </li>
                  </>
                ) : (
                  <li
                    className="dropdown-item cursor-pointer hover:bg-gray-200 px-4 py-2"
                    onClick={() => navigate("/signin")}
                  >
                    Login
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Cart and Wishlist Icons */}
        <div className="cart-wishlist-icons">
          <Link to="/cart" className="cart-icon-container">
            <FontAwesomeIcon icon={faCartPlus} size="lg" />
          </Link>
          <Link to="/wishlist" className="wishlist-icon-container">
            <FontAwesomeIcon icon={faHeart} size="lg" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>
    </nav>
  );
}

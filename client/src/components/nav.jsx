import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faHeart, faUserCircle } from '@fortawesome/free-solid-svg-icons';

export default function NavBar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("Data");
    setIsLoggedIn(!!userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("Data");
    setIsLoggedIn(false);
    navigate("/signin");
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    navigate(`/products?brand=${brand}`);
    setIsBrandDropdownOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white  shadow-md w-full z-20 fixed top-0">
    <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
      {/* Logo */}
      <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        <span className="text-yellow-400">Shoe</span>Mart
      </div>
  
      {/* Menu Items */}
      <div className="hidden md:flex space-x-6 ml-auto">
        <Link to="/mens" className="text-lg hover:text-yellow-400">Men's</Link>
        <Link to="/womens" className="text-lg hover:text-yellow-400">Women's</Link>
      </div>
  
      {/* Brand Dropdown */}
      <div className="relative hidden md:block">
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-yellow-400"
          onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
        >
          Brands {selectedBrand && `(${selectedBrand})`}
        </button>
        {isBrandDropdownOpen && (
          <div className="absolute bg-white text-black rounded-md shadow-md mt-2 w-40 z-30">
            <ul>
              <li 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleBrandSelect("Nike")}
              >
                Nike
              </li>
              <li 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleBrandSelect("Adidas")}
              >
                Adidas
              </li>
              <li 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleBrandSelect("Puma")}
              >
                Puma
              </li>
            </ul>
          </div>
        )}
      </div>
  
      {/* Cart, Wishlist, and Profile Icons */}
      <div className="flex space-x-4 ml-auto">
        <Link to="/wishlist" className="text-white hover:text-yellow-400">
          <FontAwesomeIcon icon={faHeart} size="lg" />
        </Link>
        <Link to="/cart" className="text-white hover:text-yellow-400">
          <FontAwesomeIcon icon={faCartPlus} size="lg" />
        </Link>
        <div className="relative">
          <FontAwesomeIcon 
            icon={faUserCircle} 
            size="lg" 
            className="cursor-pointer hover:text-yellow-400"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
          {isDropdownOpen && (
            <div className="absolute right-0 bg-white text-black rounded-md shadow-md mt-2 w-40 z-30">
              <ul>
                {isLoggedIn ? (
                  <>
                    <li 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </li>
                    <li 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate("/profile")}
                    >
                      My Profile
                    </li>
                  </>
                ) : (
                  <li 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/signin")}
                  >
                    Login
                  </li>
                )}
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
        <Link to="/mens" className="block hover:text-yellow-400 text-lg">Men's</Link>
        <Link to="/womens" className="block hover:text-yellow-400 text-lg">Women's</Link>
        <button 
          className="block w-full text-left px-4 py-2 bg-blue-600 hover:bg-yellow-400"
          onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
        >
          Brands {selectedBrand && `(${selectedBrand})`}
        </button>
        {isBrandDropdownOpen && (
          <div className="bg-white text-black rounded-md shadow-md mt-2 w-full">
            <ul>
              <li 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleBrandSelect("Nike")}
              >
                Nike
              </li>
              <li 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleBrandSelect("Adidas")}
              >
                Adidas
              </li>
              <li 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleBrandSelect("Puma")}
              >
                Puma
              </li>
            </ul>
          </div>
        )}
      </div>
    )}
  </nav>
  
  );
}

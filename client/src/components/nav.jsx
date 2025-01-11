import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faHeart, faUserCircle } from "@fortawesome/free-solid-svg-icons";

export default function NavBar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("Data");
    setIsLoggedIn(!!userData);
  }, []);

  // Fetch brands from the backend
  // Fetch brands from the backend
useEffect(() => {
  const fetchBrands = async () => {
      try {
          const response = await fetch("http://localhost:3005/brands"); // No query params
          const data = await response.json();
          if (data.success) {
              setBrands(data.data.brands);
          } else {
              console.error("Failed to fetch brands:", data.message);
          }
      } catch (error) {
          console.error("Error fetching brands:", error);
      }
  };
  fetchBrands();
}, []);

  const handleLogout = () => {
    localStorage.removeItem("Data");
    setIsLoggedIn(false);
    navigate("/signin");
  };

  const handleBrandSelect = async (brand) => {
    setSelectedBrand(brand);
    try {
      const response = await fetch(`http://localhost:3005/brands?brand=${encodeURIComponent(brand)}`);
      const data = await response.json();
  
      if (data.success) {
        // Navigate using /brands/:brand route instead of query params
        navigate(`/brands/${encodeURIComponent(brand)}`, { state: { products: data.data.products } });
      } else {
        console.error("Failed to fetch products:", data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setIsBrandDropdownOpen(false);
  };
  


  

  return (
    <nav className="bg-blue-600 text-white shadow-md w-full z-20 fixed top-0">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-yellow-400">Shoe</span>Mart
        </div>

        <div className="hidden md:flex space-x-6 ml-auto">
          <Link to="/mens" className="text-lg hover:text-yellow-400">Men's</Link>
          <Link to="/womens" className="text-lg hover:text-yellow-400">Women's</Link>
        </div>

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
                {brands.map((brand, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleBrandSelect(brand)}
                  >
                    {brand}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

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
                        onClick={() => navigate("/myorder")}
                      >
                        My Orders
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

        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

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
                {brands.map((brand, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleBrandSelect(brand)}
                  >
                    {brand}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

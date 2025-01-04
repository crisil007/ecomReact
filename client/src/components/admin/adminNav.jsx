import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faUsers, faClipboardList } from '@fortawesome/free-solid-svg-icons';

export default function AdminNavBar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const adminData = localStorage.getItem("Data");
    console.log("Admin data from localStorage:", adminData);
    if (adminData) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("Data");
    setIsLoggedIn(false); // Ensure the logout process updates state
    navigate("/signin");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md w-full z-20 fixed top-0">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
          <span className="text-yellow-400">Admin</span> Portal
        </div>

        {/* Menu Items */}
        <div className="hidden md:flex space-x-6 ml-auto">
          <Link to="/admin/users" className="text-lg hover:text-yellow-400 flex items-center">
            <FontAwesomeIcon icon={faUsers} className="mr-2" /> Users
          </Link>
          <Link to="/admin/requests" className="text-lg hover:text-yellow-400 flex items-center">
            <FontAwesomeIcon icon={faClipboardList} className="mr-2" /> Requests
          </Link>
        </div>

        {/* User Profile Icon */}
        <div className="flex space-x-4 ml-auto">
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
          <Link to="/admin/users" className="block hover:text-yellow-400 text-lg">Users</Link>
          <Link to="/admin/requests" className="block hover:text-yellow-400 text-lg">Requests</Link>
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
              </ul>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

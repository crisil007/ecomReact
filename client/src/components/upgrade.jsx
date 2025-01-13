import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UpgradeRequest() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [license, setLicense] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyName || !license) {
      setError("All fields are required.");
      setSuccessMessage(""); // Clear success message if there's an error
      return;
    }

    setIsLoading(true);

    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to submit the upgrade request.");
      setSuccessMessage(""); // Clear success message if no token
      setIsLoading(false);
      return;
    }

    const requestData = {
      companyName,
      license,
    };

    try {
      const response = await fetch("http://localhost:3005/requestUpgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in request headers
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage("Your upgrade request has been submitted successfully!"); // Set success message
        setError(""); // Clear any existing errors
        navigate('/home'); // Navigate to success page (if needed)
      } else {
        alert("Your upgrade request has been submitted successfully!");
        navigate('/home');// Clear success message if the request fails
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
     // Clear success message if the request fails
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
          Become a Seller
        </h2>

        {/* Success message */}
        {successMessage && (
          <p className="text-green-600 text-center mb-4">{successMessage}</p> // Green success message
        )}

        {/* Error message */}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>} {/* Red error message */}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-lg font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your company name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="license" className="block text-lg font-medium text-gray-700">
              License Number
            </label>
            <input
              type="text"
              id="license"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your business license number"
            />
          </div>

          <div className="mb-6">
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-md text-white ${isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Request"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            By submitting, you request to become a seller on our platform.
          </p>
        </form>
      </div>
    </div>
  );
}

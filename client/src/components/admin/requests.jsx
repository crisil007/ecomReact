import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ManageUpgradeRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const fetchRequests = async () => {

      const token = localStorage.getItem("token");
  
      if (!token) {
        setError("You must be logged in to view upgrade requests.");
        setIsLoading(false);
        return;
      }
  
      try {
        const response = await fetch("http://localhost:3005/upgradeRequests", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        
        if (data.message) {
          setSuccessMessage(data.message);  // Set the success message
        }
  
        if (data.data && data.data.length > 0) {
          setRequests(data.data);  // Populate the requests if available
        } else {
          setError("No upgrade requests found.");  // Handle the case if no requests exist
        }
  
      } catch (error) {
        setError("Something went wrong. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchRequests();
  }, []);
  
  
  

  const handleApprove = async (userId) => {
    try {
      // Check if userId is an object, and if so, get the id property
      const userIdString = userId._id || userId; // If userId is an object, get its _id property
      
      // Now use the correct userIdString in the URL
      const response = await axios.put(`http://localhost:3005/approveUpgrade/${userIdString}`);
      
      alert('Request approved successfully!');
      navigate('/admin/requests')
      setRequests(requests.filter((request) => request.userId !== userIdString)); // Remove approved request from the list
    } catch (error) {
      if (error.response) {
        let message = error.response.data.message;
        alert(message);
        return;
      }
      console.error('Error approving request:', error);
      alert('Failed to approve the request.');
    }
  };
  


//   if (loading) {
//     return <div>Loading...</div>;
//   }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
          Manage Upgrade Requests
        </h2>

        {/* Success message */}
        {successMessage && (
          <p className="text-green-600 text-center mb-4">{successMessage}</p>
        )}

        {/* Error message */}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left border-b">Company Name</th>
                <th className="px-4 py-2 text-left border-b">License</th>
                <th className="px-4 py-2 text-left border-b">User</th>
                <th className="px-4 py-2 text-left border-b">Status</th>
                <th className="px-4 py-2 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
  {isLoading ? (
    <tr>
      <td colSpan="5" className="text-center py-4">Loading...</td>
    </tr>
  ) : (
    requests.map((request) => (
      <tr key={request._id}>
        <td className="px-4 py-2 border-b">{request.companyName}</td>
        <td className="px-4 py-2 border-b">{request.license}</td>
        <td className="px-4 py-2 border-b">{request.userId?.email || "N/A"}</td>
        <td className="px-4 py-2 border-b">{request.status}</td>
        <td className="px-4 py-2 border-b">
          {request.status === "pending" && (
            <button
              onClick={() => handleApprove(request.userId)} // Pass the userId object
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Approve
            </button>
          )}
        </td>
      </tr>
    ))
  )}
</tbody>


          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBuyers: 0,
    totalSellers: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:3005/dashboard-stats");
        console.log(response.data); // Log the response to check the structure
        setStats({
          totalUsers: response.data.data.totalUsers,
          totalBuyers: response.data.data.totalBuyers,
          totalSellers: response.data.data.totalSellers,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {/* Link to Users Page */}
        <Link to="/users">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Total Users</h2>
            <p className="text-4xl font-bold text-gray-800">{stats.totalUsers}</p>
          </div>
        </Link>

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Total Buyers</h2>
          <p className="text-4xl font-bold text-gray-800">{stats.totalBuyers}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Total Sellers</h2>
          <p className="text-4xl font-bold text-gray-800">{stats.totalSellers}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

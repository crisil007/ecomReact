import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
   const navigate=useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
      user_type: userType,
    };

    try {
      const response = await axios.post('http://localhost:3005/users', userData);

      if (response.status === 200) {
        alert('User created successfully!');
        navigate('/signin')
        setErrorMessage('');
      } else {
        setSuccessMessage('');
        setErrorMessage('Failed to create user. Please try again.');
      }
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(error.response ? error.response.data.message : 'Something went wrong');
    }
  };

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Type:</label>
            <input
              type="text"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition-transform transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>
        </form>
        {errorMessage && <div className="mt-4 text-center text-red-600">{errorMessage}</div>}
        {successMessage && <div className="mt-4 text-center text-green-600">{successMessage}</div>}
      </div>
    </div>
  );


};

export default Signup;

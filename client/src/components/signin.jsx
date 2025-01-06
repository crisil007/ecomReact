import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigation after login

  const login = async (event) => {
    event.preventDefault();

    const datas = { email, password };
    console.log("Login credentials:", datas);

    try {
      const response = await fetch("http://localhost:3005/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datas),
      });

      if (response.ok) {
        const parsed_response = await response.json();
        console.log("Parsed Response:", parsed_response);
        const token = parsed_response.data.token; // Assuming token is directly in `data`
        const data = parsed_response.data;
        console.log("Data to save:", data);

        // Save to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("Data", JSON.stringify(data));

        const user_type = data.user_type?._id?.toString() || data.user_type; // Handle ObjectId or plain string
        console.log("User Type ID:", user_type);

        alert(parsed_response.message);

        if (user_type === "673d6d56751d8f9abf59f6fc") {
          navigate("/admin");
        } else if (user_type === "673d6e73751d8f9abf59f6ff") {
          navigate("/sellerhome");
        } else {
          navigate("/home");
        }
      } else {
        const parsed_response = await response.json();
        console.log("Error message:", parsed_response.message);
        setError(parsed_response.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("An error occurred while trying to login. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl flex">
        {/* Left Side (Image Section) */}
        <div className="w-1/2 bg-blue-600 text-white flex flex-col items-center justify-center p-8">
          <div className="text-center mb-8">
            <img src="./images/log.jpg.jpg" alt="Graphic" className="w-30 h-60 mb-4" />
            <h1 className="text-3xl font-bold">ShoeMart</h1>
            <p className="mt-2">Get access to your Orders, Wishlist, and Recommendations</p>
          </div>
        </div>

        {/* Right Side (Login Form Section) */}
        <div className="w-1/2 bg-white p-8">
          <form onSubmit={login} method="POST">
            <div className="text-center text-3xl font-semibold text-gray-800 mb-6">Login</div>

            <div className="mb-4">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
              <span className="text-red-500 text-sm" id="email-err"></span>
            </div>

            <div className="mb-6">
              <input
                type="password"
                name="password"
                id="pass"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
              <span className="text-red-500 text-sm" id="pass-err"></span>
            </div>

            {error && <div className="text-center text-red-500 mb-4">{error}</div>}

            <div className="mb-4 text-center">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Login
              </button>
            </div>

            <div className="flex items-center justify-between text-center mb-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-4 text-gray-600">OR</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            <div className="flex flex-col items-center">
              <a href="/signup" className="text-blue-600 hover:text-blue-700 mb-2">
                Create new account
              </a>
              <a href="/forgot-password" className="text-blue-600 hover:text-blue-700">
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;

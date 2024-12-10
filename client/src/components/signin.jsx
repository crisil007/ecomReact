import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/signin.css'

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigation after login

  const login = async (event) => {
    event.preventDefault();

    const datas = {
      email,
      password,
    };

    console.log("datas from login:", datas);
    const json_data = JSON.stringify(datas);

    try {
      // Make the POST request to the server
      const response = await fetch("http://localhost:3005/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: json_data,
      });

      if (response.ok) {
        const parsed_response = await response.json();
        console.log("parsed_response:", parsed_response);

        const data = parsed_response.data;
        const token = parsed_response.data.token;
        console.log("data:", data);
        console.log("token:", token);

        localStorage.setItem("authToken", token);

        const user_type = data.user_type;
        console.log("user_type:", user_type);

        // Show the alert first
        alert(parsed_response.message);

        if (user_type._id === "673d6d56751d8f9abf59f6fc") {
          navigate("/adminpage"); // Navigate to admin page
        } else if (user_type._id === "673d6e73751d8f9abf59f6ff") {
          navigate("/seller"); // Navigate to seller page
        } else {
          navigate("/home"); // Navigate to product listing page
        }
      } else {
        // Handle unsuccessful response (non-2xx status codes)
        const parsed_response = await response.json();
        console.log("Error message:", parsed_response.message);
        setError(parsed_response.message);  // Set error message
      }
    } catch (error) {
      // Catch network errors
      console.error("Network error:", error);
      setError("An error occurred while trying to login. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <form onSubmit={login} method="POST">
          <div><span className="login-txt">Login</span></div>
          <div className="form-row">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="clienterr" id="email-err"></span>
          </div>
          <div className="form-row">
            <input
              type="password"
              name="password"
              id="pass"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="clienterr" id="pass-err"></span>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="login-btn">
            <button className="login-btn">Login</button>
          </div>
          <div className="line">
            <div className="or"><span>OR</span></div>
          </div>
          <div className="pass">
            <div className="new-use">
              <a href="/signup">Create new account</a>
            </div>
            <div className="forgot-pass">
              <a href="/forgot-password">Forgot password?</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;

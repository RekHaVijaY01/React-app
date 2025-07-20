import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Banavbar from './banavbar';

const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const usernameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[a-zA-Z]+@gmail\.com$/;

    if (!usernameRegex.test(username)) {
      alert("Username must contain only letters (no numbers or special characters).");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Email must be in format: name@gmail.com");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Login success:", data);
        localStorage.setItem("role", "user");
        navigate("/home");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error");
    }
  };

  return (
    <>
      <Banavbar />
      <div className="login-container">
        <div className="login-box">
          <h2>User Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email (e.g., name@gmail.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </>
  );
};

export default UserLogin;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Banavbar from './banavbar'; // ✅ Check path

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("role", data.role); // optionally store role
        alert(data.message);
        navigate('/admin-dashboard'); // ✅ redirect to dashboard with navbar
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Server error. Please try again later.');
    }
  };

  return (
    <>
      <Banavbar />
      <div className="login-container">
        <div className="login-box">
          <h2>Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;

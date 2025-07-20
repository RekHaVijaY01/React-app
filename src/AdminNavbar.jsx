// src/AdminNavbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './adminnavbar.css';

const AdminNavbar = () => {
  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-left">
        Elite Gathering – Admin Panel
      </div>
      <div className="admin-navbar-right">
        
        <Link to="/admin-upload" className="nav-link">Admin Upload</Link>
        <Link to="/admin-booking" className="nav-link">Appointments</Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;

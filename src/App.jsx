// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Home from "./Home";
import Decoration from "./Decoration";
import Catering from "./Catering";
import Cake from "./cake";
import Photo from "./photography";
import Contact from "./Contact";
import SelectRole from "./SelectRole";
import UserLogin from "./UserLogin";
import AdminLogin from "./AdminLogin";
import Cart from "./Cart";
import Booking from "./Booking";



import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard"; 
import AdminUpload from "./AdminUpload";
import AdminBooking from "./AdminBooking";

import { CartProvider } from "./CartContext";
import { Layout } from "./Layout";

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SelectRole />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* User layout */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/decoration" element={<Decoration />} />
            <Route path="/catering" element={<Catering />} />
            <Route path="/cake" element={<Cake />} />
            <Route path="/photography" element={<Photo />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            
          </Route>

          {/* Admin layout */}
          <Route element={<AdminLayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-upload" element={<AdminUpload />} />
            <Route path="/admin-booking" element={<AdminBooking />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;

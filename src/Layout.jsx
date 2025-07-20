// Layout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import FloatingChatbot from "./FloatingChatbot";

export const Layout = () => {
  const location = useLocation();

  // Show Navbar only after login (not on login page itself)
  const showNavbar = location.pathname !== "/user-login" && location.pathname !== "/admin-login";

  return (
  <>
    {showNavbar && <Navbar />}
    <Outlet />
    {showNavbar && <FloatingChatbot />} {/* ✅ Add this line */}
  </>
);

};

// src/AdminLayout.jsx
import React from "react";
import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;

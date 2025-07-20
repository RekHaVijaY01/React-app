import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminBooking.css";

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/bookings")
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });
  }, []);

  const maskValue = (value) => {
    if (!value) return "N/A";
    if (/^\d{12,19}$/.test(value)) return "**** **** **** " + value.slice(-4);
    if (/^[\w.\-]+@[a-zA-Z]+$/.test(value)) return value.replace(/^(.{2}).+(@.+)$/, "$1****$2");
    if (/^\d{10}$/.test(value)) return "******" + value.slice(-4);
    return value;
  };

  // Format date to DD-MM-YYYY
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleDateString("en-GB").replace(/\//g, "-"); // "DD-MM-YYYY"
  };

  // Filter by name or formatted date
  const filteredBookings = bookings.filter((booking) => {
    const nameMatch = booking.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const formatted = formatDate(booking.date);
    const dateMatch = formatted.includes(searchQuery);
    return nameMatch || dateMatch;
  });

  if (loading) return <p className="admin-loading">Loading bookings...</p>;
  if (bookings.length === 0) return <p className="admin-empty">No bookings found.</p>;

  return (
    <div className="admin-booking-container">
      <h2 className="admin-booking-title">📋 Admin Dashboard</h2>

      {/* Search Bar */}
      <div className="admin-search-bar">
        <input
          type="text"
          placeholder="Search by name or date (DD-MM-YYYY)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredBookings.map((booking) => (
        <div key={booking._id} className="booking-card">
          <p><strong>Name:</strong> {booking.name || "N/A"}</p>
          <p><strong>Email:</strong> {booking.email}</p>
          <p><strong>Phone:</strong> {booking.phone}</p>
          <p><strong>Alt Phone:</strong> {booking.altPhone}</p>
          <p><strong>Venue:</strong> {booking.venue}</p>
          <p><strong>Date:</strong> {formatDate(booking.date)}</p>
          <p><strong>Members:</strong> {booking.memberCount}</p>

          <h4 className="booking-section-title">🍱 Food Estimation:</h4>
          {booking.foodEstimation && typeof booking.foodEstimation === "object" ? (
            <ul>
              {Object.entries(booking.foodEstimation).map(([item, cost]) => (
                <li key={item}>{item}: ₹{cost}</li>
              ))}
            </ul>
          ) : (
            <p>₹{booking.foodEstimation}</p>
          )}

          <h4 className="booking-section-title">🛒 Cart Items:</h4>
          <ul>
            {booking.cartItems?.map((item, index) => (
              <li key={index}>
                {item.name} — ₹{item.price} <em>({item.serviceType})</em>
              </li>
            ))}
          </ul>

          <p><strong>💰 Total Amount:</strong> ₹{booking.totalAmount}</p>
          <p><strong>💸 Paid Amount:</strong> ₹{booking.paymentAmount || Math.floor(booking.totalAmount / 2)}</p>
          <p><strong>💳 Payment Method:</strong> {booking.paymentMethod || "N/A"}</p>
          <p><strong>🔢 Payment Details:</strong> {maskValue(booking.paymentValue)}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminBooking;

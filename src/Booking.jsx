import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import "./Booking.css";

const Booking = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    altPhone: "",
    venue: "",
    date: "",
    memberCount: "",
  });

  const [error, setError] = useState("");
  const [foodEstimation, setFoodEstimation] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [paymentValue, setPaymentValue] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const members = parseInt(formData.memberCount) || 0;

    const foodItems = cartItems.filter(item => item.serviceType === "catering");
    const nonFoodItems = cartItems.filter(item => item.serviceType !== "catering");

    const nonFoodTotal = nonFoodItems.reduce((sum, item) => sum + item.price, 0);
    const foodTotal = foodItems.reduce((sum, item) => sum + item.price * members, 0);

    setFoodEstimation(foodTotal);
    setTotalAmount(nonFoodTotal + foodTotal);
  }, [formData.memberCount, cartItems]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.email.includes("@")) return setError("Invalid email.");
    if (!phoneRegex.test(formData.phone)) return setError("Enter valid phone number.");
    if (!phoneRegex.test(formData.altPhone)) return setError("Enter valid alternate phone number.");
    if (!formData.venue || !formData.date || !formData.memberCount) {
      return setError("All fields are required.");
    }
    return true;
  };

  const isValidPayment = () => {
    const value = paymentValue.trim();
    if (paymentMethod === "credit" || paymentMethod === "debit") {
      return /^\d{12,19}$/.test(value);
    } else if (paymentMethod === "upi" || paymentMethod === "gpay") {
      return /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(value) || /^[0-9]{10}$/.test(value);
    }
    return false;
  };

  const handlePayment = () => {
    if (!isValidPayment()) return;

    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentStatus("success");
    }, 1000);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!validateForm()) return;
  if (paymentStatus !== "success") return setError("Please complete payment first.");

  const bookingData = {
    ...formData,
    memberCount: parseInt(formData.memberCount),
    cartItems,
    foodEstimation,
    totalAmount,
    paymentMethod,
    paymentValue,
    paymentAmount: Math.floor(totalAmount / 2),
  };

  try {
    const response = await fetch("http://localhost:5000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();
    if (response.ok) {
      alert("✅ Booking confirmed!");
      clearCart();
      navigate("/");
    } else {
      setError(data.error || "Something went wrong.");
    }
  } catch (err) {
    console.error("Booking error:", err);
    setError("Server error.");
  }
};


  return (
    <div className="booking-container">
      <h2>📅 Booking Details</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <input type="name" name="name" placeholder="Name" value={formData.email} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
        <input type="text" name="altPhone" placeholder="Alternate Phone Number" value={formData.altPhone} onChange={handleChange} />
        <input type="text" name="venue" placeholder="Venue Address" value={formData.venue} onChange={handleChange} />
        <input type="date" name="date" value={formData.date} onChange={handleChange} />
        <input type="number" name="memberCount" placeholder="Number of Members" value={formData.memberCount} onChange={handleChange} />
        <h5>For any customization Contact us!</h5>
        <div className="booking-summary">
          <p><strong>🍽️ Food Estimation:</strong> ₹{foodEstimation}</p>
          <p><strong>💰 Total Amount:</strong> ₹{totalAmount}</p>
        </div>

        {error && <p className="error">{error}</p>}

        {paymentStatus !== "success" ? (
          <button
            type="button"
            className="submit-btn"
            onClick={() => {
              if (validateForm()) setShowPaymentModal(true);
            }}
          >
            Proceed to Pay ₹{Math.floor(totalAmount / 2)}
          </button>
        ) : (
          <button type="submit" className="submit-btn">
            Confirm Booking
          </button>
        )}
      </form>

      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <h3>💳 Complete Your Payment</h3>

            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="credit">Credit Card</option>
              <option value="debit">Debit Card</option>
              <option value="upi">UPI</option>
              <option value="gpay">GPay</option>
            </select>

            <input
              type="text"
              placeholder="Enter payment details"
              value={paymentValue}
              onChange={(e) => setPaymentValue(e.target.value)}
            />

            <p style={{ color: isValidPayment() ? "green" : "red" }}>
              {paymentValue && (isValidPayment() ? "✅ Valid payment details." : "❌ Invalid payment details.")}
            </p>

            <button onClick={handlePayment} disabled={!isValidPayment()}>
              Pay ₹{Math.floor(totalAmount / 2)}
            </button>
            <button className="cancel-btn" onClick={() => setShowPaymentModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;

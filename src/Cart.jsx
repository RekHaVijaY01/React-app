import React from "react";
import { useCart } from "./CartContext";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

const serviceTypeLabels = {
  decoration: "Decoration",
  cake: "Cake",
  photography: "Photography",
  catering: "Food Items",
};

const displayOrder = ["decoration", "cake", "photography", "catering"];

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate(); // ✅ Add this line

  const groupedItems = cartItems.reduce((acc, item) => {
    const type = item.serviceType || "others";
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  if (cartItems.length === 0) {
    return <p className="empty-message">Your cart is empty.</p>;
  }

  return (
    <div className="cart-container">
      <div className="cart-box">
        <h2 className="cart-title">🛒 Your Cart</h2>
        <div className="table-wrapper">
          <table className="cart-table">
            <thead>
              <tr className="cart-header-row">
                <th>Category</th>
                <th>Item</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {displayOrder.map((type) =>
                groupedItems[type]?.map((item, index) => (
                  <tr key={item.id + index} className="cart-item-row">
                    {index === 0 && (
                      <td className="category-cell" rowSpan={groupedItems[type].length}>
                        {serviceTypeLabels[type]}
                      </td>
                    )}
                    <td className="item-cell">{item.name}</td>
                    <td className="price-cell">₹{item.price}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button
            onClick={() => navigate("/booking")}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Proceed to Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

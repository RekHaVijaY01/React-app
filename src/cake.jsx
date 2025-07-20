import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext"; // make sure this context is shared

const Cake = () => {
  const [services, setServices] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("http://localhost:5000/services/cake")
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, []);

  const handleAddToCart = (item) => {
    addToCart({
      id: item._id,
      name: item.title,
      price: item.price,
      serviceType: "cake",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Cake Services</h2>
      <div
        className="services"
        style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}
      >
        {services.map((item) => (
          <div
            key={item._id}
            className="card"
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "220px",
            }}
          >
            <img
              src={`http://localhost:5000${item.imageUrl}`}
              alt={item.title}
              width={200}
              height={150}
              style={{ objectFit: "cover" }}
            />
            <h3>{item.title}</h3>
            <p>₹{item.price}</p>
            <button
              onClick={() => handleAddToCart(item)}
              style={{ padding: "6px 12px", cursor: "pointer" }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cake;

import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext"; // Reuse your cart context

const Photography = () => {
  const [services, setServices] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchPhotographyServices = async () => {
      const res = await fetch("http://localhost:5000/services/photography");
      const data = await res.json();
      setServices(data);
    };

    fetchPhotographyServices();
  }, []);

  const handleAddToCart = (item) => {
    addToCart({
      id: item._id,
      name: item.title,
      price: item.price,
      serviceType: "photography",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2> Photography Services</h2>

      {services.length === 0 ? (
        <p>No photography services available at the moment.</p>
      ) : (
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
                minHeight: "150px",
              }}
            >
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
      )}
    </div>
  );
};

export default Photography;

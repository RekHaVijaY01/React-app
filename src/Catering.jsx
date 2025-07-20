import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";

const Catering = () => {
  const [groupedServices, setGroupedServices] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("http://localhost:5000/services/catering")
      .then((res) => res.json())
      .then((data) => {
        // Group by subCategory
        const grouped = {};
        data.forEach((item) => {
          const sub = item.subCategory || "others";
          if (!grouped[sub]) {
            grouped[sub] = [];
          }
          grouped[sub].push(item);
        });
        setGroupedServices(grouped);
      })
      .catch((err) => console.error("Error fetching catering data:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Catering Services</h2>

      {Object.keys(groupedServices).map((subCat) => (
        <div key={subCat} style={{ marginBottom: "40px" }}>
          <h3 style={{ borderBottom: "1px solid #ccc" }}>{subCat.toUpperCase()}</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "10px" }}>
            {groupedServices[subCat].map((item) => (
              <div
                key={item._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  width: "220px",
                  borderRadius: "8px",
                }}
              >
                <h4>{item.title}</h4>
                <p>₹{item.price}</p>
               <button
  onClick={() =>
    addToCart({
      id: item._id,
      name: item.title,
      price: item.price,
      serviceType: "catering",
    })
  }
>
  Add to Cart
</button>

              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Catering;

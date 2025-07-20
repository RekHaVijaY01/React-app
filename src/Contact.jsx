import React from "react";
import "./Contact.css"; // optional CSS file

const Contact = () => {
  return (
    <div className="contact-container">
      <h2>Contact Us</h2>

      <div className="contact-details">
        <p><strong>📍 Address:</strong> Kochi, Kerala, India</p>
        <p>
          <strong>📞 Phone:</strong>{" "}
          <a href="tel:+919876543210">+91 98765 43210</a>
        </p>
        <p>
          <strong>📧 Email:</strong>{" "}
          <a href="mailto:info@elitegatherings.com">info@elitegatherings.com</a>
        </p>
      </div>
    </div>
  );
};

export default Contact;

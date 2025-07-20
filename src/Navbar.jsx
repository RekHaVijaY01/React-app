import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react"; // ✅ Cart icon
import { useCart } from "./CartContext"; // ✅ Import cart context
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useCart(); // ✅ Get cart items

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="brand">Elite Gatherings</div>

        <ul className={`nav-links ${isOpen ? "active" : ""}`}>
          <li>
            <Link to="/home" onClick={() => setIsOpen(false)}>Home</Link>
          </li>
          <li className="dropdown">
            <span className="services-label">Services</span>
            <ul className="dropdown-menu">
              <li><Link to="/decoration" onClick={() => setIsOpen(false)}>Decoration</Link></li>
              <li><Link to="/catering" onClick={() => setIsOpen(false)}>Catering</Link></li>
              <li><Link to="/cake" onClick={() => setIsOpen(false)}>Cake</Link></li>
              <li><Link to="/photography" onClick={() => setIsOpen(false)}>Photography</Link></li>
            </ul>
          </li>
          <li>
            <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          </li>
          
          {/* ✅ Add Cart link */}
          <li className="cart-link">
            <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-1">
              <ShoppingCart size={20} />
              <span>Cart</span>
              {cartItems.length > 0 && (
                <span className="cart-count">{cartItems.length}</span>
              )}
            </Link>
          </li>
        </ul>

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

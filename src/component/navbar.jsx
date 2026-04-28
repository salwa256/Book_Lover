import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav">

        {/* LOGO */}
        <div className="nav-logo">
          <img src="public/logo.png" alt="logo" />
        </div>

        {/* HAMBURGER */}
        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* MENU */}
        <div className={`tabs ${isOpen ? "open" : ""}`}>

          <Link
            to="/"
            className={`tab ${location.pathname === "/" ? "active" : ""}`}
            onClick={closeMenu}
          >
            Rekomendasi
          </Link>

          <Link
            to="/log"
            className={`tab ${location.pathname === "/log" ? "active" : ""}`}
            onClick={closeMenu}
          >
            Log
          </Link>

          <Link
            to="/search"
            className={`tab ${location.pathname === "/search" ? "active" : ""}`}
            onClick={closeMenu}
          >
            Search
          </Link>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;
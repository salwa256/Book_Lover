import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation(); // Untuk mengecek halaman mana yang aktif

  return (
    <nav className="navbar">
      <div className="nav">
        <div className="nav-left">
          <img src="/assets/add_call.png" alt="phone" />
          <p>085800220474</p>
        </div>

        <div class="nav-right">
          <img src="/assets/Instagram-Logo-PNG-HD 1.png" alt="" />
          <p>perpusipkabtegal</p>
        </div>

        <div className="tabs">
          {/* Link to="/" akan membuka App.jsx */}
          <Link to="/" className={`tab ${location.pathname === '/' ? 'active' : ''}`}>
            Rekomendasi
          </Link>

          {/* Link to="/log" akan membuka LogPage.jsx */}
          <Link to="/log" className={`tab ${location.pathname === '/log' ? 'active' : ''}`}>
            Log
          </Link>

          {/* Link to="/search" akan membuka SearchPage.jsx */}
          <Link to="/search" className={`tab ${location.pathname === '/search' ? 'active' : ''}`}>
            Search
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
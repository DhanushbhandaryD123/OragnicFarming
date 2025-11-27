// src/components/Navbar.jsx
import './Navbar.css';

import React, { useState } from 'react';

import { Link } from 'react-router-dom';

const Navbar = ({ user, handleUserLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Farmizen</Link>
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/cart">Cart</Link></li>

        {user && (
          <>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/saved">Saved</Link></li>
          </>
        )}

        {!user && (
          <>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/signin">Signin</Link></li>
          </>
        )}

        {user && (
          <li
            className="navbar-user"
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            <span className="user-label">
              Hello, {user.username} ▾
            </span>
            {showMenu && (
              <ul className="user-dropdown">
                <li><Link to="/my-orders">My Orders</Link></li>
                <li onClick={handleUserLogout}>Logout</li>
              </ul>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

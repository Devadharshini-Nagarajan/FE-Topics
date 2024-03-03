import React from 'react';
import { Link } from 'react-router-dom'; 
import './Header.scss';

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        {/* <img src="" alt="Logo" className="logo" /> */}
        DEV
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
      </div>
    </header>
  );
};

export default Header;

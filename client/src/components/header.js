import React from 'react';
import gryphonLogo from './gryphoncp.png'; // Ensure this path is correct
import './header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img src={gryphonLogo} alt="Gryphon Logo" className="header-logo" />
        <div className="header-text">
          <h1 className="header-title">Gryph Planner</h1>
          <p className="header-subtitle">Course to Calendar Converter</p>
        </div>
      </div>
    </header>
  );
};

export default Header;

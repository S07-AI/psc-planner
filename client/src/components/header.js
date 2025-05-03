import React from 'react';
import './header.css';
import gryphonLogo from './gryphoncp.png'; // make sure it's inside the same folder

const Header = () => {
  return (
    <div className="header">
      <img src={gryphonLogo} alt="Gryphon Logo" className="header-logo" />
      <div className="header-text">
        <h1 className="header-title">Course Calendar Converter</h1>
        <p className="header-subtitle">Syllabi to Schedule</p>
      </div>
    </div>
  );
};

export default Header;

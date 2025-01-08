// Header.jsx
import React from 'react';
import './HomePage.css'; // Add styles here

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="college-info">
          <img
            src="./assets/nec_logo.png" // Path to your college logo
            alt="College Logo"
            className="college-logo"
          />
          <div>
            <h1 className="college-name">National Engineering College</h1>
            <p className="college-address">K.R. Nagar, Kovilpatti - 628 503</p>
          </div>
        </div>
        <div className="other-info">
          <div className="tnea-code">
            <p>TNEA Counselling Code</p>
            <h2>4962</h2>
          </div>
          <img
            src="./assets/nec_person.png" // Path to the right-side image
            alt="Principal or Representative"
            className="person-image"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

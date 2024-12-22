import React from 'react';
//import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <img
        src="../assets/logo.png" // Replace with your actual logo path
        alt="Logo"
        className="logo"
      />
      <h1 className="greeting">How are you feeling today?</h1>
    </header>
  );
};

export default Header;

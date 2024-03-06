import React from 'react';
import '../styles/headerstyles.css';
import { useNavigate } from 'react-router';

function Header() {
  const navigate = useNavigate();
  const handleRegisterClick = () => {
    console.log("Register clicked");
    navigate("/bookmyseat/register")
  };

  const handleSignInClick = () => {
    console.log("Sign In clicked");
    navigate("/bookmyseat/login")

  };

  return (
    <div className='mainheader'>
      <img className='headerimage' src={'/assets/images/Valtech_Logo_White.png'} alt="Valtech Logo" />
      <div className='button-container'>
        <button className='buttondesign' onClick={handleRegisterClick}>Register</button>
        <button className='buttondesign' onClick={handleSignInClick}>Sign In</button>
      </div>
    </div>
  );
}

export default Header;

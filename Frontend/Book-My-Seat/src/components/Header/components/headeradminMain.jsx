import React from 'react';
import '../styles/HeaderAdminMain.css';
import { FaUserCircle } from 'react-icons/fa';

function HeaderAdminmain() {
    const handleRegisterClick = () => {
    console.log("Register clicked");
  };

  const handleSignInClick = () => {
    console.log("Sign In clicked");

  };

  return (
    <div className='AdminMainHeader'>
      <img className='AdminMainheaderimage' src={'/assets/images/Valtech_Logo_White.png'} alt="Valtech Logo" onClick={handleRegisterClick} />
      <div className='AdminMainIcon' onClick={handleSignInClick}>
      <FaUserCircle size={40} style={{ color: 'white' }} />
      </div>
      
    </div>
  );
}

export default HeaderAdminmain;

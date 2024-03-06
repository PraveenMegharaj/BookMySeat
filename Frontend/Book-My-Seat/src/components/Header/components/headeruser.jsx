import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HeaderUser.css';

function HeaderUser() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/');
  };

  return (
    <div className='UserHeader'>
      <img
        className='UserHeaderimage'
        src={'/assets/images/Valtech_Logo_White.png'}
        alt="Valtech Logo"
        onClick={handleRegisterClick}
      />
    </div>
  );
}

export default HeaderUser;

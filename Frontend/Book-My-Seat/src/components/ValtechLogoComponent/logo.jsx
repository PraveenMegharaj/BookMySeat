import React from 'react';
import './logostyle.css';

function Logo() {
  const logoStyle = {
    width: '6%', 
      };

  return (
    <div className='blacklogo'>
      <img
        className='valtechlogo'
        src={'/assets/images/ValtechBlackIcon.png'}
        alt="Valtech Logo"
        style={logoStyle}
      />
    </div>
  );
}

export default Logo;

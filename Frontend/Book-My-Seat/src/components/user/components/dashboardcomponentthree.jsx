import React, { useState } from 'react';
import '../styles/UserDasboardThirdComp.css';

function UserDasboardThirdComp() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = months[new Date().getMonth()];
  
  return (
    <div className='user-dashboard-third-comp'>
      <h3 className='user-dashboard-third-comp-heading'>Discover the Holiday List of {currentMonth}</h3>
    </div>
  );
}

export default UserDasboardThirdComp;

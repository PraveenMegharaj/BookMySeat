import React from 'react';
import "../styles/userlayout.css"
import HeaderUser from '../../Header/components/headeruser';
import UserNavBar from '../../user/components/UserNavBar';

const UserLayout = ({ children }) => (
  <div className='RouterMain'>
    <div className='RouterHeader'>
      <HeaderUser />
    </div>
    <div className='UserNavPlusContent'>
      <div className='user-nav-main-container'>
        <UserNavBar />
      </div>
      <div className='user-Router-main-container'>{children}</div>
    </div>
  </div>
);

export default UserLayout;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateLoginStatus } from '../../auth';
import '../styles/signOut.css';

const SignOutPage = () => {
  const navigate = useNavigate();
  const [showBlurBackground, setShowBlurBackground] = useState(true);

  useEffect(() => {
    setShowBlurBackground(true);
    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);

  const handleLogout = () => {
    updateLoginStatus(false);
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('token');
    window.location.replace('/');
  };

  const handleNoButtonClick = () => {
    setShowBlurBackground(false);
    navigate('/bookmyseat/admin/dashboard'); 

  };

  const handlePopstate = (event) => {
    event.preventDefault();

    const isLoggedIn = sessionStorage.getItem('userData') ? true : false;
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    if (!isLoggedIn || (isLoggedIn && userData?.role !== 'ADMIN')) {
      navigate('/bookmyseat/login');
    }
  };

  return (
    <div>
      {showBlurBackground && <div className="blur-background"></div>}
      <div className={`signout-container ${showBlurBackground ? 'show' : ''}`} onClick={handleNoButtonClick}>
        <div className="signout-card" onClick={(e) => e.stopPropagation()}>
          <div className="signout-card-body">
            <p className="signout-card-text">Do you really want to sign out?</p>
            <div className="signout-buttons">
              <button className="btn btn-success green" onClick={handleLogout}>Yes</button>
              <button className="btn btn-danger red" onClick={handleNoButtonClick}>No</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignOutPage;

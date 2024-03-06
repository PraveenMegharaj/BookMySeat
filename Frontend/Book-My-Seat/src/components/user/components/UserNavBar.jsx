import React, { useEffect } from 'react';
import '../styles/UserNavBar.css';
import { FaRegUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
 
function UserNavBar() {
  const navigate = useNavigate();

  useEffect(() => {
    handleDashboardClick();
  }, []);

  const handleLogout = () => {
    navigate('/bookmyseat/user/signout');
  };
 
  const handleDashboardClick = () => {
    navigate('/bookmyseat/user/userdashboard');
  };
 
  const handleProfileClick = () => {
    navigate('/bookmyseat/user/userprofile');
  };
 
  const handleUserBookingClick = () => {
    navigate('/bookmyseat/user/userbooking');
  };
  const handleBookingHistoryClick = () => {
    navigate('/bookmyseat/user/bookinghistory');
  };
 
  return (
    <div className='usernavbarMaincontainer'>
      <div className='usernavbarcontainer'>
        <div className='usernavbarprofile'>
          <FaRegUserCircle size={'70%'} onClick={handleProfileClick}/>
        </div>
 
        <div className='usernavbaractions'>
          <div className='user-navbar-buttonstack'>
            <button className='usernavbarbutton' onClick={handleDashboardClick}>
              Dashboard
            </button>

            <button className='usernavbarbutton' onClick={handleUserBookingClick}>
              Seat Booking
            </button>

            <button className='usernavbarbutton' onClick={handleBookingHistoryClick}>
              Booking History
            </button>
            <button className='usernavbarbutton' onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default UserNavBar;
import React from 'react';
import '../styles/SeatNotBookedComp.css';
import { useNavigate } from 'react-router-dom';


function SeatNotBookedComp() {
  const navigate = useNavigate();

  const handleUserBookingClick = () => {
    navigate('/bookmyseat/user/userbooking');
  };

  return (
    <div className='SeatNotBookedComp'>
      <img src="/assets/images/Seat-Not-Booked.svg" alt="" className='SeatNotBookedComp-Image' />
      <div className='SeatNotBookedComp-Message'>
        <p className='SeatNotBookedComp-Message-p'>Oops! You have not booked a seat.</p>
        <button onClick={handleUserBookingClick} className='SeatNotBookedComp-Message-button'>Book a Seat</button>
      </div>
    </div>
  );
}

export default SeatNotBookedComp;

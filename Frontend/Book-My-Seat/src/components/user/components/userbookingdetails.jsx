import React, { useEffect, useState } from 'react';
import '../styles/UserBookingComp.css';
import axios from '../../../Services/axiosToken';
import SeatNotBookedComp from './seatnotbooked';

function UserBookingComp({ userId }) {
  const [bookingData, setBookingData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/bookmyseat/user/userdashboard/${userId}`);
        setBookingData(response.data);
        // console.log(userId);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError("Unauthorized access. Please log in.");
        } else {
          setError('Error fetching data. Please try again later.');
        }
        console.error('Error fetching data:', error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  return (
    <div className={`userBooking ${showDetails ? 'enlarged' : ''}`}>
      <div className='userBookingContainer'>
        {!showDetails ? (
          <div className={`userBookingCard ${showDetails ? 'expanded' : ''}`}>
            <h2 className='bookingHeader'>Booking Details</h2>
            <div className='bookingDetail'>
              {bookingData?.length > 0 ? (
                <div>
                <img src="/assets/images/Seat-booked.svg" alt="" className='SeatNotBookedComp-Image' />
                  <h5 className='detailLabel'>
                  Your seat is {bookingData[0]?.booking?.seat?.seatStatus ? 'Occupied' : 'Booked'} on {bookingData[0]?.booking?.seat?.floor?.floorName} for today
                </h5>
                <button className='BookingMoreButton' onClick={() => setShowDetails(true)}>
              View Pass
            </button>
                </div>
              ) : (
                <SeatNotBookedComp/>
              )}
            </div>
            
          </div>
        ) : (
          <div className='modal-paper'>
            <h2 className='modal-title booking-popup-title'>Additional Details</h2>
            <p className='modal-description booking-popup-title'>
              Seat Id: {bookingData?.length > 0 && bookingData[0]?.booking?.seat?.seatId}
            </p>
            <p className='modal-description booking-popup-title'>
              Floor Name: {bookingData?.length > 0 && bookingData[0]?.booking?.seat?.floor?.floorName}
            </p>
            <p className='modal-description booking-popup-title'>
              Lunch: {bookingData?.length > 0 && bookingData[0]?.lunch ? 'Yes' : 'No'}
            </p>
            <p className='modal-description booking-popup-title'>
              Tea/Coffee: {bookingData?.length > 0 && bookingData[0]?.teaCoffee ? 'Yes' : 'No'}
              {bookingData?.length > 0 && bookingData[0]?.teaCoffeeType && ` (${bookingData[0]?.teaCoffeeType})`}
            </p>
            <p className='modal-description booking-popup-title'>
              Parking: {bookingData?.length > 0 && bookingData[0]?.parking ? 'No' : 'Yes'}
              
            </p>
            <p className='modal-description booking-popup-title'>
              Additional Desktop: {bookingData?.length > 0 && bookingData[0]?.additionalDesktop ? 'No' : 'Yes'}
            </p>
            <p className='modal-description booking-popup-title'>
              Shift Name: {bookingData?.length > 0 && bookingData[0]?.booking?.shift?.shiftName}
            </p>
            <div className='start-to-end'>
            <p className='modal-description booking-popup-title'>
              Shift Start: {bookingData?.length > 0 && bookingData[0]?.booking?.shift?.startTime}
            </p>
            <p className='modal-description booking-popup-title'>
              Shift End: {bookingData?.length > 0 && bookingData[0]?.booking?.shift?.endTime}
            </p>
            </div>
            <div className='start-to-end'>
            <p className='modal-description booking-popup-title'>
  Booked From: {bookingData?.length > 0 && bookingData[0]?.booking?.startDate}
</p>
<p className='modal-description booking-popup-title'>
Booked To: {bookingData?.length > 0 && bookingData[0]?.booking?.endDate}
</p>
            </div>
            <button className='BackButton' onClick={() => setShowDetails(false)}>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserBookingComp;

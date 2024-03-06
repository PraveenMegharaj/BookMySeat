import React, { useEffect, useState } from 'react';
import '../styles/UserDasboardComp.css';
import UserBookingComp from './userbookingdetails';
import UserDasboardSecondComp from './userdasboardcardtwocomponent';
import UserDasboardThirdComp from './dashboardcomponentthree';
import UserDashboardFourthComp from './UserHolidayComp';
import axios from '../../../Services/axiosToken';

function UserDasboardComp() {
  const [userId, setUserId] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/bookmyseat/user/userProfile');
        const userData = response.data;
        setUserId(userData.userId);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/bookmyseat/user/attendance');
        setAttendanceData(response.data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchUserProfile();
    fetchAttendanceData();
  }, []);

  if (!userId || !attendanceData.length) {
    return <p>Loading...</p>;
  }

  return (
    <div className="user-dashboard-container">
      <div className="user-dashboard-card user-dashboard-firstcontainer">
        <div className='component-and-cancelButton'>
          <UserBookingComp userId={userId} />
          {/* <CancelBookingComp bookingId={attendanceData[0].booking.bookingId} /> */}
          {/* <CancelBookingComp bookingId={17} /> */}
        </div>
      </div>
      <div className='user-dashboard-secondcontainer user-dashboard-card'>
        <div className="user-dashboard-subcard">
          <UserDasboardSecondComp/>
        </div>

        <div className="user-dashboard-subcard user-dashboard-secondsubcard">
          <div className="user-dashboard-card user-dashboard-innersubcard">
            <UserDasboardThirdComp/>
          </div>

          <div className="user-dashboard-card user-dashboard-innersubcard">
            <UserDashboardFourthComp/>
          </div>
        </div>
      </div>

      {/* Rest of your component remains unchanged */}
    </div>
  );
}

export default UserDasboardComp;

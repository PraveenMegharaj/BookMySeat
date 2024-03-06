import React, { useState, useEffect } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import '../styles/securityDashboard.css';
import axios from '../../../Services/axiosToken';
import { updateLoginStatus } from '../../auth';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FaSignOutAlt } from "react-icons/fa";

function SecurityDashboard() {
  const [searchUserId, setSearchUserId] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [approvedUserCount, setApprovedUserCount] = useState(0);

  useEffect(() => {
    const storedCount = localStorage.getItem('approvedUserCount');
    setApprovedUserCount(storedCount ? parseInt(storedCount) : 0);
    fetchUserDetails();
  }, []);

  const handleSearch = () => {
    setSearchTriggered(true);
  };

  const handleLogout = () => {
    updateLoginStatus(false);
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('token');
    window.location.replace('/');
  };

  const fetchUserDetails = () => {
    axios
      .get(`http://localhost:5000/bookmyseat/user/attendance`)
      .then((response) => {
        console.log(response.data);
        setUserDetails(response.data);
        setSearchUserId('');
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });
  };

  const handleAttendanceApproval = (userId) => {
    axios
      .put(`http://localhost:5000/bookmyseat/user/attendanceApproval/${userId}`, {})
      .then((response) => {
        console.log("success");
        console.log('Attendance Approved:', response.data);
        toast.success('Attendance approved successfully!');
        updateApprovedUserDetails(userId);
      })
      .catch(error => {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error('Failed to Approve attendance');          
        }
      });
  };

  const updateApprovedUserDetails = (userId) => {
    setUserDetails((prevUserDetails) =>
      prevUserDetails.filter((user) => user.booking.user?.userId !== userId)
    );
    
    setApprovedUserCount((prevCount) => {
      const newCount = prevCount + 1;
      localStorage.setItem('approvedUserCount', newCount); 
      return newCount;
    });
  };

  const renderTableContent = () => {
    if (filteredUserDetails.length === 0 && searchTriggered) {
      return (
        <tr>
          <td colSpan="7">No booking found for User ID: {searchUserId}</td>
        </tr>
      );
    }

    return filteredUserDetails.map((user, index) => (
      <tr key={index}>
        <td>{user.booking.user?.userId}</td>
        <td>{user.booking.user?.firstName}</td>
        <td>{user.booking.seat?.seatId}</td>
        <td>{user.booking.seat?.floor?.floorId}</td>
        <td>{user.booking.user?.project?.projectName}</td>
        <td>{user.booking.shift?.shiftName}</td>
        <td>
          <button className="btn btn-success" onClick={() => handleAttendanceApproval(user.booking.user?.userId)}>
            Approve
          </button>
        </td>
      </tr>
    ));
  };

  const filteredUserDetails =
    searchTriggered && searchUserId.trim() !== ''
      ? userDetails.filter((user) => {
          const searchId = searchUserId.trim();
          const userId = String(user.booking.user?.userId);
          return userId.startsWith(searchId);
        })
      : userDetails;

  return (
    <div>
      <Navbar bg="light" expand="lg" className="register-navbar">
        <span className="logo">
          <img src={'/assets/images/Valtech_Logo_White.png'} alt="Valtech Logo" />
        </span>
        <button className="btn btn-danger" onClick={handleLogout}>
          <FaSignOutAlt />
        </button>
      </Navbar>
      <div className="Search">
        <input
          type="number"
          className="form-control mr-sm-2"
          placeholder="Enter User ID"
          value={searchUserId}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setSearchUserId(value.slice(0, 6));
          }}
        />

        <button className='btn btn-primary' onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="report-summary">
        <div>
          <strong>Pending Seats: </strong>
          {userDetails.length}
        </div>
        <div>
          <strong>Approved Seats: </strong>
          {approvedUserCount}
        </div>
      </div>
      <div className="attendance-table">
        <table className="table table-striped table-hover">
          <thead>
            <tr id="table-header">
              <th scope="col">Employee ID</th>
              <th scope="col">Employee Name</th>
              <th scope="col">Seat ID</th>
              <th scope="col">Floor ID</th>
              <th scope="col">Project name</th>
              <th scope="col">Shift Name</th>
              <th scope="col">Approval Status</th>
            </tr>
          </thead>
          <tbody>{renderTableContent()}</tbody>
        </table>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        style={{
          width: '300px',
          borderRadius: '8px',
        }}
      />
    </div>
  );
}

export default SecurityDashboard;

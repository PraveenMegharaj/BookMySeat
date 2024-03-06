import React, { useState, useEffect } from 'react';
import '../styles/rejectedRequests.css';
import { getRequests } from '../../../Services/RequestService';

const RejectedRequests = ({ selectedDate, searchQuery }) => {
  const [rejectedRequests, setRejectedRequests] = useState([]);

  useEffect(() => {
    const fetchRejectedRequests = async () => {
      try {
        const requestsData = await getRequests();
        const rejectedRequestsData = requestsData.filter(request => {
          // Filter by date
          const requestDate = new Date(request.regsiterdDate);
          if (selectedDate) {
            const selectedDateFormatted = new Date(selectedDate.toDateString());
            if (requestDate.toDateString() !== selectedDateFormatted.toDateString()) {
              return false;
            }
          }
          // Filter by search query
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
              request.name.toLowerCase().includes(query) ||
              request.userID.toString().includes(query) // Assuming userID is a string
            );
          }
          return request.approvalStatus === 'REJECTED';
        });
        setRejectedRequests(rejectedRequestsData);
      } catch (error) {
        console.error("Error fetching rejected requests:", error);
      }
    };

    fetchRejectedRequests();
  }, [selectedDate, searchQuery]);

  return (
    <div>
      {rejectedRequests.map(request => (
        <div key={request.userID} className="card-container">
          <div className='card-Body'>
            <h5 className='card-title'>{request.name}</h5>
            <p className="card-text" > {request.emailID}</p>
            <p className="card-text">{request.userID}</p>
            <p className="card-text"> {request.regsiterdDate}</p>
            <p style={{color:"red",fontWeight:"bold"}}>Rejected</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RejectedRequests;

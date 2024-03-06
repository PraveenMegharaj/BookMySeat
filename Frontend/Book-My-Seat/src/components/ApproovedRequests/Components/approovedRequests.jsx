import React, { useEffect, useState } from 'react';
import '../styles/approovedRequests.css';
import { getRequests } from '../../../Services/RequestService';

const ApproovedRequests = ({ selectedDate, searchQuery }) => {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [filteredApprovedRequests, setFilteredApprovedRequests] = useState([]);

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      try {
        const requestsData = await getRequests();
        const approvedRequestsData = requestsData.filter(request => request.approvalStatus === 'APPROVED');
        
        if (selectedDate) {
          const selectedDateFormatted = new Date(selectedDate.toDateString());
          const filteredRequestsByDate = approvedRequestsData.filter(request => {
            const requestDate = new Date(request.regsiterdDate);
            return requestDate.toDateString() === selectedDateFormatted.toDateString();
          });
          setApprovedRequests(filteredRequestsByDate);
        } else {
          setApprovedRequests(approvedRequestsData);
        }
      } catch (error) {
        console.error("Error fetching approved requests:", error);
      }
    };

    fetchApprovedRequests();
  }, [selectedDate]);

  useEffect(() => {
    if (searchQuery) {
      const filteredRequests = approvedRequests.filter(request => {
        const query = searchQuery.toLowerCase();
        return (
          request.name.toLowerCase().includes(query) ||
          request.userID.toString().includes(query)
        );
      });
      setFilteredApprovedRequests(filteredRequests);
    } else {
      setFilteredApprovedRequests(approvedRequests);
    }
  }, [approvedRequests, searchQuery]);

  return (
    <div>
      {filteredApprovedRequests.map(request => (
        <div key={request.userID} className="card-container">
          <div className='card-Body'>
            <h5 className='card-title'>{request.name}</h5>
            <p className="card-text" > {request.emailID}</p>
            <p className="card-text">{request.userID}</p>
            <p className="card-text"> {request.regsiterdDate}</p>
            <p style={{color:"green",fontWeight:"bold"}}>Approved</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApproovedRequests;

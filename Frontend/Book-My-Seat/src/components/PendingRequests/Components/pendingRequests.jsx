import React, { useEffect, useState } from "react";
import "../styles/pendingRequests.css";
import { updateRequestStatus, getRequests } from "../../../Services/RequestService";
import { Modal, Button } from "react-bootstrap";
import { updateLoginStatus } from "../../auth";

const PendingRequests = ({
  selectedDate,
  searchQuery,
  onSelectCheckboxData,
  fetchData,
  updateTrigger,
  selectAll, 
}) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [error, setError] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const requestsData = await getRequests();
        let filteredRequests = requestsData.filter(
          (request) => request.approvalStatus === "PENDING"
        );

        if (selectedDate) {
          const selectedDateFormatted = new Date(selectedDate.toDateString());
          filteredRequests = filteredRequests.filter((request) => {
            const requestDate = new Date(request.regsiterdDate);
            return (
              requestDate.toDateString() ===
              selectedDateFormatted.toDateString()
            );
          });
        }

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredRequests = filteredRequests.filter(
            (request) =>
              request.name.toLowerCase().includes(query) ||
              request.userID.toString().includes(query)
          );
        }

        setPendingRequests(filteredRequests);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
        setError("Please Try again "+ error)
        setShowModal(true);
        
      }
    };

    fetchPendingRequests();
  }, [selectedDate, searchQuery, fetchData, updateTrigger]);

  const handleCloseModal = () => {
    setShowModal(false); 
  };

  useEffect(() => {
    if (selectAll) {
      setSelectedRequests([...pendingRequests]); 
    } else {
      setSelectedRequests([]); 
    }
  }, [selectAll, pendingRequests]); 

  const handleCheckboxChange = (e, request) => {
    const isChecked = e.target.checked;
    setSelectedRequests(prevSelected => {
      if (isChecked) {
        return [...prevSelected, request];
      } else {
        return prevSelected.filter(selected => selected.userID !== request.userID);
      }
    });
  };

  useEffect(() => {
    onSelectCheckboxData(selectedRequests);
  }, [selectedRequests, onSelectCheckboxData]);

  const handleApprovedRequest = async (request) => {
    try {
      const approvedRequest = {
        ...request,
        approvalStatus: "APPROVED",
      };

      await updateRequestStatus([approvedRequest]);

      setPendingRequests((prevRequests) =>
        prevRequests.filter((req) => req.userID !== request.userID)
      );
      setSelectedRequests((prevSelected) =>
        prevSelected.filter((selected) => selected.userID !== request.userID)
      );
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectedRequest = async (request) => {
    try {
      const rejectedRequest = {
        ...request,
        approvalStatus: "REJECTED",
      };

      await updateRequestStatus([rejectedRequest]);

      setPendingRequests((prevRequests) =>
        prevRequests.filter((req) => req.userID !== request.userID)
      );
      setSelectedRequests((prevSelected) =>
        prevSelected.filter((selected) => selected.userID !== request.userID)
      );
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };



  const handleLoginAgain = () => {
    updateLoginStatus(false);
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("token");
    window.location.replace("/bookmyseat/login");
  };


  return (
    <div>
      {pendingRequests.map((request) => (
        <div key={request.userID} className="card-container">
          <div className="card-Body">
            <input
              type="checkbox"
              onChange={(e) => handleCheckboxChange(e, request)}
              checked={selectedRequests.some(
                (selected) => selected.userID === request.userID
              )}
            />
            <h5 className="card-title">{request.name}</h5>
            <p className="card-text"> {request.emailID}</p>
            <p className="card-text">{request.userID}</p>
            <p className="card-text"> {request.regsiterdDate}</p>
            <div className="card-btns">
              <button
                className="approve-all"
                onClick={() => handleApprovedRequest(request)}
              >
                Approve
              </button>
              <button
                className="reject-all"
                onClick={() => handleRejectedRequest(request)}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
       <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Something went wrong !!</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLoginAgain}>
            Login Again
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PendingRequests;

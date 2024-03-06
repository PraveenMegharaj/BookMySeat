import React, { useEffect, useState } from "react";
import "../styles/registerRequests.css";
import PendingRequests from "../../PendingRequests/Components/pendingRequests";
import ApprovedRequests from "../../ApproovedRequests/Components/approovedRequests";
import RejectedRequests from "../../RejectedRequests/Components/rejectedRequests";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoSearchOutline } from "react-icons/io5";

import {
  updateRequestStatus,
  getRequests,
} from "../../../Services/RequestService";

const RegisterRequests = () => {
  const [currentView, setCurrentView] = useState("pending");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCheckboxData, setSelectedCheckboxData] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(false); // New state variable

  const handleButtonClick = (route) => {
    setCurrentView(route);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectedCheckboxData = (data) => {
    setSelectedCheckboxData(data);
  };

  const fetchData = async () => {
    try {
      const requestsData = await getRequests();
      return requestsData;
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };
  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    const updatedCheckboxData = isChecked
      ? selectedCheckboxData.map((item) => ({ ...item, selected: true }))
      : [];
    setSelectedCheckboxData(updatedCheckboxData);
  };

  useEffect(() => {
    fetchData();
  }, [selectedCheckboxData]);

  const handleApproveAll = async () => {
    try {
      const updatedData = selectedCheckboxData.map((item) => ({
        ...item,
        approvalStatus: "APPROVED",
      }));
      await updateRequestStatus(updatedData);
      console.log("Successfully updated request status:", updatedData);
      await fetchData();
      setUpdateTrigger(!updateTrigger);
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const handleRejectAll = async () => {
    try {
      const updatedData = selectedCheckboxData.map((item) => ({
        ...item,
        approvalStatus: "REJECTED",
      }));
      await updateRequestStatus(updatedData);
      console.log("Successfully updated request status:", updatedData);
      setUpdateTrigger(!updateTrigger);
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  return (
    <div className="requests-container">
      <div className="register-requests">
        <div className="register-requests-content">
          <div className="register-requests-buttons">
            <div>
            <button
              onClick={() => handleButtonClick("pending")}
              className=" pending"
            >
              Pending Requests
            </button>
            <button
              onClick={() => handleButtonClick("approved")}
              className="approoved"
            >
              Approved Requests
            </button>
            <button
              onClick={() => handleButtonClick("rejected")}
              className="rejected"
            >
              Rejected Requests
            </button>
            </div>

            <span style={{ marginTop: "8px", fontWeight: "500" }}>
              Sort By Date:
           
            <DatePicker
              className="datepicker"
              selected={selectedDate}
              onChange={handleDateChange}
            />
             </span>

          </div>
          <div className="sortingcomps">
            <div className="input-group mb-3">
              <div className="input-group-text"  style={{border:"1px solid grey"}}>
                <input

                  className="form-check-input mt-0"
                  type="checkbox"
                  value=""
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
              </div>

              <input
                type="text"
                style={{border:"1px solid grey"}}
                className="form-control"
                onChange={handleSearch}
                placeholder="Search By Employee ID or Name"
              />
              <span className="input-group-text"  style={{border:"1px solid grey"}}>
                <IoSearchOutline className="search icon" />
              </span>
            </div>

            <div className="sorting-btns">
              <button className="approve-all" onClick={handleApproveAll}>
                Approve All
              </button>
              <button className="reject-all" onClick={handleRejectAll}>
                Reject All
              </button>
            </div>
          </div>
          <div className="cards">
            {currentView === "pending" && (
              <PendingRequests
                selectedDate={selectedDate}
                searchQuery={searchQuery}
                onSelectCheckboxData={handleSelectedCheckboxData}
                fetchData={fetchData}
                updateTrigger={updateTrigger}
                selectAll={selectAll}
                setSelectAll={setSelectAll}
              />
            )}
            {currentView === "approved" && (
              <ApprovedRequests
                selectedDate={selectedDate}
                searchQuery={searchQuery}
              />
            )}
            {currentView === "rejected" && (
              <RejectedRequests
                selectedDate={selectedDate}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterRequests;

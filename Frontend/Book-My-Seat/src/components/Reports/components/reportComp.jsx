import React, { useEffect, useState } from "react";
import ReportServiceInstance from "../../../Services/ReportService"; 
import "../styles/reportComp.css";
import { PiCarProfileDuotone, PiPersonSimpleBike } from "react-icons/pi";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { IoSearchOutline } from "react-icons/io5";
import { Modal, Button } from "react-bootstrap";
import { updateLoginStatus } from "../../auth";
import * as ExcelJS from 'exceljs';

const ReportComp = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null); 
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      const response = await ReportServiceInstance.getUsers();
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Please Try again "+ error)
      setShowModal(true);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      String(user.userId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(user.userName).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCloseModal = () => {
    setShowModal(false); 
  };

  const handleLoginAgain = () => {
    updateLoginStatus(false);
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("token");
    window.location.replace("/bookmyseat/login");
  };

  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Reports');
  
    const headers = ['Employee ID', 'Employee Name', 'Start Date', 'End Date', 'Parking Opted', 'Parking Type', 'Lunch', 'Tea/Coffee', 'Floor Name', 'Seat Number', 'Booking Type'];
    sheet.addRow(headers);
  
    users.forEach(user => {
      const row = [
        user.userId,
        user.userName,
        user.startDate,
        user.endDate,
        user.parkingType ? 'Yes' : 'No', user.parkingType === 'TWO_WHEELER' ? 'Two Wheeler' : user.parkingType === 'FOUR_WHEELER' ? 'Four Wheeler' : '-',
        user.lunch ? 'Yes' : 'No',
        user.teaCoffeeType === 'TEA' ? 'Tea' : 'Coffee',
        user.floorName,
        user.seatNumber,
        user.bookingType
      ];
      sheet.addRow(row);
    });
  
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'daily_booking_reports.xlsx';
    link.click();
  };


  return (
    <div className="report-table">
    <div className="report-header">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          style={{border:"1px solid grey"}}
          
          aria-label="Text input with search icon"
          onChange={handleSearch}
          placeholder="Search By Employee ID or Name"
          />
        <span className="input-group-text"  style={{border:"1px solid grey"}}>
          <IoSearchOutline className="search icon" />
        </span>
      </div>
      <div className="report-download">
        <h6>Download Reports</h6>
        <Button variant="primary" onClick={handleDownload}>DownLoad</Button>
      </div>
    </div>
      <table className="table table-striped table-hover" style={{marginTop:"15px"}}>
        <thead>
          <tr id="table-header">
            <th scope="col">Employee ID</th>
            <th scope="col">Name</th>
            <th scope="col">Start Date</th>
            <th scope="col">End Date</th>
            <th scope="col">Parking Opted</th>
            <th scope="col">Parking Type</th>
            <th scope="col">Lunch</th>
            <th scope="col">Tea/Coffee</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index}>
              <th scope="row">{user.userId}</th>
              <td>{user.userName}</td>
              <td>{user.startDate}</td>
              <td>{user.endDate}</td>
              <td>
                {user.parkingType ? (
                  <FaCheck fontSize={22} color="green" />
                ) : (
                  <RxCross2 fontSize={22} color="red" />
                )}
              </td>

              <td>
                {user.parkingType === "TWO_WHEELER" ? (
                  <PiPersonSimpleBike fontSize={22} />
                ) : user.parkingType === "FOUR_WHEELER" ? (
                  <PiCarProfileDuotone fontSize={22} />
                ) : (
                  "-"
                )}
              </td>
              <td>
                {user.lunch ? (
                  <FaCheck fontSize={22} color="green" />
                ) : (
                  <RxCross2 fontSize={22} color="red" />
                )}
              </td>
              <td>{user.teaCoffeeType === "TEA" ? "Tea" : "Coffee"}</td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default ReportComp;

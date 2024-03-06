import React, { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import axios from "../../../Services/axiosToken";
import { PiCarProfileDuotone, PiPersonSimpleBike } from "react-icons/pi";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { Modal } from "react-bootstrap";
import { updateLoginStatus } from "../../auth";
 
const BookingHistory = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellationBookingId, setCancellationBookingId] = useState(null);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/bookmyseat/user/booking-history');
        setBookingHistory(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
        setError("Please Try again " + error);
        setShowModal(true);
      }
    };
 
    fetchData();
  }, []);
 
  const toCamelCase = (str) => {
    return str.replace(/[-_]+(.)?/g, (_, c) => c ? c.toLowerCase() : '')
      .replace(/^\w/, (c) => c.toUpperCase());
  };
 
  const handleCloseModal = () => {
    setShowModal(false);
  };
 
  const handleLoginAgain = () => {
    updateLoginStatus(false);
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("token");
    window.location.replace("/bookmyseat/login");
  };
 
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setCancellationBookingId(booking.bookingId);
    setShowModal(true);
  };
 
  const handleCancelBooking = async () => {
    try {
      if (!cancellationBookingId) {
        console.error("Booking ID is not available");
        return;
      }
 
      const response = await axios.put(`http://localhost:5000/bookmyseat/user/cancelUserBooking/${cancellationBookingId}`);
     
      console.log("Response:", response); // Log the response for debugging
 
      setShowModal(false);
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };
 
 
  return (
    <Paper sx={{ width: '98%', overflow: 'hidden', margin: "2%" }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Booking-Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>End Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Start Time</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>End Time</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Floor</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Seat Number</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Lunch Opted</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>ParkingType</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Additional Desktop</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tea/Coffee</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Booking Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookingHistory.map((booking, index) => (
              <TableRow key={index}>
                <TableCell>{booking.bookingType}</TableCell>
                <TableCell>{booking.startDate}</TableCell>
                <TableCell>{booking.endDate}</TableCell>
                <TableCell>{booking.startTime}</TableCell>
                <TableCell>{booking.endTime}</TableCell>
                <TableCell>{toCamelCase(booking.floorName.toLowerCase())}</TableCell>
                <TableCell>{booking.seatNumber}</TableCell>
                <TableCell>
                  {booking.lunch ? (
                    <FaCheck fontSize={22} color="green" />
                  ) : (
                    <RxCross2 fontSize={22} color="red" />
                  )}
                </TableCell>
                <TableCell>
                  {booking.parkingType === "TWO_WHEELER" ? (
                    <PiPersonSimpleBike fontSize={22} />
                  ) : booking.parkingType === "FOUR_WHEELER" ? (
                    <PiCarProfileDuotone fontSize={22} />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{booking.additionalDesktop ? "Yes" : "No"}</TableCell>
                <TableCell>{booking.teaCoffeeType ? booking.teaCoffeeType : "-"}</TableCell>
                <TableCell>{booking.bookingStatus ? "Booked" : "Cancelled" }</TableCell>
                <TableCell>
                  {booking.bookingStatus && (
                    <Button variant="contained" onClick={() => handleViewDetails(booking)}>
                      Cancel 
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Booking ID: {selectedBooking && selectedBooking.bookingId}</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCancelBooking}>
            Cancel Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </Paper>
  );
}
 
export default BookingHistory;
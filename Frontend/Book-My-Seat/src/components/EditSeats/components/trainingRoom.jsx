import React, { useState, useEffect, useMemo} from 'react'
import "../styles/trainingRoom.css"
import Paper from '@mui/material/Paper'
import { Modal, Button } from 'react-bootstrap'

const generateRoomSeats = (room, selectedSeat, handleSeatClick) => {
  return room.map((col, colIndex) => (
    <React.Fragment key={colIndex}>
      <div className="col">
        {col.map((seat, seatIndex) => (
          <div key={seat && seat.id ? seat.id : `empty-${seatIndex}`} className="seat-container">
            {seat ? (
              <div
                key={seat.id}
                className={`seat 
                ${selectedSeat && selectedSeat.id === seat.id ? "selected-seat" : seat.booking_status ? "reserved-seat" : "available-seat"}`}
                onClick={() => handleSeatClick(seat)}
              >
                {seat.id}
              </div>
            ) : (
              <div key={`empty-${seatIndex}`} className="empty-seat"></div>
            )}
          </div>
        ))}
      </div>
    </React.Fragment>
  ))
}

const TrainingRoom = ({tainingRoomData, cancelSeat, modifySeat}) => {
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [combinedSeats, setCombinedSeats] = useState([])
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [modifiedSeatDetails, setModifiedSeatDetails] = useState(null);

  const seats = useMemo(() => [
    [{ id: 1 },{ id: 2 },null,{ id: 3 },{ id: 4 }],
    [{ id: 5 },{ id: 6 },null,{ id: 7 },{ id: 8 }],
    [{ id: 9 },{ id: 10 },null,{ id: 11 },{ id: 12 }],
    [{ id: 13 },{ id: 14 },null,{ id: 15 },{ id: 16 }],
    [{ id: 17 },{ id: 18 },null,{ id: 19 },{ id: 20 }],
    [{ id: 21 },{ id: 22 },null,{ id: 23 },{ id: 24 }],
    [{ id: 25 },{ id: 26 },null,{ id: 27 },{ id: 28 }],
  ], [])
  
  useEffect(() => {
    if (tainingRoomData) {
      // console.log("First Floor Raw Data:", tainingRoomData);
      setSelectedSeat(null)
      const combinedData = [];
      seats.forEach(row => {
        const newRow = row.map(seat => {
          if (seat === null) return null;
          const matchingSeat = tainingRoomData.find(fetchedSeat => fetchedSeat.seat_number === seat.id);
          return matchingSeat ? { ...seat, ...matchingSeat } : seat;
        });
        combinedData.push(newRow);
      });
      setCombinedSeats(combinedData);
      // console.log("First Combined Seats:", combinedData);
    }
  }, [tainingRoomData, seats]);
  
  const handleSeatClick = seat => {
    if (selectedSeat) {
      setModifiedSeatDetails(selectedSeat);
      setIsConfirmationModalOpen(true);
    }
    setSelectedSeat(seat);
    setIsModalOpen(true);
  };

  const handleConfirmationModalClose = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleModalClose = () => {
    setSelectedSeat(null);
    setIsModalOpen(false);
  };

  const handleModifySeat = () => {
    setIsModalOpen(false);
    setIsConfirmationModalOpen(false);
  };

  const handleConfirmMigration = () => {
    if (modifiedSeatDetails && selectedSeat) {
      selectedSeat.first_name = modifiedSeatDetails.first_name;
      selectedSeat.user_id = modifiedSeatDetails.user_id;
      selectedSeat.floor_id = modifiedSeatDetails.floor_id;
      selectedSeat.seat_number = modifiedSeatDetails.seat_number;
      selectedSeat.booking_id = modifiedSeatDetails.booking_id;

      selectedSeat.seat_number = selectedSeat.id;

      modifySeat(selectedSeat);
      setIsModalOpen(false);
      setIsConfirmationModalOpen(false);
    }
  };

  const handleCancelSeat = () => {
    if (selectedSeat) {
      cancelSeat(selectedSeat.booking_id); 
    }
    handleModalClose();
  };
  const room1 = combinedSeats.slice(0,3)
  const room2 = combinedSeats.slice(3, 5)
  const room3 = combinedSeats.slice(5, 7)

  return(
    <div className="training-container">
      <div className='training-seat-map-container'>
        <div className='training-seat-map-layout-row'>
         <Paper className='first-row'><div className='first-table'>Presentation-Board</div></Paper>
         <div className="seats-row">
          <Paper className='first-room-1'>{generateRoomSeats(room1, handleSeatClick)}</Paper>
          <Paper className='first-room-2'>{generateRoomSeats(room2, handleSeatClick)}</Paper>
          <Paper  className='first-room-3'>{generateRoomSeats(room3, handleSeatClick)}</Paper> 
         
        </div>
        </div>
       
      </div>
      <Modal show={isModalOpen} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify or Cancel Seat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Seat ID: {selectedSeat ? selectedSeat.id : ''}</p>
          <p>Employee Name: {selectedSeat ? selectedSeat.first_name : ''}</p>
          <p>Employee ID: {selectedSeat ? selectedSeat.user_id : ''}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleModifySeat}>
            Modify Seat
          </Button>
          <Button variant="danger" onClick={handleCancelSeat}>
            Cancel Seat
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={isConfirmationModalOpen} onHide={handleConfirmationModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Seat Migration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Modify Seat FROM: {modifiedSeatDetails ? modifiedSeatDetails.id : ''}</p>
          <p>Modify Seat TO : {selectedSeat ? selectedSeat.id : ''}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleConfirmMigration}>Confirm</Button>
          <Button variant="secondary" onClick={handleConfirmationModalClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
export default TrainingRoom;
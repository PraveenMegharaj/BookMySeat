import React, { useState, useEffect, useMemo} from 'react'
import "../styles/secondFloor.css"
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

const SecondFloor = ({secondFloorData, cancelSeat, modifySeat}) => {
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [combinedSeats, setCombinedSeats] = useState([])
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [modifiedSeatDetails, setModifiedSeatDetails] = useState(null);
  const seats = useMemo(() => [
    [{ id: 1 },{ id: 2 },{ id: 3 }],
    [{ id: 4 },{ id: 5 },{ id: 6 }],
    [{ id: 7 },{ id: 8 },{ id: 9 }],
    [{ id: 10 },{ id: 11 },{ id: 12 }],
    [{ id: 13 },{ id: 14 },{ id: 15 }],
    [{ id: 16 },{ id: 17 },{ id: 18 }],
    [{ id: 19 },{ id: 20 },{ id: 21 }],
    [{ id: 22 },{ id: 23 },{ id: 24 }],
    [{ id: 25 },{ id: 26 },{ id: 27 },null,null,{ id: 28 },{ id: 29 },{ id: 30 }],
    [{ id: 31 },{ id: 32 },{ id: 33 },null,{ id: 34 },{ id: 35 },{ id: 36 },{ id: 37 }],
    [{ id: 38 },{ id: 39 },{ id: 40 },null,{ id: 41 },{ id: 42 },{ id: 43 },{ id: 44 }],
    [{ id: 45 },{ id: 46 },{ id: 47 },null,{ id: 48 },{ id: 49 },{ id: 50 },{ id: 51 }],
    [{ id: 52 },{ id: 53 },{ id: 54 },null,{ id: 55 },{ id: 56 },{ id: 57 },{ id: 58 }],
    [{ id: 59 },{ id: 60 },{ id: 61 },null,null,{ id: 62 },{ id: 63 },{ id: 64 }],
    [{ id: 65 },{ id: 66 },{ id: 67 },null,{ id: 68 },{ id: 69 },{ id: 70 },{ id: 71 }],
    [{ id: 72 },{ id: 73 },{ id: 74 },null,{ id: 75 },{ id: 76 },{ id: 77 },{ id: 78 }],
    [{ id: 79 },{ id: 80 },{ id: 81 },null,{ id: 82 },{ id: 83 },{ id: 84 },{ id: 85 }],
    [{ id: 86 },{ id: 87 },{ id: 88 },null,{ id: 89 },{ id: 90 },{ id: 91 },{ id: 92 }],
    [{ id: 93 },{ id: 94 },{ id: 95 },null,null,{ id: 96 },{ id: 97 },{ id: 98 }],
    [{ id: 99 },{ id: 100 }],
    [{ id: 101 },{ id: 102 }],
    [{ id: 103 },{ id: 104 }],
    [{ id: 105 },{ id: 106 }],
    [{ id: 107 },{ id: 108 }],
    [{ id: 109 },{ id: 110 }],
    [{ id: 111 },{ id: 112 },{ id: 113 }],
    [{ id: 114 },{ id: 115 },{ id: 116 }],
    [{ id: 117 },{ id: 118 },{ id: 119 }],
    [{ id: 120 },{ id: 121 },{ id: 122 }],
  ], [])
  
  useEffect(() => {
    if (secondFloorData) {
      // console.log("Second Floor Raw Data:", secondFloorData);
      setSelectedSeat(null)
      const combinedData = [];
      seats.forEach(row => {
        const newRow = row.map(seat => {
          if (seat === null) return null;
          const matchingSeat = secondFloorData.find(fetchedSeat => fetchedSeat.seat_number === seat.id);
          return matchingSeat ? { ...seat, ...matchingSeat } : seat;
        });
        combinedData.push(newRow);
      });
      setCombinedSeats(combinedData);
    }
  }, [secondFloorData, seats]);
  
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
  const room5 = combinedSeats.slice(25,29)
  const room9 = combinedSeats.slice(8,11)
  const room10 = combinedSeats.slice(11,14)
  const room11 = combinedSeats.slice(14,17)
  const room12 = combinedSeats.slice(17,19)
  const room13 = combinedSeats.slice(0,4)
  const room15 = combinedSeats.slice(4,8)

  return(
    <div className="secondFloor-container">
      <div className='second-seat-map-container'>
        <div className='second-seat-map-layout-row1'>
          <Paper className='second-room-1'><div className='second-toilet'>Toilet</div></Paper>
          <Paper className='second-room-2'><div className='second-serverroom'>Server Room</div></Paper>
          <Paper className='second-room-3'><div className='second-meeting-table'>Meeting Room</div></Paper>
          <Paper className='second-room-4'><div className='second-meeting-table'>Meeting Room</div></Paper>
          <Paper className='second-room-5'>{generateRoomSeats(room5, handleSeatClick)}</Paper>
          <Paper className='second-room-6'><div className='second-staircase-2'>Emergency Staircase</div></Paper>
        </div>        
        <div className='second-seat-map-layout-row2'>
          <Paper className='second-room-7'><div className='second-staircase-1'>Staircase</div></Paper>
          <Paper className='second-room-8'><div className='second-conference-1'>Conference Hall</div></Paper>
          <Paper className='second-room-9'>{generateRoomSeats(room9, selectedSeat,handleSeatClick)}</Paper>
          <Paper className='second-room-10'>{generateRoomSeats(room10, selectedSeat,handleSeatClick)}</Paper>
          <Paper className='second-room-11'>{generateRoomSeats(room11, selectedSeat,handleSeatClick)}</Paper>
          <Paper className='second-room-12'>{generateRoomSeats(room12, selectedSeat,handleSeatClick)}</Paper>
        </div>
        <div className='second-seat-map-layout-row3'>
          <Paper className='second-room-13'>{generateRoomSeats(room13, selectedSeat,handleSeatClick)}</Paper>
          <Paper className='second-room-14'><div className='second-meeting-table'>Meeting Table</div></Paper>
          <Paper className='second-room-14'><div className='second-meeting-table'>Meeting Table</div></Paper>
          <Paper className='second-room-15'>{generateRoomSeats(room15, selectedSeat,handleSeatClick)}</Paper>
          <Paper className='second-room-16'><div className='second-conference-2'>Conference Hall</div></Paper>
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
export default SecondFloor
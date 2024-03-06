import React, { useState, useEffect , useMemo} from 'react';
import '../styles/groundFloor.css'
import Paper from '@mui/material/Paper';
import { Modal, Button } from 'react-bootstrap'

const generateRoomSeats = (room, selectedSeat ,handleSeatClick) => {
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

const GroundFloor = ({groundFloorData, cancelSeat, modifySeat}) => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [combinedSeats, setCombinedSeats] = useState([])
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [modifiedSeatDetails, setModifiedSeatDetails] = useState(null);
  
  const seats = useMemo(() =>[
    [{ id: 1 }, { id: 2 }, null, { id: 3 }, { id: 4 }],
    [{ id: 5 }, { id: 6 }, null, { id: 7 }, { id: 8 }],
    [{ id: 9 }, { id: 10 }, null, { id: 11 }, { id: 12 }],
    [{ id: 13 }, { id: 14 }, null, { id: 15 }, { id: 16 }, { id: 17 }, null, { id: 18 }, { id: 19 }, { id: 20 }, { id: 21 }, { id: 22 }],
    [{ id: 23 }, { id: 24 }, null, { id: 25 }, { id: 26 }, { id: 27 }, null, { id: 28 }, { id: 29 }, { id: 30 }, { id: 31 }, { id: 32 }],
    [{ id: 33 }, { id: 34 }, null, { id: 35 }, { id: 36 }, { id: 37 }, null, { id: 38 }, { id: 39 }, { id: 40 }, { id: 41 }, { id: 42 }],
    [{ id: 43 }, { id: 44 }, null, { id: 45 }, { id: 46 }, { id: 47 }, null, { id: 48 }, { id: 49 }, { id: 50 }, { id: 51 }, { id: 52 }],
    [{ id: 53 }, { id: 54 }, null, { id: 55 }, { id: 56 }, { id: 57 }, null, { id: 58 }, { id: 59 }, { id: 60 }],
    [{ id: 61 }, { id: 62 }, null, { id: 63 }, { id: 64 }, { id: 65 }, null, { id: 66 }, { id: 67 }, { id: 68 }],
    [{ id: 69 }, { id: 70 }, null, { id: 71 }, { id: 72 }, { id: 73 }, null, { id: 74 }, { id: 75 }, { id: 76 }],
    [{ id: 77 }, { id: 78 }, null, { id: 79 }, { id: 80 }, { id: 81 }, null, { id: 82 }, { id: 83 }, { id: 84 }],
    [{ id: 85 }, { id: 86 }, null, { id: 87 }, { id: 88 }, { id: 89 }, null, { id: 90 }, { id: 91 }, { id: 92 }],
    [{ id: 93 }, { id: 94 }],
    [{ id: 95 }, { id: 96 }, null, { id: 97 }, { id: 98 }, { id: 99 }],
    [{ id: 100 }, { id: 101 }, null, { id: 102 }, { id: 103 }, { id: 104 }],
    [{ id: 105 }, { id: 106 }, null, { id: 107 }, { id: 108 }],
    [{ id: 109 }, { id: 110 }, null, { id: 111 }, { id: 112 }],
    [{ id: 113 }, { id: 114 }, null, { id: 115 }, { id: 116 }]
  ], [])

  useEffect(() => {
    if (groundFloorData) {
      // console.log("Ground Floor Raw Data:", groundFloorData);
      setSelectedSeat(null)
      const combinedData = [];
      seats.forEach(row => {
        const newRow = row.map(seat => {
          if (seat === null) return null;
          const matchingSeat = groundFloorData.find(fetchedSeat => fetchedSeat.seat_number === seat.id);
          return matchingSeat ? { ...seat, ...matchingSeat } : seat;
        });
        combinedData.push(newRow);
      });
      setCombinedSeats(combinedData);
      // console.log("Ground Combined Seats:", combinedData);
    }
  }, [groundFloorData,seats]);

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
  const room4 = combinedSeats.slice(0, 3);
  const room5 = combinedSeats.slice(3, 12);
  const room6 = combinedSeats.slice(12);

  return(
    <div className='groundfloor-container'>
      <div className='seat-map-container'>
        <div className='seat-map-layout-row1'>
          <Paper className='room-1'><div className='conference-table'>Conference Table</div></Paper>
          <Paper className='room-2'><div className='conference-table'>Conference Table</div></Paper>
          <Paper className='room-3'><div className='conference-table'>Conference Table</div></Paper>
        </div>
        <div className='seat-map-layout-row2'>
          <Paper className='room-4'>{generateRoomSeats(room4,selectedSeat, handleSeatClick)}</Paper>
          <Paper className='room-5'>{generateRoomSeats(room5,selectedSeat, handleSeatClick)}</Paper>
          <Paper className='room-6'>{generateRoomSeats(room6, selectedSeat,handleSeatClick)}</Paper>
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

export default GroundFloor
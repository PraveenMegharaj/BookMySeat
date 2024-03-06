import React, { useState, useEffect, useMemo} from 'react'
import "../../EditSeats/styles/trainingRoom.css"
import Paper from '@mui/material/Paper'

const generateRoomSeats = (room, handleSeatClick, selectedSeatId) => {
  return room.map((col, colIndex) => (
      <React.Fragment key={colIndex}>
      <div className="col">
        {col.map((seat, seatIndex) => {
          return (
            <div key={seat && seat.id ? seat.id : `empty-${seatIndex}`} className="seat-container">
              {seat && typeof seat === 'object' && 'id' in seat ? (
                <div
                  key={seat.id}
                  className={`seat ${seat.preferred ? "preferred-seat" : ""} ${
                      'bookingStatus' in seat && seat.bookingStatus
                        ? "reserved-seat"
                        : selectedSeatId === seat.id
                        ? "selected-seat"
                        : seat.reservedStatus
                        ? "disabled-seat"
                        : "available-seat"
                    }`}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat.id}
                </div>
              ) : (
                <div key={`empty-${seatIndex}`} className="empty-seat"></div>
              )}
            </div>
          );
        })}
      </div>
    </React.Fragment>
  ));
};

const UserTrainingRoom = ({trainingRoomData,selectedSeat,onSeatSelect,preferredSeatsDataTrainingRoom,reserveData}) => {
  const [combinedSeats, setCombinedSeats] = useState([])
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
   
    if (trainingRoomData && trainingRoomData.length > 0 && preferredSeatsDataTrainingRoom && preferredSeatsDataTrainingRoom.length > 0 && reserveData) {
        const combinedData = combineData(seats, trainingRoomData, preferredSeatsDataTrainingRoom,reserveData);
        setCombinedSeats(combinedData);
    } else {
        setCombinedSeats(seats);
    }
}, [trainingRoomData, preferredSeatsDataTrainingRoom,reserveData,seats]);

  const combineData = (seats, trainingRoomData, preferredSeatsData,reserveData) => {
      const combinedData = seats.map(row => {
          return row.map(seat => {
              if (seat === null) return null;
              const matchingSeat = trainingRoomData &&trainingRoomData.find(fetchedSeat => fetchedSeat.seat_number === seat.id);
              const reservedSeat = reserveData && reserveData.find(reservedSeat => reservedSeat.seatNumber === seat.id);
              const preferredSeat = preferredSeatsData && preferredSeatsData.find(preferredSeat => preferredSeat.seat.seatNumber === seat.id);
              if (reservedSeat) {
                  return { ...seat, ...matchingSeat, ...reservedSeat };
              } else if (preferredSeat) {
                  return { ...seat, ...matchingSeat, ...preferredSeat, preferred: true };
              } else if (matchingSeat) {
                  return { ...seat, ...matchingSeat };
              } else {
                  return seat;
              }
          });
      });
      return combinedData;
      
  };

  const handleSeatClick = seat => {
      onSeatSelect(seat.id);
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
          <Paper className='first-room-1'>{generateRoomSeats(room1, handleSeatClick,selectedSeat)}</Paper>
          <Paper className='first-room-2'>{generateRoomSeats(room2, handleSeatClick,selectedSeat)}</Paper>
          <Paper  className='first-room-3'>{generateRoomSeats(room3, handleSeatClick,selectedSeat)}</Paper> 
         
        </div>
        </div>
       
      </div>
      
    </div>
  )
}
export default UserTrainingRoom;
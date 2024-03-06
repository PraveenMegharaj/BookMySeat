import React, { useState, useEffect, useMemo} from 'react'
import "../../EditSeats/styles/trainingRoom.css"
import Paper from '@mui/material/Paper'

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
                  ${ seat.reservedStatus ? "disabled-seat" : 
                    selectedSeat && selectedSeat.id === seat.id ? "selected-seat" :
                    seat.booking_status ? "reserved-seat" : 
                    "available-seat"}`}
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

const ReservedTrainingRoom = ({tainingRoomData, trainingRoomReservedData, onSeatClick}) => {
  const [selectedSeat, setSelectedSeat] = useState(null)
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
    if (tainingRoomData && trainingRoomReservedData) {
      setSelectedSeat(null);
      const combinedData = [];
      seats.forEach(row => {
        const newRow = row.map(seat => {
          if (seat === null) return null;
          const matchingSeat = tainingRoomData.find(fetchedSeat => fetchedSeat.seat_number === seat.id);
          const reservedSeat = trainingRoomReservedData.find(reservedSeat => reservedSeat.seat.seatNumber === seat.id);
          if (reservedSeat) {
            return { ...seat, ...matchingSeat, ...reservedSeat };
          } else if (matchingSeat) {
            return { ...seat, ...matchingSeat };
          } else {
            return seat;
          }
        });
        combinedData.push(newRow);
      });
      setCombinedSeats(combinedData);
      // console.log(combinedData)
    }
  }, [tainingRoomData,seats, trainingRoomReservedData]);

  const handleSeatClick = seat => {
    setSelectedSeat(seat);
    // reserveSeat(seat.id)
    onSeatClick(seat.id)
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
            <Paper className='first-room-1'>{generateRoomSeats(room1, selectedSeat,handleSeatClick)}</Paper>
            <Paper className='first-room-2'>{generateRoomSeats(room2, selectedSeat,handleSeatClick)}</Paper>
            <Paper  className='first-room-3'>{generateRoomSeats(room3, selectedSeat,handleSeatClick)}</Paper> 
          </div>
        </div>
      </div>
    </div>
  )
}
export default ReservedTrainingRoom;
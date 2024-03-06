import React, { useState, useEffect, useMemo } from 'react'
import "../../EditSeats/styles/mezzanineFloor.css"
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

const ReservedMezzanineFloor = ({mezzanineFloorData, mezzanineFloorReservedData, onSeatClick}) => {
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [combinedSeats, setCombinedSeats] = useState([])
  
  const seats = useMemo(() => [
    [{ id: 1 },{ id: 2 },{ id: 3 }],
    [{ id: 4 },{ id: 5 },{ id: 6 }],
    [{ id: 7 },{ id: 8 },null,{ id: 9 },{ id: 10 }],
    [{ id: 11 },{ id: 12 },null,{ id: 13 },{ id: 14 }],
    [{ id: 15 },{ id: 16 },null,{ id: 17 },{ id: 18 }],
    [{ id: 19 },{ id: 20 },null,{ id: 21 },{ id: 22 }],
    [{ id: 23 },{ id: 24 },null,{ id: 25 },{ id: 26 }],
    [{ id: 27 },{ id: 28 },null,{ id: 29 },{ id: 30 }],
    [{ id: 31 },{ id: 32 },null,{ id: 33 },{ id: 34 }],
    [{ id: 35 },{ id: 36 },null,{ id: 37 },{ id: 38 }],
    [{ id: 39 },{ id: 40 },null,{ id: 41 },{ id: 42 }],
    [{ id: 43 },{ id: 44 },{ id: 45 },{ id: 46 },{ id: 47 }]
  ], [])
  
  useEffect(() => {
    if (mezzanineFloorData && mezzanineFloorReservedData) {
      // console.log("Mezzanine Floor Raw Data:", mezzanineFloorData);
      setSelectedSeat(null);
      const combinedData = [];
      seats.forEach(row => {
        const newRow = row.map(seat => {
          if (seat === null) return null;
          const matchingSeat = mezzanineFloorData.find(fetchedSeat => fetchedSeat.seat_number === seat.id);
          const reservedSeat = mezzanineFloorReservedData.find(reservedSeat =>  reservedSeat.seat.seatNumber === seat.id);
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
      // console.log("Mezzanine Combined Seats:", combinedData);
    }
  }, [mezzanineFloorData,seats, mezzanineFloorReservedData]);

  const handleSeatClick = seat => {
    setSelectedSeat(seat);
    onSeatClick(seat.id)
  };

  const room4 = combinedSeats.slice(0, 2)
  const room5 = combinedSeats.slice(2, 4)
  const room6 = combinedSeats.slice(4, 6)
  const room7 = combinedSeats.slice(6, 8)
  const room8 = combinedSeats.slice(8, 10)
  const room10 = combinedSeats.slice(11)
  return(
    <div className='mezzaninefloor-container'>
    <div className='mezz-seat-map-container'>
      <div className='mezz-seat-map-layout-row1'>
        <Paper className='mezz-room-1'><div className='mezz-office-table'>Office Rooms</div></Paper>
        <Paper className='mezz-room-2'><div className='mezz-office-table'>Office Rooms</div></Paper>
        <Paper className='mezz-room-3'><div className='mezz-office-table'>Office Rooms</div></Paper>
      </div>
      <div className='mezz-seat-map-layout-row2'>
        <Paper className='mezz-room-4'>{generateRoomSeats(room4, selectedSeat, handleSeatClick)}</Paper>
        <Paper className='mezz-room-5'>{generateRoomSeats(room5, selectedSeat, handleSeatClick)}</Paper>
        <Paper className='mezz-room-6'>{generateRoomSeats(room6, selectedSeat, handleSeatClick)}</Paper>
        <Paper className='mezz-room-7'>{generateRoomSeats(room7, selectedSeat, handleSeatClick)}</Paper>
        <Paper className='mezz-room-8'>{generateRoomSeats(room8, selectedSeat, handleSeatClick)}</Paper>
      </div>
      <div className='mezz-seat-map-layout-row3'>
        <Paper className='mezz-room-9'><div className='mezz-ITSupport-room'>IT Support Room</div></Paper>
        <Paper className='mezz-room-10'>{generateRoomSeats(room10, selectedSeat, handleSeatClick)}</Paper>
      </div>
    </div>
  </div>
  )
}
export default ReservedMezzanineFloor
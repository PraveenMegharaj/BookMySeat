import React, { useState, useEffect, useMemo} from 'react'
import "../../EditSeats/styles/thirdFloor.css"
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

const ReservedThirdFloor = ({thirdFloorData, thirdFloorReservedData, onSeatClick}) => {
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [combinedSeats, setCombinedSeats] = useState([])
  const seats = useMemo(() => [
    [{ id: 1 },{ id: 2 },{ id: 3 },{ id: 4 }],
    [{ id: 5 },{ id: 6 },{ id: 7 },{ id: 8 }],
    [{ id: 9 },{ id: 10 },{ id: 11 },{ id: 12 }],
    [{ id: 13 },{ id: 14 },{ id: 15 },{ id: 16 }],
    [{ id: 17 },{ id: 18 },{ id: 19 },{ id: 20 }],
    [{ id: 21 },{ id: 22 },{ id: 23 },{ id: 24 }],
    [{ id: 25 },{ id: 26 },{ id: 27 },{ id: 28 }],
    [{ id: 29 },{ id: 30 },{ id: 31 },{ id: 32 }],
    [{ id: 33 },{ id: 34 },{ id: 35 },{ id: 36 }],
    [{ id: 37 },{ id: 38 },{ id: 39 },{ id: 40 }],
    [{ id: 41 },{ id: 42 }],
    [{ id: 43 },{ id: 44 }],
    [{ id: 45 },{ id: 46 }],
    [{ id: 47 },{ id: 48 }],
    [{ id: 49 },{ id: 50 }],
    [{ id: 51 },{ id: 52 },{ id: 53 },{ id: 54 },{ id: 55 }],
    [{ id: 56 },{ id: 57 },{ id: 58 },{ id: 59 },{ id: 60 }],
    [{ id: 61 },{ id: 62 },{ id: 63 },{ id: 64 },{ id: 65 }],
    [{ id: 66 },{ id: 67 },{ id: 68 }],
    [{ id: 69 },{ id: 70 },{ id: 71 }],
    [{ id: 72 },{ id: 73 },{ id: 74 }],
    [{ id: 75 },{ id: 76 },{ id: 77 }],
    [{ id: 78 },{ id: 79 }],
    [{ id: 80 },{ id: 81 }],
    [{ id: 82 },{ id: 83 }],
    [{ id: 84 },{ id: 85 }],
    [{ id: 86 },{ id: 87 }],
    [{ id: 88 },{ id: 89 }],
    [{ id: 90 },{ id: 91 }],
    [{ id: 92 },{ id: 93 }]
  ], [])
  
  useEffect(() => {
    if (thirdFloorData && thirdFloorReservedData) {
      setSelectedSeat(null);
      const combinedData = [];
      seats.forEach(row => {
        const newRow = row.map(seat => {
          if (seat === null) return null;
          const matchingSeat = thirdFloorData.find(fetchedSeat => fetchedSeat.seat_number === seat.id);
          const reservedSeat = thirdFloorReservedData.find(reservedSeat => reservedSeat.seat.seatNumber === seat.id);
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
  }, [thirdFloorData,seats, thirdFloorReservedData]);

  const handleSeatClick = seat => {
    setSelectedSeat(seat);
    // reserveSeat(seat.id)
    onSeatClick(seat.id)
  };

  const room1 = combinedSeats.slice(0,2)
  const room2 = combinedSeats.slice(2,4)
  const room3 = combinedSeats.slice(4,6)
  const room4 = combinedSeats.slice(6,8)
  const room5 = combinedSeats.slice(8,10)
  const room6 = combinedSeats.slice(10,15)
  const room10 = combinedSeats.slice(15,18)
  const room11 = combinedSeats.slice(18,22)
  const room15 = combinedSeats.slice(22,30)

  return(
    <div className="thirdFloor-container">
      <div className='third-seat-map-container'>
        <div className='third-seat-map-layout-row1'>
          <Paper className='third-room-1'>{generateRoomSeats(room1, selectedSeat, handleSeatClick)}</Paper>
          <Paper className='third-room-2'>{generateRoomSeats(room2, selectedSeat, handleSeatClick)}</Paper>
          <Paper className='third-room-3'>{generateRoomSeats(room3, selectedSeat, handleSeatClick)}</Paper>
          <Paper className='third-room-4'>{generateRoomSeats(room4, selectedSeat, handleSeatClick)}</Paper>
          <Paper className='third-room-5'>{generateRoomSeats(room5, selectedSeat, handleSeatClick)}</Paper>
          <Paper className='third-room-6'>{generateRoomSeats(room6, selectedSeat, handleSeatClick)}</Paper>
          <Paper className='third-room-7'><div className='third-room-7-reference'>Reference Section</div></Paper>
        </div>        
        <div className='third-seat-map-layout-row2'>
          <Paper className='third-room-8'>
            <div className='third-room-8-con1'>
              <div className='third-room-8-con1-storeroom'>Store Room</div>
              <div className='third-room-8-con1-AHU'>AHU Room</div>
            </div>
            <div className='third-room-8-con2'>Staircase</div>
          </Paper>
          <Paper className='third-room-9'>
            <div className='third-room-9-con1'>
              <div className='third-room-9-con1-lab'>Lab</div>
              <div className='third-room-9-con1-discussion'>Discussion Room</div>
            </div>
            <div className='third-room-9-con2'>Louis Vuitton Holding</div>
          </Paper>
          <Paper className='third-room-10'>{generateRoomSeats(room10, selectedSeat, handleSeatClick)}</Paper>
          <Paper className='third-room-11'>{generateRoomSeats(room11, selectedSeat, handleSeatClick)}</Paper>
          <Paper className='third-room-12'>
            <div className='third-room-12-d1'>Discussion Room</div>
            <div className='third-room-12-d2'>Discussion Room</div>
            <div className='third-room-12-d3'>Discussion Room</div>
          </Paper>
        </div>
        <div className='third-seat-map-layout-row3'>
          <Paper className='third-room-13'><div className='third-room-13-emergency'>Emergency Exit</div></Paper>
          <Paper className='third-room-14'><div className='third-room-14-con2'>Louis Vuitton Holding</div></Paper>
          <Paper className='third-room-15'>{generateRoomSeats(room15, selectedSeat, handleSeatClick)}</Paper>
          <Paper className='third-room-16'><div className='third-room-16-store'>Store Room</div></Paper>
        </div>
      </div>
    </div>
  )
}
export default ReservedThirdFloor
import React, { useState, useEffect, useMemo } from 'react';
import '../../EditSeats/styles/groundFloor.css';
import Paper from '@mui/material/Paper';



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

const UserGroundFloor = ({ groundFloorData, selectedSeat, onSeatSelect, preferredSeatsDataGroundFloor, reserveData }) => {
    const [combinedSeats, setCombinedSeats] = useState([]);

    const seats = useMemo(() => [
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
    ], []);

    useEffect(() => {
        if (groundFloorData && reserveData && preferredSeatsDataGroundFloor) {
            const combinedData = [];
            console.log("ground floor",combinedData)
            seats.forEach(row => {
                const newRow = row.map(seat => {
                    if (seat === null) return null;
                    const matchingSeat = groundFloorData.find(fetchedSeat => fetchedSeat.seatNumber === seat.id);
                    const reservedSeat = reserveData.find(reservedSeat => reservedSeat.seatNumber === seat.id);
                    const preferredSeat = preferredSeatsDataGroundFloor.find(preferredSeat => preferredSeat.seat.seatNumber === seat.id);
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
                combinedData.push(newRow);
            });
            setCombinedSeats(combinedData);
            console.log(combinedData);
        }
    }, [groundFloorData, seats, preferredSeatsDataGroundFloor, reserveData]);

   
    
    

    const handleSeatClick = seat => {
        onSeatSelect(seat.id);
    };

    const room4 = combinedSeats.slice(0, 3);
    const room5 = combinedSeats.slice(3, 12);
    const room6 = combinedSeats.slice(12);

    return (
        <div className='groundfloor-container'>
            <div className='seat-map-container'>
                <div className='seat-map-layout-row1'>
                    <Paper className='room-1'><div className='conference-table' >Conference Table</div></Paper>
                    <Paper className='room-2'><div className='conference-table'>Conference Table</div></Paper>
                    <Paper className='room-3'><div className='conference-table'>Conference Table</div></Paper>
                </div>
                <div className='seat-map-layout-row2'>
                    <Paper className='room-4'>{generateRoomSeats(room4, handleSeatClick, selectedSeat)}</Paper>
                    <Paper className='room-5'>{generateRoomSeats(room5, handleSeatClick, selectedSeat)}</Paper>
                    <Paper className='room-6'>{generateRoomSeats(room6, handleSeatClick, selectedSeat)}</Paper>
                </div>
            </div>
        </div>
    );
}

export default UserGroundFloor;
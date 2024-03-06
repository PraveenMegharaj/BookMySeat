



import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import Paper from '@mui/material/Paper';
import "../../EditSeats/styles/editSeats.css";
import axios from '../../../Services/axiosToken';
import RestrictSeatLegend from './restrictSeatLegend';
import ReservedGroundFloor from './restrictGroundFloor';
import ReservedFirstFloor from './restrictFirstFloor';
import ReservedMezzanineFloor from './restrictMezzanineFlorr';
import ReservedSecondFloor from './restrictSecondFloor';
import ReservedThirdFloor from './restrictThirdFloor';
import ReservedTrainingRoom from './restrictTrainingFloor';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RestrictSeat = () => {
  const [selectedFloor, setSelectedFloor] = useState("ground-floor");
  const [groundFloorData, setGroundFloorData] = useState(null);
  const [mezzanineFloorData, setMezzanineFloorData] = useState(null);
  const [firstFloorData, setFirstFloorData] = useState(null);
  const [secondFloorData, setSecondFloorData] = useState(null);
  const [thirdFloorData, setThirdFloorData] = useState(null);
  const [tainingRoomData,setTrainingRoomData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const [groundFloorReservedData, setGroundFloorReservedData] = useState(null);
  const [mezzanineFloorReservedData, setMezzanineFloorReservedData] = useState(null);
  const [firstFloorReservedData, setFirstFloorReservedData] = useState(null);
  const [secondFloorReservedData, setSecondFloorReservedData] = useState(null);
  const [thirdFloorReservedData, setThirdFloorReservedData] = useState(null);
  const [trainingRoomReservedData, setTrainingRoomReservedData] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);

    setTimeout(() => {
      setModalOpen(false);
    }, 2000);
  };

  const onSeatClick = (seatId) => {
    setSelectedSeatId(seatId);
  };

  useEffect(() => {
    fetchData(selectedFloor);
    fetchReserved();
  }, [selectedFloor]);

  const renderFloor = () => {
    if (selectedFloor === "ground-floor") {
      return <ReservedGroundFloor groundFloorData={groundFloorData}  onSeatClick={onSeatClick} groundFloorReservedData={groundFloorReservedData}/>
    } else if (selectedFloor === "mezzanine-floor") {
      return <ReservedMezzanineFloor mezzanineFloorData={mezzanineFloorData} onSeatClick={onSeatClick} mezzanineFloorReservedData={mezzanineFloorReservedData}/>
    } else if (selectedFloor === "first-floor") {
      return <ReservedFirstFloor firstFloorData={firstFloorData} onSeatClick={onSeatClick} firstFloorReservedData={firstFloorReservedData}/>
    } else if (selectedFloor === "second-floor") {
      return <ReservedSecondFloor secondFloorData={secondFloorData} onSeatClick={onSeatClick} secondFloorReservedData={secondFloorReservedData}/>
    } else if (selectedFloor === "third-floor") {
      return <ReservedThirdFloor thirdFloorData={thirdFloorData} onSeatClick={onSeatClick} thirdFloorReservedData={thirdFloorReservedData}/>
    } else if (selectedFloor === "training-room") {
      return <ReservedTrainingRoom tainingRoomData={tainingRoomData} onSeatClick={onSeatClick} trainingRoomReservedData={trainingRoomReservedData}/>
    } else {
      return null
    }
  };

  const handleUserFetch = (UserID) => {
    if(UserID){
      axios.get(`http://localhost:5000/bookmyseat/admin/getAllUsers/${UserID}`)
      .then(response => {
        if (response.data.length === 0) {
          openModal('No data found for the provided UserID.');
        } else {
          setUserData(response.data);
          openModal(`${response.data[0].firstName+ " " +response.data[0].lastName} selected for Seat Reservation`);
        }
      })
      .catch(error => {
        console.error('Error fetching UserID:', error);
        openModal('Enter valid UserID.');
      });
    } else {
      openModal("Please Enter a Employee ID")
    } 
  };

  const fetchReserved = () => {
    axios.get('http://localhost:5000/bookmyseat/admin/reserve')
    .then(response => {
      setGroundFloorReservedData(response.data.filter(item => item.seat.floor.floorId === 1));
        setMezzanineFloorReservedData(response.data.filter(item => item.seat.floor.floorId === 2));
        setFirstFloorReservedData(response.data.filter(item => item.seat.floor.floorId === 3));
        setSecondFloorReservedData(response.data.filter(item => item.seat.floor.floorId === 4));
        setThirdFloorReservedData(response.data.filter(item => item.seat.floor.floorId === 5));
        setTrainingRoomReservedData(response.data.filter(item => item.seat.floor.floorId === 6));
    })
    .catch(error => {
      console.error('Error fetching reserved data:', error)
    })
  }

  const fetchData = (floor) => {
    axios.get(`http://localhost:5000/bookmyseat/admin/user-seat-info`)
      .then(response => {
        const allData = response.data
        let filteredData = null
  
        if (floor === "ground-floor") {
          filteredData = allData.filter(item => item.floor_id === 1)
          setGroundFloorData(filteredData)
        } 
        else if (floor === "mezzanine-floor") {
          filteredData = allData.filter(item => item.floor_id === 2)
          setMezzanineFloorData(filteredData)
        } 
        else if (floor === "first-floor") {
          filteredData = allData.filter(item => item.floor_id === 3)
          setFirstFloorData(filteredData)
        } 
        else if (floor === "second-floor") {
          filteredData = allData.filter(item => item.floor_id === 4)
          setSecondFloorData(filteredData)
        } 
        else if (floor === "third-floor") {
          filteredData = allData.filter(item => item.floor_id === 5)
          setThirdFloorData(filteredData)
        }
        else if (floor === "training-room") {
          filteredData = allData.filter(item => item.floor_id === 6)
          setTrainingRoomData(filteredData)
        }
      })
      .catch(error => {
        console.error('Error fetching floor data:', error)
      })

  }

  const reserveSeat = () => {
    if (!selectedSeatId) {
      openModal("Select a Seat to Reserve");
      return;
    } else if (!userData){
      openModal("Select a user to reserve");
      return;
    }

    const seatNumber = selectedSeatId
    const userId = userData ? userData[0].userId : null;
    let floorId;
    if (selectedFloor === "ground-floor") {
      floorId = 1
    } 
    else if (selectedFloor === "mezzanine-floor") {
      floorId = 2
    } 
    else if (selectedFloor === "first-floor") {
      floorId = 3
    } 
    else if (selectedFloor === "second-floor") {
      floorId = 4
    } 
    else if (selectedFloor === "third-floor") {
      floorId = 5
    }
    else if (selectedFloor === "training-room") {
      floorId = 6      
    }

    axios.post(`http://localhost:5000/bookmyseat/admin/reserve/${userId}/${floorId}/${seatNumber}`)
    .then(response => {
      openModal( 
        `${response.data} for\n 
        Employee : ${userData[0].firstName+ " " +userData[0].lastName}\n
        Seat Number : ${userId}\n
        \nFloor: ${selectedFloor}`, );
        fetchReserved()
    })
    .catch(error => {
      console.error('Error reserving seat:', error);
      openModal('Seat already reserved for User');
    });
  }
  
  return (
    <div className="layout-container">
      <h2 className="layout-header">Reserve Seats</h2>
      <div className="floor-select">
        <Paper className={`floor ${selectedFloor === "ground-floor" ? 'floor-selected' : ''}`} elevation={5} onClick={() => setSelectedFloor("ground-floor")} >Ground Floor</Paper>
        <Paper className={`floor ${selectedFloor === "mezzanine-floor" ? 'floor-selected' : ''}`} elevation={5} onClick={() => setSelectedFloor("mezzanine-floor")} >Mezzanine Floor</Paper>
        <Paper className={`floor ${selectedFloor === "first-floor" ? 'floor-selected' : ''}`} elevation={5} onClick={() => setSelectedFloor("first-floor")} >First Floor</Paper>
        <Paper className={`floor ${selectedFloor === "second-floor" ? 'floor-selected' : ''}`} elevation={5} onClick={() => setSelectedFloor("second-floor")} >Second Floor</Paper>
        <Paper className={`floor ${selectedFloor === "third-floor" ? 'floor-selected' : ''}`} elevation={5} onClick={() => setSelectedFloor("third-floor")} >Third Floor</Paper>
        <Paper className={`floor ${selectedFloor === "training-room" ? 'floor-selected' : ''}`} elevation={5} onClick={() => setSelectedFloor("training-room")} >Training Room</Paper>
      </div>
      <div className="floor-container">
        <RestrictSeatLegend handleUserFetch={handleUserFetch} reserveSeat={reserveSeat}/>
        {renderFloor()}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={{
          content: {
            width: '250px',
            height:'100px',
            margin: 'auto',
            textAlign: 'center',
            border:'2px solid black',
            top : '100px'
          },
        }}
      >
        <b>{modalContent}</b>
      </Modal>
      
    </div>
  )
}

export default RestrictSeat;

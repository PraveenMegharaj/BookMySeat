import { useState, useEffect } from "react"
import GroundFloor from './groundFloor'
import MezzanineFloor from './mezzanineFloor'
import FirstFloor from './firstFloor'
import Paper from '@mui/material/Paper'
import axios from "../../../Services/axiosToken"
import "../styles/editSeats.css"
import EditSeatLegend from "./editSeatLegend"
import TrainingRoom from "./trainingRoom"
import SecondFloor from "./secondFloor"
import ThirdFloor from "./thirdFloor"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModifySeats = () => {
  const [selectedFloor, setSelectedFloor] = useState("ground-floor")
  const [groundFloorData, setGroundFloorData] = useState(null)
  const [mezzanineFloorData, setMezzanineFloorData] = useState(null)
  const [firstFloorData, setFirstFloorData] = useState(null)
  const [tainingRoomData,setTrainingRoomData] = useState(null)
  const [secondFloorData, setSecondFloorData] = useState(null)
  const [thirdFloorData, setThirdFloorData] = useState(null)

  const renderFloor = () => {
    if (selectedFloor === "ground-floor") {
      return <GroundFloor groundFloorData={groundFloorData} cancelSeat={cancelSeat} modifySeat={modifySeat}/>
    } else if (selectedFloor === "mezzanine-floor") {
      return <MezzanineFloor mezzanineFloorData={mezzanineFloorData} cancelSeat={cancelSeat} modifySeat={modifySeat}/>
    } else if (selectedFloor === "first-floor") {
      return <FirstFloor firstFloorData={firstFloorData} cancelSeat={cancelSeat} modifySeat={modifySeat}/>
    } else if (selectedFloor === "training-room") {
      return <TrainingRoom tainingRoomData={tainingRoomData} />
    } else if (selectedFloor === "second-floor") {
      return <SecondFloor secondFloorData={secondFloorData} cancelSeat={cancelSeat} modifySeat={modifySeat}/>
    } else if (selectedFloor === "third-floor") {
      return <ThirdFloor thirdFloorData={thirdFloorData} cancelSeat={cancelSeat} modifySeat={modifySeat}/>
    } else {
      return null
    }
  }

  useEffect(() => {
    fetchData(selectedFloor)
  }, [selectedFloor])

  const fetchData = (floor) => {
    axios.get(`http://localhost:5000/bookmyseat/admin/user-seat-info`)
      .then(response => {
        const allData = response.data
        console.log("Raw Data :", allData)
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

    const cancelSeat = (userId) => {
      console.log(userId)
      axios.put(`http://localhost:5000/bookmyseat/admin/cancelBooking/${userId}`)
        .then(response => {
          console.log(response.data)
          fetchData(selectedFloor)
          toast.success(`Seat Cancelled for Booking Number: ${userId}`)
        })
        .catch(error => {
          console.error('Error canceling seat:', error)
          toast.error('Seat Cacellation Failed!')
        });
    }   
    const modifySeat = (ModifySeatData) => {
      console.log("Modified Seats Data:",ModifySeatData)
      axios.put(`http://localhost:5000/bookmyseat/admin/updateSeat/${ModifySeatData.seat_number}/${ModifySeatData.floor_id}/${ModifySeatData.booking_id}`)
        .then(response => {
          console.log(response.data)
          fetchData(selectedFloor)
          toast.success(`Seat Modified for: ${ModifySeatData.first_name}`)
        })
        .catch(error => {
          console.error('Error modifying seat:', error)
          toast.error('Seat Modified Failed!')
        });
    }   
  
  return (
    <div className="layout-container">
      <h2 className='layout-header'>Modify Seats</h2>
      <div className="floor-select">
        <Paper className={`floor ${selectedFloor === "ground-floor" ? 'floor-selected' : ''}`} elevation={5} onClick={() => setSelectedFloor("ground-floor")} >Ground Floor</Paper>
        <Paper className={`floor ${selectedFloor === "mezzanine-floor" ? 'floor-selected' : ''}`} elevation={5} onClick={() => setSelectedFloor("mezzanine-floor")} >Mezzanine Floor</Paper>
        <Paper className={`floor ${selectedFloor === "first-floor" ? 'floor-selected' : ''}`} elevation={5} onClick={() => setSelectedFloor("first-floor")} >First Floor</Paper>
        <Paper className={`floor ${selectedFloor === "second-floor" ? 'floor-selected' : ''}`} elevation={5} onClick={() => setSelectedFloor("second-floor")} >Second Floor</Paper>
        <Paper className={`floor ${selectedFloor === "third-floor" ? 'floor-selected' : ''}`} elevation={5} onClick={() => setSelectedFloor("third-floor")} >Third Floor</Paper>
        <Paper className={`floor ${selectedFloor === "training-room" ? 'floor-selected' : ''}`} elevation={5} onClick={() => setSelectedFloor("training-room")} >Training Room</Paper>
      </div>
      <div className="floor-container">
        <EditSeatLegend/>
        {renderFloor()}
      </div>
      <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={true}
            style={{
              width: '300px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          />
    </div>
  )
}

export default ModifySeats
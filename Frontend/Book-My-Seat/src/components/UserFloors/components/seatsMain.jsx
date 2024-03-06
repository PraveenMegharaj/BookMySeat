import React, { useState, useEffect } from 'react';
import axios from '../../../Services/axiosToken';
import '../styles/seatsMain.css';
import Button from "@mui/material/Button";
import UserGroundFloor from './userGroundFloor';
import UserMezzanineFloor from './userMezzanineFloor';
import UserFirstFloor from './userFirstFloor';
import UserSecondFloor from './userSecondFloor';
import UserTrainingRoom from './userTrainingRoom';
import Modal from 'bootstrap/js/dist/modal'; 
import UserThirdFloor from './userThirdFloor';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserSeatLegend from './userSeatLegend';

const SeatsMain = ({ onSeatSelect, startDate, endDate }) => {
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [groundFloorData, setGroundFloorData] = useState(null);
    const [mezzanineFloorData, setMezzanineFloorData] = useState(null);
    const [firstFloorData, setFirstFloorData] = useState(null);
    const [trainingRoomData, setTrainingRoomData] = useState(null);
    const [secondFloorData, setSecondFloorData] = useState(null);
    const [thirdFloorData, setThirdFloorData] = useState(null);
    const [modal, setModal] = useState(null);
    const [preferredSeatsDataGroundFloor, setPreferredSeatsDataGroundFloor] = useState(null);
    const [preferredSeatsDataMezzanineFloor, setPreferredSeatsDataMezzanineFloor] = useState(null);
    const [preferredSeatsDataFirstFloor, setPreferredSeatsDataFirstFloor] = useState(null);
    const [preferredSeatsDataSecondFloor, setPreferredSeatsDataSecondFloor] = useState(null);
    const [preferredSeatsDataThirdFloor, setPreferredSeatsDataThirdFloor] = useState(null);
    const [preferredSeatsDataTrainingRoom, setPreferredSeatsDataTrainingRoom] = useState(null);
    const [reservedFirstFloorData,setReservedFirstFloorData] = useState(null)
    const [reservedGroundFloordata,setReservedGroundFloorData] = useState(null)
    const [reservedSecondFloorData,setReservedSecondFloorData] = useState(null)
    const [reservedThirdFloorData,setReservedThirdFloorData] = useState(null)
    const [reservedMezzanineFloorData,setReservedMezzanineFloorData] = useState(null)
    const [reservedTrainingRoomData,setReservedTrainingRoomData] = useState(null)
    const [error,setError] = useState("")
    const [reserveData, setReserveData] = useState(null)
    const [users,setusers] =useState(null)

    useEffect(() => {
        fetchData(selectedFloor);
        reservedData()
        setModal(new Modal(document.getElementById('myModal')));
        if (selectedFloor && startDate && endDate) {
            preferredSeats(); 
        }
    }, [selectedFloor, startDate, endDate]);

    const reservedData = () => {
        axios.get('http://localhost:5000/bookmyseat/user/restrain-reserve')
        .then((response) => {
            console.log("Reserved data", response.data);
            const filteredGroundFloorData = response.data.filter(item => item.reservedId === 1);
            const filteredMezzanineFloorData = response.data.filter(item => item.reservedId === 2);
            const filteredFirstFloorData = response.data.filter(item => item.reservedId === 3);
            const filteredSecondFloorData = response.data.filter(item => item.reservedId === 4);
            const filteredThirdFloorData = response.data.filter(item => item.reservedId === 5);
            const filteredTrainingRoomData = response.data.filter(item => item.reservedId === 6);
            
            setReservedFirstFloorData(filteredFirstFloorData);
            setReservedMezzanineFloorData(filteredMezzanineFloorData);
            setReservedGroundFloorData(filteredGroundFloorData);
            setReservedGroundFloorData(filteredGroundFloorData);
            setReservedSecondFloorData(filteredSecondFloorData);
            setReservedThirdFloorData(filteredThirdFloorData);
            setReservedTrainingRoomData(filteredTrainingRoomData);
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const fetchData = (floor) => {

    const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate
    };
  
    axios.post("http://localhost:5000/bookmyseat/user/bookedSeat", data)
      .then((response) => {
        console.log("Start date and end date sent successfully");
        console.log(response.data)
       
             const allData = response.data;
                console.log("Seat data:", allData);
                let filteredData = null;
    
                switch (floor) {
                    case "ground-floor":
                        filteredData = allData.filter(item => item.floorId === 1);
                        setGroundFloorData(filteredData);
                        break;
                    case "mezzanine-floor":
                        filteredData = allData.filter(item => item.floorId === 2);
                        setMezzanineFloorData(filteredData);
                        break;
                    case "first-floor":
                        filteredData = allData.filter(item => item.floorId === 3);
                        setFirstFloorData(filteredData);
                        break;
                    case "second-floor":
                        filteredData = allData.filter(item => item.floorId === 4);
                        setSecondFloorData(filteredData);
                        break;
                    case "third-floor":
                        filteredData = allData.filter(item => item.floorId === 5);
                        setThirdFloorData(filteredData);
                        break;
                    case "training-room":
                        filteredData = allData.filter(item => item.floorId === 6);
                        setTrainingRoomData(filteredData);
                        break;
                    default:
                        break;
                }
                
            if (filteredData && filteredData.length === 0) {
                setError("No data available for this floor.");
            }
            })
            .catch(error => {
                console.error('Error fetching floor data:', error);
                setError(error)
                toast.error(error);
            });
    };

    const openModal = () => {
        if (modal) {
            modal.show();
        }
    };

    const closeModal = () => {
        if (modal) {
            modal.hide();
        }
    };


    const handleSeatSelect = (seatNumber, floorId) => {
        setSelectedSeat(seatNumber);
        onSeatSelect(seatNumber, floorId);
        closeModal(); 
    };

    const fetchUserDetails = () => {
        axios.get("http://localhost:5000/bookmyseat/user/userProfile")
          .then(response => {
            console.log("profile",response.data.restrain)
            setusers(response.data.restrain)
            
            
          })
          .catch(error => {
            console.error('Error fetching user profile:', error);
          });
      };
    
      useEffect(() => {
        fetchUserDetails();
      }, []);
   

    const preferredSeats = () => {
        const formattedStartDate = new Date(startDate).toISOString();
        const formattedEndDate = new Date(endDate).toISOString();
    
        const floorIdMap = {
            "ground-floor": 1,
            "mezzanine-floor": 2,
            "first-floor": 3,
            "second-floor": 4,
            "third-floor": 5,
            "training-room": 6,
        };
        const selectedFloorId = floorIdMap[selectedFloor];
        
        axios.post("http://localhost:5000/bookmyseat/user/projectPrefrenced/floor/seat", {
            floorId: selectedFloorId,
            startDate: formattedStartDate,
            endDate: formattedEndDate
        })
        .then(response => {
            switch (selectedFloor) {
                case "ground-floor":
                    setPreferredSeatsDataGroundFloor(response.data.preferredSeats);
                    break;
                case "mezzanine-floor":
                    setPreferredSeatsDataMezzanineFloor(response.data.preferredSeats);
                    console.log('av',response.data.preferredSeats)
                    break;
                case "first-floor":
                    setPreferredSeatsDataFirstFloor(response.data.preferredSeats);
                    break;
                case "second-floor":
                    setPreferredSeatsDataSecondFloor(response.data.preferredSeats);
                    break;
                case "third-floor":
                    setPreferredSeatsDataThirdFloor(response.data.preferredSeats);
                    break;
                case "training-room":
                    setPreferredSeatsDataTrainingRoom(response.data.preferredSeats);
                    break;
                default:
                    break;
            }
        })
        .catch(error => {
            console.error('Error Sending Preferred Seats data', error);
        });
    }

    const renderFloor = () => {
        switch (selectedFloor) {
            case "ground-floor":
                return <UserGroundFloor groundFloorData={groundFloorData} selectedSeat={selectedSeat} onSeatSelect={(seatNumber) => handleSeatSelect(seatNumber, 1)} preferredSeatsDataGroundFloor={preferredSeatsDataGroundFloor} reserveData={reservedGroundFloordata}/>;
            case "mezzanine-floor":
                return <UserMezzanineFloor mezzanineFloorData={mezzanineFloorData} selectedSeat={selectedSeat} onSeatSelect={(seatNumber) => handleSeatSelect(seatNumber, 2)} preferredSeatsDataMezzanineFloor={preferredSeatsDataMezzanineFloor} reserveData={reservedMezzanineFloorData}/>;
            case "first-floor":
                return <UserFirstFloor firstFloorData={firstFloorData} selectedSeat={selectedSeat} onSeatSelect={(seatNumber) => handleSeatSelect(seatNumber, 3)}  preferredSeatsDataFirstFloor={preferredSeatsDataFirstFloor} reserveData={reservedFirstFloorData} />;
            case "training-room":
                return <UserTrainingRoom trainingRoomData={trainingRoomData} selectedSeat={selectedSeat} onSeatSelect={(seatNumber) => handleSeatSelect(seatNumber, 6)} preferredSeatsDataSecondFloor={preferredSeatsDataSecondFloor} reserveData={reservedSecondFloorData}/>;
            case "second-floor":
                return <UserSecondFloor secondFloorData={secondFloorData} selectedSeat={selectedSeat} onSeatSelect={(seatNumber) => handleSeatSelect(seatNumber, 4)} preferredSeatsDataThirdFloor={preferredSeatsDataThirdFloor} reserveData={reservedThirdFloorData}/>;
            case "third-floor":
                return <UserThirdFloor thirdFloorData={thirdFloorData} selectedSeat={selectedSeat} onSeatSelect={(seatNumber) => handleSeatSelect(seatNumber, 5)} preferredSeatsDataTrainingRoom={preferredSeatsDataTrainingRoom} reserveData={reservedTrainingRoomData}/>;
            default:
                return null;
        }
    };

    const isUserRestricted = (floorId) => {
        if (users && users.restrainId === floorId) {
            return true; 
        }
        return false; 
    };



    return (
        <div>
            <h5>Floor Map Name</h5>
            {selectedFloor && <p className="selected-floor">Selected Floor: {selectedFloor} {selectedSeat ? `- Selected Seat: ${selectedSeat}` : ''}</p>}
            <div className="floorCard">
                <a href="/editSeat/ground-floor" className="floorName">Ground Floor</a>
                <Button variant="contained" onClick={() => { setSelectedFloor("ground-floor"); openModal(); preferredSeats()}} disabled={isUserRestricted(2)}>Book seat</Button>
          
            </div>
            <div className="floorCard">
                <a href="/editSeat/mezzanine-floor" className="floorName">Mezzanine Floor</a>
                <Button variant="contained" onClick={() => { setSelectedFloor("mezzanine-floor"); openModal(); preferredSeats() }} disabled={isUserRestricted(2)}>Book seat</Button>
            </div>
            <div className="floorCard">
                <a className="floorName">First Floor</a>
                <Button variant="contained" onClick={() => { setSelectedFloor("first-floor"); openModal(); preferredSeats()}} disabled={isUserRestricted(3)}>Book seat</Button>
            </div>
            <div className="floorCard">
                <a href="/editSeat/mezzanine-floor" className="floorName" onClick={() => { setSelectedFloor("second-floor"); openModal(); }} disabled={isUserRestricted(4)}>Second Floor</a>
                <Button variant="contained" onClick={() => { setSelectedFloor("second-floor"); openModal(); preferredSeats()}}>Book seat</Button>
            </div>
            <div className="floorCard">
                <a className="floorName">Third Floor</a>
                <Button variant="contained" onClick={() => { setSelectedFloor("third-floor"); openModal(); preferredSeats()}} disabled={isUserRestricted(5)}>BOOK SEAT</Button>
            </div>
            <div className="floorCard">
                <a className="floorName">Training Room</a>
                <Button variant="contained" onClick={() => { setSelectedFloor("training-room"); openModal(); preferredSeats()}} disabled={isUserRestricted(6)}>BOOK SEAT</Button>
            </div>
            
            <div className="modal fade" id="myModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{selectedFloor}</h5>
                            <UserSeatLegend/>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                        </div>
                        <div className="modal-body">
                            {renderFloor()}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
            position="top-center"
            autoClose={1000}
            hideProgressBar={true}
            style={{
              width: '300px',
              borderRadius: '8px',
            }}
 
          />
        </div>
    );
};

export default SeatsMain;

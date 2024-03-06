import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import "../styles/newBooking.css";
import SeatsMain from "../../UserFloors/components/seatsMain";
import axios from "../../../Services/axiosToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';

const steps = ["Select Basic Info", "Book a seat", "Additional Info"];

export default function NewBooking() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [requestType, setRequestType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [lunch, setLunch] = useState("");
  const [teaCoffee, setTeaCoffee] = useState("");
  const [teaCoffeeOption, setTeaCoffeeOption] = useState("");
  const [parking, setParking] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);

    setTimeout(() => {
      setModalOpen(false);
    }, 2000);
  };

  const fetchShifts = () => {
    axios
      .get("http://localhost:5000/bookmyseat/user/getAllShifts")
      .then((response) => {
        setShifts(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  
  

  const isSeatBooked = (seatId, startDate, endDate) => {
    return bookings.some((booking) => {
      return (
        booking.seatId === seatId &&
        ((startDate >= booking.startDate && startDate <= booking.endDate) ||
          (endDate >= booking.startDate && endDate <= booking.endDate))
      );
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "lunch") {
      setLunch(value);
    } else if (name === "teaCoffee") {
      setTeaCoffee(value);
    } else if (name === "teaCoffeeOption") {
      setTeaCoffeeOption(value);
    } else if (name === "parking") {
      setParking(value);
    } else if (name === "vehicleType") {
      setVehicleType(value);
    }
  };

  const handleNext = () => {
    switch (activeStep) {
      case 0:
        if (!requestType || !startDate || !endDate || !selectedShift) {
          toast.error("Please fill in all the details.");
          return;
        }
        // sendStartDateAndEndDate(startDate, endDate);
        break;
      case 1:
        if (!selectedSeat || !selectedFloor) {
          toast.error("Please select a seat.");
          return;
        }
        if (isSeatBooked(selectedSeat, startDate, endDate)) {
          toast.error("Booking already exists for this date range.");
          return;
        }
        break;
      case 2:
        if (
          !lunch ||
          !teaCoffee ||
          (teaCoffee === "yes" && !teaCoffeeOption) ||
          (parking === "yes" && !vehicleType)
        ) {
          alert("Please fill in all the details.");
          return;
        }
        if (teaCoffee === "yes" && !teaCoffeeOption) {
          alert("Please select tea or coffee.");
          return;
        }
        if (parking === "yes" && !vehicleType) {
          alert("Please select vehicle type for parking.");

          return;
        }
        if (activeStep == steps.length - 1) {
          handleSubmit();
          return;
        }
        break;
      default:
        break;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleRequestTypeChange = (event) => {
    setRequestType(event.target.value);
  };

  const handleStartDateChange = (event) => {
    const newStartDate = event.target.value;
    const today = new Date().toISOString().split("T")[0];
    if (newStartDate < today) {
      openModal("Please select a future date.");
      return;
    }
    setStartDate(newStartDate);
    switch (requestType) {
      case "daily":
        setEndDate(newStartDate);
        break;
      case "weekly":
        setEndDate(getEndDateForWeek(newStartDate));
        break;
      case "monthly":
        setEndDate(getEndDateForMonth(newStartDate));
        break;
      default:
        setEndDate(null);
    }
  };

  const getEndDateForWeek = (startDate) => {
    return new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
  };

  const getEndDateForMonth = (startDate) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split("T")[0];
  };

  const handleSeatSelect = (seatNumber, floorId) => {
    setSelectedSeat(seatNumber);
    setSelectedFloor(floorId);
  };

  const handleShiftSelect = (event) => {
    setSelectedShift(event.target.value);
  };


  const handleSubmit = () => {
    const formData = {
      bookingType: requestType.toUpperCase(),
      additionalDesktop: true,
      startDate: startDate,
      endDate: endDate,
      lunch: lunch === "yes",
      parkingOpted: parking === "yes",
      parkingType: parking === "yes" ? vehicleType.toUpperCase() : null,
      teaCoffee: teaCoffee === "yes",
      teaCoffeeType: teaCoffee === "yes" ? teaCoffeeOption.toUpperCase() : null,
      seatNumber: selectedSeat,
      floorId: selectedFloor,
      shiftId: selectedShift,
    };
    
    axios
      .post("http://localhost:5000/bookmyseat/user/bookseat", formData)
      .then((response) => {
        if (response.status === 200) {
          console.log("Seat booked successfully");
          toast.success("Seat Booked Successfully");
          navigate("/bookmyseat/user/userdashboard");

        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        if (error.response && error.response.status === 409) {
          alert("You have already booked for this date range.");
        } else {
          alert(

            "An error occurred while processing your request. Please try again later."
          );
        }
      });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <form>
            <ToastContainer
              position="top-center"
              autoClose={1000}
              hideProgressBar={true}
              style={{
                width: "300px",
                borderRadius: "8px",
              }}
            />
            <label htmlFor="Location">Location:</label>
            <select className="form-select" aria-label="Default select example">
              <option defaultValue>Bengaluru</option>
            </select>
            <br />
            <label htmlFor="Shift">Type of request:</label>
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={handleRequestTypeChange}
            >
              <option defaultValue>Select duration</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            {(requestType === "daily" ||
              requestType === "weekly" ||
              requestType === "monthly") && (
              <>
                <br />
                <label htmlFor="DateRange">Date Range:</label> <br />
                <TextField
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
                <TextField type="date" value={endDate} disabled />
              </>
            )}
            <br/>
            <label htmlFor="Shift">Shift:</label>
            <select
  className="form-select"
  aria-label="Default select example"
  onChange={handleShiftSelect} // handleShiftSelect is assigned as the onChange event handler
>
  <option defaultValue>Select Shift</option>
  {shifts.map((shift) => (
    <option key={shift.shiftId} value={shift.shiftId}>
      {shift.startTime + "-" + shift.endTime}
    </option>
  ))}
</select>
          </form>
        );
      case 1:
        return (
          <div>
            <SeatsMain
              onSeatSelect={handleSeatSelect}
              startDate={startDate}
              endDate={endDate}
              setBookings={setBookings}
            />
          </div>
        );
      case 2:
        return (
          <form className="bookingForm">
            <div className="formGroup">
              <label>Do you want to have lunch?</label>
              <div className="radioGroup">
                <input
                  type="radio"
                  name="lunch"
                  value="yes"
                  id="lunchYes"
                  onChange={handleInputChange}
                />
                <label htmlFor="lunchYes">Yes</label>
                <input
                  type="radio"
                  name="lunch"
                  value="no"
                  id="lunchNo"
                  onChange={handleInputChange}
                />
                <label htmlFor="lunchNo">No</label>
              </div>
            </div>

            <div className="formGroup">
              <label>Do you want to have Tea/Coffee?</label>
              <div className="radioGroup">
                <input
                  type="radio"
                  name="teaCoffee"
                  value="yes"
                  id="teaCoffeeYes"
                  onChange={handleInputChange}
                />
                <label htmlFor="teaCoffeeYes">Yes</label>
                <input
                  type="radio"
                  name="teaCoffee"
                  value="no"
                  id="teaCoffeeNo"
                  onChange={handleInputChange}
                />
                <label htmlFor="teaCoffeeNo">No</label>
              </div>
              {teaCoffee === "yes" && (
                <div className="subGroup">
                  <label>Which one would you like:</label>
                  <div className="radioGroup">
                    <input
                      type="radio"
                      name="teaCoffeeOption"
                      value="tea"
                      id="tea"
                      onChange={handleInputChange}
                    />
                    <label htmlFor="tea">Tea</label>
                    <input
                      type="radio"
                      name="teaCoffeeOption"
                      value="coffee"
                      id="coffee"
                      onChange={handleInputChange}
                    />
                    <label htmlFor="coffee">Coffee</label>
                  </div>
                </div>
              )}
            </div>

            <div className="formGroup">
              <label>Do you need parking?</label>
              <div className="radioGroup">
                <input
                  type="radio"
                  name="parking"
                  value="yes"
                  id="parkingYes"
                  onChange={handleInputChange}
                />
                <label htmlFor="parkingYes">Yes</label>
                <input
                  type="radio"
                  name="parking"
                  value="no"
                  id="parkingNo"
                  onChange={handleInputChange}
                />
                <label htmlFor="parkingNo">No</label>
              </div>
              {parking === "yes" && (
                <div className="subGroup">
                  <label>Select vehicle type:</label>
                  <div className="radioGroup">
                    <input
                      type="radio"
                      name="vehicleType"
                      value="TWO_wheeler"
                      id="vehicleType2Wheeler"
                      onChange={handleInputChange}
                    />
                    <label htmlFor="vehicleType2Wheeler">2-wheeler</label>
                    <input
                      type="radio"
                      name="vehicleType"
                      value="FOUR_wheeler"
                      id="vehicleType4Wheeler"
                      onChange={handleInputChange}
                    />
                    <label htmlFor="vehicleType4Wheeler">4-wheeler</label>
                  </div>
                </div>
              )}
            </div>
          </form>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <div className="NewbookingMainContainer">
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <React.Fragment>
        <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>{getStepContent(activeStep)}</Box>
      </React.Fragment>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={{
          content: {
            width: '300px',
            margin: 'auto',
            textAlign: 'center',
            border:'2px solid black',
          },
        }}
      >
        <b>{modalContent}</b>
      </Modal>
    </div>
  );
}
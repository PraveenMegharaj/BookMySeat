import React, { useEffect, useState } from "react";
import { GiSofa } from "react-icons/gi";
import "../styles/dashBoard.css";
import { LuParkingCircle } from "react-icons/lu";
import { MdLunchDining } from "react-icons/md";
import { LuMonitor } from "react-icons/lu";
import { PieChart } from "@mui/x-charts/PieChart";
import DashBoardService from "../../../Services/DashBoard";
import { FiCoffee } from "react-icons/fi";
import { Modal, Button } from "react-bootstrap";
import { updateLoginStatus } from "../../auth";

const DashBoard = () => {
  const [selectedCard, setSelectedCard] = useState("seats");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    DashBoardService.getUsers()
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(" Please try again." + error);
        setShowModal(true);
      });
  }, []);

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };
  const getCardData = () => {
    if (error) {
      return [];
    }

    switch (selectedCard) {
      case "seats":
        return users.map((user) => ({
          id: user.id,
          data: [
            { value: user.seatsBooked, label: "Seats Booked" },
            { value: 599, label: "Seats Available" },
          ],
        }));
      case "parking":
        return users.map((user) => ({
          id: user.id,
          data: [
            {
              value: user.totalTwoWheelerParkingBooked,
              label: "2-Wheeler Parking Booked",
            },
            {
              value: user.totalFourWheelerParkingBooked,
              label: "4-Wheeler Parking Booked",
            },
          ],
        }));
      case "lunch":
        return users.map((user) => ({
          id: user.id,
          data: [
            { value: user.totalLunchBooked, label: "Opted for Lunch" },
            {
              value: user.seatsBooked - user.totalLunchBooked,
              label: "Not Opted for Lunch",
            },
          ],
        }));
      case "monitor":
        return users.map((user) => ({
          id: user.id,
          data: [
            { value: user.totalDesktopBooked, label: "Monitors Booked" },
            { value: 10, label: "Monitors Available" },
          ],
        }));
      case "tea":
        return users.map((user) => ({
          id: user.id,
          data: [
            { value: user.totalTeaBooked, label: "Tea Booked" },
            { value: user.totalCoffeeBooked, label: "Coffee Booked" },
          ],
        }));
      default:
        return [];
    }
  };

  const handleCardClick = (cardType) => {
    setSelectedCard(cardType);
  };
  const handleLoginAgain = () => {
    updateLoginStatus(false);
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("token");
    window.location.replace("/bookmyseat/login");
  };

  return (
    <div className="main-dashboard">
      <div className="dashboard-main-contiainer">
        {users.reduce((acc, user) => acc + user.seatsBooked, 0) === 0 && (
          <p
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              color: "red",
              textAlign: "center",
            }}
          >
            There are no bookings for today!!!!
          </p>
        )}
        <div className="seat-card-column">
          <div className="seat-card-row-1">
            <div
              className={`seat-card ${
                selectedCard === "seats" ? "selected" : ""
              }`}
              onClick={() => handleCardClick("seats")}
            >
              <div className="seats-header">
                <h6>Seats</h6>
                <h4>
                  {users.reduce((acc, user) => acc + user.seatsBooked, 0)}
                </h4>
              </div>
              <div
                className="seat-card-icon"
                style={{ backgroundColor: "black" }}
              >
                <GiSofa color="white" style={{ fontSize: "25px" }} />
              </div>

              <div className="card-details">
                <hr />
                <p>
                  {" "}
                  Seats Occupied:
                  {users.reduce((acc, user) => acc + user.seatsBooked, 0)}
                </p>
                <p> Seats Available:599</p>
              </div>
            </div>

            <div
              className={`seat-card ${
                selectedCard === "parking" ? "selected" : ""
              }`}
              onClick={() => handleCardClick("parking")}
            >
              <div className="parking-header">
                <h6>Parking</h6>
                <h4>
                  {users.reduce(
                    (acc, user) =>
                      acc +
                      (user.totalTwoWheelerParkingBooked +
                        user.totalFourWheelerParkingBooked),
                    0
                  )}
                </h4>
              </div>
              <div
                className="parking-card-icon"
                style={{ backgroundColor: "#2696F2" }}
              >
                <LuParkingCircle color="white" style={{ fontSize: "25px" }} />
              </div>
              <div className="card-details">
                <hr />
                <p>
                  Total Parking:
                  {users.reduce(
                    (acc, user) => acc + user.totalParkingBooked,
                    0
                  )}
                </p>
                <p>
                  2-Wheeler Parking:
                  {users.reduce(
                    (acc, user) => acc + user.totalTwoWheelerParkingBooked,
                    0
                  )}
                </p>
                <p>
                  4-Wheeler Parking:
                  {users.reduce(
                    (acc, user) => acc + user.totalFourWheelerParkingBooked,
                    0
                  )}
                </p>
              </div>
            </div>
            <div
              className={`seat-card ${
                selectedCard === "lunch" ? "selected" : ""
              }`}
              onClick={() => handleCardClick("lunch")}
            >
              <div className="lunch-header">
                <h6>Lunch</h6>
                <h4>
                  {users.reduce((acc, user) => acc + user.totalLunchBooked, 0)}
                </h4>
              </div>
              <div
                className="lunch-card-icon"
                style={{ backgroundColor: "#ECB54F" }}
              >
                <MdLunchDining color="white" style={{ fontSize: "25px" }} />
              </div>
              <div className="card-details">
                <hr />
                <p>
                  {" "}
                  Opted for Lunch:
                  {users.reduce((acc, user) => acc + user.totalLunchBooked, 0)}
                </p>
                <p>
                  Not opted for lunch:
                  {users.reduce(
                    (acc, user) =>
                      acc + (user.seatsBooked - user.totalLunchBooked),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="seat-card-row-2">
            <div
              className={`seat-card-2 ${
                selectedCard === "monitor" ? "selected" : ""
              }`}
              onClick={() => handleCardClick("monitor")}
            >
              <div className="monitor-header">
                <h6>Monitor</h6>
                <h4>
                  {users.reduce(
                    (acc, user) => acc + user.totalDesktopBooked,
                    0
                  )}
                </h4>
              </div>
              <div
                className="monitor-card-icon"
                style={{ backgroundColor: "#F4613D" }}
              >
                <LuMonitor color="white" style={{ fontSize: "25px" }} />
              </div>
              <div className="card-details">
                <hr />
                <p>
                  Monitors opted:
                  {users.reduce(
                    (acc, user) => acc + user.totalDesktopBooked,
                    0
                  )}
                </p>
                <p>Monitors Available:10</p>
              </div>
            </div>
            <div
              className={`seat-card-2 ${
                selectedCard === "tea" ? "selected" : ""
              }`}
              onClick={() => handleCardClick("tea")}
            >
              <div className="lunch-header">
                <h6>Tea/Coffee</h6>
                <h4>
                  {users.reduce(
                    (acc, user) =>
                      acc + (user.totalCoffeeBooked + user.totalTeaBooked),
                    0
                  )}
                </h4>
              </div>
              <div
                className="tea-card-icon"
                style={{ backgroundColor: "purple" }}
              >
                <FiCoffee color="white" style={{ fontSize: "25px" }} />
              </div>
              <div className="card-details">
                <hr />
                <p>
                  {" "}
                  Opted for Tea:
                  {users.reduce((acc, user) => acc + user.totalTeaBooked, 0)}
                </p>
                <p>
                  {" "}
                  Opted for Coffe:
                  {users.reduce((acc, user) => acc + user.totalCoffeeBooked, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="piechart">
          <PieChart
            series={[
              {
                data: getCardData()[0]?.data || [],
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
                label: {
                  position: "outside", // Adjust the position as needed ('insideEnd', 'outsideEnd', 'inside', 'outside', etc.)
                },
              },
            ]}
            height={250}
          />
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Something went wrong !!</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLoginAgain}>
            Login Again
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DashBoard;

import React, { useState } from "react";
import { Tabs, Tab, Container, Box } from "@mui/material";
import "../styles/tablayout.css";
import RestrictSeat from "./restrictionSeat";
import RestrainSeat from "./restrainSeats";

const RestrictionTab = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container className="tab-container">
      <Box>
        <Tabs value={value} onChange={handleChange} variant="fullWidth">
          <Tab label="Reserved Seats" />
          <Tab label="Restrain Seats" />
        </Tabs>
      </Box>
      <div className="tab-content">
        <div className={value === 0 ? "content active-content" : "content"}>
          <RestrictSeat/>
        </div>
        <div className={value === 1 ? "content active-content" : "content"}>
          <RestrainSeat/>
        </div>
      </div>
    </Container>
  );
};

export default RestrictionTab;

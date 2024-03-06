import React,{ useState } from "react";
import "../styles/restrictSeatLegend.css"
import Button from '@mui/material/Button';

const RestrictSeatLegend = ({handleUserFetch,reserveSeat}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };
  // const handleBlur = () => {
  //   handleUserFetch(searchQuery);
  // }  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleUserFetch(searchQuery); 
    }
  };
  const handleSubmission = () => {
    reserveSeat()
    setSearchQuery("")
  }
  const legendItems = [
    { label: 'Reserved Seat', color: '#D1D3CA' },
    { label: 'Selected Seat', color: 'orange' },
    { label: 'Available Seat', color: '#B3FF60' },
    { label: 'Booked Seats', color: '#FF5959' },
  ];
  return(
    <div className='rlegend-container mb-4'>
        <div class="input-group rlegend-search">
          <input type="text" class="form-control border-primary" placeholder="Search UserID.." 
          value={searchQuery} onChange={handleChange} /* onBlur={handleBlur} */  onKeyPress={handleKeyPress}/>
        </div>
      <div className="rlegend-header-container">
        {legendItems.map((item, index) => (
          <div className='rlegend-header'key={index}>
            <div className='rlegend-seat' style={{backgroundColor : item.color}}></div>
            <div key={index} className='legend-item'>{item.label}</div>
          </div>
        ))}
        </div>
        <Button variant="contained"  color="warning" onClick={handleSubmission} >Reserve Seat</Button>
  </div>
  )
}

export default RestrictSeatLegend
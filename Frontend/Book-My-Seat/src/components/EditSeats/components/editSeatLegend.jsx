// import { useState } from "react";
import "../styles/editSeatLegend.css"
// import DatePicker from "react-datepicker";

const EditSeatLegend = () => {
/*   const [selectedDate, setSelectedDate] = useState(new Date()); 
  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log(date)
  }; */
  const legendItems = [
    { label: 'Selected Seat', color: 'orange' },
    { label: 'Available Seats', color: '#B3FF60' },
    { label: 'Booked Seats', color: '#FF5959' },
  ];
  return(
    <div className='legend-container'>
      {legendItems.map((item, index) => (
        <div className="legend-header"key={index}>
          <div className='legend-seat' style={{backgroundColor : item.color}}></div>
          <div className='legend-item'>{item.label}</div>
        </div>
      ))}
     {/*  <div className="legend-calender">
        <span>Select Date :</span>
        <DatePicker className="datepicker" selected={selectedDate} onChange={handleDateChange}/>
      </div> */}
    </div>
  )
}

export default EditSeatLegend
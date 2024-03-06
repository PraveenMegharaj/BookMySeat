import "../styles/userSeatLegend.css"
const UserSeatLegend = () => {
  const legendItems = [
    { label: 'Reserved Seat', color: '#D1D3CA' },
    { label: 'Selected Seat', color: 'orange' },
    { label: 'Available Seat', color: '#B3FF60' },
    { label: 'Booked Seats', color: '#FF5959' },
    { label: 'Teamate Seats', color: 'lightblue' },
  ];
  return(
    <div className="userSeatLegend-container">
      {legendItems.map((item, index) => (
        <div className='userSeatLegend-header'key={index}>
          <div className='userSeatLegend-seat' style={{backgroundColor : item.color}}></div>
          <div key={index} className='userSeatLegend-item'>{item.label}</div>        </div>
      ))}
    </div>
  )
}
export default UserSeatLegend
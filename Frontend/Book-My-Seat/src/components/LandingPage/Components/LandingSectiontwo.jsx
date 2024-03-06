import React, { useState, useEffect } from 'react';
import "../styles/LandingSectionTwo.css";
import { useNavigate } from 'react-router';

function LandingSectionTwo() {
  const navigate = useNavigate();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageSources = [
    '/assets/images/workspace4.jpg',
    '/assets/images/workspace6.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageSources.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [imageSources.length]);

  return (
    <div className='sectiononemain'>
      <div className="BookSeatCard">
        <div className="sectiononebookseatcard">
          <div className="contentBeforeButton">
            <h2 className='sectiontwotitle sectiontwoh2'>Valtech</h2>
            <p className='sectiontwotitle sectiontwoparagraph'>Explore perfection at Valiant Innovations with our dedicated commitment, offering cutting-edge solutions and exceptional experiences.</p>
          </div>
          
          <img
            src={imageSources[currentImageIndex]}
            alt="Book A Seat"
            className="cardImage"
          />
          
          <button className="bookSeatButton" onClick={()=>navigate("/bookmyseat/login")}>
            Explore Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingSectionTwo;

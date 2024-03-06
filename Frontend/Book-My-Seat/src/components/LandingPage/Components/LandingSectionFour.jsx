import React, { useState, useEffect } from 'react';
import '../styles/Landingsectionfour.css';
import { BsQrCode } from "react-icons/bs";
import { IoFastFood } from "react-icons/io5";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { LuLassoSelect } from "react-icons/lu";

const LandingSectionFour = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const cardData = [
    { title: 'Seat Availability Check',  icon:<MdAirlineSeatReclineNormal />  },
    { title: 'Seat Selection',  icon: <LuLassoSelect />  },
    { title: 'Opt for Food',  icon: <IoFastFood />  },
    { title: 'QR Code Confirmation',  icon: <BsQrCode /> },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cardData.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [cardData.length]);

  return (
    <div className='sectionfourMainContainer'>
      <div><h1 className='sectionfourcardtitle'>Seat Booking</h1></div>
      <div className="sectionfourcardContainer">
      {cardData.map((card, index) => (
        <div
          key={index}
          className={`sectionfourcard ${index === currentCardIndex ? 'active' : ''}`}
        >
          <h5>{card.title}</h5>
          <div className='sectionfouricon'>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default LandingSectionFour;

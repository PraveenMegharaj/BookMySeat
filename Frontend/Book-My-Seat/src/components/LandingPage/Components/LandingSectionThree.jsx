import React, { useState, useEffect } from 'react';
import "../styles/LandingSectionThree.css";
import Logo from '../../ValtechLogoComponent/logo';
import LandingSectionThreeSubcomp from './LandingSectionThreeSubcomp';

function LandingSectionThree() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const cardData = [
    { imageSrc: '/assets/images/dontwaste1.jpg', title: 'Card 1' },
    { imageSrc: '/assets/images/Dontwaste2.jpg', title: 'Card 2' },
    { imageSrc: '/assets/images/dontwaste4.jpg', title: 'Card 2' },
    { imageSrc: '/assets/images/dontwaste5.jpg', title: 'Card 2' },
    
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex(prevIndex => (prevIndex + 1) % cardData.length);
    }, 5000);

 
    return () => clearInterval(interval);
  }, [cardData.length]); 

  return (
    <div className='Thirdmaincontainer'>
      <div className='thirdlogowrapper'>
      <Logo/>
      </div>
      <div className="ThirdCardContainer">
        
        <div className="Card">
          {cardData[currentCardIndex] && (
            <img
              src={cardData[currentCardIndex].imageSrc}
              alt={cardData[currentCardIndex].title}
              className="CardImage"
            />
          )}
        </div>
          <div className='cardcontent'><LandingSectionThreeSubcomp/></div>
    </div>
    </div>
  );
}

export default LandingSectionThree;

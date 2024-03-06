// LandingSectionFive component

import React from 'react';
import "../styles/LandingSectionFive.css";
import LandingSectionOne from './LandingSectionOne';

function LandingSectionFive() {
  return (
    <div className='landingFivemajorcontainer'>
      <div>
          <h2 className='landingSectionFiveCardTitle maincontainertitle'>Our Cartography & Motto</h2>
        </div>
      <div className='landingFivemaincontainer'>
      <div className='landingSectionFivecard'>
        
        <div className='landingsectionfivecontent'>
        <h2 className='landingSectionFiveCardTitle'>Experience Excellence with Valtech</h2>
        <p className='cardText'>Discover a world of innovation and creativity with Valtech. Our commitment to excellence sets us apart, offering cutting-edge solutions and exceptional experiences. Join us on a journey of digital transformation!</p>
        
        </div>
      </div>

      <div className='landingSectionFivecard landingsectionFiveMap'>
        <LandingSectionOne/>
      </div>
    </div>
    </div>
  );
}

export default LandingSectionFive;

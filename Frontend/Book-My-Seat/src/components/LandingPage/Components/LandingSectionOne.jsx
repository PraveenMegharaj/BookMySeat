import React from 'react';
import Iframe from 'react-iframe';
import "../styles/LandingSectionOne.css";

function LandingSectionOne() {
  return (
    
    <div className='landingonemaincontainer'>
     
      <div className='mapcontainer'>
      
      <div className="mapcard">
                <Iframe
            url="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.873243436558!2d77.5947681148231!3d12.916119590889924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae166d6076e0e3%3A0x38c7d20de6c084b3!2sJayadeva%20Hospital!5e0!3m2!1sen!2sin!4v1664372694411!5m2!1sen!2sin"
            width="100%"
            height="300"
            frameBorder="0"
            style={{ border: '0' }}
            allowFullScreen
            title="Valtech Map"
          />

      </div>
    </div>
    </div>
  );
}

export default LandingSectionOne;

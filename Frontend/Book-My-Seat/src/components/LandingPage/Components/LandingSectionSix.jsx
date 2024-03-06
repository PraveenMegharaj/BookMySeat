
import React, { useEffect, useState } from 'react';
import "../styles/LandingSectionSix.css";

function LandingSectionSix() {
  const cities = [
    { name: 'Bangalore', image: '/assets/images/bangalore.jpg' },
    { name: 'Pune', image: '/assets/images/pune.jpg' },
    { name: 'Gurugram', image: '/assets/images/gurugram.jpg' },
    { name: 'Argentina', image: '/assets/images/argentina.jpg' },
    { name: 'Brazil', image: '/assets/images/brazil.jpg' },
    { name: 'UK', image: '/assets/images/uk.jpg' },
    { name: 'USA', image: '/assets/images/us.jpg' },
  ];
  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCityIndex((prevIndex) => (prevIndex + 1) % cities.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [cities.length]);

  return (
    <div className='landingsixmajorcontainer'>
        <div>
            <h2 className='landingsixlabel'>Valtech Branches</h2>
        </div>
      <div className='landingSixmaincontainer'>
      {cities.map((city, index) => (
        <div
          key={index}
          className={`LandingSectionsixcard ${index === currentCityIndex ? 'active' : ''}`}
          style={{
            transform: `translateX(${(index - currentCityIndex) * 30}%)`,
          }}
        >
          <img src={city.image} alt={city.name} className='cityImage' />
          <p className='cityname'>{city.name}</p>
        </div>
      ))}
      </div>
    </div>
  );
}

export default LandingSectionSix;

import React, { useState, useEffect } from 'react';



function LandingSectionThreeSubcomp() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const quotes = [
    "Every grain of rice on your plate is a gift. Don't waste the blessings you've been given.",
    "Waste not, want not. Appreciate the food on your plate, for it is a privilege denied to many.",
    "Your plate is a canvas of gratitude. Fill it with appreciation, not waste.",
    "Think twice before you toss. Every scrap of food carries a story of hard work and resources."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex(prevIndex => (prevIndex + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (

    <div className="ThirdCardsubContainer">
      <div className="thirdsubcomp">
        <p className="Quote" style={{ fontSize: '30px', color: '#721c24' }}>
          {quotes[currentQuoteIndex]}
        </p>
      </div>
    </div>
  );
}

export default LandingSectionThreeSubcomp;

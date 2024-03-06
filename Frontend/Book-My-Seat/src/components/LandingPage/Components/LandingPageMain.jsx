import React from 'react';
import LandingSectionTwo from './LandingSectiontwo';
import LandingSectionThree from './LandingSectionThree';
import '../styles/LandingPageMain.css';
import Header from '../../Header/components/header';
import LandingSectionFour from './LandingSectionFour';
import LandingSectionFive from './LandingSectionFive';
import LandingSectionsix from './LandingSectionSix';
import FooterComp from '../../Footer/components/FooterMain';

const LandingPageMain = () => {
  return (
    <>
     
      <div>
      <div className='landingpagemainContainer'>
        <div className='floatingheader'>
          <div className='headerlanding'>
            <Header/>
        </div>
        <div className='sectionWrapper'>
          <LandingSectionTwo />
        </div>
        </div>
        <div className='sectionWrapper'>
          <LandingSectionsix/>
        </div>
        <div className='sectionWrapper'>
          <LandingSectionFive/>
        </div>
        <div className='sectionWrapper'>
        <FooterComp/>
        </div>
        
      </div>
      </div>
    </>
  );
};

export default LandingPageMain;

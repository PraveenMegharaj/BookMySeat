import React from 'react';
import { FaInstagram, FaFacebook, FaLinkedin, FaGoogle, FaSpotify } from 'react-icons/fa';

import '../styles/FooterCompstyle.css';

function FooterComp() {
  return (
    <div className='FooterMainContainer'>
      <div className='FooterIcons'>
        <FaInstagram className='Icon' />
        <FaFacebook className='Icon' />
        <FaLinkedin className='Icon' />
        <FaGoogle className='Icon' />
        <FaSpotify className='Icon' />
      </div>
      <div className='FooterLinks'>
        <span className='FooterEachLink' >Privacy Statement</span>
        <span className='FooterEachLink' >Cookie Statement</span>
        <span className='FooterEachLink' >Accessibility</span>
      </div>
    </div>
  );
}

export default FooterComp;

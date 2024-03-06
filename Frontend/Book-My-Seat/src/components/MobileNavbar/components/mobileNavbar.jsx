import React from 'react';
import { MdAirlineSeatReclineExtra, MdOutlineDashboard } from "react-icons/md";
import { PiGitPullRequestBold } from "react-icons/pi";
import { BiNoEntry } from "react-icons/bi";
import { FaMapMarkerAlt, FaProjectDiagram, FaRegUserCircle, FaUserEdit } from "react-icons/fa";
import { DiOpenshift } from "react-icons/di";
import { LiaSignOutAltSolid } from "react-icons/lia";
import '../styles/mobileNavbar.css'
import { ImHistory } from 'react-icons/im';

const MobileNavbar = ({ setActiveComponent, activeComponent, closeMobileFilter }) => {
  const handleDashboardClick = () => {
    setActiveComponent('dashboard');
    closeMobileFilter(); // Close the mobile filter after clicking on a navigation item
  };
  
  const handleRequestsClick = () => {
    setActiveComponent('requests');
    closeMobileFilter();
  };

  const handleEditShiftClick = () => {
    setActiveComponent('editshift');
    closeMobileFilter();
  };

  const handleCreateUser = () => {
    setActiveComponent('createuser');
    closeMobileFilter();
  };
  
  const handleEditSeat = () => {
    setActiveComponent('editseat');
    closeMobileFilter();
  };

  const handleRestrictSeat = () => {
    setActiveComponent('restrictseat');
    closeMobileFilter();
  };

  const handleSignOut = () => {
    setActiveComponent('signout');
    closeMobileFilter();
  };
  const handleLocation = () => {
    setActiveComponent('location');
    closeMobileFilter();
  };
  const handleProject = () => {
    setActiveComponent('project');
    closeMobileFilter();
  };
  const handleReportClick = () => {
    setActiveComponent('report');
    closeMobileFilter();
  };

  const handleManageClick = () => {
    setActiveComponent('manage');
    closeMobileFilter();
  };
  const handleProfileClick = () => {
    setActiveComponent('userprofile');
    closeMobileFilter();
  };
  return (
    <div className='navbar-container-1'>
      <div className='navbar-sections-1'>
      <button className="close-button" id="cross" onClick={closeMobileFilter}>
        &times;
        </button>
        <div className='navigation-buttons-1'>
        <div className={`Admin-navbarprofile ${activeComponent === 'userprofile' ? 'active' : ''}`} onClick={handleProfileClick}>
          <FaRegUserCircle size={'40%'} onClick={handleProfileClick} />
        </div>

          <div className={`nav-btn ${activeComponent === 'dashboard' ? 'active' : ''}`} onClick={handleDashboardClick}>
            <MdOutlineDashboard color='white' style={{fontSize:'25px'}}/>
            <span className='navButton'>Dashboard</span>
          </div>
 
          <div className={`nav-btn ${activeComponent === 'requests' ? 'active' : ''}`} onClick={handleRequestsClick}>
            <PiGitPullRequestBold color='white' style={{fontSize:'25px'}}/>
            <span className='navButton' >Requests</span>
          </div> 

          <div className={`nav-btn ${activeComponent === 'createuser' ? 'active' : ''}`} onClick={handleCreateUser}>
            <FaUserEdit color='white' style={{fontSize:'25px'}} />
            <span className='navButton'>Create User</span>
          </div>
 
          <div className={`nav-btn ${activeComponent === 'editseat' ? 'active' : ''}`} onClick={handleEditSeat}>
            <MdAirlineSeatReclineExtra  color='white' style={{fontSize:'25px'}} />
            <span className='navButton'>Edit Seats</span>
          </div>

          <div className={`nav-btn ${activeComponent === 'restrictseat' ? 'active' : ''}`} onClick={handleRestrictSeat}>
            <BiNoEntry color='white' style={{fontSize:'25px'}}/>
            <span className='navButton'>Restrict Seats</span>
          </div>

          <div className={`nav-btn ${activeComponent === 'report' ? 'active' : ''}`}  onClick={handleReportClick}>
            <ImHistory color='white' style={{fontSize:'25px'}}/>
            <span className='navButton'>Report</span>
        </div>
 
          <div className={`nav-btn ${activeComponent === 'editshift' ? 'active' : ''}`} onClick={handleEditShiftClick}>
            <DiOpenshift color='white' style={{fontSize:'25px'}}/>
            <span className='navButton'>Shift Timing</span>
          </div>

          <div className={`nav-btn ${activeComponent === 'manage' ? 'active' : ''}`} onClick={handleManageClick}>
            <FaProjectDiagram color='white' style={{fontSize:'25px'}}/>
 
            <span className='navButton'>Manage</span>
          </div>

          <div className={`nav-btn ${activeComponent === 'signout' ? 'active' : ''}`} onClick={handleSignOut}>
            <LiaSignOutAltSolid color='white' style={{fontSize:'25px'}}/>
            <a className='navButton' href='/signout'>Sign Out</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNavbar;

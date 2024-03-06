import React from 'react';
import { MdAirlineSeatReclineExtra, MdOutlineDashboard, MdWork } from "react-icons/md";
import { PiGitPullRequestBold } from "react-icons/pi";
import { BiNoEntry } from "react-icons/bi";
import { FaProjectDiagram, FaRegUserCircle, FaUserEdit } from "react-icons/fa";
import { DiOpenshift } from "react-icons/di";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { ImHistory } from "react-icons/im";
import '../styles/navBar.css'
 
 
 
const NavBar = ({ setActiveComponent, activeComponent }) => {
 
  const handleDashboardClick = () => {
    setActiveComponent('dashboard');
  };
 
  const handleRequestsClick = () => {
    setActiveComponent('requests');
  };
 

  const handleEditShiftClick = () => {
    setActiveComponent('editshift');
  };
  const handleCreateUser=() => {
    setActiveComponent('createuser')
  }
 
  const handleEditSeat = () => {
    setActiveComponent('editseat');
  };
  const handleRestrictSeat = () => {
    setActiveComponent('restrictseat');
  };

  const handleSignOut = () => {
    setActiveComponent('signout');
  };
  const handleReportClick = () => {
    setActiveComponent('report');
  };
  const handleManageClick = () => {
    setActiveComponent('manage');
  };
  const handleProfileClick = () => {
    setActiveComponent('userprofile');
  };

 
  return (
    <div className='navbar-container'>
      <div className='navbar-sections'>
        <div className={`Admin-navbarprofile ${activeComponent === 'userprofile' ? 'active' : ''}`} onClick={handleProfileClick}>
          <FaRegUserCircle size={'35%'} onClick={handleProfileClick} />
        </div>
        <div className='navigation-buttons'>
          <div className={`nav-btn ${activeComponent === 'dashboard' ? 'active' : ''}`} onClick={handleDashboardClick}>
            <MdOutlineDashboard color='white' style={{fontSize:'25px'}}/>
            <span className='navButton'>Dashboard</span>
          </div>
 
 
          <div className={`nav-btn ${activeComponent === 'requests' ? 'active' : ''}`} onClick={handleRequestsClick}>
            <PiGitPullRequestBold color='white' style={{fontSize:'25px'}}/>
            <span className='navButton' >Requests</span>
          </div> 


          <div className={`nav-btn ${`nav-btn ${activeComponent === 'createuser' ? 'active' : ''}`}`} onClick={handleCreateUser}>
            <FaUserEdit color='white' style={{fontSize:'25px'}} />
            <span className='navButton'>Create User</span>
          </div>
 

          <div className={`nav-btn ${`nav-btn ${activeComponent === 'restrictseat' ? 'active' : ''}`}`}  onClick={handleRestrictSeat}>
            <BiNoEntry color='white' style={{fontSize:'25px'}}/>
            <span className='navButton'>Seat Restiction</span>
          </div>
 
          <div className={`nav-btn ${`nav-btn ${activeComponent === 'editseat' ? 'active' : ''}`}`} onClick={handleEditSeat}>
            <MdAirlineSeatReclineExtra  color='white' style={{fontSize:'25px'}} />
            <span className='navButton'>Modify Seats</span>
          </div>
 
 
          <div className={`nav-btn ${activeComponent === 'report' ? 'active' : ''}`}  onClick={handleReportClick}>
            <ImHistory color='white' style={{fontSize:'25px'}}/>
            <span className='navButton'>Report</span>
        </div>
 
 
           <div className={`nav-btn ${activeComponent === 'editshift' ? 'active' : ''}`}  onClick={handleEditShiftClick}>
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
  );
};
 
export default NavBar;
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../../NavBar/Components/navBar';
import DashBoard from '../../DashBoard/Components/dashBoard';
import RegisterRequests from '../../RegistrationRequests/Components/registerComp';
import "../styles/admin.css"
import ModifySeats from '../../EditSeats/components/editSeats';
import ShiftEditMain from '../../Editshift/components/mainshifteditor';
import SignOutPage from '../../SignOut/components/signOut';
import UserMain from '../../CreateModifyUser/Components/main'
import MobileNavbar from '../../MobileNavbar/components/mobileNavbar';
import ReportComp from '../../Reports/components/reportComp';
import RestrictionTab from '../../Restriction/Components/restrictionTab';
import ManageComp from '../../Manage/components/ManageComp';
import HeaderUser from '../../Header/components/headeruser';
import UserProfile from '../../Profile/components/userProfile';
import AdminProfile from '../../Profile/components/adminProfile';


const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false); 
  useEffect(() => {
    if (location.pathname === '/bookmyseat/admin/*') {
      setActiveComponent('dashboard');
    } else {
      const components = location.pathname.split('/').filter(Boolean);
      const activeComponentFromPath = components[components.length - 1];
      setActiveComponent(activeComponentFromPath || 'dashboard');
    }
  }, [location.pathname]);

  const handleSetActiveComponent = (component) => {
    setActiveComponent(component);
    navigate(`/bookmyseat/admin/${component}`);
  };

  const openMobileFilter = () => {
    setIsMobileFilterOpen(true);
  };

  const closeMobileFilter = () => {
    setIsMobileFilterOpen(false);
  };

  return (
    <div className='mainadminContainer'>

       <div className='AdminHeaderComp'>
        <HeaderUser/>
      </div>
       <button className="filter-in-mobile"  onClick={openMobileFilter} >NavBar</button>

      

      <div style={{ display: 'flex' }} className='AdminnavigationComp'>
        <div className='admin-navbar'>
          <NavBar setActiveComponent={handleSetActiveComponent} activeComponent={activeComponent} />
        </div>
  
               
        
        <div className='admin-content' style={{ flex: 1, overflowY: 'auto' }}>
          {activeComponent === 'dashboard' && <DashBoard />}
          {activeComponent === 'requests' && <RegisterRequests />}
          {activeComponent === 'createuser' && <UserMain/>}
          {activeComponent === 'editseat' && <ModifySeats />}
          {activeComponent === 'restrictseat' && <RestrictionTab />}
          {activeComponent === 'editshift' && < ShiftEditMain/>}
          {activeComponent === 'report' && <ReportComp />}
          {activeComponent === 'manage' && <ManageComp />}
          {activeComponent === 'signout' && <SignOutPage />}
          {activeComponent === 'userprofile' && <AdminProfile/>}
        </div>
      </div>
      {/* Render the mobile navbar as a popup */}
      {isMobileFilterOpen && (
        <div className="mobile-filter-overlay">
          <MobileNavbar
            setActiveComponent={handleSetActiveComponent}
            activeComponent={activeComponent} 
            closeMobileFilter={closeMobileFilter}
          />
        </div>
      )}
    </div>
  );
};

export default Admin;

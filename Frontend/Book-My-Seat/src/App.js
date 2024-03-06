import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import RegisterRequests from './components/RegistrationRequests/Components/registerComp';
import LandingPageMain from './components/LandingPage/Components/LandingPageMain';
import ShiftEditMain from './components/Editshift/components/mainshifteditor';
import LoginForm from './components/LoginPage/components/loginComp';
import Registration from './components/UserRegistration/Components/registration';
import ModifySeats from './components/EditSeats/components/editSeats';
import SignOutPage from './components/SignOut/components/signOut';
import DashBoard from './components/DashBoard/Components/dashBoard';
import Admin from './components/Admin/components/admin';
import { getLoginStatus } from './components/auth';
import RestrictionTab from './components/Restriction/Components/restrictionTab';
import UserMain from './components/CreateModifyUser/Components/main';
import ReportComp from './components/Reports/components/reportComp';
import NewBooking from './components/NewBooking/components/newBooking';
import UserDasboardComp from './components/user/components/UserDasboard';
import UserProfile from './components/Profile/components/userProfile';
import UserLayout from './components/userlayout/components/userlayout';
import BookingHistory from './components/BookingHistory/components/bookingHistory';
import SecurityDashboard from './components/Security/components/securityDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserFirstFloor from './components/UserFloors/components/userFirstFloor';
import UserSecondFloor from './components/UserFloors/components/userSecondFloor';
import UserGroundFloor from './components/UserFloors/components/userGroundFloor';
import UserThirdFloor from './components/UserFloors/components/userThirdFloor';
import UserMezzanineFloor from './components/UserFloors/components/userMezzanineFloor';
import UserTrainingRoom from './components/UserFloors/components/userTrainingRoom';
import UserBookingComp from './components/user/components/userbookingdetails';

const App = () => {
  const userData = JSON.parse(sessionStorage.getItem('userData'));
  const role = userData?.role;
  const isAdminLoggedIn = getLoginStatus() && role === 'ADMIN';
  const isUserLoggedIn = getLoginStatus() && role === 'USER';
  const isSecurityLoggedIn = getLoginStatus() && role === 'SECURITY';

 
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPageMain />} />
          <Route path="/bookmyseat/login" element={<LoginForm />} />
          <Route path="/bookmyseat/register" element={<Registration />} />
          <Route path="/bookmyseat/user/userlayout" element={isUserLoggedIn ? <UserLayout/> : <Navigate to="/bookmyseat/login" />} />
          <Route path="/bookmyseat/newbooking" element={isUserLoggedIn ? <NewBooking/> : <Navigate to="/bookmyseat/login" />} />
          <Route path="/bookmyseat/admin/*" element={isAdminLoggedIn ? <Admin /> : <Navigate to="/bookmyseat/login" />} />
          <Route path="/dashboard" element={isAdminLoggedIn ? <DashBoard /> : <Navigate to="/bookmyseat/login" />} />
          <Route path="/requests" element={isAdminLoggedIn ? <RegisterRequests /> : <Navigate to="/bookmyseat/login" />} />
          <Route path="/createuser" element={isAdminLoggedIn ? <UserMain/> : <Navigate to="/bookmyseat/login" />} />
          <Route path="/signout" element={isAdminLoggedIn ? <SignOutPage /> : <Navigate to="/bookmyseat/login" />} />
          <Route path="/editshift" element={isAdminLoggedIn ? <ShiftEditMain /> : <Navigate to="/bookmyseat/login" />} />
          <Route path="/editSeat" element={isAdminLoggedIn ? <ModifySeats /> : <Navigate to="/bookmyseat/login" />} />
          <Route path="/restrictseat" element={isAdminLoggedIn ? <RestrictionTab /> : <Navigate to="/bookmyseat/login" />} />
          <Route path="/report" element={isAdminLoggedIn ? <ReportComp/> : <Navigate to="/bookmyseat/login" />} />
          <Route
            path="/bookmyseat/security/dashboard"
            element={isSecurityLoggedIn ?<SecurityDashboard/>: <Navigate to="/bookmyseat/login" />}
          />
 
          <Route
            path="/bookmyseat/user/userdashboard"
            element={isUserLoggedIn ? <UserLayout><UserDasboardComp /></UserLayout> : <Navigate to="/bookmyseat/login" />}
          />
 
          <Route
            path="/bookmyseat/user/userprofile"
            element={isUserLoggedIn ? <UserLayout><UserProfile /></UserLayout> : <Navigate to="/bookmyseat/login" />}
          />

          <Route
            path="/bookmyseat/user/bookinghistory"
            element={isUserLoggedIn ? <UserLayout><BookingHistory /></UserLayout> : <Navigate to="/bookmyseat/login" />}
          />
          
          <Route
            path="/bookmyseat/user/signout"
            element={isUserLoggedIn ? <UserLayout><SignOutPage/></UserLayout> : <Navigate to="/bookmyseat/login" />}
          />
 
          <Route
            path="/bookmyseat/user/userbooking"
            element={isUserLoggedIn ? <UserLayout><NewBooking /></UserLayout> : <Navigate to="/bookmyseat/login" />}
          />
         
            <Route
            path="/bookmyseat/user/booking/first-floor"
            element={isUserLoggedIn ? <UserLayout><UserFirstFloor /></UserLayout> : <Navigate to="/bookmyseat/login" />}
          />
            <Route
            path="/bookmyseat/user/booking/second-floor"
            element={isUserLoggedIn ? <UserLayout><UserSecondFloor /></UserLayout> : <Navigate to="/bookmyseat/login" />}
          />
           <Route
            path="/bookmyseat/user/booking/ground-floor"
            element={isUserLoggedIn ? <UserLayout><UserGroundFloor /></UserLayout> : <Navigate to="/bookmyseat/login" />}
          />
           <Route
            path="/bookmyseat/user/booking/third-floor"
            element={isUserLoggedIn ? <UserLayout><UserThirdFloor /></UserLayout> : <Navigate to="/bookmyseat/login" />}
          />

           <Route
            path="/bookmyseat/user/booking/mezzanine-floor"
            element={isUserLoggedIn ? <UserLayout><UserMezzanineFloor /></UserLayout> : <Navigate to="/bookmyseat/login" />}
          />
           <Route
            path="/bookmyseat/user/booking/training-room"
            element={isUserLoggedIn ? <UserLayout><UserTrainingRoom /></UserLayout> : <Navigate to="/bookmyseat/login" />}
          />
           <Route
            path="/bookmyseat/user/booking/booking-details"
            element={isUserLoggedIn ? <UserLayout><UserBookingComp /></UserLayout> : <Navigate to="/bookmyseat/login" />}
          />
         
         
        </Routes>
      </BrowserRouter>
    </>
  );
};
 
export default App;
 
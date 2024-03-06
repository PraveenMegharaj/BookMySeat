import { useState, useEffect } from 'react';
import axios from '../../../Services/axiosToken';
import "../styles/adminProfile.css"

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);

  const fetchAdminProfile = () => {
    axios.get("http://localhost:5000/bookmyseat/user/userProfile")
      .then(response => {
        setAdminData(response.data);
      })
      .catch(error => {
        console.error('Error fetching admin profile:', error);
      });
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  return (
    <div className="adminprofile-container">
      <section className="adminprofile-layout">
        <div className="adminprofile-card">
          <div className="adminprofile-avatar">
            <img src={'/assets/images/boy.png'} alt="Avatar" className="adminprofile-avatar-img" />
            {adminData && (
              <>
                <h3>{`${adminData.firstName} ${adminData.lastName}`}</h3>
                <h5>At Valtech</h5>
              </>
            )}
          </div>
          <div className="adminprofile-info">
            <div className="adminprofile-info-admininfo">
              <h4>Admin Info</h4>
              <hr className="adminprofile-info-hr" />
              {adminData && (
                <>
                  <p>Email ID : {adminData.emailId}</p>
                  <p>Phone Number : {adminData.phoneNumber}</p>
                  <p>Employee ID : {adminData.userId}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminProfile;

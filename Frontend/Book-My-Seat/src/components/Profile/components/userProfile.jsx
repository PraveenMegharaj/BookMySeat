import React, { useState,useEffect } from 'react';
import '../styles/userProfile.css';
import { Modal} from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from '../../../Services/axiosToken'
import { updateLoginStatus } from '../../auth';

const UserProfile = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setcurrentPassword] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [userData, setUserData] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [avatarImage, setAvatarImage] = useState('/assets/images/boyprofile1.png');


  const handleToggleChangePassword = () => {
    setShowChangePassword(!showChangePassword);
  };

  const handleCurrentPasswordChange = (e) => {
    setcurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setnewPassword(e.target.value);
    const passwordMatch = e.target.value === confirmPassword;
    if (!passwordMatch) {
      setPasswordMatchError('Passwords do not match');
    } else {
      setPasswordMatchError('');
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!passwordRegex.test(e.target.value)) {
      setPasswordMatchError('Password must contain an uppercase letter, a lowercase letter, a number, and a special character, with a minimum length of 8 characters.');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    const passwordMatch = e.target.value === newPassword;
    if (!passwordMatch) {
      setPasswordMatchError('Passwords do not match');
    } else {
      setPasswordMatchError('');
    }
  };

  
  const handleLogout = () => {
    updateLoginStatus(false);
    sessionStorage.removeItem('userData');
    window.location.replace('/');
  };

  const fetchUserProfile = () => {
    axios.get("http://localhost:5000/bookmyseat/user/userProfile")
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (passwordMatchError) {
      return;
    }

    const data = {
      currentPassword,
      newPassword,
    };
    console.log(data)
    axios.put("http://localhost:5000/bookmyseat/user/changepassword", data)
      .then(response => {
        console.log("success")
        toast.success('password changed successfully!');
        handleLogout();
      })
      .catch(error => {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error('Failed to change password');          
        }
      });
  
    setcurrentPassword('');
    setnewPassword('');
    setConfirmPassword('');
   
  };

  const handleToggleImagePopup = () => {
    setShowImagePopup(!showImagePopup);
  };
 
  const handleImageClick = (image) => {
    setSelectedImage(image);
   
  };
 
  const handleCloseImagePopup = () => {
    setSelectedImage(null);
    setShowImagePopup(false);
  };
 
  const handleApplyAvatarImage = () => {
    if (selectedImage) {
      setAvatarImage(selectedImage);
    }
    setShowImagePopup(false);
  };
 
  const images = [
    '/assets/images/boyprofile1.png',
    '/assets/images/boyprofile3.png',
    '/assets/images/boyprofile2.png',
    '/assets/images/boyprofile4.png',
    '/assets/images/girlprofile.png',
    '/assets/images/girlprofile2.png',
    '/assets/images/girlprofile3.png',
    '/assets/images/girlprofile4.png',
  ];
 
  return (
    <div className="userprofile-container">
      <section className="userprofile-layout">
        <div className="userprofile-card">
        <div className="userprofile-avatar" onClick={handleToggleImagePopup}>
            <img src={avatarImage} alt="Avatar" className="userprofile-avatar-img" />
            <h3>{userData ? `${userData.firstName} ${userData.lastName}` : "Employee name"}</h3>
            <h5>At Valtech</h5>
          </div>
          <div className="userprofile-info">
            <div className="userprofile-info-userinfo">
              <h3>User Info</h3>
              <hr className="userprofile-info-hr" />
              <p>Email ID: {userData ? userData.emailId : "N/A"}</p>
              <p>Phone Number: {userData ? userData.phoneNumber : "N/A"}</p>
              <p>Employee ID: {userData ? userData.userId : "N/A"}</p>
            </div>
            <div className="userprofile-info-changepassword">
              <hr className="userprofile-info-hr" />
              <button
                className="btn btn-success"
                onClick={handleToggleChangePassword}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {showChangePassword && (
          <div className="userprofile-changepassword-container">           
            <div className="userprofile-changepassword">
              <h3>Change Password</h3>
              <form className="userprofile-changepassword-form">
                <div className='mb-3'>
                  <label htmlFor="user-oldPassword">Current Password:</label>
                  <input type="password" 
                    id="currentPassword" 
                    className="form-control"
                    onChange={handleCurrentPasswordChange}
                    value={currentPassword}
                    required />
                </div>
                <div className='mb-3'>
                <label htmlFor="enterPassword">New Password:</label>
                <input
                  type="password"
                  id="newPassword"
                  className="form-control"
                  onChange={handleNewPasswordChange}
                  value={newPassword}
                  required
                />
              </div>
              <div className='mb-3'>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-control"
                  onChange={handleConfirmPasswordChange}
                  value={confirmPassword}
                  required
                />
              {passwordMatchError && <p className="error-messageR">{passwordMatchError}</p>}      
              </div>

                <button                
                  className="btn btn-success"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
        <Modal open={showImagePopup} onClose={handleCloseImagePopup}>
          <div className="userprofile-image-popup">
            <div className="userprofile-image-popup-content">
              <span className="userprofile-image-popup-close" onClick={handleCloseImagePopup}>
                &times;
              </span>
              <div className="userprofile-images-popup-container">
                <div className="userprofile-image-group">
                  {images.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="userprofile-image-popup-item"
                      onClick={() => handleImageClick(image)}
                    />
                  ))}
                </div>
                <div className="userprofile-image-group">
                  {images.slice(4, 8).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Image ${index + 5}`}
                      className="userprofile-image-popup-item"
                      onClick={() => handleImageClick(image)}
                    />
                  ))}
                </div>
              <div className='avatarbutton'>
              <button className='btn btn-primary' onClick={handleApplyAvatarImage} >
                Apply Avatar
              </button>
              </div>
              </div>
            </div>
 
          </div>
        </Modal> 
      </section>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        style={{
          width: '300px',
          borderRadius: '8px',
        }}
      />
    </div>
  );
};

export default UserProfile;

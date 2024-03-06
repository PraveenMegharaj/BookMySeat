import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { MdLogin } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
import '../styles/register.css';
 
const Registration = () => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
 
  const handleNext = () => {
    if (step === 1 && (!firstName || !lastName || !userId)) {
      toast.error('Please fill all required fields');
      return;
    }
    setStep(step + 1);
  };
 
  const handlePrevious = () => {
    setStep(step - 1);
  };
 
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
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
    const passwordMatch = e.target.value === password;
    if (!passwordMatch) {
      setPasswordMatchError('Passwords do not match');
    } else {
      setPasswordMatchError('');
    }
  };
 
  const validatePasswordMatch = () => {
    const passwordMatch = password === confirmPassword;
    if (!passwordMatch) {
      setPasswordMatchError('Passwords do not match');
    } else {
      setPasswordMatchError('');
    }
  };
 
  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z]+(\.[a-zA-Z]+)?@valtech\.com$/;
    if (!emailRegex.test(email)) {
      setEmailError('Email should be in the format name.initials@valtech.com');
    } else {
      setEmailError('');
    }
  };
 
  const handleEmailBlur = () => {
    validateEmail();
  };
 
  const handlePasswordBlur = () => {
    validatePasswordMatch();
  };
 
  const handleConfirmPasswordBlur = () => {
    validatePasswordMatch();
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
 
    validateEmail();
    validatePasswordMatch();
 
    if (!emailError && !passwordMatchError) {
     
      const userCredentials = {
        firstName,
        lastName,
        userId: Number(userId),
        emailId: email,
        phoneNumber: Number(phoneNumber),
        password,
        confirm: confirmPassword,
      };
 
      console.log('Submitted User Data:', userCredentials);
 
      axios.post("http://localhost:5000/bookmyseat/registration", userCredentials)
        .then(response => {
          console.log('Registration Success');
          toast.success('Registration successfully!');
        })
        .catch(error => {
          if (error.response && error.response.data) {
            toast.error(error.response.data);
          } else {
            toast.error('Failed to register');          
          }
        });
       
      setFirstName('');
      setLastName('');
      setUserId('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setConfirmPassword('');
      setPasswordMatchError('');
    }
  };
 
  return (
    <div className='bg-image'>
      <Navbar bg="light" expand="lg" className='register-navbar'>
        <span className='logo'>
          <img src={'/assets/images/Valtech_Logo_White.png'} alt="Valtech Logo" />
        </span>
        <Link className='nav' to="/bookmyseat/login"><MdLogin /></Link>
      </Navbar>
 
      <div className="main-register">
        <div className="register-container">
          <div style={{ marginTop: '20px' }} className='progressbar'>
            <div>Step {step} of 2</div>
            <div><progress value={step} max="2" /></div>
          </div>
 
          {step === 1 ? (
            <div className='register'>
              <div className="mb-3">
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  className="form-control"
                  placeholder="Enter Your First Name"
                  maxLength={20}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  className="form-control"
                  placeholder="Enter Your Last Name"
                  maxLength={20}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="userId">User ID:</label>
                <input
                  type="text"
                  id="userId"
                  className="form-control"
                  placeholder="Enter Your User ID"
                  value={userId}
                  onChange={(e) => {
                    const input = e.target.value.replace(/\D/g, '');
                    setUserId(input.slice(0, 6));
                  }}
                  required
                />
              </div>
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div>
                <div className="mb-3">
                  <label htmlFor="email">Email Address:</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    required
                  />
                  {emailError && <p className="error-messageR">{emailError}</p>}
                </div>
 
                <div className="mb-3">
                  <label htmlFor="phoneNumber">Phone Number:</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    className="form-control"
                    placeholder="Enter Your Phone Number"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
 
                <div className="mb-3">
                  <label htmlFor="enterPassword">Enter Password:</label>
                  <input
                    type="password"
                    id="enterPassword"
                    className="form-control"
                    placeholder="Enter Password"
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    value={password}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    placeholder="Confirm Password"
                    onChange={handleConfirmPasswordChange}
                    onBlur={handleConfirmPasswordBlur}
                    value={confirmPassword}
                    required
                  />
                  {passwordMatchError && <p className="error-messageR">{passwordMatchError}</p>}
                </div>
 
                <button type="button" className="btn btn-secondary bm" onClick={handlePrevious}>
                  Previous
                </button>
                <button type="submit" className="btn btn-primary rbtn">
                  Register
                </button>
              </div>
            </form>
          )}
 
        </div>
      </div>
 
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        style={{

          width: '320px',
          borderRadius: '8px',
        }}
      />
    </div>
  );
};
 

export default Registration;
 

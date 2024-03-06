import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import '../styles/forgotPassword.css'

const ForgotPasswordForm = ({ onClose }) => {
    const [emailId, setEmailId] = useState('');
    const [userId, setUserId] = useState('');
    const [otpValue, setOtpValue] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [timer, setTimer] = useState(120);
    const [step, setStep] = useState(1);
    const [otpValueSent, setOtpValueSent] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');
    const navigate = useNavigate();
  
    const handleEmailChange = (e) => {
      setEmailId(e.target.value);
    };
  
    const handleFormSubmit = (event) => {
      event.preventDefault();

      const emailRegex = /^[a-zA-Z]+(\.[a-zA-Z]+)?@valtech\.com$/;

      if (!emailRegex.test(emailId)) {
        setEmailError('Email should be in the format name.initials@valtech.com');
        return;
      } else {
        setEmailError('');
      }

      console.log({ emailId });
      axios
        .post('http://localhost:5000/bookmyseat/user/forgot-password', { emailId })
        .then((response) => {
          setUserId(response.data.userId);
          toast.success('OTP sent to your registered email');
          startTimer();
          setOtpValueSent(true);
          setStep(2);
        })
        .catch((error) => {
          console.error('Error:', error);
          toast.error('Failed to send OTP. Please try again.');
        });
    };
  
    const handleOtpChange = (e) => {
      setOtpValue(e.target.value);
    };
  
    const handleVerifyOtp = () => {
      console.log({ userId, otpValue });
      axios
        .post(`http://localhost:5000/bookmyseat/user/verify-otp/${userId}`, { otpValue })
        .then((response) => {
          toast.success('OTP verified successfully');
          setStep(3);
        })
        .catch((error) => {
          console.error('Error:', error);
          toast.error('OTP verification failed. Please check the OTP and try again.');
        });
    };
  
    const handleNewPasswordChange = (e) => {
      setNewPassword(e.target.value);
    };
  
    const handleSetNewPassword = () => {
      console.log({newPassword})
      axios
        .put(`http://localhost:5000/bookmyseat/user/reset-password/${userId}`, { newPassword })
        .then((response) => {
          console.log('success')
          toast.success('Password reset successfully');
          setTimeout(() => {
            onClose();
          }, 1000); 
        })
        .catch((error) => {
          console.error('Error:', error);
          toast.error('Failed to reset password. Please try again.');
        });
    };
  
    const startTimer = () => {
      setTimer(120);
    };
  
    useEffect(() => {
      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
  
      return () => clearInterval(timerInterval);
    }, []);
  
    useEffect(() => {
      if (timer === 0 && step === 2) {
        toast.error('Time expired. Please request a new OTP.');
        onClose();
      }
    }, [timer, step, onClose]);
  
    return (
      <div className='forgot-password'>
        <Modal
          isOpen={step === 1}
          onRequestClose={onClose}
          contentLabel="Enter Email Modal"
          className="modal-dialog-centered"  
        >
          <div className="modal-content">
            <form onSubmit={handleFormSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Enter your Email</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
              </div>
              <div className="modal-body">
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={emailId}
                  onChange={handleEmailChange}
                  required
                />
                {emailError && <p className="error-messageF">{emailError}</p>}
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </Modal>
  
        <Modal
          isOpen={step === 2}
          onRequestClose={onClose}
          contentLabel="Enter OTP Modal"
          className="modal-dialog-centered"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Enter OTP</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <label htmlFor="otp" className="form-label">OTP:</label>
              <input
                type="text"
                id="otp"
                className="form-control"
                placeholder="Enter OTP"
                value={otpValue}
                onChange={handleOtpChange}
                required
              />
              <p>{`Time remaining: ${Math.floor(timer / 60)}:${timer % 60}`}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={handleVerifyOtp}>Verify OTP</button>
            </div>
          </div>
        </Modal>
  
        <Modal
          isOpen={step === 3}
          onRequestClose={onClose}
          contentLabel="Enter New Password Modal"
          className="modal-dialog-centered"
          
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Enter New Password</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <label htmlFor="newPassword" className="form-label">New Password:</label>
              <input
                type="password"
                id="newPassword"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
              />
              {passwordMatchError && (
                      <p className="error-messageF">{passwordMatchError}</p>
                    )}

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={handleSetNewPassword}>Set New Password</button>
            </div>
          </div>
        </Modal>
  
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

export default ForgotPasswordForm;


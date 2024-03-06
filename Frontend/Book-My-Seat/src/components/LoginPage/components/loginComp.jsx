import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { getLoginStatus, updateLoginStatus } from '../../auth';
import { Navbar } from 'react-bootstrap';
import { FaRegUser } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/login.css';
import ForgotPasswordForm from './forgotPasswordForm'; 
import { FaHome } from "react-icons/fa";

const LoginForm = () => {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [redirectTo, setRedirectTo] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
  };

  useEffect(() => {
    if (getLoginStatus()) {
      const userData = JSON.parse(sessionStorage.getItem('userData'));

      if (userData) {
        switch (userData.role) {
          case 'ADMIN':
            setRedirectTo('/bookmyseat/admin/*');
            break;
          case 'USER':
            setRedirectTo('/bookmyseat/user/userlayout');
            break;
          case 'SECURITY':
            setRedirectTo('/bookmyseat/security/dashboard');
            break;
          default:
            break;
        }
      }
    }
  }, []);

  useEffect(() => {
    if (redirectTo) {
      navigate(redirectTo);
    }
  }, [redirectTo, navigate]);

  const handleEmailChange = (e) => {
    setEmailId(e.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const emailRegex = /^[a-zA-Z]+(\.[a-zA-Z]+)?@valtech\.com$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    if (!emailRegex.test(emailId)) {
      setEmailError('Email should be in the format name.initials@valtech.com');
      return;
    } else {
      setEmailError('');
    }

    if (!passwordRegex.test(password)) {
      setPasswordMatchError(
        'Password must contain an uppercase letter, a lowercase letter, a number, and a special character, with a minimum length of 8 characters.'
      );
      return;
    } else {
      setPasswordMatchError('');
    }

    axios
      .post('http://localhost:5000/bookmyseat/login', { emailId, password })
      .then((response) => {
        console.log('Login success');
        console.log(response.data);
        sessionStorage.setItem('userData', JSON.stringify(response.data));
        sessionStorage.setItem('token', response.data.accessToken);
        updateLoginStatus(true);
        toast.success('Login successful!', {
          onClose: () => {
            setEmailId('');
            setPassword('');

            const userData = response.data;
            switch (userData.role) {
              case 'ADMIN':
                setRedirectTo('/bookmyseat/admin/*');
                break;
              case 'USER':
                setRedirectTo('/bookmyseat/user/userlayout');
                break;
              case 'SECURITY':
                setRedirectTo('/bookmyseat/security/dashboard');
                break;
              default:
                break;
            }
          },
        });
        window.location.reload(true);
      })
      .catch(error => {
        if (error.response && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('login failed');          }
      });
     
          
  };

  const handleSignUpClick = () => {
    navigate('/bookmyseat/register');
  };

  return (
    <div>
      <Navbar bg="light" expand="lg" className="bar">
        <span className="logo">
          <img src={'/assets/images/Valtech_Logo_White.png'} alt="Valtech Logo" />
        </span>
        <Link to="/" className="nav">
        <FaHome />
        </Link>
      </Navbar>
      <div className="main-login">
        <div className="login-container">
          {!getLoginStatus() && (
            <div className="screen">
              <div className="screen__content">
                <form className="login" onSubmit={handleFormSubmit}>
                  <div className="mb-3 input-container">
                    <FaRegUser className="input-icon" />
                    <input
                      type="email"
                      id="emailId"
                      className="form-control"
                      placeholder="Enter your Email"
                      value={emailId}
                      onChange={handleEmailChange}
                      required
                    />

                    {emailError && <p className="error-messageL">{emailError}</p>}
                  </div>
                  <div className="mb-3 input-container">
                    <input
                      type="password"
                      id="enterPassword"
                      className="form-control"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <RiLockPasswordFill className="input-icon2" />
                    {passwordMatchError && (
                      <p className="error-messageL">{passwordMatchError}</p>
                    )}

                    <span className="forgot" onClick={handleForgotPassword}>
                      Forgot Password?
                    </span>
                    <div>
                      <button type="submit" className="btn btn-primary">
                        LOGIN
                      </button>
                    </div>
                    <p>
                      Need an account?
                      <span onClick={handleSignUpClick} className="sign-up">
                        Sign Up
                      </span>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          )}

          <ToastContainer
            position="top-center"
            autoClose={1000}
            hideProgressBar={true}
            style={{
              width: '300px',
              borderRadius: '8px',
            }}
          />

          {showForgotPassword && (
            <ForgotPasswordForm onClose={closeForgotPassword} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

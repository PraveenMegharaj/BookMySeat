import React, { useState, useEffect } from 'react';
import '../styles/createUser.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from '../../../Services/axiosToken';

const CreateUser = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
 
  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/bookmyseat/admin/projects');
      console.log('Fetched projects:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const projectsData = await fetchProjects();
      setProjects(projectsData);
    };

    fetchData();
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    const emailRegex = /^[a-zA-Z]+(\.[a-zA-Z]+)?@valtech\.com$/;
    if (!emailRegex.test(e.target.value)) {
      setEmailError('Email should be in the format name.initials@valtech.com');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userCredentials = {
      firstName,
      lastName,
      userId:Number(userId),
      emailId: email,
      phoneNumber:Number(phoneNumber),
      projectId: selectedProject,
    };
    console.log('Submitted User Data:', userCredentials);

    axios
      .post('http://localhost:5000/bookmyseat/admin/createuser', userCredentials)
      .then((response) => {
        console.log('Success');
        toast.success('User created successfully!');
      })
      .catch(error => {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error('Failed to create user');          
        }
      });

    setFirstName('');
    setLastName('');
    setUserId('');
    setEmail('');
    setPhoneNumber('');
    setSelectedProject('');
  };

  return (
    <div className='createUser-container'>
      <div className='createUser-card'>
        <form onSubmit={handleSubmit}>
          <div className='Name'>
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
                placeholder="Enter Your last Name"
                maxLength={20}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
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

          <div className="mb-3">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your Email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {emailError && <p className="error-messageC">{emailError}</p>}
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
            <label htmlFor="project">Project:</label>
            <select
              id="project"
              className="form-control"
              value={selectedProject}
              onChange={(e) => setSelectedProject(Number(e.target.value))}
            >
              <option>Select Project</option>
              {projects.map((project) => (
                <option key={project.projectId} value={Number(project.projectId)}>
                  {project.projectName}
                </option>
              ))}
            </select>

          </div>
          <button type="submit" className="btn btn-primary">
            Create User
          </button>
        </form>
      </div>
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

export default CreateUser;

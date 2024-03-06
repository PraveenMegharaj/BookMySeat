import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from '../../../Services/axiosToken';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../styles/modifyUser.css';

const ModifyUser = () => {
  const [searchUserId, setSearchUserId] = useState('');
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/bookmyseat/admin/projects');
      console.log('Fetched projects:', response.data);
      setProjects(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  };

  const handleFetchUserDetails = async () => {
    try {
      if (searchUserId) {
        const [userResponse, projectsData] = await Promise.all([
          axios.get(`http://localhost:5000/bookmyseat/admin/getAllUsers/${searchUserId}`),
          fetchProjects(),
        ]);

        const userData = userResponse.data[0];
        console.log('User Data:', userData);

        setUserId(userData.userId);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setPhoneNumber(userData.phoneNumber);
        setEmail(userData.emailId);

        if (userData.project) {
          setSelectedProject(userData.project.projectId || '');
        }

        setProjects(projectsData);
      }
    } catch (error) {
      console.error('Error fetching user details or projects:', error);     
      toast.error('Failed to fetch user details or projects');
    }
  };

  const handleUpdatePhoneNumber = (e) => {
    e.preventDefault();

    const updatedUserData = {
      firstName,
      lastName,
      userId: Number(userId),
      emailId: email,
      phoneNumber: Number(phoneNumber),
      projectId: selectedProject,
    };

    console.log('Updating user data:', updatedUserData);

    axios
      .put(`http://localhost:5000/bookmyseat/admin/update`, updatedUserData)
      .then((response) => {
        console.log('Success');
        console.log(response.data);
        toast.success('User data modification Successful');
        setUserId('');
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setEmail('');
        setSelectedProject('');
      })
      .catch(error => {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error('Failed to modify user');          
        }
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <div className="search-bar">
        <input
          type="number"
          className="form-control mr-sm-2"
          placeholder="Enter User ID"
          value={searchUserId}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setSearchUserId(value.slice(0, 6)); 
          }}
        />
        <Button className='btn btn-primary' onClick={handleFetchUserDetails}>
          Search
        </Button>
      </div>

      <div className="createUser-container">
        <div className="createUser-card">
          <form onSubmit={handleUpdatePhoneNumber}>
            <div className='Name'>
              <div className="mb-3">
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  className="form-control"
                  placeholder="Enter Your First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  className="form-control"
                  placeholder="Enter Your last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  readOnly
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
                readOnly
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
                onChange={(e) => setEmail(e.target.value)}
                readOnly
              />
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
              Modify User
            </button>
          </form>
        </div>
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

export default ModifyUser;

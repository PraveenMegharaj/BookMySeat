import React, { useState, useEffect } from 'react';
import { Modal, Paper, TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import axios from '../../../Services/axiosToken';
import '../styles/project.css';

const ProjectComp = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddProjectPopup, setShowAddProjectPopup] = useState(false);
  const [newProject, setNewProject] = useState({ projectName: '' });
  const [projectsData, setProjectsData] = useState([]);
  const [error, setError] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [updatedProjectName, setUpdatedProjectName] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    axios.get('http://localhost:5000/bookmyseat/admin/projects')
      .then(response => {
        console.log('Fetched projects:', response.data);
        setProjectsData(response.data);
      })
      .catch(error => console.error('Error fetching projects:', error));
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleAddProject = () => {
    setShowAddProjectPopup(true);
  };

  const handleAddProjectClose = () => {
    setShowAddProjectPopup(false);
    setError('');
  };

  const handleAddProjectSubmit = () => {
    setShowAddProjectPopup(false);

    if (projectsData.some(project => project.projectName === newProject.projectName)) {
      setError(`Error: ${newProject.projectName} already exists in the database.`);
      return;
    }

    setShowAddConfirmation(true);
  };

  const handleAddConfirmationClose = () => {
    setShowAddConfirmation(false);
    setError('');
  };

  const handleAddConfirmationSubmit = () => {
    setShowAddConfirmation(false);

    const projectNameToAdd = newProject.projectName;
    axios.post('http://localhost:5000/bookmyseat/admin/createProject', newProject)
      .then(response => {
        fetchProjects();
        setShowAlert(true);
        setNewProject({ projectName: '' });
      })
      .catch(error => {
        console.error('Error adding project:', error);
        setError(`Failed to add ${newProject.projectName}. Please try again.`);
      });
  };

  const handleDeleteProject = (project) => {
    if (!project || !project.projectId) {
      setError(`Invalid project. Please try again.`);
      return;
    }

    setSelectedProject(project);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmationClose = () => {
    setShowDeleteConfirmation(false);
    setSelectedProject(null);
    setError('');
  };

  const handleDeleteConfirmationSubmit = () => {
    setShowDeleteConfirmation(false);
    const projectId = selectedProject.projectId;

    axios.delete(`http://localhost:5000/bookmyseat/admin/project/${projectId}`)
      .then(response => {
        fetchProjects();
        setShowAlert(true);
      })
      .catch(error => {
        console.error('Error deleting project:', error);
        setError(`Failed to delete project. Please try again.`);
      });
  };

  const handleUpdateProject = (project) => {
    if (!project || !project.projectId) {
      setError(`Invalid project. Please try again.`);
      return;
    }

    setSelectedProject(project);
    setUpdatedProjectName(project.projectName);
    setShowUpdateConfirmation(true);
  };

  const handleUpdateConfirmationClose = () => {
    setShowUpdateConfirmation(false);
    setSelectedProject(null);
    setUpdatedProjectName('');
    setError('');
  };

  const handleUpdateConfirmationSubmit = () => {
    setShowUpdateConfirmation(false);
    const projectId = selectedProject.projectId;

    axios.put(`http://localhost:5000/bookmyseat/admin/updateProject/${parseInt(projectId, 10)}`, { projectName: updatedProjectName })
      .then(response => {
        fetchProjects();
        setShowAlert(true);
        setUpdatedProjectName('');
      })
      .catch(error => {
        console.error('Error updating project:', error);
        setError(`Failed to update project. Please try again.`);
      });
  };

  const calculateAnimationDelay = (index) => {
    return `${index * 0.1}s`;
  };

  return (
    <div className='ProjectMainContainer'>
      <Typography variant="h4" gutterBottom className='headingeditprofile'>
        Explore Our Projects
      </Typography>
      <div className="ProjectContainer">
        {projectsData.map((project, index) => (
          <Paper
          key={index}
          className='ProjectCard'
          elevation={3}
          onClick={() => handleProjectClick(project)}
          style={{ animationDelay: calculateAnimationDelay(index) }}
        >
            {project.projectName}
            <div className='editproject-buttons-container'>
              <Button variant="outlined" color="secondary" onClick={() => handleDeleteProject(project)}>
                Delete
              </Button>
              <Button variant="outlined" color="primary" onClick={() => handleUpdateProject(project)}>
                Update
              </Button>
            </div>
          </Paper>
        ))}
        <div className='addprojectbutton'>
          <Button variant="contained" color="primary" elevation={3} onClick={handleAddProject}>
            Add Project
          </Button>
        </div>
      </div>

      <Modal
        open={showAddProjectPopup}
        onClose={handleAddProjectClose}
        aria-labelledby="add-project-modal"
        aria-describedby="add-project-modal-description"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Paper sx={{ width: 300, padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add Project
            </Typography>
            <TextField
              label="Enter project name"
              variant="outlined"
              fullWidth
              value={newProject.projectName}
              onChange={(e) => setNewProject({ projectName: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleAddProjectSubmit} fullWidth>
              Add
            </Button>
            <Button variant="contained" color="secondary" onClick={handleAddProjectClose} fullWidth sx={{ marginTop: 2 }}>
              Close
            </Button>
            {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}
          </Paper>
        </Box>
      </Modal>

      <Dialog
        open={showDeleteConfirmation}
        onClose={handleDeleteConfirmationClose}
        aria-labelledby="delete-confirmation-dialog"
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete the selected project?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmationSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showUpdateConfirmation}
        onClose={handleUpdateConfirmationClose}
        aria-labelledby="update-confirmation-dialog"
      >
        <DialogTitle>Update Confirmation</DialogTitle>
        <DialogContent>
          <TextField
            label="Enter updated project name"
            variant="outlined"
            fullWidth
            value={updatedProjectName}
            onChange={(e) => setUpdatedProjectName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateConfirmationClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateConfirmationSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showAddConfirmation}
        onClose={handleAddConfirmationClose}
        aria-labelledby="add-confirmation-dialog"
      >
        <DialogTitle>Add Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to add {newProject.projectName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddConfirmationClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddConfirmationSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showAlert}
        onClose={() => setShowAlert(false)}
        aria-labelledby="alert-dialog"
      >
        <DialogTitle>Operation Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The operation was successful.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAlert(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ProjectComp;

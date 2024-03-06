import React, { useState, useEffect } from 'react';
import { Modal, Paper, TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import axios from '../../../Services/axiosToken';
import '../styles/location.css';

const LocationComp = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showAddLocationPopup, setShowAddLocationPopup] = useState(false);
  const [newLocation, setNewLocation] = useState({ locationName: '' });
  const [locationsData, setLocationsData] = useState([]);
  const [error, setError] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);
  const [showAlert, setShowAlert] = useState('');

  useEffect(() => {
    fetchLocations();
  }, []); 

  const fetchLocations = () => {
    axios.get('http://localhost:5000/bookmyseat/admin/allLocation') 
      .then(response => {
        console.log('Fetched locations:', response.data);
        setLocationsData(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  const handleAddLocation = () => {
    setShowAddLocationPopup(true);
  };

  const handleAddLocationClose = () => {
    setShowAddLocationPopup(false);
    setError('');
  };

  const handleAddLocationSubmit = () => {
    setShowAddLocationPopup(false);

    if (locationsData.some(location => location.locationName === newLocation.locationName)) {
      setError(`Error: ${newLocation.locationName} already exists in the database.`);
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

    const locationNameToAdd = newLocation.locationName;
    axios.post('http://localhost:5000/bookmyseat/admin/location', newLocation)
      .then(response => {
        fetchLocations();
        setShowAlert(`Location added successfully: ${locationNameToAdd}`);
        setNewLocation({ locationName: '' });
      })
      .catch(error => {
        console.error('Error adding location:', error);
        setError(`Failed to add ${newLocation.locationName}. Please try again.`);
      });
  };

  const handleDeleteLocation = (location) => {
    if (!location || !location.locationId) {
      setError(`Invalid location. Please try again.`);
      return;
    }

    setSelectedLocation(location);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmationClose = () => {
    setShowDeleteConfirmation(false);
    setSelectedLocation(null);
    setError('');
  };

  const handleDeleteConfirmationSubmit = () => {
    setShowDeleteConfirmation(false);
    const locationId = selectedLocation.locationId;

    axios.delete(`http://localhost:5000/bookmyseat/admin/deleteLocation/${locationId}`)
      .then(response => {
        fetchLocations();
        setShowAlert(`Location deleted successfully.`);
      })
      .catch(error => {
        console.error('Error deleting location:', error);
        setError(`Failed to delete location. Please try again.`);
      });
  };
  const calculateAnimationDelay = (index) => {
    return `${index * 0.1}s`;
  };

  return (
    <div className='LocationMainContainer'>
      <Typography variant="h4" gutterBottom>
        Our Locations
      </Typography>
      <div className="LocationContainer">
        {locationsData.map((location, index) => (
          <Paper
            key={index}
            className={`LocationCard ${selectedLocation === location ? 'selected' : ''}`}
            elevation={3}
            onClick={() => handleLocationClick(location)}
          >
            <h2>{location.locationName}</h2>
            <div className='editlocation-buttons-container'>
              <Button variant="outlined" color="secondary" onClick={() => handleDeleteLocation(location)}>
                Delete
              </Button>
            </div>
          </Paper>
        ))}
        <div className='addlocationbutton'>
          <Button variant="contained" color="primary" elevation={3} onClick={handleAddLocation}>
            Add Location
          </Button>
        </div>
      </div>

      <Modal
        open={showAddLocationPopup}
        onClose={handleAddLocationClose}
        aria-labelledby="add-location-modal"
        aria-describedby="add-location-modal-description"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Paper sx={{ width: 300, padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add Location
            </Typography>
            <TextField
              label="Enter location name"
              variant="outlined"
              fullWidth
              value={newLocation.locationName}
              onChange={(e) => setNewLocation({ locationName: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleAddLocationSubmit} fullWidth>
              Add
            </Button>
            <Button variant="contained" color="secondary" onClick={handleAddLocationClose} fullWidth sx={{ marginTop: 2 }}>
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
            Do you want to delete the selected location?
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
        open={showAddConfirmation}
        onClose={handleAddConfirmationClose}
        aria-labelledby="add-confirmation-dialog"
      >
        <DialogTitle>Add Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to add {newLocation.locationName}?
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
        onClose={() => setShowAlert('')}
        aria-labelledby="alert-dialog"
      >
        <DialogTitle>Operation Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {showAlert}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAlert('')} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default LocationComp;

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import axios from '../../../Services/axiosToken';
import '../styles/EditHolidayComp.css';

const EditHolidayComp = () => {
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [showAddHolidayPopup, setShowAddHolidayPopup] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    holidayName: '',
    day: '',
    month: '',
  });

  const [holidaysData, setHolidaysData] = useState([]);
  const [error, setError] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = () => {
    axios
      .get('http://localhost:5000/bookmyseat/admin/holidays')
      .then((response) => {
        console.log('Fetched holidays:', response.data);
        setHolidaysData(response.data);
      })
      .catch((error) => console.error('Error fetching holidays:', error));
  };

  const handleHolidayClick = (holiday) => {
    setSelectedHoliday(holiday);
  };

  const handleAddHoliday = () => {
    setShowAddHolidayPopup(true);
  };

  const handleAddHolidayClose = () => {
    setShowAddHolidayPopup(false);
    setError('');
  };

  const handleAddHolidaySubmit = () => {
    setShowAddHolidayPopup(false);
  
    if (
      holidaysData.some(
        (holiday) =>
          holiday.holidayName === newHoliday.holidayName ||
          (holiday.day === newHoliday.day && holiday.month === newHoliday.month)
      )
    ) {
      setError(
        `Error: ${newHoliday.holidayName} or date already exists in the database.`
      );
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

    const holidayToAdd = {
      holidayName: newHoliday.holidayName,
      holidayDate: newHoliday.day, // Assuming 'day' contains the date in "YYYY-MM-DD" format
      holidayMonth: newHoliday.month,
    };

    axios
      .post(
        'http://localhost:5000/bookmyseat/admin/addHolidays',
        holidayToAdd
      )
      .then((response) => {
        fetchHolidays();
        setShowAlert(true);
        setNewHoliday({ holidayName: '', day: '', month: '' });
      })
      .catch((error) => {
        console.error('Error adding holiday:', error);
        setError(`Failed to add ${newHoliday.holidayName}. Please try again.`);
      });
  };

  const handleDeleteHoliday = (holiday) => {
    if (!holiday || !holiday.holidayId) {
      setError(`Invalid holiday. Please try again.`);
      return;
    }

    setSelectedHoliday(holiday);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmationClose = () => {
    setShowDeleteConfirmation(false);
    setError('');
  };

  const handleDeleteConfirmationSubmit = () => {
    setShowDeleteConfirmation(false);
    const holidayId = selectedHoliday.holidayId;

    axios
      .delete(`http://localhost:5000/bookmyseat/admin/deleteholidays/${holidayId}`)
      .then((response) => {
        fetchHolidays();
      })
      .catch((error) => {
        console.error('Error deleting holiday:', error);
        setError(`Failed to delete holiday. Please try again.`);
      });

    setShowAlert(true);
  };

  const calculateAnimationDelay = (index) => {
    return `${index * 0.1}s`;
  };

  return (
    <div className='HolidayMainContainer'>
      <Typography variant='h4' gutterBottom className='headingeditholiday'>
        Our Holidays
      </Typography>

      <div className='HolidayContainer'>
        {holidaysData.map((holiday, index) => (
          <Paper
            key={index}
            className='HolidayCard'
            elevation={3}
            onClick={() => handleHolidayClick(holiday)}
            style={{ animationDelay: calculateAnimationDelay(index) }}
          >
            <h2>{holiday.holidayName}</h2>
            <div className='editholiday-buttons-container'>
              <Button variant='outlined' color='secondary' onClick={() => handleDeleteHoliday(holiday)}>
                Delete
              </Button>
            </div>
          </Paper>
        ))}
        <div className='addholidaybutton'>
          <Button variant='contained' color='primary' elevation={3} onClick={handleAddHoliday}>
            Add Holiday
          </Button>
        </div>
      </div>

      <Modal
        open={showAddHolidayPopup}
        onClose={handleAddHolidayClose}
        aria-labelledby='add-holiday-modal'
        aria-describedby='add-holiday-modal-description'
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Paper sx={{ width: 300, padding: 3 }}>
            <Typography variant='h6' gutterBottom>
              Add Holiday
            </Typography>
            <TextField
              label='Enter holiday name'
              variant='outlined'
              fullWidth
              value={newHoliday.holidayName}
              onChange={(e) => setNewHoliday({ ...newHoliday, holidayName: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label='Select date'
              variant='outlined'
              fullWidth
              type='date'
              InputLabelProps={{
                shrink: true,
              }}
              value={newHoliday.day}
              onChange={(e) => setNewHoliday({ ...newHoliday, day: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label='Select month'
              variant='outlined'
              fullWidth
              type='month'
              InputLabelProps={{
                shrink: true,
              }}
              value={newHoliday.month}
              onChange={(e) => setNewHoliday({ ...newHoliday, month: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <Button variant='contained' color='primary' onClick={handleAddHolidaySubmit} fullWidth>
              Add
            </Button>
            <Button variant='contained' color='secondary' onClick={handleAddHolidayClose} fullWidth sx={{ marginTop: 2 }}>
              Close
            </Button>
            {error && <Typography color='error' sx={{ marginTop: 2 }}>{error}</Typography>}
          </Paper>
        </Box>
      </Modal>

      <Dialog
        open={showDeleteConfirmation}
        onClose={handleDeleteConfirmationClose}
        aria-labelledby='delete-confirmation-dialog'
      >
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete the selected holiday?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmationSubmit} color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showAddConfirmation} onClose={handleAddConfirmationClose} aria-labelledby='add-confirmation-dialog'>
        <DialogTitle>Add Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to add {newHoliday.holidayName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddConfirmationClose} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleAddConfirmationSubmit} color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showAlert} onClose={() => setShowAlert(false)} aria-labelledby='alert-dialog'>
        <DialogTitle>Operation Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The operation was successful.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAlert(false)} color='primary'>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditHolidayComp;

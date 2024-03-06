import React, { useState, useEffect } from 'react';
import axios from '../../../Services/axiosToken';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import '@mui/material/styles';
import '../styles/Editshiftstyle.css';

function EditExistingShift() {
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedShiftDetails, setSelectedShiftDetails] = useState({
    shiftId: null,
    shiftName: '',
    startTime: '',
    endTime: '',
  });
  const [updatedShift, setUpdatedShift] = useState({
    shiftName: '',
    startTime: '',
    endTime: '',
  });
  const [shiftOptions, setShiftOptions] = useState([]);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchShiftDetails();
  }, []);

  const fetchShiftDetails = () => {
    axios
      .get('http://localhost:5000/bookmyseat/admin/getAllShiftDetails')
      .then((response) => {
        const data = response.data;

        if (data && Array.isArray(data)) {
          setShiftOptions(data);
        } else {
          console.error('Invalid data format received from the API');
        }
      })
      .catch((error) => console.error('Error fetching shift details:', error));
  };

  const fetchShiftDetailsById = (shiftId) => {
    axios
      .get(`http://localhost:5000/bookmyseat/admin/getAllShiftDetails`)
      .then((response) => {
        const shifts = response.data;

        const selectedShift = shifts.find((shift) => shift.shiftId === shiftId);

        if (selectedShift) {
          setSelectedShiftDetails(selectedShift);
          setUpdatedShift({
            shiftName: selectedShift.shiftName,
            startTime: selectedShift.startTime,
            endTime: selectedShift.endTime,
          });
        } else {
          console.error('Shift not found with ID:', shiftId);
        }
      })
      .catch((error) => console.error('Error fetching shift details:', error));
  };

  const handleShiftChange = (event) => {
    const selectedShiftId = parseInt(event.target.value, 10);
    setSelectedShift(selectedShiftId);
    setIsShiftActive(true);

    fetchShiftDetailsById(selectedShiftId);
  };

  const handleUpdateShift = () => {
    setIsUpdateModalOpen(true);
  };

  const handleUpdateConfirm = () => {
    setIsUpdateModalOpen(false);
    setLoading(true);
  
    const updatedShiftData = {
      shiftName: updatedShift.shiftName,
      startTime: updatedShift.startTime,
      endTime: updatedShift.endTime,
    };
  
    axios
      .put(`http://localhost:5000/bookmyseat/admin/updateShiftTime/${selectedShiftDetails.shiftId}`, updatedShiftData)
      .then((response) => {
        console.log('Shift updated successfully:', response.data);
        toast.success('Shift updated successfully');
        
        // Fetch the updated details of the selected shift
        fetchShiftDetailsById(selectedShiftDetails.shiftId);
      })
      .catch((error) => {
        console.error('Error updating shift:', error);
        toast.error('Error updating shift');
      })
      .finally(() => setLoading(false));
  };
  

  const handleUpdateCancel = () => {
    setIsUpdateModalOpen(false);
  };

  const handleDeleteShift = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
    setLoading(true);

    axios
      .delete(`http://localhost:5000/bookmyseat/admin/deleteShiftDetails/${selectedShiftDetails.shiftId}`)
      .then((response) => {
        console.log('Shift deleted successfully:', response.data);
        toast.success('Shift deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting shift:', error);
        toast.error('Error deleting shift');
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleEdit = () => {
    setIsShiftActive(false);
  };

  return (
    <div className='ExistingShiftContainer'>
      <div className='Editcard'>
        <h1 className='editshiftlabel'>Edit Existing Shift</h1>
        <form className='EditshiftForm'>
          <label htmlFor='shiftSelect'>Select a Shift</label>
          <select
            className={`editshiftselect ${isShiftActive ? 'active' : ''}`}
            id='shiftSelect'
            value={selectedShift}
            onChange={handleShiftChange}
          >
            <option value='' disabled>Select a Shift</option>
            {shiftOptions.map((shift) => (
              <option key={shift.shiftId} value={shift.shiftId}>
                {shift.shiftName}
              </option>
            ))}
          </select>
          <p>
                Selected Shift Timings: {selectedShiftDetails.startTime} - {selectedShiftDetails.endTime}
              </p>

          {isShiftActive && (
            <>
              <div className='button-group'>
                <input
                  type='text'
                  className='editshiftinput'
                  placeholder='Updated Shift Name'
                  value={updatedShift.shiftName}
                  onChange={(e) => setUpdatedShift({ ...updatedShift, shiftName: e.target.value })}
                />
                <input
                  type='text'
                  className='editshiftinput'
                  placeholder='Updated Start Time'
                  value={updatedShift.startTime}
                  onChange={(e) => setUpdatedShift({ ...updatedShift, startTime: e.target.value })}
                />
                <input
                  type='text'
                  className='editshiftinput'
                  placeholder='Updated End Time'
                  value={updatedShift.endTime}
                  onChange={(e) => setUpdatedShift({ ...updatedShift, endTime: e.target.value })}
                />
                <button type='button' className='editshiftbutton' onClick={handleUpdateShift}>
                  Update Shift
                </button>
                <button type='button' className='editshiftbutton delete' onClick={handleDeleteShift}>
                  Delete Shift
                </button>
              </div>
              
            </>
          )}

        </form>
      </div>

      {/* Update Confirmation Modal */}
      <Modal open={isUpdateModalOpen} onClose={handleUpdateCancel}>
        <Box sx={{ width: 300, bgcolor: 'background.paper', p: 2, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <Typography variant="h6" component="div">
            Confirm Update
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to update this shift?
          </Typography>
          <Button onClick={handleUpdateConfirm}>Yes</Button>
          <Button onClick={handleUpdateCancel}>No</Button>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteModalOpen} onClose={handleDeleteCancel}>
        <Box sx={{ width: 300, bgcolor: 'background.paper', p: 2, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <Typography variant="h6" component="div">
            Confirm Deletion
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this shift?
          </Typography>
          <Button onClick={handleDeleteConfirm}>Yes</Button>
          <Button onClick={handleDeleteCancel}>No</Button>
        </Box>
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
}

export default EditExistingShift;

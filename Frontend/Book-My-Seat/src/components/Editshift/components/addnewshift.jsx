import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/Addnewshiftstyle.css";
import axios from '../../../Services/axiosToken';

function AddNewShift() {
  const [shiftName, setShiftName] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');

  const handleShiftNameChange = (event) => {
    setShiftName(event.target.value);
  };

  const handleFromTimeChange = (event) => {
    setFromTime(event.target.value);
  };

  const handleToTimeChange = (event) => {
    setToTime(event.target.value);
  };

  const handleAddShift = () => {
    const newShift = {
      shiftName: shiftName,
      startTime: fromTime,
      endTime: toTime,
    };
  
    axios.post('http://localhost:5000/bookmyseat/admin/addShiftTime', newShift)
      .then(response => {
        console.log('Shift added successfully:', response.data);
        setShiftName('');
        setFromTime('');
        setToTime('');
        toast.success('Shift added successfully!');
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          toast.error('Error: Shift already present!');
        } else {
          console.error('Error adding shift:', error);
          toast.error('Error adding shift. Please try again.');
        }
      });
  };

  return (
    <div className='AddNewShiftContainer'>
      <div className='addnewshiftformContainer'>
        <h1 className='addNewShiftLabel'>Add New Shift</h1>
        <form>
          <label className='addNewShiftLabel'></label>
          <input type='text' className='addNewShiftInput' value={shiftName} placeholder='Shift Name:' onChange={handleShiftNameChange} />

          <label className='addNewShiftLabel'>From Time:</label>
          <input type='time' className='addNewShiftInput' value={fromTime} onChange={handleFromTimeChange} />

          <label className='addNewShiftLabel'>To Time:</label>
          <input type='time' className='addNewShiftInput' value={toTime} onChange={handleToTimeChange} />

          <button type='button' className='addNewShiftButton' onClick={handleAddShift}>
            Add Shift
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
}

export default AddNewShift;

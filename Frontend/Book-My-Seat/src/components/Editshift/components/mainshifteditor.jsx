import React, { useState } from 'react';
import EditExistingShift from './Editshift';
import AddNewShift from './addnewshift';
import '../styles/mainshifteditor.css'; 

function ShiftEditMain() {
  const [activeCard, setActiveCard] = useState('editshift'); // Set initial value to 'editshift'

  const handleEditShiftClick = () => {
    setActiveCard('editshift');
  };

  const handleModifyShiftClick = () => {
    setActiveCard('addshift');
  };

  return (
    <div className='ShiftEditContainer'>
      <div className="ShiftEditbuttonContainer">
        <button
          className={`shiftButton ${activeCard === 'editshift' ? 'active' : ''}`}
          onClick={handleEditShiftClick}
        >
          Edit Shift
        </button>
        <button
          className={`shiftButton ${activeCard === 'addshift' ? 'active' : ''}`}
          onClick={handleModifyShiftClick}
        >
          Add New Shift
        </button>
      </div>

      <div className="ShiftEditcardsContainer">
        {activeCard === 'editshift' && (
          <div className="ShiftEditcard">
            <EditExistingShift/>
          </div>
        )}

        {activeCard === 'addshift' && (
          <div className="ShiftEditcard">
            <AddNewShift/>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShiftEditMain;

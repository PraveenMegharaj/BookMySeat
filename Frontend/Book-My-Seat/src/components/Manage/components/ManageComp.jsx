import React, { useState } from 'react';
import Button from '@mui/material/Button';
import "../styles/ManageComp.css";
import ProjectComp from '../../project/components/EditProject';
import LocationComp from '../../Location/Components/location';
import EditHolidayComp from '../../HolidayComponent/component/EditHolidayComp';

function ManageComp() {
  const [activeComponent, setActiveComponent] = useState('project'); 

  const handleButtonClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="Manage-Container">
      <div className='Manage-Button-Container'>
        <Button
          variant="contained"
          color={activeComponent === 'project' ? 'secondary' : 'primary'}
          onClick={() => handleButtonClick('project')}
        >
          Project
        </Button>
        <Button
          variant="contained"
          color={activeComponent === 'location' ? 'secondary' : 'primary'}
          onClick={() => handleButtonClick('location')}
        >
          Location
        </Button>
        <Button
          variant="contained"
          color={activeComponent === 'holiday' ? 'secondary' : 'primary'}
          onClick={() => handleButtonClick('holiday')}
        >
          Holiday
        </Button>
      </div>

      <div className='Manage-Content-Container'>
        {activeComponent === 'project' && <ProjectComp />}
        {activeComponent === 'location' && <LocationComp />}
        {activeComponent === 'holiday' && <EditHolidayComp />}
      </div>
    </div>
  );
}

export default ManageComp;

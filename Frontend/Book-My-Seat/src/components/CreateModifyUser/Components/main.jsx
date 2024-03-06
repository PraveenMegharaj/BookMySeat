import React, { useState } from 'react';
import CreateUser from './createUser';
import ModifyUser from './modifyUser';
import '../styles/main.css'

const UserMain=() =>{
  const [activeCard, setActiveCard] = useState('createuser'); 

  const handleModifyUserClick = () => {
    setActiveCard('modifyuser');
  };

  const handleAddNewUserClick = () => {
    setActiveCard('createuser');
  };

  return (
    <div className='UserEditContainer'>
      <div className="UserEditButtonContainer">
        <button
          className={`userButton btn btn-primary ${activeCard === 'createuser' ? 'active' : ''}`}
          onClick={handleAddNewUserClick}
        >
          Create User
        </button>
        <button
          className={`userButton btn btn-primary ${activeCard === 'modifyuser' ? 'active' : ''}`}
          onClick={handleModifyUserClick}
        >
          Modify User
        </button>
        
      </div>

      <div className="UserEditCardsContainer">
        {activeCard === 'createuser' && (
          <div className="UserEditCard">
            <CreateUser/>
          </div>
        )}
        {activeCard === 'modifyuser' && (
          <div className="UserEditCard">
            <ModifyUser/>
          </div>
        )}

        
      </div>
    </div>
  );
}

export default UserMain;
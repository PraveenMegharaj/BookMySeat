import React, { useEffect, useState } from 'react';
import '../styles/UserHolidayComp.css'; 
import axios from '../../../Services/axiosToken';

function UserDashboardFourthComp() {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const apiURL = 'http://localhost:5000/bookmyseat/admin/holidays';

    axios.get(apiURL)
      .then((response) => setHolidays(response.data))
      .catch((error) => console.error('Error fetching holidays:', error));
  }, []);

  // const currentMonth = 4;
  const currentMonth = new Date().getMonth() + 1;

  const currentMonthHolidays = holidays.filter((holiday) => {
    const holidayMonth = new Date(holiday.holidayDate).getMonth() + 1;
    return holidayMonth === currentMonth;
  });

  return (
    <div className='UserDashboardFourthComp'>
      <div className='holidayCardContent'>        

        {currentMonthHolidays.length === 0 ? (
          <div className='noHolidaysCard'>
            <p className='noHolidaysCardParagraph'>No holidays for {new Date().toLocaleString('default', { month: 'long' })}. </p>
          </div>
        ) : (
          <div className='holidayCard'>
            <div>
              {currentMonthHolidays.map((holiday) => (
                <div key={holiday.id} className='holidayItem'>
                  <div className='holidaycontent'>
                    {`${holiday.holidayMonth.slice(0, 3)} - ${new Date(holiday.holidayDate).getDate()}, ${new Date(
                      holiday.holidayDate
                    ).getFullYear()}`}{' '}</div>
                    <div className='holidaycontent'><h5>{holiday.holidayName}</h5></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboardFourthComp;

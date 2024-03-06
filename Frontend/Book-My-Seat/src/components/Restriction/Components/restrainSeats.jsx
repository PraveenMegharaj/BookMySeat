import { useEffect, useState } from "react"
import axios from '../../../Services/axiosToken';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import "../styles/restrainSeat.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RestrainSeat = () => {
  const [restrainData,setRestrainData] = useState([])
  const [checkedData, setCheckedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFloor, setSelectedFloor] = useState(null);

  
  useEffect(() => {
    fetchData()
  }, [])
  
  useEffect(() => {
    const filteredData = filterData(restrainData, searchTerm);
    setFilteredData(filteredData);
  }, [restrainData, searchTerm]);
  
/*   useEffect(() => {
    console.log(checkedData);
    console.log(selectedFloor)
  }, [checkedData,selectedFloor]); */
  
  const floors = [
    { id: 1, title: "Ground Floor" },
    { id: 2, title: "Mezzanine Floor" },
    { id: 3, title: "First Floor" },
    { id: 4, title: "Second Floor" },
    { id: 5, title: "Third Floor" },
    { id: 6, title: "Training Room" }
  ];

  const handleCheckboxChange = (userId) => {
    setCheckedData(prevCheckedData => {
      if (prevCheckedData.includes(userId)) {
        return prevCheckedData.filter(id => id !== userId);
      } else {
        return [...prevCheckedData, userId];
      }
    });
  };

  const fetchData = () => {
    axios.get(`http://localhost:5000/bookmyseat/admin/approved`)
      .then(response => {
        setRestrainData(response.data)
        setFilteredData(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error fetching floor data:', error)
      })
  }

  const restrainUsers = () => {
    if(!checkedData.length){
      toast.warn("Select Users to for Restriction")
      return
    }
    if(!selectedFloor){
      toast.warn("Select Floor for Restriction")
      return
    }
    axios.post('http://localhost:5000/bookmyseat/admin/restrainusers', {
      userId: checkedData,
      floor_id: selectedFloor
    })
      .then(response => {
        console.log(response.data);
        const restrainedUsers = checkedData.map(userId => {
          const user = filteredData.find(item => item.userId === userId);
          return user.firstName;
        });
        const restrainedUsersString = restrainedUsers.join(', ');
        toast.success(`Restriction added to Users: ${restrainedUsersString}`);
        setCheckedData([]);
        setSelectedFloor(null)
      })
      .catch(error => {
        console.error('Error restraining users:', error);
        toast.error(error)
      });
  };

  const filterData = (data, term) => {
    return data.filter(item => {
      const userIdMatch = item.userId.toString().includes(term.toLowerCase());
      const firstNameMatch = item.firstName.toLowerCase().includes(term.toLowerCase());
      return userIdMatch || firstNameMatch;
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFloorSelect = (floor) => {
    setSelectedFloor(floor);
  };

  return(
    <div className="restrain-layout">
      <h2 className="restrain-head">Restrain Seats</h2>
      <div className="restrain-header">
        <div className="input-group mb-2 restrain-input">
          <input type="text" className="form-control border-primary" placeholder="Search." onChange={handleSearchChange}/>
        </div>
        <div className="restrain-dropdown">
        <DropdownButton id="dropdown-basic-button" title={selectedFloor ? floors.find(floor => floor.id === selectedFloor)?.title : "Select Floor"}>
            {floors.map(floor => (
              <Dropdown.Item key={floor.id} onClick={() => handleFloorSelect(floor.id)}>{floor.title}</Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
        <div className="restrain-button">
          <Button variant="warning" onClick={restrainUsers}>Restrain Seat</Button>
        </div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr id='table-header'> 
            <th></th>
            <th scope="col">User ID</th>
            <th scope="col">Employee Name</th>
            <th scope="col">Email ID</th>
            <th scope="col">Project</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item,idx) => (
            <tr key={idx}  className={(checkedData.includes(item.userId) || item.checked) ? 'pinned-row' : ''}>
              <td><input type="checkbox" onChange={() => handleCheckboxChange(item.userId)} checked={checkedData.includes(item.userId)}/></td>
              <td>{item.userId}</td>
              <td>{item.firstName} {item.lastName}</td>
              <td>{item.emailId}</td>
              <td>{item.project.projectId}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={true}
            style={{
              width: '300px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          />
    </div>
  )
}
export default RestrainSeat
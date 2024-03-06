import axios from '../Services/axiosToken';

const USERS_REST_API_URL = "http://localhost:5000/bookmyseat/admin/dashboard";

class DashBoardService {
    getUsers() {
        return axios.get(USERS_REST_API_URL);
    }
}

const dashboardServiceInstance = new DashBoardService();

export default dashboardServiceInstance;


const REQUESTS_REST_API_URL = "http://localhost:5000/bookmyseat/admin";

const updateRequestStatus = async (request) => {
  try {
    const response = await axios.put(`${REQUESTS_REST_API_URL}/request/update`, request);
    console.log("Response from backend:", response.data);
    return response.data; 
  } catch (error) {
    throw new Error("Error updating request status: " + error.message);
  }
};

const getRequests = async () => {
  try {
    const response = await axios.get(`${REQUESTS_REST_API_URL}/requests`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching pending requests: " + error.message);
  }
};

export { updateRequestStatus, getRequests };

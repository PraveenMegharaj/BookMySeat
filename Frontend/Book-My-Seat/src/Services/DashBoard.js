import axios from '../Services/axiosToken';

const USERS_REST_API_URL = "http://localhost:5000/bookmyseat/admin/dashboard";

class DashBoardService {
    getUsers() {
        return axios.get(USERS_REST_API_URL);
    }
}

const dashboardServiceInstance = new DashBoardService();

export default dashboardServiceInstance;

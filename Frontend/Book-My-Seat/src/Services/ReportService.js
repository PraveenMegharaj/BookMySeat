import axios from '../Services/axiosToken';

const USERS_REST_API_URL = "http://localhost:5000/bookmyseat/admin/reports";

class ReportService {
    getUsers() {
        return axios.get(USERS_REST_API_URL);
    }
}

const ReportServiceInstance = new ReportService();

export default ReportServiceInstance;

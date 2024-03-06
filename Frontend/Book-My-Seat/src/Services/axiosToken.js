import axios from 'axios';
import { getToken} from './AuthService';

const instance = axios.create({
  baseURL: 'http://localhost:5000/bookmyseat',
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = getToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;

import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/',
  // withCredentials: true, // Uncomment if using cookies
});

API.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token'); // or localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default API;

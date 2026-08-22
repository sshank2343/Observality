import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT to every outgoing request automatically
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('obs_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global handling for expired/invalid tokens — redirect to login
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('obs_token');
      localStorage.removeItem('obs_user');
      localStorage.removeItem('obs_org_id');
      // Full reload ensures all React state resets cleanly on auth failure
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
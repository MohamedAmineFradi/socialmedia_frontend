import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({ baseURL: 'http://localhost:8084/api' });

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  const user = useAuthStore.getState().user;
  
  // Send Authorization header for all real tokens
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Send frontend username for libertalk profile
  if (user?.username) {
    config.headers['X-Frontend-User'] = user.username;
  }
  
  return config;
});

// Add response interceptor to handle errors gracefully
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Backend may not be running:', error.message);
      // Don't throw the error, return a rejected promise with a custom message
      return Promise.reject(new Error('Backend server is not available. Please check if the backend is running on port 8084.'));
    }
    return Promise.reject(error);
  }
);

export default api;
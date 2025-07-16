import axios from 'axios';
// Remove direct import of the store
// import { store } from '@/store/store';

let getStateAccessor = null;

export function setStoreAccessors({ getState }) {
  getStateAccessor = getState;
}

const api = axios.create({ baseURL: 'http://localhost:8084/api' });

api.interceptors.request.use(config => {
  // Use the injected getState accessor
  const state = getStateAccessor ? getStateAccessor() : {};
  const token = state.auth?.token;
  const user = state.auth?.user;
  
  // Send Authorization header for all real tokens
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Send frontend username for libertalk profile
  if (user?.username) {
    config.headers['X-Frontend-User'] = user.username;
  }

  // Debug: log headers to confirm Authorization is set
  console.log('API request headers:', config.headers);
  
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
import axios from 'axios';

let getStateAccessor = null;

export function setStoreAccessors({ getState }) {
  getStateAccessor = getState;
}

const api = axios.create({ baseURL: 'http://localhost:8084/api' });

api.interceptors.request.use(config => {
  const state = getStateAccessor ? getStateAccessor() : {};
  const token = state.auth?.token;
  const user = state.auth?.user;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (user?.username) {
    config.headers['X-Frontend-User'] = user.username;
  }

  console.log('API request headers:', config.headers);
  console.log('API request data:', config.data);
  
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Backend may not be running:', error.message);
      return Promise.reject(new Error('Backend server is not available. Please check if the backend is running on port 8084.'));
    }
    return Promise.reject(error);
  }
);

export default api;
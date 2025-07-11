import api from './api';

export const getUser = async (userId) => {
  const { data } = await api.get(`/users/${userId}`);
  return data;
};

export const getAllUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

export const updateUser = async (userId, userData) => {
  const { data } = await api.put(`/users/${userId}`, userData);
  return data;
}; 
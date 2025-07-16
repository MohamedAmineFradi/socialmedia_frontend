import api from './api';

export const getProfileByUserId = async (userId) => {
  console.log('Fetching profile for user ID:', userId);
  if (userId === null || userId === undefined || userId === '' || Number.isNaN(Number(userId))) {
    console.warn('getProfileByUserId: userId is invalid, skipping API call. userId =', userId);
    return null;
  }
  try {
    // Use the public endpoint that works for both self and other users
    const { data } = await api.get(`/profiles/find/user/${userId}`);
    console.log('Profile data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const createProfileForUser = async (userId, profileData) => {
  const { data } = await api.post(`/profiles/user/${userId}`, profileData);
  return data;
};

export const updateProfile = async (userId, profileData) => {
  const { data } = await api.put(`/profiles/${userId}`, profileData);
  return data;
};

export const deleteProfile = async (profileId) => {
  const { data } = await api.delete(`/profiles/${profileId}`);
  return data;
}; 
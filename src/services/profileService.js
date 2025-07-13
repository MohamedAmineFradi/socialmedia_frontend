import api from './api';

export const getProfileByUserId = async (userId) => {
  console.log('Fetching profile for user ID:', userId);
  try {
    const { data } = await api.get(`/profiles/user/${userId}`);
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

export const updateProfile = async (profileId, profileData) => {
  const { data } = await api.put(`/profiles/${profileId}`, profileData);
  return data;
};

export const deleteProfile = async (profileId) => {
  const { data } = await api.delete(`/profiles/${profileId}`);
  return data;
}; 
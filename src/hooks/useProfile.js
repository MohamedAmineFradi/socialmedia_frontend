import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile, updateProfile } from '@/store/profileSlice';
import { useEffect, useRef } from 'react';

export default function useProfile(userId) {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.profile.entities[userId]);
  const loading = useSelector(state => state.profile.loadingById[userId] || false);
  const error = useSelector(state => state.profile.error);

  const prevUserId = useRef();

  useEffect(() => {
    const shouldFetch = userId && userId !== prevUserId.current && !profile;
    
    if (shouldFetch) {
      dispatch(fetchProfile(userId));
    }
    
    prevUserId.current = userId;
  }, [userId, dispatch, profile]);

  const handleUpdateProfile = (profileData) => dispatch(updateProfile({ userId, profileData }));

  return { profile, loading, error, handleUpdateProfile };
}
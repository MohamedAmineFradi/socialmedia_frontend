import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile, updateProfile, clearProfile } from '@/store/profileSlice';
import { useEffect, useRef } from 'react';

export default function useProfile(userId) {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.profile.entities[userId]);
  const loading = useSelector(state => state.profile.loadingById[userId] || false);
  const error = useSelector(state => state.profile.error);

  const prevUserId = useRef();

  useEffect(() => {
    if (prevUserId.current && prevUserId.current !== userId) {
      dispatch(clearProfile());
    }
    
    const shouldFetch = userId !== null && userId !== undefined && userId !== '' && !Number.isNaN(Number(userId)) &&
      (prevUserId.current !== userId || !profile);

    prevUserId.current = userId;
    // Only dispatch if necessary
    if (shouldFetch) {
      dispatch(fetchProfile(userId));
    } else {
      if (userId !== undefined && (userId === null || userId === '' || Number.isNaN(Number(userId)))) {
        console.warn('useProfile: userId is invalid, skipping fetchProfile. userId =', userId);
      }
    }
  }, [userId, dispatch, profile]);

  const handleUpdateProfile = (profileData) => dispatch(updateProfile({ userId, profileData }));

  return { profile, loading, error, handleUpdateProfile };
} 
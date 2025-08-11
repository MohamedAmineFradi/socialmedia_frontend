import { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import api from '@/services/api';

export default function useUserDbId() {
  const { user, authenticated, isAuthenticated: legacyIsAuth } = useAuth();
  const isAuthenticated = authenticated ?? legacyIsAuth;
  const [userDbId, setUserDbId] = useState(null);
  const [loadingUserId, setLoadingUserId] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user && typeof user.id === 'number') {
      setUserDbId(user.id);
      setLoadingUserId(false);
    } else if (isAuthenticated && user && !userDbId) {
      setLoadingUserId(true);
      api.get('/users/me')
        .then(res => setUserDbId(res.data.id))
        .catch(() => setUserDbId(null))
        .finally(() => setLoadingUserId(false));
    }
  }, [isAuthenticated, authenticated, legacyIsAuth, user, userDbId]);

  return { userDbId, loadingUserId };
} 
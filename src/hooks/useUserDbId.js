import { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import api from '@/services/api';

export default function useUserDbId() {
  // useAuth returns { authenticated, user } (plus token, keycloak). Fall back to isAuthenticated for backward compatibility
  const { user, authenticated, isAuthenticated: legacyIsAuth } = useAuth();
  const isAuthenticated = authenticated ?? legacyIsAuth;
  const [userDbId, setUserDbId] = useState(null);
  const [loadingUserId, setLoadingUserId] = useState(true);

  useEffect(() => {
    // If user.id is a number, it's the DB user ID, use it directly
    if (isAuthenticated && user && typeof user.id === 'number') {
      setUserDbId(user.id);
      setLoadingUserId(false);
    } else if (isAuthenticated && user && !userDbId) {
      // Otherwise, fetch from backend
      setLoadingUserId(true);
      api.get('/users/me')
        .then(res => setUserDbId(res.data.id))
        .catch(() => setUserDbId(null))
        .finally(() => setLoadingUserId(false));
    }
  }, [isAuthenticated, authenticated, legacyIsAuth, user, userDbId]);

  return { userDbId, loadingUserId };
} 
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login as loginAction, logout as logoutAction, setUser, setToken } from '@/store/authSlice';
import { clearProfile } from '@/store/profileSlice';
import { resetPosts } from '@/store/postsSlice';
import { clearComments } from '@/store/commentsSlice';
import { clearReactions } from '@/store/reactionsSlice';
import authService, { extractRolesFromToken } from '@/services/auth/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default function AuthProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);

  // Ensure component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Initializing Keycloak authentication...');
        const authenticated = await authService.init();
        
        if (authenticated) {
          console.log('User is authenticated with Keycloak');
          // Extract roles from token and set in Redux user
          const token = authService.token || (authService.keycloak && authService.keycloak.token);
          if (token) {
            const roles = extractRolesFromToken(token);
            dispatch(setUser({ ...authService.user, roles }));
          }
        } else {
          console.log('User is not authenticated');
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setError(error.message || 'Authentication service unavailable');
        setIsInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [mounted]);

  const handleLogin = async () => {
    try {
      setError(null);
      await authService.login();
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutAction());
      dispatch(clearProfile());
      dispatch(resetPosts());
      dispatch(clearComments());
      dispatch(clearReactions());
    } catch (error) {
      console.error('Logout failed:', error);
      setError(error.message || 'Logout failed.');
    }
  };

  // Stable helper callbacks to prevent re-creation on each render.
  const hasRole = useCallback((role) => {
    return user?.roles?.includes(role);
  }, [user]);

  const isSuperAdmin = useCallback(() => {
    return user?.roles?.includes('superAdmin');
  }, [user]);

  const refreshUserRoles = useCallback(() => {
    return authService.refreshUserRoles ? authService.refreshUserRoles() : undefined;
  }, []);

  const value = {
    isAuthenticated,
    user,
    isLoading,
    isInitialized,
    error,
    login: handleLogin,
    logout: handleLogout,
    hasRole,
    isSuperAdmin,
    refreshUserRoles,
  };

  // Don't render anything until mounted on client
  if (!mounted) {
    return null;
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009ddb] mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing authentication...</p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">Error: {error}</p>
              <p className="text-red-500 text-xs mt-2">
                Make sure Keycloak is running and the client is configured properly
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 
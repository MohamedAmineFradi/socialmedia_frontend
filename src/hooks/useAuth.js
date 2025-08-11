"use client";
import { useSelector } from 'react-redux';

export default function useAuth() {
  const keycloak = null; 
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const authenticated = useSelector(state => state.auth.isAuthenticated);

  return { keycloak, token, authenticated, user };
}
"use client";
import { useEffect, useState } from 'react';
import keycloak from '@/services/auth/keycloak';

export default function useAuth() {
  const [kc, setKc] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    keycloak.init({ onLoad: 'login-required' }).then(auth => {
      if (auth) {
        setKc(keycloak);
        setToken(keycloak.token);
        // refresh token every 60 s
        setInterval(() => keycloak.updateToken(30).then(r => r && setToken(keycloak.token)), 60000);
      }
    });
  }, []);

  return { keycloak: kc, token, authenticated: !!token, user: kc?.tokenParsed };
}
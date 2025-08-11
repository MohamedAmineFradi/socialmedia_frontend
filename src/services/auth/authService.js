import keycloak from './keycloak';
import { store } from '@/store/store';
import { login as loginAction, logout as logoutAction, setUser, setToken } from '@/store/authSlice';
import api from '@/services/api';

class AuthService {
  constructor() {
    this.keycloak = keycloak;
    this.initialized = false;
  }

  async init() {
    try {
      if (this.initialized) {
        return this.keycloak.authenticated;
      }

      console.log('Initializing Keycloak...');
      console.log('Keycloak instance:', this.keycloak);
      
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false,
        enableLogging: true,
        pkceMethod: 'S256'
      });

      console.log('Keycloak initialized, authenticated:', authenticated);
      this.initialized = true;

      if (authenticated) {
        await this.handleSuccessfulAuth();
      }

      return authenticated;
    } catch (error) {
      console.error('Keycloak initialization failed:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        keycloak: this.keycloak
      });
      
      let errorMessage = 'Keycloak initialization failed';
      if (error.message.includes('NetworkError')) {
        errorMessage = 'Cannot connect to Keycloak server. Please check if Keycloak is running on http://localhost:8081';
      } else if (error.message.includes('client')) {
        errorMessage = 'Keycloak client not found. Please check if the client "social-media-frontend" is configured in Keycloak';
      } else if (error.message.includes('realm')) {
        errorMessage = 'Keycloak realm not found. Please check if the realm "libertalk" exists in Keycloak';
      }
      
      throw new Error(errorMessage);
    }
  }

  async login() {
    try {
      console.log('Starting Keycloak login...');
      await this.keycloak.login({
        redirectUri: window.location.origin + '/posts'
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async logout() {
    try {
      console.log('Starting Keycloak logout...');
      await this.keycloak.logout({
        redirectUri: window.location.origin
      });
      store.dispatch(logoutAction());
    } catch (error) {
      console.error('Logout failed:', error);
      store.dispatch(logoutAction());
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  async handleSuccessfulAuth() {
    console.log('Handling successful authentication...');
    const token = this.keycloak.token;
    if (token) {
      store.dispatch(setToken(token));
    }
    
    let backendUserInfo = null;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`Attempting to get backend user info (attempt ${retryCount + 1}/${maxRetries})...`);
        const response = await api.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        backendUserInfo = response.data;
        console.log('Backend user info:', backendUserInfo);
        break;
      } catch (error) {
        retryCount++;
        console.error(`Failed to get backend user info (attempt ${retryCount}/${maxRetries}):`, error);
        if (error.response?.status === 404 && retryCount < maxRetries) {
          console.log('User not found in database, waiting before retry...');
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          continue;
        } else {
          console.error('Failed to get backend user info after retries');
          break;
        }
      }
    }
    
    const user = {
      id: backendUserInfo?.id || this.keycloak.subject,
      keycloakId: this.keycloak.subject,
      username: this.keycloak.tokenParsed?.preferred_username,
      email: this.keycloak.tokenParsed?.email,
      firstName: this.keycloak.tokenParsed?.given_name,
      lastName: this.keycloak.tokenParsed?.family_name,
      roles: backendUserInfo?.roles || this.getDefaultRoles(this.keycloak.tokenParsed?.preferred_username)
    };

    console.log('User data with roles:', user);
    store.dispatch(loginAction({ token, user }));

    this.keycloak.onTokenExpired = () => {
      console.log('Token expired, refreshing...');
      this.keycloak.updateToken(70).then((refreshed) => {
        if (refreshed) {
          console.log('Token refreshed successfully');
          store.dispatch(setToken(this.keycloak.token));
        }
      }).catch((error) => {
        console.error('Token refresh failed:', error);
        this.logout();
      });
    };
  }

  getDefaultRoles(username) {
    if (username === 'admin') {
      return ['superAdmin'];
    } else {
      return ['user'];
    }
  }

  async getUserInfo() {
    try {
      const response = await api.get('/users/me');
      const backendUserInfo = response.data;
      const currentUser = store.getState().auth.user;
      if (currentUser && backendUserInfo?.roles) {
        const updatedUser = {
          ...currentUser,
          roles: backendUserInfo.roles
        };
        store.dispatch(setUser(updatedUser));
      }
      return backendUserInfo;
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('User not found in database yet, this is normal during first login');
        return null;
      } else {
        console.error('Failed to get user info:', error);
        return null;
      }
    }
  }

  isAuthenticated() {
    return store.getState().auth.isAuthenticated;
  }

  getToken() {
    return store.getState().auth.token;
  }

  getUser() {
    return store.getState().auth.user;
  }

  hasRole(role) {
    const user = this.getUser();
    return user?.roles?.includes(role) || false;
  }

  isSuperAdmin() {
    return this.hasRole('superAdmin');
  }

  async refreshUserRoles() {
    try {
      const backendUserInfo = await this.getUserInfo();
      if (backendUserInfo?.roles) {
        const currentUser = this.getUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            roles: backendUserInfo.roles
          };
          store.dispatch(setUser(updatedUser));
          console.log('User roles refreshed:', backendUserInfo.roles);
        }
      } else {
        console.log('No backend user info available, using default roles');
      }
    } catch (error) {
      console.error('Failed to refresh user roles:', error);
    }
  }
}

const authService = new AuthService();
export default authService; 

export function extractRolesFromToken(token) {
  if (!token) return [];
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.realm_access?.roles || [];
  } catch (e) {
    return [];
  }
}
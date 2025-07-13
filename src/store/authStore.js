import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  
  setToken: (token) => set({ token, isAuthenticated: !!token }),
  setUser: (user) => set({ user }),
  updateUser: (updatedUser) => {
    const currentState = get();
    const newUser = { ...currentState.user, ...updatedUser };
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    set({ user: newUser });
  },
  logout: () => set({ token: null, user: null, isAuthenticated: false }),
  
  // Initialize auth state from localStorage
  initializeAuth: () => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    if (token && user) {
      set({ 
        token, 
        user: JSON.parse(user), 
        isAuthenticated: true 
      });
    }
  },
  
  // Login function
  login: (token, user) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  
  // Logout function
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ token: null, user: null, isAuthenticated: false });
  }
})); 
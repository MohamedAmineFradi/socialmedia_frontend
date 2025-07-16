import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import postsReducer from './postsSlice';
import commentsReducer from './commentsSlice';
import profileReducer from './profileSlice';
import reactionsReducer from './reactionsSlice';
import { setStoreAccessors } from '../services/api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    comments: commentsReducer,
    profile: profileReducer,
    reactions: reactionsReducer,
    // Ajoute d'autres reducers ici si besoin
  },
});

// Make Redux state accessible to API service for auth headers
setStoreAccessors({ getState: store.getState }); 
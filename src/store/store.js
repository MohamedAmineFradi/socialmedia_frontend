import { configureStore } from '@reduxjs/toolkit';
import messagingReducer from './messagingSlice';
import authReducer from './authSlice';
import postsReducer from './postsSlice';
import commentsReducer from './commentsSlice';
import profileReducer from './profileSlice';
import reactionsReducer from './reactionsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    comments: commentsReducer,
    profile: profileReducer,
    reactions: reactionsReducer,
    messaging: messagingReducer,
  },
});
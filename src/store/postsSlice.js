import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPosts, getUserPosts, addPost as addPostApi, editPost as editPostApi, deletePost as deletePostApi } from '@/services/postService';

// Avoid duplicate fetches if we already have data or a request in flight
export const fetchGlobalPosts = createAsyncThunk(
  'posts/fetchGlobalPosts',
  async () => {
    return await getPosts(); // No userId param
  },
  {
    condition: (_arg, { getState }) => {
      const { posts } = getState();
      const haveData = (posts.global ?? []).length > 0;
      const hasError = !!posts.error;
      const alreadyLoaded = posts.loadedGlobal;
      // If loading, have data, already loaded once, or error – skip
      if (posts.loadingGlobal || haveData || alreadyLoaded || hasError) {
        return false;
      }
      return true;
    }
  }
);

// Fetch posts for a specific user – skip if cached or in-flight
export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async (rawUserId) => {
    const userId = String(rawUserId);
    return await getUserPosts(userId);
  },
  {
    condition: (rawUserId, { getState }) => {
      const userId = String(rawUserId);
      const { posts } = getState();
      if (!userId) return false; // invalid arg → skip

      const alreadyLoading = posts.loadingByUserId[userId];
      const alreadyHaveData = (posts.byUserId[userId] ?? []).length > 0;
      const alreadyLoadedOnce = posts.loadedByUserId[userId];
      const hasError = !!posts.error;
      if (alreadyLoading || alreadyHaveData || alreadyLoadedOnce || hasError) {
        return false;
      }
      return true;
    }
  }
);

export const addPost = createAsyncThunk('posts/addPost', async ({ userId, content }) => {
  return await addPostApi(userId, { content });
});
export const editPost = createAsyncThunk('posts/editPost', async ({ postId, userId, content }) => {
  return await editPostApi(postId, userId, { content });
});
export const deletePost = createAsyncThunk('posts/deletePost', async ({ postId, userId }) => {
  await deletePostApi(postId, userId);
  return { postId, userId };
});

const initialPostsState = {
  global: [],
  byUserId: {}, // { [userId]: [posts] }
  loadingGlobal: false,
  loadedGlobal: false,
  loadingByUserId: {},
  loadedByUserId: {},
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState: initialPostsState,
  reducers: {
    clearGlobalPosts(state) {
      state.global = [];
      state.loadingGlobal = false;
      state.loadedGlobal = false;
      state.error = null;
    },
    clearUserPosts(state, action) {
      const userId = action.payload;
      state.byUserId[userId] = [];
      state.loadingByUserId[userId] = false;
      state.loadedByUserId[userId] = false;
      state.error = null;
    },
    resetPosts() {
      return initialPostsState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Global feed
      .addCase(fetchGlobalPosts.pending, (state) => {
        state.loadingGlobal = true;
        state.loadedGlobal = false;
        state.error = null;
      })
      .addCase(fetchGlobalPosts.fulfilled, (state, action) => {
        state.loadingGlobal = false;
        state.loadedGlobal = true;
        state.global = action.payload;
      })
      .addCase(fetchGlobalPosts.rejected, (state, action) => {
        state.loadingGlobal = false;
        state.loadedGlobal = true;
        state.error = action.error.message;
      })
      // User posts
      .addCase(fetchUserPosts.pending, (state, action) => {
        const userId = action.meta.arg;
        state.loadingByUserId[userId] = true;
        state.loadedByUserId[userId] = false;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        const userId = action.meta.arg;
        state.loadingByUserId[userId] = false;
        state.loadedByUserId[userId] = true;
        state.byUserId[userId] = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        const userId = action.meta.arg;
        state.loadingByUserId[userId] = false;
        state.loadedByUserId[userId] = true;
        state.error = action.error.message;
      })
      // Add/Edit/Delete: update both global and user-specific if needed
      .addCase(addPost.fulfilled, (state, action) => {
        const post = action.payload;
        state.global.unshift(post);
        const userId = post.userId || post.authorId;
        if (userId) {
          if (!state.byUserId[userId]) state.byUserId[userId] = [];
          state.byUserId[userId].unshift(post);
        }
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const post = action.payload;
        // Update in global
        const idxGlobal = state.global.findIndex(p => p.id === post.id);
        if (idxGlobal !== -1) state.global[idxGlobal] = post;
        // Update in user
        const userId = post.userId || post.authorId;
        if (userId && state.byUserId[userId]) {
          const idxUser = state.byUserId[userId].findIndex(p => p.id === post.id);
          if (idxUser !== -1) state.byUserId[userId][idxUser] = post;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const { postId, userId } = action.payload;
        state.global = state.global.filter(p => p.id !== postId);
        if (userId && state.byUserId[userId]) {
          state.byUserId[userId] = state.byUserId[userId].filter(p => p.id !== postId);
        }
      })
      // Optimistic update for addReaction
      .addCase(require('@/store/reactionsSlice').addReaction.pending, (state, action) => {
        const { postId, userId, reactionType } = action.meta.arg;
        // Update in global
        const idxGlobal = state.global.findIndex(p => p.id === postId);
        if (idxGlobal !== -1) {
          const post = state.global[idxGlobal];
          // Remove previous reaction effect
          if (post.userReaction) {
            if (post.userReaction.type === 'LIKE') post.likes = Math.max(0, (post.likes || 0) - 1);
            if (post.userReaction.type === 'DISLIKE') post.dislikes = Math.max(0, (post.dislikes || 0) - 1);
          }
          // Add new reaction effect
          if (reactionType === 'LIKE') post.likes = (post.likes || 0) + 1;
          if (reactionType === 'DISLIKE') post.dislikes = (post.dislikes || 0) + 1;
          post.userReaction = { type: reactionType, id: 'optimistic' };
        }
        // Update in user
        Object.keys(state.byUserId).forEach(uid => {
          const idxUser = state.byUserId[uid]?.findIndex(p => p.id === postId);
          if (idxUser !== -1) {
            const post = state.byUserId[uid][idxUser];
            if (post.userReaction) {
              if (post.userReaction.type === 'LIKE') post.likes = Math.max(0, (post.likes || 0) - 1);
              if (post.userReaction.type === 'DISLIKE') post.dislikes = Math.max(0, (post.dislikes || 0) - 1);
            }
            if (reactionType === 'LIKE') post.likes = (post.likes || 0) + 1;
            if (reactionType === 'DISLIKE') post.dislikes = (post.dislikes || 0) + 1;
            post.userReaction = { type: reactionType, id: 'optimistic' };
          }
        });
      })
      // Rollback on addReaction.rejected
      .addCase(require('@/store/reactionsSlice').addReaction.rejected, (state, action) => {
        const { postId } = action.meta.arg;
        // Refetch or reset userReaction to null (or previous state if you store it)
        const idxGlobal = state.global.findIndex(p => p.id === postId);
        if (idxGlobal !== -1) {
          const post = state.global[idxGlobal];
          post.userReaction = null;
        }
        Object.keys(state.byUserId).forEach(uid => {
          const idxUser = state.byUserId[uid]?.findIndex(p => p.id === postId);
          if (idxUser !== -1) {
            const post = state.byUserId[uid][idxUser];
            post.userReaction = null;
          }
        });
      })
      // Optimistic update for deleteReaction
      .addCase(require('@/store/reactionsSlice').deleteReaction.pending, (state, action) => {
        const { postId } = action.meta.arg;
        // Remove userReaction and decrement count
        const idxGlobal = state.global.findIndex(p => p.id === postId);
        if (idxGlobal !== -1) {
          const post = state.global[idxGlobal];
          if (post.userReaction) {
            if (post.userReaction.type === 'LIKE') post.likes = Math.max(0, (post.likes || 0) - 1);
            if (post.userReaction.type === 'DISLIKE') post.dislikes = Math.max(0, (post.dislikes || 0) - 1);
          }
          post.userReaction = null;
        }
        Object.keys(state.byUserId).forEach(uid => {
          const idxUser = state.byUserId[uid]?.findIndex(p => p.id === postId);
          if (idxUser !== -1) {
            const post = state.byUserId[uid][idxUser];
            if (post.userReaction) {
              if (post.userReaction.type === 'LIKE') post.likes = Math.max(0, (post.likes || 0) - 1);
              if (post.userReaction.type === 'DISLIKE') post.dislikes = Math.max(0, (post.dislikes || 0) - 1);
            }
            post.userReaction = null;
          }
        });
      })
      // Rollback on deleteReaction.rejected
      .addCase(require('@/store/reactionsSlice').deleteReaction.rejected, (state, action) => {
        // Could refetch or restore previous state if you store it
        // For now, do nothing (or trigger a refetch elsewhere)
      });
  }
});

export const { clearGlobalPosts, clearUserPosts, resetPosts } = postsSlice.actions;
export default postsSlice.reducer; 
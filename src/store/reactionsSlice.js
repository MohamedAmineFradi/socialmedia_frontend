import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addReaction as addReactionApi, deleteReaction as deleteReactionApi } from '@/services/postService';

export const addReaction = createAsyncThunk('reactions/addReaction', async ({ postId, userId, reactionType }) => {
  await addReactionApi(postId, userId, reactionType);
  return { postId, reactionType };
});

export const deleteReaction = createAsyncThunk('reactions/deleteReaction', async ({ reactionId, userId, postId }) => {
  await deleteReactionApi(reactionId, userId);
  return { postId };
});

const reactionsSlice = createSlice({
  name: 'reactions',
  initialState: {
    pending: {}, 
    error: null,
  },
  reducers: {
    clearReactions(state) {
      state.pending = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addReaction.pending, (state, action) => {
        const { postId } = action.meta.arg;
        state.pending[postId] = true;
        state.error = null;
      })
      .addCase(addReaction.fulfilled, (state, action) => {
        const { postId } = action.payload;
        state.pending[postId] = false;
      })
      .addCase(addReaction.rejected, (state, action) => {
        const { postId } = action.meta.arg;
        state.pending[postId] = false;
        state.error = action.error.message;
      })
      .addCase(deleteReaction.pending, (state, action) => {
        const { postId } = action.meta.arg;
        state.pending[postId] = true;
        state.error = null;
      })
      .addCase(deleteReaction.fulfilled, (state, action) => {
        const { postId } = action.payload;
        state.pending[postId] = false;
      })
      .addCase(deleteReaction.rejected, (state, action) => {
        const { postId } = action.meta.arg;
        state.pending[postId] = false;
        state.error = action.error.message;
      });
  }
});

export const { clearReactions } = reactionsSlice.actions;
export default reactionsSlice.reducer; 
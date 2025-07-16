import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getComments, addComment as addCommentApi, editComment as editCommentApi, deleteComment as deleteCommentApi } from '@/services/commentService';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId) => {
    return await getComments(postId);
  },
  {
    condition: (postId, { getState }) => {
      const { comments } = getState();
      const cached = comments.byPost[postId]?.items?.length > 0;
      const loading = comments.byPost[postId]?.loading;
      if (loading || cached) return false;
      return true;
    },
  }
);

export const addComment = createAsyncThunk('comments/addComment', async ({ postId, content }) => {
  return await addCommentApi(postId, { content });
});

export const editComment = createAsyncThunk(
  'comments/editComment',
  async ({ commentId, userId, commentData, postId }) => {
    const updated = await editCommentApi(commentId, userId, commentData);
    // Attach postId for reducer
    return { ...updated, postId };
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ commentId, postId, userId }, { getState }) => {
    const state = getState();
    const finalUserId = userId || state.auth.user?.id;
    await deleteCommentApi(commentId, finalUserId);
    // Return both commentId and postId for reducer
    return { commentId, postId };
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    byPost: {}, // { [postId]: { items: [], loading: false, error: null } }
  },
  reducers: {
    clearComments(state) {
      state.byPost = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state, action) => {
        const postId = action.meta.arg;
        state.byPost[postId] = state.byPost[postId] || { items: [], loading: false, error: null };
        state.byPost[postId].loading = true;
        state.byPost[postId].error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const postId = action.meta.arg;
        state.byPost[postId] = { items: action.payload, loading: false, error: null };
      })
      .addCase(fetchComments.rejected, (state, action) => {
        const postId = action.meta.arg;
        state.byPost[postId] = state.byPost[postId] || { items: [], loading: false, error: null };
        state.byPost[postId].loading = false;
        state.byPost[postId].error = action.error.message;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const postId = action.meta.arg.postId;
        state.byPost[postId] = state.byPost[postId] || { items: [], loading: false, error: null };
        state.byPost[postId].items.push(action.payload);
      })
      .addCase(editComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const { postId } = action.meta.arg;
        if (state.byPost[postId]) {
          const idx = state.byPost[postId].items.findIndex(c => c.id === updatedComment.id);
          if (idx !== -1) {
            state.byPost[postId].items[idx] = updatedComment;
          }
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { commentId, postId } = action.meta.arg;
        if (state.byPost[postId]) {
          state.byPost[postId].items = state.byPost[postId].items.filter(c => c.id !== commentId);
        }
      });
  }
});

export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer; 
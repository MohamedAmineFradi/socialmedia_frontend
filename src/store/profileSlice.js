import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfileByUserId, updateProfile as updateProfileApi } from '@/services/profileService';

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId) => {
    return await getProfileByUserId(userId);
  },
  {
    // Skip if already loading or cached
    condition: (userId, { getState }) => {
      const { profile } = getState();
      if (!userId) return false;
      const alreadyLoading = profile.loadingById[userId];
      const alreadyHave = profile.entities[userId];
      if (alreadyLoading || alreadyHave) return false;
      return true;
    },
  }
);

export const updateProfile = createAsyncThunk('profile/updateProfile', async ({ userId, profileData }) => {
  return await updateProfileApi(userId, profileData);
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    entities: {}, // key: userId, value: profile object
    loadingById: {}, // { [userId]: boolean }
    error: null,
  },
  reducers: {
    clearProfile(state) {
      state.entities = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state, action) => {
        const userId = action.meta.arg;
        state.loadingById[userId] = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        const userId = action.meta.arg; // userId passed to thunk
        state.loadingById[userId] = false;
        if (userId) {
          state.entities[userId] = action.payload;
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        const userId = action.meta.arg;
        state.loadingById[userId] = false;
        state.error = action.error.message;
      })

      .addCase(updateProfile.pending, (state, action) => {
        const userIdUpd = action.meta.arg.userId;
        state.loadingById[userIdUpd] = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated?.userId) {
          state.loadingById[updated.userId] = false;
          state.entities[updated.userId] = updated;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        const failedId = action.meta.arg.userId;
        state.loadingById[failedId] = false;
        state.error = action.error.message;
      });
  }
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer; 
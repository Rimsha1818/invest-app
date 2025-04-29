import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  token: null,
  error: false,
  profile_photo_path: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = false; 
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.token = action.payload.token;
      state.error = false;
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.loading = false;
      state.error = false;
    },
    updateAvatar: (state, action) => {
    state.currentUser.profile_photo_path = action.payload;
},
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateAvatar } = userSlice.actions;
export default userSlice.reducer;

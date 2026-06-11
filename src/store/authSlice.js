import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthSession: (state, action) => {
      const session = action.payload;
      state.session = session;
      state.user = session ? session.user : null;
      state.isAuthenticated = !!session;
      state.loading = false;
    },
    clearAuthSession: (state) => {
      state.session = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setAuthSession, clearAuthSession, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;

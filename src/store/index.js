import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import internshipsReducer from './internshipsSlice';
import uiReducer from './uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    internships: internshipsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Store subscriber for persisting internships list to localStorage
let currentList;
store.subscribe(() => {
  const previousList = currentList;
  const state = store.getState();
  currentList = state.internships.list;

  if (previousList !== currentList) {
    try {
      localStorage.setItem('launchpad_internships', JSON.stringify(currentList));
    } catch (error) {
      // Ignore write errors
    }
  }
});

export default store;

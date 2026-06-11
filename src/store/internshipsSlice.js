import { createSlice } from '@reduxjs/toolkit';

const getInitialList = () => {
  try {
    const saved = localStorage.getItem('launchpad_internships');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  list: getInitialList(),
  filters: {
    status: 'All',
    priority: 'All',
    dateRange: 'All', // 'This week', 'This month', 'All time'
  },
  searchQuery: '',
  viewMode: 'list', // 'list' or 'kanban'
  loading: false,
  error: null,
};

const internshipsSlice = createSlice({
  name: 'internships',
  initialState,
  reducers: {
    setInternships: (state, action) => {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    addInternship: (state, action) => {
      state.list.unshift(action.payload);
    },
    updateInternship: (state, action) => {
      const updatedItem = action.payload;
      const index = state.list.findIndex((item) => item.id === updatedItem.id);
      if (index !== -1) {
        state.list[index] = updatedItem;
      }
    },
    deleteInternship: (state, action) => {
      const id = action.payload;
      state.list = state.list.filter((item) => item.id !== id);
    },
    updateInternshipStatus: (state, action) => {
      const { id, status } = action.payload;
      const internship = state.list.find((item) => item.id === id);
      if (internship) {
        internship.status = status;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setInternshipsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setInternshipsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setInternships,
  addInternship,
  updateInternship,
  deleteInternship,
  updateInternshipStatus,
  setFilters,
  setSearchQuery,
  setViewMode,
  setInternshipsLoading,
  setInternshipsError,
} = internshipsSlice.actions;

export default internshipsSlice.reducer;

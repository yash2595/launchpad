import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modal: {
    open: false,
    type: null, // 'add' | 'edit' | 'delete' | 'browse'
    data: null,
  },
  toast: {
    message: '',
    type: 'info', // 'success' | 'warning' | 'danger' | 'info'
    visible: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showModal: (state, action) => {
      const { type, data } = action.payload;
      state.modal.open = true;
      state.modal.type = type;
      state.modal.data = data || null;
    },
    hideModal: (state) => {
      state.modal.open = false;
      state.modal.type = null;
      state.modal.data = null;
    },
    showToast: (state, action) => {
      const { message, type } = action.payload;
      state.toast.message = message;
      state.toast.type = type || 'info';
      state.toast.visible = true;
    },
    hideToast: (state) => {
      state.toast.visible = false;
    },
  },
});

export const { showModal, hideModal, showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;

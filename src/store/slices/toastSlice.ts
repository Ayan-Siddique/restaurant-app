import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ToastItem {
  id: string;
  type: "warning" | "error" | "info" | "success";
  title: string;
  message: string;
  duration?: number;
}

interface ToastState {
  toasts: ToastItem[];
}

const initialState: ToastState = {
  toasts: [],
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<Omit<ToastItem, "id"> & { id?: string }>
    ) => {
      const id = action.payload.id || `toast-${Date.now()}-${Math.random()}`;
      const item: ToastItem = {
        ...action.payload,
        id,
        duration: action.payload.duration ?? 6000,
      };

      const existingIndex = state.toasts.findIndex((t) => t.id === id);
      if (existingIndex !== -1) {
        state.toasts[existingIndex] = item;
      } else {
        state.toasts.push(item);
      }
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { showToast, removeToast, clearToasts } = toastSlice.actions;

export default toastSlice.reducer;

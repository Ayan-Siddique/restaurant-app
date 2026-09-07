import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ThemeMode ="all" | "veg" | "nonVeg";

interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = {
  mode: "all",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { setMode } = themeSlice.actions;

export default themeSlice.reducer;
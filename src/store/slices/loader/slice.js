// src/store/slices/ui/slice.js
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "loader",
  initialState: {
    loaders: {},
  },
  reducers: {
    startLoader: (state, action) => {
      state.loaders[action.payload] = true;
    },
    stopLoader: (state, action) => {
      state.loaders[action.payload] = false;
    },
  },
});

export const uiLoaderActions = uiSlice.actions;
export default uiSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  categories: [],
  subCategories: [],
};
const categoriesSlice = createSlice({
  name: "categories",
  initialState: initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSubCategories: (state, action) => {
      state.subCategories = action.payload;
    },
  },
});

export const categoriesActions = categoriesSlice.actions;
export default categoriesSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { calculateTotalItems } from "../../../helpers/helpers";

const initialState = {
  wishlist: null,
  items: [],
  total: 0,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    setWishlist: (state, action) => {
      state.wishlist = action.payload;
      state.items = action.payload?.items || [];
      state.total = calculateTotalItems(state.items);
    },

    addToWishlist: (state, action) => {
      state.wishlist = action.payload;
      state.items = action.payload?.items || [];
      state.total = calculateTotalItems(state.items);
    },

    updateWishlist: (state, action) => {
      console.log("Updating wishlist:", action.payload);
      state.wishlist = action.payload;
      state.items = action.payload?.items || [];
      state.total = calculateTotalItems(state.items);
    },

    removeFromWishlist: (state, action) => {
      state.wishlist = action.payload;
      state.items = action.payload?.items || [];
      state.total = calculateTotalItems(state.items);
    },

    clearWishlist: (state) => {
      state.wishlist = null;
      state.items = [];
      state.total = 0;
    },
  },
});

export const wishlistActions = wishlistSlice.actions;
export default wishlistSlice.reducer;

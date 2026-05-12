import { createSlice } from "@reduxjs/toolkit";
import { calculateTotal } from "../../../helpers/helpers";

const initialState = {
  cart: null,
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
      state.items = action.payload?.items || [];
      state.total = calculateTotal(state.items);
    },

    addToCart: (state, action) => {
      state.cart = action.payload;
      state.items = action.payload?.items || [];
      state.total = calculateTotal(state.items);
    },

    updateCart: (state, action) => {
      state.cart = action.payload;
      state.items = action.payload?.items || [];
      state.total = calculateTotal(state.items);
    },

    removeFromCart: (state, action) => {
      state.cart = action.payload;
      state.items = action.payload?.items || [];
      state.total = calculateTotal(state.items);
    },

    clearCart: (state) => {
      state.cart = null;
      state.items = [];
      state.total = 0;
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  orderDetails: {},

  orderPagination: {
    limit: 30,
    page: 1,
    total: 0,
    totalPages: 0,
  },
};

const orderSlice = createSlice({
  name: "order",

  initialState,

  reducers: {
    setOrders: (state, action) => {
      if (state.orderPagination.page === 1) {
        state.orders = action.payload;
      } else {
        state.orders = [...state.orders, ...action.payload];
      }
    },

    setOrderDetails: (state, action) => {
      state.orderDetails = action.payload;
    },

    setOrdersPagination: (state, action) => {
      state.orderPagination = {
        ...state.orderPagination,
        ...action.payload,
      };
    },
  },
});

export const orderActions = orderSlice.actions;

export default orderSlice.reducer;

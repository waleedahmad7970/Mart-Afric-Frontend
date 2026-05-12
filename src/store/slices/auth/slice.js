import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  users: [],
  userDetails: {},
  userPagination: {
    limit: 30,
    page: 1,
    total: 0,
    totalPages: 0,
  },
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    user: (state, action) => {
      state.user = action.payload;
    },
    hydrateUser: (state) => {
      const stored = localStorage.getItem("user");
      if (stored) {
        state.user = JSON.parse(stored);
      }
    },
    setUsers: (state, action) => {
      if (state.userPagination.page === 1) {
        state.users = action.payload;
      } else {
        state.users = [...state.users, ...action.payload];
      }
    },

    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },

    setUserPagination: (state, action) => {
      state.userPagination = {
        ...state.userPagination,
        ...action.payload,
      };
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;

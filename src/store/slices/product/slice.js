import { createSlice } from "@reduxjs/toolkit";
const initalState = {
  productDetails: {},
  products: [],
  productsPagination: {
    limit: 30,
    page: 1,
    total: 0,
    totalPages: 0,
  },
  bestSellers: [],
  featuredProducts: [],
  trendingsProducts: [],
  smartSearch: [],
};
const productSlice = createSlice({
  name: "product",
  initialState: initalState,
  reducers: {
    setProducts: (state, action) => {
      const { data, page } = action.payload;

      if (page === 1) {
        state.products = data;
      } else {
        state.products = [...state.products, ...data];
      }
    },
    setProductsPagination: (state, action) => {
      state.productsPagination = {
        ...state.productsPagination,
        ...action.payload,
      };
    },
    setProductDetails: (state, action) => {
      state.productDetails = action.payload;
    },
    setTrendingProducts: (state, action) => {
      state.trendingsProducts = action.payload;
    },
    setBestSellers: (state, action) => {
      state.bestSellers = action.payload;
    },

    setFeaturedProducts: (state, action) => {
      state.featuredProducts = action.payload;
    },
    updateProduct: (state, action) => {
      const updatedProduct = action.payload;
      const index = state.products.findIndex(
        (product) => product._id === updatedProduct._id,
      );
      if (index !== -1) {
        state.products[index] = updatedProduct;
      } else {
        state.products.unshift(updatedProduct);
      }
      if (state.productDetails._id === updatedProduct._id) {
        state.productDetails = updatedProduct;
      }
    },
    setSmartSearch: (state, action) => {
      state.smartSearch = action.payload;
    },
    resetProducts: (state) => {
      state.products = [];
      state.productsPagination = {
        limit: 30,
        page: 1,
        total: 0,
        totalPages: 0,
      };
    },
  },
});

export const productActions = productSlice.actions;
export default productSlice.reducer;

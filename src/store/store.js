import { configureStore } from "@reduxjs/toolkit";
// import your reducers here later
import authSlice from "./slices/auth/slice";
import categoriesSlice from "./slices/categories/slice";
import uiLoaderSlice from "./slices/loader/slice";
import productSlice from "./slices/product/slice";
import cartSlice from "./slices/cart/slice";
import orderSlice from "./slices/orders/slice";
import adminSlice from "./slices/admin/slice";
import wishlistSlice from "./slices/wishlist/slice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    loader: uiLoaderSlice,
    categories: categoriesSlice,
    products: productSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
    orders: orderSlice,
    // admin slcie
    admin: adminSlice,
  },
});

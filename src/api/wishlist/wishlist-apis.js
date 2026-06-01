import { api } from "../https";
import { getDispatch } from "../dispatch/dispatch";
import { authActions } from "../../store/slices/auth/slice";
import { categoriesActions } from "../../store/slices/categories/slice";
import { uiLoaderActions } from "../../store/slices/loader/slice";
import { cartActions } from "../../store/slices/cart/slice";
import { wishlistActions } from "../../store/slices/wishlist/slice";
const wishlistApis = {
  toggleWishlist: async (productId) => {
    const dispatch = getDispatch();
    const [res, error] = await api.post(`/wishlist/items/${productId}`);
    const { data, success } = res?.data || {};
    if (success) {
      dispatch(wishlistActions.updateWishlist(data));
    }
    return [res, error];
  },
  getWishlist: async () => {
    const dispatch = getDispatch();
    const [res, error] = await api.get("/wishlist");
    const { data, success } = res?.data || {};
    if (success) {
      dispatch(wishlistActions.updateWishlist(data));
    }
    return [res, error];
  },
  clearWishlist: async () => {
    const dispatch = getDispatch();
    const [res, error] = await api.delete("/wishlist");
    const { success } = res?.data || {};
    if (success) {
      dispatch(wishlistActions.clearWishlist());
    }
    return [res, error];
  },
  removeItem: async (productId) => {
    const dispatch = getDispatch();
    const [res, error] = await api.delete(`/wishlist/items/${productId}`);
    return [res, error];
  },
};

export default wishlistApis;

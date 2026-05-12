import { api } from "../https";
import { getDispatch } from "../dispatch/dispatch";
import { authActions } from "../../store/slices/auth/slice";
import { categoriesActions } from "../../store/slices/categories/slice";
import { uiLoaderActions } from "../../store/slices/loader/slice";
import { cartActions } from "../../store/slices/cart/slice";
const cartApis = {
  addToCart: async (item) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("addToCartLoader"));
    const [res, error] = await api.post("/cart/items", item);
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(cartActions.addToCart(data));
    }
    dispatch(uiLoaderActions.stopLoader("addToCartLoader"));
    return [res, error];
  },
  getCart: async () => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("cartLoader"));
    const [res, error] = await api.get("/cart");
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(cartActions.setCart(data));
    }
    dispatch(uiLoaderActions.stopLoader("cartLoader"));
    return [res, error];
  },
  updateItem: async ({ productId, quantity }) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("updateItemLoader"));
    const [res, error] = await api.patch(`/cart/items/${productId}`, {
      quantity,
    });
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(cartActions.setCart(data));
    }
    dispatch(uiLoaderActions.stopLoader("updateItemLoader"));
    return [res, error];
  },
  deletItem: async ({ productId }) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("deleteItemLoader"));
    const [res, error] = await api.delete(`/cart/items/${productId}`);
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(cartActions.setCart(data));
    }
    dispatch(uiLoaderActions.stopLoader("deleteItemLoader"));
    return [res, error];
  },
};

export default cartApis;

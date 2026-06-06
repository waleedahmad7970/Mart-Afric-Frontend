import { api } from "../https";
import { getDispatch } from "../dispatch/dispatch";
import { authActions } from "../../store/slices/auth/slice";
import { categoriesActions } from "../../store/slices/categories/slice";
import { uiLoaderActions } from "../../store/slices/loader/slice";
import { cartActions } from "../../store/slices/cart/slice";
import { handleFormikErrors } from "../../helpers/helpers";
import { adminActions } from "../../store/slices/admin/slice";
const couponApis = {
  appllyCoupon: async ({ code }) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("applyCouponLoader"));

    const safeCode = encodeURIComponent(code);

    const [res, error] = await api.post(`/cart/apply-promo`, {
      code: safeCode,
    });

    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(cartActions.setCart(data));
    }
    if (error) handleFormikErrors(error);

    dispatch(uiLoaderActions.stopLoader("applyCouponLoader"));
    return [res, error];
  },
  removeCoupon: async () => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("removeCouponLoader"));
    const [res, error] = await api.delete(`/cart/remove-promo`);
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(cartActions.setCart(data));
    }
    dispatch(uiLoaderActions.stopLoader("removeCouponLoader"));
    return [res, error];
  },
  // admin
  getCoupons: async () => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("couponsLoader"));
    const [res, error] = await api.get(`/coupons`);
    const { success, data, message } = res?.data || {};
    console.log("res", data);
    if (success) {
      dispatch(adminActions.setCoupons(data));
    }
    dispatch(uiLoaderActions.stopLoader("couponsLoader"));
    return [res, error];
  },
  createCoupon: async (values) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("createCouponLoader"));
    const [res, error] = await api.post(`/coupons`, values);
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(categoriesActions.setCoupons(data));
    }
    dispatch(uiLoaderActions.stopLoader("createCouponLoader"));
    return [res, error];
  },
  updateCoupon: async ({ values, Id }) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("updateCouponLoader"));
    const [res, error] = await api.patch(`/coupons/${Id}`, values);
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(categoriesActions.setCoupons(data));
    }
    dispatch(uiLoaderActions.stopLoader("updateCouponLoader"));
    return [res, error];
  },
};

export default couponApis;

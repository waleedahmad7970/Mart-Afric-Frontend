import { api } from "../https";
import { getDispatch } from "../dispatch/dispatch";
import { uiLoaderActions } from "../../store/slices/loader/slice";
import { productActions } from "../../store/slices/product/slice";
import { handleFormikErrors } from "../../helpers/helpers";
import { orderActions } from "../../store/slices/orders/slice";
const ordersApis = {
  getOrders: async () => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("ordersLoader"));
    const [res, error] = await api.get("/orders");
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(orderActions.setOrders(data));
    }
    dispatch(uiLoaderActions.stopLoader("ordersLoader"));
    return [res, error];
  },
  getOrder: async (orderId) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("orderLoader"));
    const [res, error] = await api.get(`/orders/${orderId}`);
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(orderActions.setOrderDetails(data));
    }
    dispatch(uiLoaderActions.stopLoader("orderLoader"));
    return [res, error];
  },
  myOrders: async (orderId) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("orderLoader"));
    const [res, error] = await api.get(`/orders/my`);
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(orderActions.setOrders(data));
    }
    dispatch(uiLoaderActions.stopLoader("orderLoader"));
    return [res, error];
  },
};

export default ordersApis;

import { api } from "../https";
import { getDispatch } from "../dispatch/dispatch";
import { uiLoaderActions } from "../../store/slices/loader/slice";
import { productActions } from "../../store/slices/product/slice";
import { handleFormikErrors } from "../../helpers/helpers";
import { orderActions } from "../../store/slices/orders/slice";
import { adminActions } from "../../store/slices/admin/slice";
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
  updateStatus: async ({ id, status }) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("orderLoader"));
    const [res, error] = await api.patch(`/orders/${id}/status`, {
      status,
    });
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(orderActions.updateOrderStatus(data));
    }
    dispatch(uiLoaderActions.stopLoader("orderLoader"));
    return [res, error];
  },
  // admin
  getAdminOrders: async ({ page, limit, search, status, sort }) => {
    // 1. Safely build the query string
    const dispatch = getDispatch();
    const params = new URLSearchParams();

    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (sort) params.append("sort", sort);

    const url = `/orders?${params.toString()}`;

    dispatch(uiLoaderActions.startLoader("orderLoader"));

    const [res, error] = await api.get(url);
    const { success, data, message } = res?.data || {};

    if (success) {
      dispatch(adminActions.setOrders(data));
      dispatch(adminActions.setOrderPagination(data.meta));
    }

    dispatch(uiLoaderActions.stopLoader("orderLoader"));
    return [res, error];
  },
  getAdminOrder: async (orderId) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("orderLoader"));
    const [res, error] = await api.get(`/orders/${orderId}`);
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(adminActions.setOrderDetails(data));
    }
    dispatch(uiLoaderActions.stopLoader("orderLoader"));
    return [res, error];
  },
};

export default ordersApis;

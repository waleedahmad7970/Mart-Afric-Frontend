import { api } from "../https";
import { getDispatch } from "../dispatch/dispatch";
import { authActions } from "../../store/slices/auth/slice";
import { uiLoaderActions } from "../../store/slices/loader/slice";
const userApi = {
  getUsers: async (values) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("usersLoader"));
    const [res, error] = await api.get("/users");
    dispatch(uiLoaderActions.stopLoader("usersLoader"));
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(authActions.setUsers(data));
    }
    return [res, error];
  },
  getUsers: async (values) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("usersCountLoader"));
    const [res, error] = await api.get("/users");
    dispatch(uiLoaderActions.stopLoader("usersCountLoader"));
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(authActions.setUsers(data));
    }
    return [res, error];
  },
};

export default userApi;

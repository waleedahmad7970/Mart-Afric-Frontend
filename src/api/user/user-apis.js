import { api } from "../https";
import { getDispatch } from "../dispatch/dispatch";
import { authActions } from "../../store/slices/auth/slice";
import { uiLoaderActions } from "../../store/slices/loader/slice";
import { adminActions } from "../../store/slices/admin/slice";
const userApi = {
  getMe: async (values) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("meLoader"));
    const [res, error] = await api.get("/users/me");
    dispatch(uiLoaderActions.stopLoader("meLoader"));
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(authActions.user(data));
    }
    return [res, error];
  },
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
  getAdminUsers: async (values) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("usersCountLoader"));
    const [res, error] = await api.get("/users");
    dispatch(uiLoaderActions.stopLoader("usersCountLoader"));
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(adminActions.setUsers(data));
    }
    return [res, error];
  },

  uploadAvatar: async (file) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("uploadAvatarLoader"));
    const formData = new FormData();
    formData.append("avatar", file);
    const [res, error] = await api.post("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(uiLoaderActions.stopLoader("uploadAvatarLoader"));
    return [res, error];
  },
  updateUser: async (values) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("updateUserLoader"));
    const [res, error] = await api.patch(`/users/me`, values);
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(authActions.updateUser(data));
    }
    dispatch(uiLoaderActions.stopLoader("updateUserLoader"));
    return [res, error];
  },
  updateUserPassword: async (values) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("updatePasswordLoader"));
    const [res, error] = await api.patch(`/users/password`, values);
    const { success, data, message } = res?.data || {};
    dispatch(uiLoaderActions.stopLoader("updatePasswordLoader"));
    return [res, error];
  },
  updateAddress: async (values) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("updateAddressLoader"));
    const [res, error] = await api.put("/users/address", values);
    dispatch(uiLoaderActions.stopLoader("updateAddressLoader"));

    return [res, error];
  },
};

export default userApi;

import { api } from "../https";
import { getDispatch } from "../dispatch/dispatch";
import { authActions } from "../../store/slices/auth/slice";
const authApis = {
  login: async (values) => {
    const dispatch = getDispatch();
    const [res, error] = await api.post("/auth/login", values);
    const token = res?.data?.data?.token;
    const user = res?.data?.data?.user;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch(authActions.user(user));

    return [res, error];
  },
  signup: async (values) => {
    const dispatch = getDispatch();

    const [res, error] = await api.post("/auth/register", values);
    return [res, error];
  },
};

export default authApis;

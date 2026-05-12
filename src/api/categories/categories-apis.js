import { api } from "../https";
import { getDispatch } from "../dispatch/dispatch";
import { authActions } from "../../store/slices/auth/slice";
import { categoriesActions } from "../../store/slices/categories/slice";
import { uiLoaderActions } from "../../store/slices/loader/slice";
const categoriesApis = {
  getAllCategories: async (values) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("categoriesLoader"));
    const [res, error] = await api.get("/categories");
    const { success, data, message } = res?.data || {};
    dispatch(uiLoaderActions.stopLoader("categoriesLoader"));
    if (success) {
      dispatch(categoriesActions.setCategories(data));
    }
    return [res, error];
  },
};

export default categoriesApis;

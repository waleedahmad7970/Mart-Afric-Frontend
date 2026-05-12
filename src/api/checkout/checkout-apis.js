import { api } from "../https";
import { getDispatch } from "../dispatch/dispatch";
import { uiLoaderActions } from "../../store/slices/loader/slice";
import { productActions } from "../../store/slices/product/slice";
import { handleFormikErrors } from "../../helpers/helpers";
const checkoutApis = {
  checkout: async (body, navigate) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("checkoutLoader"));

    const [res, error] = await api.post("/orders/checkout", body);
    if (res?.data?.success === true) {
      return navigate("/orders");
    }
    dispatch(uiLoaderActions.stopLoader("checkoutLoader"));

    return [res, error];
  },
};

export default checkoutApis;

import { api } from "../https";
import { getDispatch } from "../dispatch/dispatch";
import { uiLoaderActions } from "../../store/slices/loader/slice";
import { productActions } from "../../store/slices/product/slice";
const aiSuggestionApis = {
  aiChat: async (message) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("aiLoader"));
    const [res, error] = await api.post("/ai-suggestions/chat", { message });
    dispatch(uiLoaderActions.stopLoader("aiLoader"));
    return [res, error];
  },
  smartSearch: async ({ query }) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("smartSearchLoader"));
    const [res, error] = await api.post("/ai-suggestions/smart-search", {
      query: query,
    });
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(productActions.setSmartSearch(data));
    }
    dispatch(uiLoaderActions.stopLoader("smartSearchLoader"));
    return [res, error];
  },
};

export default aiSuggestionApis;

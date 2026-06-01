import { api } from "../https";
import { getDispatch } from "../dispatch/dispatch";
import { authActions } from "../../store/slices/auth/slice";
import { categoriesActions } from "../../store/slices/categories/slice";
import { uiLoaderActions } from "../../store/slices/loader/slice";
import { adminActions } from "../../store/slices/admin/slice";
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
  getSubCategories: async (values) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("subCategoriesLoader"));
    const [res, error] = await api.get("/sub-categories");
    const { success, data, message } = res?.data || {};
    dispatch(uiLoaderActions.stopLoader("subCategoriesLoader"));
    if (success) {
      dispatch(categoriesActions.setSubCategories(data));
    }
    return [res, error];
  },
  // admin
  getAdminCategories: async (values) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("categoriesLoader"));
    const [res, error] = await api.get("/categories");
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(adminActions.setCategories(data));
    }
    dispatch(uiLoaderActions.stopLoader("categoriesLoader"));
    return [res, error];
  },
  getAdminSubCategories: async (values) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("subCategoriesLoader"));
    const [res, error] = await api.get("/sub-categories");
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(adminActions.setSubCategories(data));
    }
    dispatch(uiLoaderActions.stopLoader("subCategoriesLoader"));
    return [res, error];
  },
  adminCreateCategory: async (values) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("createCategoryLoader"));
    const [res, error] = await api.post("/categories", values);
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(adminActions.addCategory(data));
    }
    dispatch(uiLoaderActions.stopLoader("createCategoryLoader"));
    return [res, error];
  },
  updateCategory: async ({ id, values }) => {
    console.log("values", values);
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("updateCategoryLoader"));
    const [res, error] = await api.patch(`/categories/${id}`, values);
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(adminActions.updateCategory(data));
    }
    dispatch(uiLoaderActions.stopLoader("updateCategoryLoader"));
    return [res, error];
  },
  deleteCategory: async ({ id }) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("deleteCategoryLoader"));
    const [res, error] = await api.delete(`/categories/${id}`);
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(adminActions.deleteCategory(id));
    }
    dispatch(uiLoaderActions.stopLoader("deleteCategoryLoader"));
    return [res, error];
  },
  adminCreateSubCategory: async (values) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("createSubCategoryLoader"));
    const [res, error] = await api.post("/sub-categories", values);
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(adminActions.addSubCategory(data));
    }
    dispatch(uiLoaderActions.stopLoader("createSubCategoryLoader"));
    return [res, error];
  },
  updateSubCategory: async ({ id, values }) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("updateSubCategoryLoader"));
    const [res, error] = await api.patch(`/sub-categories/${id}`, values);
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(adminActions.updateSubCategory(data));
    }
    dispatch(uiLoaderActions.stopLoader("updateSubCategoryLoader"));
    return [res, error];
  },
  deleteSubCategory: async ({ id }) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("deleteSubCategoryLoader"));
    const [res, error] = await api.delete(`/sub-categories/${id}`);
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(adminActions.deleteSubCategory(id));
    }
    dispatch(uiLoaderActions.stopLoader("deleteSubCategoryLoader"));
    return [res, error];
  },
};

export default categoriesApis;

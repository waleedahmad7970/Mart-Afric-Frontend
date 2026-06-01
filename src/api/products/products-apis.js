import { api } from "../https";
import { getDispatch } from "../dispatch/dispatch";
import { uiLoaderActions } from "../../store/slices/loader/slice";
import { productActions } from "../../store/slices/product/slice";
import { handleFormikErrors } from "../../helpers/helpers";
import { adminActions } from "../../store/slices/admin/slice";
const productsApis = {
  getProduct: async (productId) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("productLoader"));
    const [res, error] = await api.get(`/products/${productId}`);
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(productActions.setProductDetails(data));
    }
    dispatch(uiLoaderActions.stopLoader("productLoader"));
    return [res, error];
  },

  getBestSellers: async (values) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("bestSellerLoader"));
    const [res, error] = await api.get("/products/best-sellers");
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(productActions.setBestSellers(data));
    }
    dispatch(uiLoaderActions.stopLoader("bestSellerLoader"));

    return [res, error];
  },
  trendingProducts: async (values) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("trendingLoader"));
    const [res, error] = await api.get("/products/trending");
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(productActions.setTrendingProducts(data));
    }
    dispatch(uiLoaderActions.stopLoader("trendingLoader"));

    return [res, error];
  },
  featuredProducts: async (values) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("featuredLoader"));
    const [res, error] = await api.get("/products/featured");
    const { success, data, message } = res?.data || {};
    if (success) {
      dispatch(productActions.setFeaturedProducts(data));
    }
    dispatch(uiLoaderActions.stopLoader("featuredLoader"));

    return [res, error];
  },
  products: async ({
    page = 1,
    limit = 12,
    search = "",
    category = "",
    minPrice = "",
    maxPrice = "",
    rating = "",
    inStock = "",
    sort = "",
  }) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("productsLoader"));

    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(category && { category }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
      ...(rating && { rating }),
      ...(inStock && { inStock }),
      ...(sort && { sort }),
    });

    const [res, error] = await api.get(`/products?${params.toString()}`);
    const { success, data, meta } = res?.data || {};

    if (success) {
      dispatch(
        productActions.setProducts({
          data,
          page: meta.page,
        }),
      );

      dispatch(productActions.setProductsPagination(meta));
    }

    dispatch(uiLoaderActions.stopLoader("productsLoader"));
    return [res, error];
  },

  // admin
  getProductsStats: async () => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("productsLoader"));
    const [res, error] = await api.get(`/products/stats`);
    const { success, data, message } = res?.data || {};

    const stats = {
      outOfStock: data?.outOfStock,
      lowStock: data?.lowStock,
      activeProducts: data?.activeProducts,
      totalProducts: data?.totalProducts,
      totalRevenue: data?.totalRevenue,
      topSellingProducts: data?.topSellingProducts,
      totalStock: data?.totalStock,
    };

    if (success) {
      dispatch(adminActions.setProductsStats(stats));
    }
    dispatch(uiLoaderActions.stopLoader("productsLoader"));
    return [res, error];
  },
  getAdminProducts: async ({
    page,
    limit,
    search,
    category,
    subCategory,
    sku,
    brand,
    sort,
    stock,
  }) => {
    const dispatch = getDispatch();
    let url = `/products?limit=${limit}&page=${page}`;

    if (search) {
      url += `&search=${search}`;
    }
    if (category) {
      url += `&category=${category}`;
    }
    if (subCategory) {
      url += `&subCategory=${subCategory}`;
    }
    if (sku) {
      url += `&sku=${sku}`;
    }
    if (brand) {
      url += `&brand=${brand}`;
    }
    if (sort) {
      url += `&sort=${sort}`;
    }
    if (stock) {
      url += `&stock=${stock}`;
    }
    dispatch(uiLoaderActions.startLoader("productsLoader"));
    const [res, error] = await api.get(`${url}`);
    const { success, data, message, meta } = res?.data || {};
    if (success) {
      dispatch(adminActions.setProducts(data));
      dispatch(adminActions.setProductsPagination(meta));
    }
    dispatch(uiLoaderActions.stopLoader("productsLoader"));
    return [res, error];
  },
  uploadImage: async ({ file }) => {
    const formData = new FormData();
    formData.append("image", file);
    const [res, error] = await api.post(`products/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return [res, error];
  },
  updateProduct: async ({ productId, body }) => {
    const dispatch = getDispatch();

    dispatch(uiLoaderActions.startLoader("uploaderLoader"));

    const [res, error] = await api.patch(`/products/${productId}`, body);

    dispatch(uiLoaderActions.stopLoader("uploaderLoader"));

    const { success, data } = res?.data || {};

    if (success) {
      dispatch(productActions.updateProduct(data));
    }
    if (error) {
      handleFormikErrors(error);
    }

    return [res, error];
  },
  createProduct: async ({ body }) => {
    const [res, error] = await api.post("/products", body);
    const { success, data, message } = res?.data || {};
    if (success) {
      productActions.updateProduct(data);
    }
    return [res, error];
  },
  getAllProducts: async ({ page, limit }) => {
    const dispatch = getDispatch();
    dispatch(uiLoaderActions.startLoader("productsLoader"));
    const [res, error] = await api.get(`/products?limit=${limit}&page=${page}`);
    const { success, data, message, meta } = res?.data || {};

    if (success) {
      dispatch(
        productActions.setProducts({
          data,
          page: meta.page,
        }),
      );

      dispatch(productActions.setProductsPagination(meta));
    }

    dispatch(uiLoaderActions.stopLoader("productsLoader"));

    return [res, error];
  },
  deleteProduct: async ({ id }) => {
    const [res, error] = await api.delete(`/products/${id}`);
    const { success, data, message } = res?.data || {};
    const dispatch = getDispatch();

    if (success) {
      dispatch(productActions.deleteProductsFromList(id));
    }
    return [res, error];
  },
};

export default productsApis;

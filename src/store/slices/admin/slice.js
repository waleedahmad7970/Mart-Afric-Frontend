import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    users: [],
    userPagination: {
      limit: 30,
      page: 1,
      total: 0,
      totalPages: 0,
    },
  },
  product: {
    products: [],
    productsPagination: {
      limit: 30,
      page: 1,
      total: 0,
      totalPages: 0,
    },
    stats: {
      outOfStock: 0,
      lowStock: 0,
      activeProducts: 0,
      totalProducts: 0,
      totalRevenue: 0,
      topSellingProducts: 0,
      totalStock: 0,
    },
  },
  order: {
    orders: [],
    orderDetails: {},
    orderPagination: {
      limit: 30,
      page: 1,
      total: 0,
      totalPages: 0,
    },
  },
  category: {
    categories: [],
    categoryPagination: {
      limit: 30,
      page: 1,
      total: 0,
      totalPages: 0,
    },
  },
  subCategory: {
    subCategories: [],
    subCategoryPagination: {
      limit: 30,
      page: 1,
      total: 0,
      totalPages: 0,
    },
  },
  brand: {
    brands: [],
    brandPagination: {
      limit: 30,
      page: 1,
      total: 0,
      totalPages: 0,
    },
  },
  reports: {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    totalCustomers: 0,
    chartData: [],
    topProducts: [],
  },
  coupon: {
    totalCoupons: 0,
    activeCoupons: 0,
    totalUsage: 0,
    coupons: [],
    couponPagination: {
      limit: 30,
      page: 1,
      total: 0,
      totalPages: 0,
    },
  },
};

const adminSlice = createSlice({
  name: "admin",
  initialState: initialState,
  reducers: {
    // ========================
    // USERS CRUD
    // ========================
    setUsers: (state, action) => {
      if (state.user.userPagination.page === 1) {
        state.user.users = action.payload;
      } else {
        state.user.users = [...state.user.users, ...action.payload];
      }
    },
    setUserPagination: (state, action) => {
      state.user.userPagination = {
        ...state.user.userPagination,
        ...action.payload,
      };
    },
    addUser: (state, action) => {
      state.user.users.unshift(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.user.users.findIndex(
        (u) => u._id === action.payload._id || u.id === action.payload.id,
      );
      if (index !== -1) {
        state.user.users[index] = action.payload;
      }
    },
    deleteUser: (state, action) => {
      state.user.users = state.user.users.filter(
        (u) => u._id !== action.payload && u.id !== action.payload,
      );
    },

    // ========================
    // PRODUCTS CRUD
    // ========================
    setProducts: (state, action) => {
      if (state.product.productsPagination.page === 1) {
        state.product.products = action.payload;
      } else {
        state.product.products = [...state.product.products, ...action.payload];
      }
    },
    setProductsPagination: (state, action) => {
      state.product.productsPagination = {
        ...state.product.productsPagination,
        ...action.payload,
      };
    },
    addProduct: (state, action) => {
      state.product.products.unshift(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.product.products.findIndex(
        (p) => p._id === action.payload._id || p.id === action.payload.id,
      );
      if (index !== -1) {
        state.product.products[index] = action.payload;
      }
    },
    setProductsStats: (state, action) => {
      state.product.stats = {
        ...state.product.stats,
        ...action.payload,
      };
    },
    deleteProduct: (state, action) => {
      state.product.products = state.product.products.filter(
        (p) => p?._id !== action.payload && p?._id !== action.payload,
      );
    },

    // ========================
    // ORDERS CRUD
    // ========================
    setOrders: (state, action) => {
      if (state.order.orderPagination.page === 1) {
        state.order.orders = action.payload;
      } else {
        state.order.orders = [...state.order.orders, ...action.payload];
      }
    },
    setOrderPagination: (state, action) => {
      state.order.orderPagination = {
        ...state.order.orderPagination,
        ...action.payload,
      };
    },
    setOrderDetails: (state, action) => {
      state.order.orderDetails = action.payload;
    },
    addOrder: (state, action) => {
      state.order.orders.unshift(action.payload);
    },
    updateOrder: (state, action) => {
      const index = state.order.orders.findIndex(
        (o) => o._id === action.payload._id || o.id === action.payload.id,
      );
      if (index !== -1) {
        state.order.orders[index] = action.payload;
      }
    },
    deleteOrder: (state, action) => {
      state.order.orders = state.order.orders.filter(
        (o) => o._id !== action.payload && o.id !== action.payload,
      );
    },

    // ========================
    // CATEGORIES CRUD
    // ========================
    setCategories: (state, action) => {
      if (state.category.categoryPagination.page === 1) {
        state.category.categories = action.payload;
      } else {
        state.category.categories = [
          ...state.category.categories,
          ...action.payload,
        ];
      }
    },
    setCategoryPagination: (state, action) => {
      state.category.categoryPagination = {
        ...state.category.categoryPagination,
        ...action.payload,
      };
    },
    addCategory: (state, action) => {
      state.category.categories.unshift(action.payload);
    },
    updateCategory: (state, action) => {
      const index = state.category.categories.findIndex(
        (c) => c._id === action.payload._id || c.id === action.payload.id,
      );
      if (index !== -1) {
        state.category.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action) => {
      state.category.categories = state.category.categories.filter(
        (c) => c._id !== action.payload && c.id !== action.payload,
      );
    },

    // ========================
    // SUB-CATEGORIES CRUD
    // ========================
    setSubCategories: (state, action) => {
      if (state.subCategory.subCategoryPagination.page === 1) {
        state.subCategory.subCategories = action.payload;
      } else {
        state.subCategory.subCategories = [
          ...state.subCategory.subCategories,
          ...action.payload,
        ];
      }
    },
    setSubCategoryPagination: (state, action) => {
      state.subCategory.subCategoryPagination = {
        ...state.subCategory.subCategoryPagination,
        ...action.payload,
      };
    },
    addSubCategory: (state, action) => {
      state.subCategory.subCategories.unshift(action.payload);
    },
    updateSubCategory: (state, action) => {
      const index = state.subCategory.subCategories.findIndex(
        (c) => c._id === action.payload._id || c.id === action.payload.id,
      );
      if (index !== -1) {
        state.subCategory.subCategories[index] = action.payload;
      }
    },
    deleteSubCategory: (state, action) => {
      state.subCategory.subCategories = state.subCategory.subCategories.filter(
        (c) => c._id !== action.payload && c.id !== action.payload,
      );
    },

    // ========================
    // BRANDS CRUD
    // ========================
    setBrands: (state, action) => {
      if (state.brand.brandPagination.page === 1) {
        state.brand.brands = action.payload;
      } else {
        state.brand.brands = [...state.brand.brands, ...action.payload];
      }
    },
    setBrandPagination: (state, action) => {
      state.brand.brandPagination = {
        ...state.brand.brandPagination,
        ...action.payload,
      };
    },
    addBrand: (state, action) => {
      state.brand.brands.unshift(action.payload);
    },
    updateBrand: (state, action) => {
      const index = state.brand.brands.findIndex(
        (c) => c._id === action.payload._id || c.id === action.payload.id,
      );
      if (index !== -1) {
        state.brand.brands[index] = action.payload;
      }
    },
    deleteBrand: (state, action) => {
      state.brand.brands = state.brand.brands.filter(
        (c) => c._id !== action.payload && c.id !== action.payload,
      );
    },
    reportsStats: (state, action) => {
      state.reports = {
        ...state.reports,
        ...action.payload,
      };
    },
    // coupons
    setCoupons: (state, action) => {
      if (state.coupon.couponPagination.page === 1) {
        state.coupon.coupons = action.payload;
      } else {
        state.coupon.coupons = [...state.coupon.coupons, ...action.payload];
      }
    },
    setCouponPagination: (state, action) => {
      state.coupon.couponPagination = {
        ...state.coupon.couponPagination,
        ...action.payload,
      };
    },
    addCoupon: (state, action) => {
      state.coupon.coupons.unshift(action.payload);
    },
    updateCoupon: (state, action) => {
      const index = state.coupon.coupons.findIndex(
        (c) => c._id === action.payload._id || c._id === action.payload._id,
      );
      if (index !== -1) {
        state.coupon.coupons[index] = action.payload;
      }
    },
    deleteCoupon: (state, action) => {
      state.coupon.coupons = state.coupon.coupons.filter(
        (c) => c._id !== action.payload && c._id !== action.payload,
      );
    },
  },
});

export const adminActions = adminSlice.actions;
export default adminSlice.reducer;

import { api } from "../https";
import { getDispatch } from "../dispatch/dispatch";
import { authActions } from "../../store/slices/auth/slice";
import { categoriesActions } from "../../store/slices/categories/slice";
import { uiLoaderActions } from "../../store/slices/loader/slice";
import { cartActions } from "../../store/slices/cart/slice";
import { wishlistActions } from "../../store/slices/wishlist/slice";
import { handleFormikErrors } from "../../helpers/helpers";
import { adminActions } from "../../store/slices/admin/slice";
const reviewsApis = {
  createReview: async (body) => {
    const dispatch = getDispatch();
    const [res, error] = await api.post(`/reviews`, body);
    const { data, success } = res?.data || {};
    if (success) {
      dispatch(adminActions.addReview(data));
    }
    if (error) {
      handleFormikErrors(error);
    }
    return [res, error];
  },
  deleteReview: async ({ id }) => {
    const dispatch = getDispatch();
    const [res, error] = await api.delete(`/reviews/${id}`);
    const { data, success } = res?.data || {};
    if (success) {
      dispatch(adminActions.deleteReview(id));
    }
    if (error) {
      handleFormikErrors(error);
    }
    return [res, error];
  },
  getAllReviews: async ({ search, rating, sort } = {}) => {
    const dispatch = getDispatch();

    const [res, error] = await api.get("/reviews", {
      params: {
        search: search || undefined,
        rating: rating !== "all" ? rating : undefined,
        sort: sort || undefined,
      },
    });

    const { data, success } = res?.data || {};

    if (success) {
      dispatch(adminActions.setReviews(data));
    }

    if (error) {
      handleFormikErrors(error);
    }

    return [res, error];
  },
};

export default reviewsApis;

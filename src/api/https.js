import axios from "axios";
import { toast } from "sonner";

/**
 * Axios Instance
 */
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 */
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `➡️ ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    );

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response Interceptor
 */
http.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);

    // --- UNIVERSAL SUCCESS TOASTS ---
    const message = response.data?.message;

    // Auto-toast for login or specific success messages
    if (response.config.url.includes("/auth/login")) {
      toast.success("Welcome back!");
    } else if (
      response.status === 201 ||
      (response.status === 200 && message)
    ) {
      // Optional: Toast for any successful POST/PUT/DELETE if a message exists
      if (["post", "put", "delete"].includes(response.config.method)) {
        toast.success(message || "Action successful!");
      }
    }

    return response;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const message = data?.message || error.message || "Something went wrong";

    console.error(`❌ API Error ${status || ""}:`, data || error.message);

    // --- UNIVERSAL ERROR TOASTS ---
    if (status === 401) {
      localStorage.removeItem("token");
      toast.error("Session expired. Please login again.");
    } else if (status === 403) {
      toast.error("You do not have permission to perform this action.");
    } else if (status === 500) {
      toast.error("Server error. Please try again later.");
    } else if (status !== 422) {
      // We skip 422 because handleFormikErrors will show those under the inputs
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

/**
 * Promisified wrapper -> [res, error]
 */
const wrap = (promise) =>
  promise
    .then((res) => [res.data, null])
    .catch((err) => [
      null,
      err.response?.data || err.message || "Something went wrong",
    ]);

/**
 * API methods
 */
export const api = {
  get: (url, config) => wrap(http.get(url, config)),
  post: (url, data, config) => wrap(http.post(url, data, config)),
  put: (url, data, config) => wrap(http.put(url, data, config)),
  delete: (url, config) => wrap(http.delete(url, config)),
};

export default http;

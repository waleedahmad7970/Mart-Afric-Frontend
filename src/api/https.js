import axios from "axios";
import { toast } from "sonner";

/**
 * Axios Instance
 */
const http = axios.create({
  timeout: 20000,
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
    const isLoginRequest = error.config?.url?.includes("/auth/login"); // Check if it's login

    console.error(`❌ API Error ${status || ""}:`, data || error.message);

    if (status === 401) {
      // ONLY remove token if it's NOT the login request failing
      if (!isLoginRequest) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
      } else {
        // If login fails, just show the error, don't clear storage
        toast.error(message || "Invalid credentials");
      }
    } else if (status === 403) {
      toast.error(message);
    }
    // ... rest of your error logic

    return Promise.reject(error);
  },
);

/**
 * Promisified wrapper -> [res, error]
 */
const wrap = (promise) =>
  promise
    .then((res) => [res, null])
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
  patch: (url, data, config) => wrap(http.patch(url, data, config)),
};

export default http;

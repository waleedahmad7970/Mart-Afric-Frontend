import axios from "axios";

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
    return response;
  },
  (error) => {
    const status = error.response?.status;

    console.error(
      `❌ API Error ${status || ""}:`,
      error.response?.data || error.message,
    );

    if (status === 401) {
      localStorage.removeItem("token");
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

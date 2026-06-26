import axios from "axios";

// In development, package.json's "proxy" field forwards /api/* to
// http://localhost:5000 automatically, so a relative base URL works for
// both `npm start` and a production build served behind the same domain.
const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // required so the Flask session cookie is sent
  headers: { "Content-Type": "application/json" },
});

// Centralized error normalization so every page can do the same
// `catch (err) { setError(err.message) }` pattern.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const message =
      (data?.errors && data.errors.join(" ")) ||
      data?.error ||
      "Something went wrong. Please try again.";
    return Promise.reject({ ...error, message, status: error.response?.status });
  }
);

export default api;

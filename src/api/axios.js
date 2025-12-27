import axios from "axios";
import { logout } from "../utils/logout";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// ✅ Attach token automatically to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Handle 401 Unauthorized globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Clears token & user, then reloads page
      logout();
    }
    return Promise.reject(err);
  }
);

export default api;

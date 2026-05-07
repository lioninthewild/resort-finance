import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE,
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors - redirect to login (but not for login endpoint)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    // Don't redirect for auth endpoints (login, verify)
    if (url.includes("/auth/")) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
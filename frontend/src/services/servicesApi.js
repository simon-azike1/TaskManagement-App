import axios from "axios";

// 🌍 Environment detection
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// 🌐 API Base URL
const API_BASE_URL = isLocalhost
  ? "http://localhost:10000/api"  // ✅ FIXED: Changed from 1000 to 10000
  : "https://taskmanagement-app-2oq9.onrender.com/api";

// 🧭 Debug logging
console.log("🌍 Running on localhost?", isLocalhost);
console.log("🔗 API Base URL:", API_BASE_URL);

// 🪙 Token helpers
const TOKEN_KEY = "taskmaster_token";
const getAuthToken = () => localStorage.getItem(TOKEN_KEY) || "";
const normalizeToken = (raw) =>
  (raw || "").replace(/^Bearer\s+/i, "").replace(/^"|"$/g, "").trim();
const applyAuthHeader = (token) => {
  const jwt = normalizeToken(token);
  if (jwt) {
    api.defaults.headers.common.Authorization = `Bearer ${jwt}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

// 🛠️ Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // keep true if backend uses cookies
});

// Ensure header on page load/refresh
applyAuthHeader(getAuthToken());

// 📦 Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${normalizeToken(token)}`;
    }
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// 🔄 Response interceptor: handle auth & network errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error("🔌 Network Error - is your backend running?");
    }

    const status = error.response?.status;
    const msg = error.response?.data?.message || "";

    if (status === 401) {
      if (/expired|invalid|token/i.test(msg)) {
        console.warn("🔐 Auth token expired or invalid, clearing auth data");
        authAPI.clearAuth();
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

// ------------------ AUTH API ------------------
export const authAPI = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    if (response.data.success) {
      const token = response.data.data?.token || response.data.token;
      const user = response.data.data?.user || response.data.user;

      localStorage.setItem("taskmaster_auth", "true");
      localStorage.setItem("taskmaster_user", JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, normalizeToken(token));
      applyAuthHeader(token);
      console.log("🔑 Token stored successfully");
    }
    return response;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.success) {
      const token = response.data.data?.token || response.data.token;
      const user = response.data.data?.user || response.data.user;

      localStorage.setItem("taskmaster_auth", "true");
      localStorage.setItem("taskmaster_user", JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, normalizeToken(token));
      applyAuthHeader(token);
      console.log("🔑 Token stored successfully");
    }
    return response;
  },

  getMe: async () => api.get("/auth/me"),

  logout: async () => {
    try {
      await api.post("/auth/logout"); 
    } catch (error) {
      console.error("Logout API error:", error);
    }
    authAPI.clearAuth();
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, normalizeToken(token));
      applyAuthHeader(token);
      console.log("🔑 Token stored successfully");
    }
  },

  getToken: () => getAuthToken(),

  isAuthenticated: () =>
    !!(getAuthToken() && localStorage.getItem("taskmaster_auth") === "true"),

  getCurrentUser: () =>
    JSON.parse(localStorage.getItem("taskmaster_user") || "null"),

  clearAuth: () => {
    localStorage.removeItem("taskmaster_auth");
    localStorage.removeItem("taskmaster_user");
    localStorage.removeItem(TOKEN_KEY);
    applyAuthHeader("");
    console.log("🧹 Auth data cleared");
  },
};

// ✅ Named exports for direct imports
export const register = authAPI.register;
export const login = authAPI.login;


// ------------------ NOTES API ------------------
export const notesAPI = {
  getNotes: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.append(k, v));
    const queryString = params.toString();
    return api.get(queryString ? `/notes?${queryString}` : "/notes");
  },

  getNote: (id) => api.get(`/notes/${id}`),
  createNote: (data) => api.post("/notes", data),
  updateNote: (id, data) => api.put(`/notes/${id}`, data),
  deleteNote: (id) => api.delete(`/notes/${id}`),

  //  Toggle note completion/status
  toggleNote: (id) => api.patch(`/notes/${id}/toggle`),
  healthCheck: () => api.get("/health"),
};


// 🌟 Default export
export default api;
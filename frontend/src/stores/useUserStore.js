// stores/useUserStore.js
import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { persist } from "zustand/middleware"; // Add this import for persistence

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      checkingAuth: true,

      setUser: (user, token = null) => {
        if (token) {
          localStorage.setItem("token", token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        set({ user: { ...user }, token, loading: false });
      },

      signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });

        if (password !== confirmPassword) {
          set({ loading: false });
          return toast.error("Passwords do not match");
        }

        try {
          const res = await axios.post("/auth/signup", { name, email, password });
          const { user, token } = res.data;
          get().setUser(user, token); // Use setUser action
        } catch (error) {
          set({ loading: false });
          toast.error(error.response?.data?.message || "An error occurred");
        }
      },

      login: async (email, password) => {
        set({ loading: true });

        try {
          const res = await axios.post("/auth/login", { email, password });
          const { user, token } = res.data;
          get().setUser(user, token); // Use setUser action
        } catch (error) {
          set({ loading: false });
          toast.error(error.response?.data?.message || "An error occurred");
        }
      },

      logout: async () => {
        try {
          await axios.post("/auth/logout");
        } catch (error) {
          console.error("Logout error:", error); // Non-blocking
        } finally {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common['Authorization'];
          set({ user: null, token: null });
          toast.success("Logged out successfully");
        }
      },

      checkAuth: async () => {
        set({ checkingAuth: true });
        const token = localStorage.getItem("token");
        if (!token) {
          set({ checkingAuth: false, user: null, token: null });
          return;
        }

        try {
          const response = await axios.get("/auth/profile");
          set({ user: { ...response.data }, token, checkingAuth: false });
        } catch (error) {
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            delete axios.defaults.headers.common['Authorization'];
            toast.error("Session expired. Please log in again.");
          }
          console.error("Auth check error:", error);
          set({ checkingAuth: false, user: null, token: null });
        }
      },

      refreshToken: async () => {
        // Prevent multiple simultaneous refresh attempts
        if (get().checkingAuth) return;

        set({ checkingAuth: true });
        try {
          const response = await axios.post("/auth/refresh"); // Fixed endpoint to match backend
          const { token } = response.data;
          localStorage.setItem("token", token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          set({ token, checkingAuth: false });
          return token;
        } catch (error) {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common['Authorization'];
          set({ user: null, token: null, checkingAuth: false });
          throw error;
        }
      },
    }),
    {
      name: 'user-storage', // Key for localStorage
      partialize: (state) => ({ user: state.user, token: state.token }), // Only persist user/token
    }
  )
);

// Axios request interceptor to add token to headers
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || useUserStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios response interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout
        useUserStore.getState().logout();
        toast.error("Session expired. Redirecting to login.");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
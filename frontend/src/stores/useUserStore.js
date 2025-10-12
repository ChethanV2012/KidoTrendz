// stores/useUserStore.js
import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Passwords do not match");
		}

		try {
			const res = await axios.post("/auth/signup", { name, email, password });
			const { user, token } = res.data;
			localStorage.setItem("token", token); // Store token
			set({ user, loading: false });
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
			localStorage.setItem("token", token); // Store token
			set({ user, loading: false });
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
			localStorage.removeItem("token"); // Always clear token
			set({ user: null });
			toast.success("Logged out successfully");
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		const token = localStorage.getItem("token");
		if (!token) {
			set({ checkingAuth: false, user: null });
			return;
		}

		try {
			const response = await axios.get("/auth/profile");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			if (error.response?.status === 401) {
				localStorage.removeItem("token");
				toast.error("Session expired. Please log in again.");
			}
			console.error("Auth check error:", error);
			set({ checkingAuth: false, user: null });
		}
	},

	refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/refresh-token");
			const { token } = response.data;
			localStorage.setItem("token", token); // Update access token
			set({ checkingAuth: false });
			return token;
		} catch (error) {
			localStorage.removeItem("token");
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
}));

// Axios request interceptor to add token to headers
axios.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Axios response interceptor for token refresh (updated to use store)
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
				refreshPromise = useUserStore.getState().refreshToken(); // Fixed: Use store.getState()
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, logout
				useUserStore.getState().logout(); // Fixed: Use store.getState()
				toast.error("Session expired. Redirecting to login.");
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);
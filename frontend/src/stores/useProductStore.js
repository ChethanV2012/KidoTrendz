// stores/useProductStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set, get) => ({
	products: [],
	selectedProduct: null,
	loading: false,
	error: null,

	setProducts: (products) => set({ products }),

	// 🛒 PUBLIC: Fetch all products for shop page
	fetchShopProducts: async (searchQuery = '') => {
		set({ loading: true, error: null });
		try {
			const params = searchQuery ? { q: searchQuery } : {};
			const response = await axios.get("/products/shop", { params });
			set({ products: response.data.products || response.data, loading: false });
		} catch (error) {
			const errMsg = error.response?.data?.message || "Failed to fetch shop products";
			set({
				loading: false,
				error: errMsg
			});
			toast.error(errMsg);
		}
	},

	// 🔒 ADMIN: Fetch all products (protected)
	fetchAllProducts: async () => {
		set({ loading: true, error: null });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false });
		} catch (error) {
			const errMsg = error.response?.data?.error || "Failed to fetch products";
			set({
				error: errMsg,
				loading: false
			});
			toast.error(errMsg);
		}
	},

	// 📦 Create new product (Admin) - Now auto-refreshes shop list
	createProduct: async (productData) => {
		set({ loading: true, error: null });
		try {
			await axios.post("/products", productData);
			// Refresh the full shop list to avoid duplicates/local append issues
			await get().fetchShopProducts();  // Auto-refresh after create
			set({ loading: false });
			toast.success("Product created successfully!");
		} catch (error) {
			const errMsg = error.response?.data?.message || error.response?.data?.error || "Failed to create product";
			toast.error(errMsg);  // Handles duplicate-specific message (e.g., "Product name already exists")
			set({ loading: false, error: errMsg });
		}
	},

	// 🧹 Delete product (Admin) - Refresh after delete
	deleteProduct: async (productId) => {
		set({ loading: true, error: null });
		try {
			await axios.delete(`/products/${productId}`);
			// Refresh the full shop list
			await get().fetchShopProducts();
			toast.success("Product deleted successfully!");
		} catch (error) {
			const errMsg = error.response?.data?.error || "Failed to delete product";
			set({ loading: false, error: errMsg });
			toast.error(errMsg);
		}
	},

	// 🌟 Toggle featured status (Admin) - Refresh cache
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true, error: null });
		try {
			await axios.patch(`/products/${productId}`);
			// Refresh shop list (in case featured affects display)
			await get().fetchShopProducts();
			toast.success("Featured status updated!");
		} catch (error) {
			const errMsg = error.response?.data?.error || "Failed to update product";
			set({ loading: false, error: errMsg });
			toast.error(errMsg);
		}
	},

	// 🎯 Fetch products by category (Public)
	fetchProductsByCategory: async (category) => {
		set({ loading: true, error: null });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			const errMsg = error.response?.data?.error || "Failed to fetch products";
			set({
				error: "Failed to fetch category products",
				loading: false
			});
			toast.error(errMsg);
		}
	},

	// 🚻 Fetch products by gender (Public)
	fetchProductsByGender: async (gender) => {
		set({ loading: true, error: null });
		try {
			const response = await axios.get(`/products/gender/${gender}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			const errMsg = error.response?.data?.error || "Failed to fetch products";
			set({
				error: "Failed to fetch gender products",
				loading: false
			});
			toast.error(errMsg);
		}
	},

	// 💫 Fetch featured products (Public)
	fetchFeaturedProducts: async () => {
		set({ loading: true, error: null });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data.products || response.data, loading: false });
		} catch (error) {
			const errMsg = error.response?.data?.error || "Failed to fetch featured products";
			set({
				error: errMsg,
				loading: false
			});
			toast.error(errMsg);
		}
	},

	// 🔍 Fetch a single product by ID (Public)
	fetchProductById: async (id) => {
		set({ loading: true, error: null });
		try {
			const response = await axios.get(`/products/${id}`);
			set({ selectedProduct: response.data, loading: false });
		} catch (error) {
			const errMsg = error.response?.data?.error || "Failed to fetch product";
			toast.error(errMsg);
			set({ loading: false, error: errMsg });
		}
	},
}));
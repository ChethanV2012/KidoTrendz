import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import toast from "react-hot-toast";
import { Menu, X} from "lucide-react";
//import { RefreshCw } from "lucide-react";
import ProductCard from "./ProductCard";

const Shop = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const {
    products: storeProducts,
    loading,
    error,
    fetchShopProducts,
  } = useProductStore();

  const { isAuthenticated } = useUserStore();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error("Please login first to add to cart!");
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const formatCategory = (cat) => {
    return cat
      .replace(/_/g, " ")
      .replace(/&/g, " & ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const normalizeCategory = (cat) => {
    return (cat || '').replace(/_/g, " ").toLowerCase();
  };

  const categories =
    storeProducts.length > 0
      ? [...new Set(storeProducts.map((p) => p.category))].filter(Boolean)
      : [];
  const genders =
    storeProducts.length > 0
      ? [...new Set(storeProducts.map((p) => p.gender))].filter(Boolean)
      : [];

  const prices = storeProducts.map((p) => p.price).filter(Boolean);
  const globalMin = prices.length > 0 ? Math.min(...prices) : 0;
  const globalMax = prices.length > 0 ? Math.max(...prices) : 1000;
  const effectiveMaxPrice = Math.min(maxPrice, globalMax);
  const effectiveMinPrice = Math.max(minPrice, globalMin);

  useEffect(() => {
    fetchShopProducts();
  }, [fetchShopProducts]);

  useEffect(() => {
    if (storeProducts.length === 0 && !loading) return;

    let filtered = [...storeProducts];

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      const normalizedSelectedCategories = selectedCategories.map(normalizeCategory);
      filtered = filtered.filter(
        (product) => {
          const productNorm = normalizeCategory(product.category);
          return normalizedSelectedCategories.some(catNorm => productNorm === catNorm);
        }
      );
    }

    if (selectedGenders.length > 0) {
      const lowerSelectedGenders = selectedGenders.map(gender => gender.toLowerCase());
      filtered = filtered.filter(
        (product) => product.gender && lowerSelectedGenders.includes(product.gender.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (product) => product.price >= effectiveMinPrice && product.price <= effectiveMaxPrice
    );

    switch (sortBy) {
      case "all":
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
    }

    setFilteredProducts(filtered);
  }, [
    searchTerm,
    selectedCategories,
    selectedGenders,
    effectiveMinPrice,
    effectiveMaxPrice,
    sortBy,
    storeProducts,
    loading,
  ]);

  // Show all filtered products without pagination
  const currentProducts = filteredProducts;

  const handleRefresh = () => {
    fetchShopProducts();
    toast.success("Products refreshed!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-900 min-h-screen">
        <motion.div
          className="text-emerald-400 text-xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          Loading products...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <motion.div
          className="text-center text-white max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-xl font-semibold text-red-400 mb-2">Fetch Error</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={fetchShopProducts}
            className="bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600"
          >
            Retry
          </button>
          <p className="text-sm text-gray-400 mt-4">
            Ensure your backend server is running and the route{" "}
            <span className="text-emerald-400">/api/products/shop</span> is accessible
            (public endpoint).
          </p>
        </motion.div>
      </div>
    );
  }

  if (storeProducts.length === 0 && !loading && !error) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <motion.div
          className="text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-6xl mb-4">🛍️</div>
          <h3 className="text-xl font-semibold text-emerald-400 mb-2">
            Welcome to the Shop!
          </h3>
          <p className="text-gray-400">Loading products...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-6 sm:mb-8 text-center lg:text-left"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-400 mb-2">
            Shop
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">Home / Shop</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4 flex justify-between items-center order-1">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 p-2 rounded-md"
            >
              {showMobileFilters ? <X size={20} /> : <Menu size={20} />}
              <span className="text-sm font-medium">Filters</span>
            </button>
            <span className="text-gray-400 text-sm">
              {filteredProducts.length} results
            </span>
          </div>

          {/* Mobile Backdrop */}
          {showMobileFilters && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
          )}

          {/* Sidebar Filters */}
          <motion.aside
            className={`lg:w-1/4 order-2 lg:order-1 space-y-4 lg:space-y-6 ${
              showMobileFilters ? "block fixed inset-y-0 left-0 z-50 bg-gray-900 w-80" : "hidden"
            } lg:block lg:relative lg:w-auto lg:h-auto overflow-y-auto lg:overflow-visible`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Mobile Close Button */}
            {showMobileFilters && (
              <div className="p-4 border-b border-gray-700">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 w-full text-left"
                >
                  <X size={20} />
                  <span className="text-sm">Close Filters</span>
                </button>
              </div>
            )}

            <div className="p-4 lg:p-6">
              {/* Search */}
              <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4 mb-4">
                <h3 className="text-base font-semibold text-white mb-3">Search Products</h3>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-700 text-white placeholder-gray-400"
                />
              </div>

              {/* Categories */}
              <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4 mb-4">
                <h3 className="text-base font-semibold text-white mb-3">Categories</h3>
                <ul className="space-y-3 max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, cat]);
                            } else {
                              setSelectedCategories(selectedCategories.filter((c) => c !== cat));
                            }
                          }}
                          className="mr-2 text-emerald-500"
                        />
                        <span className="text-gray-300 text-sm">{formatCategory(cat)}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                {selectedCategories.length > 0 && (
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="mt-3 w-full text-sm text-emerald-400 hover:text-emerald-300"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Genders */}
              <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4 mb-4">
                <h3 className="text-base font-semibold text-white mb-3">Genders</h3>
                <ul className="space-y-3">
                  {genders.map((gender) => (
                    <li key={gender}>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedGenders.includes(gender)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedGenders([...selectedGenders, gender]);
                            } else {
                              setSelectedGenders(selectedGenders.filter((g) => g !== gender));
                            }
                          }}
                          className="mr-2 text-emerald-500"
                        />
                        <span className="text-gray-300 text-sm">
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                {selectedGenders.length > 0 && (
                  <button
                    onClick={() => setSelectedGenders([])}
                    className="mt-3 w-full text-sm text-emerald-400 hover:text-emerald-300"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4">
                <h3 className="text-base font-semibold text-white mb-3">Price Range</h3>
                <div className="space-y-4">
                  <div className="text-center text-gray-300 mb-3">
                    ₹{effectiveMinPrice.toFixed(0)} - ₹{effectiveMaxPrice.toFixed(0)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Min Price</label>
                    <input
                      type="range"
                      min={globalMin}
                      max={globalMax}
                      value={effectiveMinPrice}
                      onChange={(e) => setMinPrice(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${((effectiveMinPrice - globalMin) / (globalMax - globalMin)) * 100}%, #4b5563 ${((effectiveMinPrice - globalMin) / (globalMax - globalMin)) * 100}%, #4b5563 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>₹{globalMin.toFixed(0)}</span>
                      <span>₹{globalMax.toFixed(0)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Max Price</label>
                    <input
                      type="range"
                      min={globalMin}
                      max={globalMax}
                      value={effectiveMaxPrice}
                      onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #4b5563 0%, #4b5563 ${((effectiveMaxPrice - globalMin) / (globalMax - globalMin)) * 100}%, #10b981 ${((effectiveMaxPrice - globalMin) / (globalMax - globalMin)) * 100}%, #10b981 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>₹{globalMin.toFixed(0)}</span>
                      <span>₹{globalMax.toFixed(0)}</span>
                    </div>
                  </div>
                  {(minPrice > globalMin || maxPrice < globalMax) && (
                    <button
                      onClick={() => {
                        setMinPrice(0);
                        setMaxPrice(10000);
                      }}
                      className="w-full text-sm text-emerald-400 hover:text-emerald-300"
                    >
                      Reset Price Range
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Product Grid */}
          <motion.main
            className="lg:w-3/4 order-3 w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-700 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <span className="text-gray-400 text-sm">
                  Showing {currentProducts.length} of {filteredProducts.length} results
                </span>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
                  <label className="text-sm text-gray-400">
                    Sort by:
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="ml-2 p-1 border border-gray-600 rounded-md bg-gray-700 text-white"
                    >
                      <option value="all">All</option>
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </label>
                  <button
                    onClick={handleRefresh}
                    className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 text-sm"
                    title="Refresh products"
                  >
                    {/*<RefreshCw size={16} />
                    <span>Refresh</span>*/}
                  </button>
                </div>
              </div>

              {currentProducts.length === 0 ? (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                  <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {currentProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ProductCard product={product} onAddToCart={handleAddToCart} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
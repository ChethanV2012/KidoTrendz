import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For back navigation
import toast from "react-hot-toast";
import { ShoppingCart, Ruler, Loader2, ArrowLeft } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
// Assume ProductCard component exists; adjust import path as needed
// import ProductCard from './ProductCard'; // e.g., a reusable card component for products

const ProductDetail = ({ product: propProduct = [] }) => { // Accept relatedProducts prop
  const navigate = useNavigate(); // For back button (fallback)
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const [selectedSizes, setSelectedSizes] = useState([]); // Array for multi-select
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState("");

  // Early guard: If no product, show loading/error (though parent should handle)
  if (!propProduct) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-white mr-2" />
        <p className="text-white">Loading product details...</p>
      </div>
    );
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back(); // More reliable back navigation
    } else {
      navigate('/'); // Fallback to home if no history
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    }
    if (selectedSizes.length === 0) {
      toast.error("Please select at least one size", { id: "size" });
      return;
    }
    // Add multiple sizes/variants to cart
    selectedSizes.forEach((size) => {
      addToCart({ ...propProduct, selectedSize: size });
    });
    toast.success(`Added ${selectedSizes.length} size(s) to cart!`);
    setSelectedSizes([]); // Reset after add
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleCheckDelivery = () => {
    if (!pincode || pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }
    // Simulate API call; replace with real fetch (e.g., POST /api/delivery/check)
    setDeliveryInfo(`Delivery available in ${pincode} within 2-3 days.`);
    toast.success("Delivery check successful!");
  };

  // Helper: Convert cm to inches (rounded to 1 decimal)
  const cmToInches = (cm) => {
    if (!cm) return 'N/A';
    return (cm / 2.54).toFixed(1);
  };

  // Helper: Format description to bold labels like "Color:"
  const formatDescription = (desc) => {
    if (!desc) return null;
    return desc.split('\n').filter(line => line.trim() !== '').map((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.includes(':')) {
        const parts = trimmedLine.split(':', 2);
        const label = parts[0].trim();
        const value = parts[1]?.trim() || '';
        return (
          <div key={index} className="mb-1">
            <span className="font-bold text-white">{label}:</span>{' '}
            <span className="text-gray-300">{value}</span>
          </div>
        );
      }
      return (
        <div key={index} className="mb-1 text-gray-300 whitespace-pre-wrap">
          {line}
        </div>
      );
    });
  };

  // Helper: Format measurement key for display
  const formatMeasurement = (key) => {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  // Safe access with full optional chaining
  let sizeChart = propProduct?.sizeChart || {}; // Full size chart
  const category = propProduct?.category || 't-shirt';
  const gender = propProduct?.gender || 'unisex';
  const isFootwear = category === 'footwear';
  const isBags = category === 'bags';
  const isAccessories = category === 'accessories';
  const isSetsSuits = category === 'sets&suits';

  // Sizes: For bags and accessories, specific age groups; otherwise from prop
  const baseSizes = [
    '0-3 months', '3-6 months', '6-9 months', '9-12 months', '1-3 years', '3-5 years', 
    '5-7 years', '7-9 years', '9-12 years'
  ];
  let sizes = isBags 
    ? ['3-7 years', '7-12 years'] 
    : isAccessories 
    ? baseSizes 
    : (propProduct?.sizes || []);

  // Ensure sizes match sizeChart keys if sizes is empty but sizeChart has data
  if (sizes.length === 0 && Object.keys(sizeChart).length > 0) {
    sizes = Object.keys(sizeChart).sort((a, b) => a.localeCompare(b));
  }

  // Determine measurements keys based on category
  const measurementKeys = category === 'pants' 
    ? ['waist', 'inseam', 'outseam'] 
    : category === 'shorts'
    ? ['waist', 'inseam', 'outseam']
    : category === 'sets&suits'
    ? ['top_chest', 'top_length', 'top_sleeve', 'bottom_waist', 'bottom_inseam', 'bottom_outseam']
    : category === 'footwear'
    ? ['length'] // For shoes/slippers: inner length in cm only (width not in provided chart)
    : category === 'bags' || category === 'accessories'
    ? [] // No measurements for bags/accessories (age groups only)
    : ['chest', 'length', 'sleeve']; // Default for t-shirt, extend for other categories (indo_western, kurtis, etc.)

  // Dynamic labels
  const sizesLabel = isFootwear ? 'Sole Numbers' : isBags ? 'Age Groups' : isAccessories ? 'Age Groups' : isSetsSuits ? 'Set Sizes' : 'Sizes';
  const selectedLabel = isFootwear ? 'sole number(s)' : isBags ? 'bag(s)' : isAccessories ? 'accessory(s)' : isSetsSuits ? 'set(s)' : 'item(s)';

  // Product details from MongoDB (via API prop; assume array of {label, value})
  const productDetails = propProduct.details || []; // Fetched from DB

  // Helper to format selected sizes for display (include length for footwear)
  const formatSelectedSize = (size) => {
    if (!isFootwear) return size;
    const length = sizeChart[size]?.length;
    return length ? `${size} (${length} cm)` : size;
  };

  // Normalize category for diagram labels (handle 'tshirt' or 't-shirt')
  const normalizedCategory = category === 'tshirt' ? 't-shirt' : category;

  // Dynamic diagram labels
  const diagramLabels = {
    'pants': 'Pant Garment',
    'shorts': 'Shorts Garment',
    'indo_western': 'Indo-Western Garment',
    'kurtis': 'Kurti Garment',
    'jackets': 'Jacket Garment',
    'lehenga_choli': 'Lehenga Choli Garment',
    'ethnic_wear': 'Ethnic Garment',
    'footwear': 'Shoe / Slipper',
    'sets&suits': 'Top + Bottom',
    't-shirts': 'T-Shirt / Shirt'
  };

  // Compute diagram label with gender prefix for ethnic categories
  let diagramLabel = diagramLabels[normalizedCategory] || 'Garment';
  const isEthnicCategory = ['indo_western', 'kurtis', 'lehengha_choli', 'ethnic_wear'].includes(normalizedCategory);
  if (isEthnicCategory) {
    const genderPrefix = gender.charAt(0).toUpperCase() + gender.slice(1);
    diagramLabel = `${genderPrefix} ${diagramLabel}`;
  }
  if (isSetsSuits) {
    const genderPrefix = gender.charAt(0).toUpperCase() + gender.slice(1);
    diagramLabel = `${genderPrefix} ${diagramLabel}`;
  }

  // Dynamic title for modal
  let formattedCategory = normalizedCategory.replace(/_/g, ' ').replace(/tshirt/g, 'T-Shirt').replace(/\b\w/g, l => l.toUpperCase());
  if (isEthnicCategory || isSetsSuits) {
    const genderPrefix = gender.charAt(0).toUpperCase() + gender.slice(1);
    formattedCategory = `${genderPrefix} ${formattedCategory}`;
  }

  // Inline SimpleProductCard removed — use the imported FeaturedProducts or an external ProductCard component instead.

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 min-h-screen"> {/* Increased max-width for better space */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image - Wrapped in container with fixed aspect ratio for concise fit, sized to match details */}
        <div className="space-y-4"> {/* Added space-y-4 for button below image */}
          <div className="relative aspect-[3/4] w-full max-w-xs mx-auto md:max-w-none"> {/* Adjusted max-w to xs for decreased width/height */}
            <img
              className="absolute inset-0 object-cover w-full h-full rounded-lg shadow-lg" // Updated: Absolute fill for perfect fit
              src={propProduct.image}
              alt={propProduct.name}
              onError={(e) => { 
                e.target.src = "https://via.placeholder.com/300x400?text=No+Image+Available"; // Concise placeholder
              }}
            />
          </div>
          {/* Add to Cart Button - Moved to left side below image, enabled after size selection */}
          <button
            disabled={selectedSizes.length === 0 || !user}
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart size={22} className="mr-2" />
            Add {selectedSizes.length || sizesLabel} to Cart
          </button>
        </div>

        {/* Product Details - Increased space-y for better layout */}
        <div className="space-y-6"> {/* Increased from 4 to 6 */}
          {/* Back Button at Top */}
          <button
            onClick={handleBack}
            className="flex items-center text-sm text-gray-300 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </button>

          {/* Product Title - One font size smaller */}
          <h1 className="text-2xl font-bold text-white">{propProduct.name}</h1>

          {/* Product Details Section - From MongoDB */}
          {productDetails.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">Additional Details</h3>
              <dl className="space-y-2 text-sm">
                {productDetails.map((detail, index) => (
                  <div key={index} className="flex justify-between">
                    <dt className="text-gray-400">{detail.label}:</dt>
                    <dd className="text-white">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Description Section - Renamed to Product Details with bold labels */}
          {(propProduct.description || "No description available.") !== "No description available." && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-3">Product Details</h3>
              {formatDescription(propProduct.description)}
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-emerald-400">₹{propProduct.price}</p>
          </div>

          {/* Size Selection - Toggle buttons like screenshot */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Select {sizesLabel} (Buy multiple for different ages)
            </label>
            <div className="flex flex-wrap gap-2 mb-2"> {/* Horizontal like image */}
              {sizes.length > 0 ? (
                sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1 rounded-full text-xs border-2 transition-colors ${
                      selectedSizes.includes(size)
                        ? 'border-orange-500 bg-orange-500 text-white'
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))
              ) : (
                <p className="text-gray-400">No sizes available</p>
              )}
            </div>
            {selectedSizes.length > 0 && (
              <p className="text-sm text-emerald-400">
                Selected: {selectedSizes.map(formatSelectedSize).join(', ')} ({selectedSizes.length} {selectedLabel})
              </p>
            )}
          </div>

          {/* Size Chart Button - Appears if at least one size selected, chart available, and not bags or accessories */}
          {selectedSizes.length > 0 && Object.keys(sizeChart).length > 0 && !isBags && !isAccessories && (
            <button
              onClick={() => setShowSizeChart(true)}
              className="flex items-center text-sm text-gray-300 hover:text-white transition-colors"
            >
              <Ruler size={16} className="mr-1" />
              View Size Chart
            </button>
          )}

          {/* Pincode Delivery Check - Below size selection */}
          <div className="pt-4 border-t border-gray-700">
            <label className="block text-sm font-medium text-white mb-2">Enter Pincode to Check Delivery</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit pincode"
                maxLength={6}
                className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCheckDelivery}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                Check
              </button>
            </div>
            {deliveryInfo && <p className="mt-2 text-sm text-green-400">{deliveryInfo}</p>}
          </div>

          {/* Additional Info */}
          <div className="text-xs text-gray-400 space-y-1">
            <p>Gift Wrap Available</p>
            <p>7 Days Return/Exchange</p>
          </div>
        </div>
      </div>

      {/* Size Chart Modal - Full table for all sizes, wider; only for non-bags and non-accessories */}
      {showSizeChart && sizes.length > 0 && Object.keys(sizeChart).length > 0 && !isBags && !isAccessories && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"> {/* Wider: max-w-6xl, taller */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                Size Chart - {formattedCategory} {/* Dynamic title */}
              </h3>
              <button
                onClick={() => setShowSizeChart(false)}
                className="text-gray-300 hover:text-white text-xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="relative bg-gray-700 p-4 rounded-md mb-4">
              {/* Dynamic diagram based on category */}
              <div className="text-center mb-4">
                <div className="inline-block border border-gray-500 p-4 rounded-lg">
                  {category === 'pants' ? (
                    // Pant diagram
                    <div className="w-24 h-40 border-2 border-dashed border-gray-400 mx-auto mb-2 relative bg-gray-600 rounded">
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-white">
                        {/* Waist */}
                        <div className="w-12 h-8 bg-blue-500 rounded-t mb-1"></div>
                        {/* Legs */}
                        <div className="w-12 h-28 bg-blue-500 rounded-b"></div>
                        <span className="mt-1">{diagramLabel}</span>
                      </div>
                    </div>
                  ) : category === 'shorts' ? (
                    // Shorts diagram
                    <div className="w-24 h-24 border-2 border-dashed border-gray-400 mx-auto mb-2 relative bg-gray-600 rounded">
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-white">
                        {/* Waist */}
                        <div className="w-12 h-6 bg-blue-500 rounded-t mb-1"></div>
                        {/* Shorter inseam */}
                        <div className="w-12 h-14 bg-blue-500 rounded-b"></div>
                        <span className="mt-1">{diagramLabel}</span>
                      </div>
                    </div>
                  ) : category === 'sets&suits' ? (
                    // Sets & Suits diagram: Top + Bottom side by side
                    <div className="flex gap-4 justify-center mb-2">
                      <div className="w-24 h-32 border-2 border-dashed border-gray-400 relative bg-gray-600 rounded text-center">
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-white">
                          {/* Sleeve */}
                          <div className="w-16 h-4 bg-red-500 rounded-t mb-1"></div>
                          {/* Body */}
                          <div className="w-16 h-20 bg-red-500 rounded-b"></div>
                        </div>
                        <span className="text-xs mt-1 block"></span>
                      </div>
                      <div className="w-24 h-40 border-2 border-dashed border-gray-400 relative bg-gray-600 rounded text-center">
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-white">
                          {/* Waist */}
                          <div className="w-12 h-8 bg-blue-500 rounded-t mb-1"></div>
                          {/* Legs */}
                          <div className="w-12 h-28 bg-blue-500 rounded-b"></div>
                        </div>
                        <span className="text-xs mt-1 block"></span>
                      </div>
                    </div>
                  ) : ['indo_western', 'kurtis', 'lehengha_choli', 'ethnic_wear'].includes(category) ? (
                    // Custom Ethnic/Kurta diagram (longer body, flared bottom for lehengha, etc.)
                    <div className="w-24 h-40 border-2 border-dashed border-gray-400 mx-auto mb-2 relative bg-gray-600 rounded">
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-white">
                        {/* Sleeve */}
                        <div className="w-16 h-4 bg-indigo-500 rounded-t mb-1"></div>
                        {/* Body */}
                        <div className="w-16 h-28 bg-indigo-500 rounded-b relative">
                          {category === 'lehengha_choli' && (
                            /* Flare only for lehengha */
                            <div className="absolute bottom-0 left-0 w-8 h-12 bg-indigo-400 rounded-br"></div>
                          )}
                        </div>
                        <span className="mt-1">{diagramLabel}</span>
                      </div>
                    </div>
                  ) : category === 'footwear' ? (
                    // Footwear diagram (shoe/slippers)
                    <div className="w-32 h-16 border-2 border-dashed border-gray-400 mx-auto mb-2 relative bg-gray-600 rounded">
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-white">
                        {/* Sole/Length */}
                        <div className="w-20 h-8 bg-purple-500 rounded mb-1"></div>
                        {/* Width indicator */}
                        <div className="w-4 h-8 bg-purple-500 rounded-r absolute right-0 top-0"></div>
                        <span className="mt-1">{diagramLabel}</span>
                      </div>
                    </div>
                  ) : category === 'bags' ? (
                    // Bags diagram (backpack/handbag with volume indicator)
                    <div className="w-24 h-32 border-2 border-dashed border-gray-400 mx-auto mb-2 relative bg-gray-600 rounded">
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-white">
                        <div className="w-16 h-20 bg-green-500 rounded mb-1 relative">
                          {/* Volume indicator */}
                          <div className="absolute top-1 right-1 w-4 h-4 bg-yellow-400 rounded-full"></div>
                        </div>
                        <span className="mt-1">{diagramLabel}</span>
                      </div>
                    </div>
                  ) : (
                    // T-shirt diagram (default)
                    <div className="w-24 h-32 border-2 border-dashed border-gray-400 mx-auto mb-2 relative bg-gray-600 rounded">
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-white">
                        {/* Sleeve */}
                        <div className="w-16 h-4 bg-red-500 rounded-t mb-1"></div>
                        {/* Body */}
                        <div className="w-16 h-20 bg-red-500 rounded-b"></div>
                        <span className="mt-1">{diagramLabel}</span>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-gray-300">Measurements (cm / inches)</p>
                </div>
              </div>
              {/* Full Size Chart Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-600 text-sm">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-white font-bold">Measurement</th>
                      {sizes.map((size) => (
                        <th key={size} className="px-4 py-2 text-left text-white font-bold border-l border-gray-500">
                          {size}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-500">
                    {measurementKeys.map((key) => (
                      <tr key={key} className="hover:bg-gray-500">
                        <td className="px-4 py-2 font-medium text-white">{formatMeasurement(key)}</td>
                        {sizes.map((size) => {
                          const measurement = sizeChart[size]?.[key];
                          let displayValue = measurement || 'N/A';
                          let secondary = '';
                          const isCapacity = key === 'capacity';
                          const isNumeric = typeof measurement === 'number';
                          if (!isCapacity && isNumeric) {
                            const inches = cmToInches(measurement);
                            secondary = <span className="text-xs opacity-80">({inches} in)</span>;
                          }
                          return (
                            <td key={size} className="px-4 py-2 text-gray-300 border-l border-gray-500">
                              {displayValue} {isCapacity ? 'L' : 'cm'}<br />
                              {secondary}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center mb-4">
              All measurements shown are of the garment and will have a tolerance of 0.5 inches/1.25 cm.
            </p>
            <button
              onClick={() => setShowSizeChart(false)}
              className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      )}
    </div>
  );
};

export default ProductDetail;
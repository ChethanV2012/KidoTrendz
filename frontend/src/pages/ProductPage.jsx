import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ProductDetail from '../components/ProductDetail'; 
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

// Helper: Generate sizes based on category/gender - Using exact user-provided list
const generateSizes = (category) => {
  const baseSizes = [
    '0-3 months', '3-6 months', '6-9 months', '9-12 months', '1-3 years', '3-5 years',
    '5-7 years', '7-9 years', '9-12 years'
  ];
  return ['pants', 'shorts', 'indo_western', 'kurtis', 'lehengha_choli', 'ethnic_wear', 'accessories', 'sets&suits'].includes(category) ? baseSizes : baseSizes; // Full range for all here
};

// Helper: Generate size chart based on category/gender - Realistic measurements in cm
const generateSizeChart = (category, gender) => {
  if (category === 'accessories') {
    // Accessories: No size chart needed, just age selection
    return {};
  }
  const sizeChart = {};
  const sizes = generateSizes(category);
  const isGirls = gender === 'girls';

  // Common data objects
  const tshirtData = {
    '0-3 months': { chest: 40, length: 30, sleeve: 20 },
    '3-6 months': { chest: 43, length: 33, sleeve: 22 },
    '6-9 months': { chest: 45, length: 36, sleeve: 24 },
    '9-12 months': { chest: 48, length: 39, sleeve: 26 },
    '1-3 years': { chest: 52, length: 42, sleeve: 28 },
    '3-5 years': { chest: 56, length: 46, sleeve: 30 },
    '5-7 years': { chest: 60, length: 50, sleeve: 32 },
    '7-9 years': { chest: 64, length: 54, sleeve: 34 },
    '9-12 years': { chest: 68, length: 58, sleeve: 36 },
  };
  const pantsData = {
    '0-3 months': { waist: 37, inseam: 25, outseam: 40 },
    '3-6 months': { waist: 45, inseam: 27, outseam: 43 },
    '6-9 months': { waist: 47, inseam: 29, outseam: 46 },
    '9-12 months': { waist: 49, inseam: 31, outseam: 49 },
    '1-3 years': { waist: 52, inseam: 35, outseam: 55 },
    '3-5 years': { waist: 54, inseam: 40, outseam: 60 },
    '5-7 years': { waist: 56, inseam: 45, outseam: 65 },
    '7-9 years': { waist: 58, inseam: 50, outseam: 70 },
    '9-12 years': { waist: 61, inseam: 55, outseam: 75 },
  };
  const shortsData = {
    '0-3 months': { waist: 37, inseam: 12, outseam: 25 },
    '3-6 months': { waist: 45, inseam: 13, outseam: 26 },
    '6-9 months': { waist: 47, inseam: 14, outseam: 27 },
    '9-12 months': { waist: 49, inseam: 15, outseam: 28 },
    '1-3 years': { waist: 52, inseam: 16, outseam: 29 },
    '3-5 years': { waist: 54, inseam: 18, outseam: 30 },
    '5-7 years': { waist: 56, inseam: 20, outseam: 31 },
    '7-9 years': { waist: 58, inseam: 22, outseam: 32 },
    '9-12 years': { waist: 61, inseam: 24, outseam: 33 },
  };
  const ethnicData = isGirls ? {
    '0-3 months': { chest: 38, length: 36, sleeve: 13 },
    '3-6 months': { chest: 42, length: 38, sleeve: 15 },
    '6-9 months': { chest: 44, length: 41, sleeve: 18 },
    '9-12 months': { chest: 48, length: 43, sleeve: 20 },
    '1-3 years': { chest: 51, length: 46, sleeve: 23 },
    '3-5 years': { chest: 56, length: 56, sleeve: 31 },
    '5-7 years': { chest: 66, length: 66, sleeve: 36 },
    '7-9 years': { chest: 71, length: 74, sleeve: 43 },
    '9-12 years': { chest: 75, length: 81, sleeve: 48 },
  } : {
    '0-3 months': { chest: 38, length: 36, sleeve: 17 },
    '3-6 months': { chest: 40, length: 37, sleeve: 18 },
    '6-9 months': { chest: 43, length: 40, sleeve: 20 },
    '9-12 months': { chest: 46, length: 42, sleeve: 24 },
    '1-3 years': { chest: 51, length: 46, sleeve: 27 },
    '3-5 years': { chest: 58, length: 55, sleeve: 31 },
    '5-7 years': { chest: 66, length: 64, sleeve: 39 },
    '7-9 years': { chest: 71, length: 70, sleeve: 47 },
    '9-12 years': { chest: 75, length: 77, sleeve: 50 },
  };

  if (category === 'pants') {
    // Pants: waist, inseam, outseam (cm) - Based on standard charts (e.g., Carter's adapted)
    sizes.forEach((size) => {
      sizeChart[size] = pantsData[size] || { waist: 50, inseam: 40, outseam: 60 }; // Fallback
      // Slight gender adjustment (e.g., girls waist -1cm)
      if (isGirls) sizeChart[size].waist -= 1;
    });
  } else if (category === 'shorts') {
    // Shorts: waist (same as pants), shorter inseam/outseam (cm)
    sizes.forEach((size) => {
      sizeChart[size] = shortsData[size] || { waist: 50, inseam: 20, outseam: 30 }; // Fallback
      // Slight gender adjustment (e.g., girls waist -1cm)
      if (isGirls) sizeChart[size].waist -= 1;
    });
  } else if (category === 'sets&suits') {
    // Sets & Suits: Combined top (t-shirt for boys, ethnic/kurti for girls) + bottom (pants) measurements
    const topDataToUse = isGirls ? ethnicData : tshirtData;
    sizes.forEach((size) => {
      const top = topDataToUse[size] || { chest: 50, length: 40, sleeve: 25 };
      let bottom = pantsData[size] || { waist: 50, inseam: 40, outseam: 60 };
      if (isGirls) bottom.waist -= 1;
      sizeChart[size] = {
        top_chest: top.chest,
        top_length: top.length,
        top_sleeve: top.sleeve,
        bottom_waist: bottom.waist,
        bottom_inseam: bottom.inseam,
        bottom_outseam: bottom.outseam,
      };
    });
  } else if (['indo_western', 'kurtis', 'lehengha_choli', 'ethnic_wear'].includes(category)) {
    // Gender-specific ethnic wear: chest, length, sleeve (cm) - Girls from Homesake Love; Boys adapted from Homesake Love boys kurta set (converted/averaged to cm, rounded)
    sizes.forEach((size) => {
      sizeChart[size] = ethnicData[size] || { chest: 50, length: 40, sleeve: 25 }; // Fallback
    });
  } else {
    // T-shirt: chest, length, sleeve (cm) - Based on standard kids charts (e.g., Hanna Andersson/Size.ly adapted)
    sizes.forEach((size) => {
      sizeChart[size] = tshirtData[size] || { chest: 50, length: 40, sleeve: 25 }; // Fallback
    });
  }
  return sizeChart;
};

const ProductPage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      fetchFeaturedProducts();
    }, [fetchFeaturedProducts]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Adjust API endpoint to match your backend (e.g., /api/products/${id})
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error(`Product not found: ${response.status}`);
        }
        const data = await response.json();
        // Ensure data has required fields; fallback if missing
        setProduct({
          ...data,
          category: data.category || 't-shirt', 
          gender: data.gender || 'unisex', 
          sizes: data.sizes || generateSizes(data.category), // Dynamic sizes
          sizeChart: data.sizeChart || generateSizeChart(data.category, data.gender), // Dynamic chart
          description: data.description || 'Adorable kids\' wear. Made from soft 100% cotton.',
        });
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setError('Invalid product ID');
      setLoading(false);
    }
  }, [id]);

  // Scroll to top on component mount (load/refresh)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-white mr-2" />
        <p className="text-white">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <p className="text-red-400 text-center">{error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <>
      <ProductDetail product={product} />
      {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
    </>
  );
};

export default ProductPage;
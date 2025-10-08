// Example Shop.jsx (assuming you have a useProductsStore)
import { useSearchParams } from "react-router-dom";
import { useProductsStore } from "../stores/useProductsStore"; // Assume this exists with products array

const Shop = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products } = useProductsStore();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );

  if (query && filteredProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-300 mb-4">No products found</h2>
        <p className="text-gray-500">Try searching for something else or browse categories.</p>
      </div>
    );
  }

  // Render products grid otherwise
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-emerald-400 mb-6">Shop</h1>
      {query && <p className="text-gray-300 mb-4">Showing results for &quot;{query}&quot;</p>}
      {/* Your products grid here */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white">{product.name}</h3>
            <p className="text-gray-400">{product.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
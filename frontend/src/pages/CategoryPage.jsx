import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
	const { fetchProductsByCategory, products, loading } = useProductStore();
	const navigate = useNavigate();

	const { category } = useParams();

	useEffect(() => {
		fetchProductsByCategory(category);
	}, [fetchProductsByCategory, category]);

	const handleBack = () => {
		navigate(-1);
	};

	return (
		<div className='min-h-screen bg-gray-900'>
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<div className='flex items-center justify-between mb-8'>
					<motion.button
						onClick={handleBack}
						className='flex items-center text-emerald-400 hover:text-emerald-300 text-lg font-medium transition-colors'
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
					>
						<span className='mr-2'>←</span> Back
					</motion.button>
					<motion.h1
						className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 flex-1'
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						{category.charAt(0).toUpperCase() + category.slice(1)} Products
					</motion.h1>
					<div className='w-8' /> {/* Spacer for symmetry */}
				</div>

				{loading ? (
					<div className="flex justify-center items-center py-12">
						<motion.div
							className="text-emerald-400 text-xl"
							animate={{ rotate: 360 }}
							transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
						>
							Loading...
						</motion.div>
					</div>
				) : products?.length === 0 ? (
					<motion.h2
						className='text-3xl font-semibold text-gray-300 text-center'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						No products found in this category.
					</motion.h2>
				) : (
					<motion.div
						className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						{products?.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</motion.div>
				)}
			</div>
		</div>
	);
};
export default CategoryPage;
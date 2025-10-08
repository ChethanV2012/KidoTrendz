import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const FeaturedProducts = ({ featuredProducts }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);
	const [shuffledProducts, setShuffledProducts] = useState([]);

	const { addToCart } = useCartStore();
	const { user } = useUserStore();
	const navigate = useNavigate();

	// Shuffle only admin-marked featured products on every mount (including navigation back)
	useEffect(() => {
		if (featuredProducts && featuredProducts.length > 0) {
			const adminFeatured = featuredProducts.filter(product => product.isFeatured === true);
			const shuffled = [...adminFeatured].sort(() => Math.random() - 0.5);
			setShuffledProducts(shuffled);
			setCurrentIndex(0); // Reset carousel to start
		}
	}, [featuredProducts]); // Depend on featuredProducts to reshuffle if data changes

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
	};

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= shuffledProducts.length - itemsPerPage;

	const handleProductClick = (productId) => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		navigate(`/product/${productId}`);
	};

	const handleAddToCart = (product) => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		} else {
			addToCart(product);
		}
	};

	if (shuffledProducts.length === 0) {
		return null;
	}

	return (
		<div className='py-12'>
			<div className='container mx-auto px-4'>
				<h2 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>Featured</h2>
				<div className='relative'>
					<div className='overflow-hidden'>
						<div
							className='flex transition-transform duration-300 ease-in-out'
							style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
						>
							{shuffledProducts?.map((product) => (
								<div key={product._id} className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2'>
									<div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
										<div 
											className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl cursor-pointer'
											onClick={() => handleProductClick(product._id)}
										>
											<img 
												className='object-cover w-full h-full' 
												src={product.image} 
												alt={product.name} 
											/>
											<div className='absolute inset-0 bg-black bg-opacity-20' />
										</div>
										<div className='mt-4 px-5 pb-5'>
											<h5 className='text-xl font-semibold tracking-tight text-white'>{product.name}</h5>
											<div className='mt-2 mb-5 flex items-center justify-between'>
												<p>
													<span className='text-3xl font-bold text-emerald-400'>₹{product.price.toFixed(2)}</span>
												</p>
											</div>
											<button
												className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
												 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
												onClick={() => handleAddToCart(product)}
											>
												<ShoppingCart size={22} className='mr-2' />
												Add to cart
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					<button
						onClick={prevSlide}
						disabled={isStartDisabled}
						className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isStartDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
						}`}
					>
						<ChevronLeft className='w-6 h-6' />
					</button>

					<button
						onClick={nextSlide}
						disabled={isEndDisabled}
						className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isEndDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
						}`}
					>
						<ChevronRight className='w-6 h-6' />
					</button>
				</div>
			</div>
		</div>
	);
};
export default FeaturedProducts;
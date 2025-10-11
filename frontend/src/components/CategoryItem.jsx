import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CategoryItem = ({ category }) => {
	return (
		<motion.div 
			className='relative overflow-hidden h-96 w-full rounded-lg group'
			initial={{ y: 50, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			whileHover={{ y: -5 }}
		>
			<Link 
				to={"/category" + category.href}
				onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
			>
				<div className='w-full h-full cursor-pointer'>
					<div className='absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10' />
					<img
						src={category.imageUrl}
						alt={category.name}
						className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110'
						loading='lazy'
					/>
					<div className='absolute bottom-0 left-0 right-0 p-4 z-20'>
						<h3 className='text-white text-2xl font-bold mb-2'>{category.name}</h3>
						<p className='text-gray-200 text-sm'>Explore {category.name}</p>
					</div>
				</div>
			</Link>
		</motion.div>
	);
};

export default CategoryItem;
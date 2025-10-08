import { useState } from "react";
import { ShoppingCart, UserPlus, LogOut, Lock, Search, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	const { cart } = useCartStore();
	const location = useLocation();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const query = searchParams.get('q') || '';
	const menuLinks = [
		{ to: "/", label: "HOME" },
		{ to: "/shop", label: "SHOP" },
		{ to: "/about", label: "ABOUT" },
		{ to: "/contact", label: "CONTACT" },
	];

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const handleSearchChange = (e) => {
		const newQuery = e.target.value;
		if (newQuery) {
			setSearchParams({ q: newQuery });
			// Optionally navigate to /shop or /search for results
			if (location.pathname !== '/shop') {
				navigate(`/shop?q=${newQuery}`);
			}
		} else {
			setSearchParams({});
			if (location.pathname !== '/shop') {
				navigate('/shop');
			}
		}
	};

	return (
		<header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
			<div className='container mx-auto px-4 sm:px-6 py-3 sm:py-4'>
				<div className='flex justify-between items-center relative'>
					<Link to='/' className='text-xl sm:text-2xl font-bold text-emerald-400 tracking-wide select-none'>
						E-Commerce
					</Link>

					{/* Mobile menu button - only for non-admin */}
					{!isAdmin && (
						<button
							className='md:hidden text-gray-300 hover:text-emerald-400 transition duration-300'
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						>
							{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					)}

					{/* Desktop search and nav - only for non-admin */}
					{!isAdmin && (
						<div className='hidden md:flex items-center gap-8 mx-8 flex-1 max-w-2xl'>
							{/* Desktop search */}
							<div className="relative flex-1 max-w-md">
								<Search
									size={16}
									className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 pointer-events-none"
								/>
								<input
									type="text"
									placeholder="Search products..."
									value={query}
									onChange={handleSearchChange}
									className="pl-10 py-2.5 w-full rounded-full border border-gray-600 bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
								/>
							</div>

							{/* Desktop nav */}
							<nav className='flex items-center gap-8 font-medium text-gray-300 uppercase'>
								{menuLinks.map(({ to, label }) => (
									<Link
										key={to}
										to={to}
										className={`relative transition duration-300 ease-in-out hover:text-emerald-400 ${location.pathname === to
											? "text-emerald-400 font-semibold"
											: ""
											} group`}
									>
										{label}
										<span
											className={`absolute left-0 -bottom-1 w-full h-0.5 bg-emerald-400 scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100 ${location.pathname === to ? "scale-x-100" : ""
												}`}
										/>
									</Link>
								))}
							</nav>
						</div>
					)}

					{/* Right side - visible on all */}
					<div className="flex items-center gap-2 sm:gap-4">
						{/* Cart - only for non-admin users */}
						{user && !isAdmin && (
							<Link
								to="/cart"
								className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
							>
								<ShoppingCart className='group-hover:text-emerald-400' size={20} />
								{cart.length > 0 && (
									<span
										className='absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
										text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
									>
										{cart.length}
									</span>
								)}
							</Link>
						)}

						{/* Admin Dashboard */}
						{isAdmin && (
							<Link
								className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
									transition duration-300 ease-in-out flex items-center'
								to={"/secret-dashboard"}
							>
								<Lock className='mr-1' size={18} />
								<span className='hidden lg:inline'>Dashboard</span>
							</Link>
						)}

						{/* Auth / Logout */}
						{user ? (
							<button
								className='flex items-center gap-1 sm:gap-2 text-gray-300 hover:text-emerald-400 md:bg-gray-700 md:hover:bg-gray-600 md:text-white py-2 px-3 sm:px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 md:transform-none'
								onClick={handleLogout}
							>
								<LogOut size={18} />
								<span className='hidden md:inline'>Log Out</span>
							</button>
						) : (
							<Link
								to="/signup"
								className='flex items-center gap-1 sm:gap-2 text-gray-300 hover:text-emerald-400 md:bg-emerald-600 md:hover:bg-emerald-700 md:text-white py-2 px-3 sm:px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 md:transform-none'
							>
								<UserPlus size={18} />
								<span className='hidden md:inline'>Create Account</span>
							</Link>
						)}
					</div>
				</div>
			</div>

			{/* Mobile Menu Dropdown - only for non-admin */}
			{isMobileMenuOpen && !isAdmin && (
				<div className="md:hidden absolute top-full left-0 w-full bg-gray-900 bg-opacity-95 backdrop-blur-md border-t border-emerald-800 shadow-lg">
					<nav className="flex flex-col items-center gap-4 py-6">
						{/* Mobile Nav Links */}
						{menuLinks.map(({ to, label }) => (
							<Link
								key={to}
								to={to}
								className={`text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out text-sm uppercase font-medium ${location.pathname === to ? "text-emerald-400 font-semibold" : ""}`}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{label}
							</Link>
						))}

						{/* Mobile Search */}
						<div className="relative w-full max-w-sm mx-auto px-4">
							<Search
								size={16}
								className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 pointer-events-none"
							/>
							<input
								type="text"
								placeholder="Search products..."
								value={query}
								onChange={handleSearchChange}
								className="pl-12 py-2.5 w-full rounded-full border border-gray-600 bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
							/>
						</div>

						{/* Mobile Admin Dashboard */}
						{isAdmin && (
							<Link
								to="/secret-dashboard"
								className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium transition duration-300 ease-in-out text-sm"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<Lock size={18} />
								Dashboard
							</Link>
						)}
					</nav>
				</div>
			)}
		</header>
	);
};
export default Navbar;
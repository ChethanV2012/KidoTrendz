import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { ShoppingCart, User, LogOut, Lock, Search, Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import logo from '../assets/kidoTrendzLogo.png'; // Adjust path as needed

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	// eslint-disable-next-line no-unused-vars
	const { cart, clearCart } = useCartStore(); // Assuming clearCart action exists in store
	const location = useLocation();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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
		setIsProfileDropdownOpen(false);
	};

	const toggleProfileDropdown = () => {
		setIsProfileDropdownOpen(!isProfileDropdownOpen);
	};

	const handleSearchChange = (e) => {
		const newQuery = e.target.value;
		if (newQuery) {
			setSearchParams({ q: newQuery });
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

	// Cart clearing should be handled from your payment success handler (e.g., after confirming payment).
	// Call clearCart() from the component or module that processes the payment confirmation to avoid
	// keeping unused functions inside this Navbar component.

	return (
		<header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
			<div className='container mx-auto px-4 sm:px-6 py-3 sm:py-4'>
				<div className='flex justify-between items-center relative'>
					<Link to='/' className='flex-shrink-0'>
						<img src={logo} alt="E-Commerce Logo" className="h-8 sm:h-10 w-auto" />
					</Link>

					{/* Mobile menu button - only for non-admin */}
					{!isAdmin && (
						<button
							className='md:hidden text-gray-300 hover:text-emerald-400 transition duration-300 ml-auto'
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
									className="pl-10 py-2.5 w-full rounded-full border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-sm hover:shadow-md"
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

						{/* Admin Dashboard Button - Prominent for admins (always visible, no toggle needed) */}
						{isAdmin && (
							<Link
								to="/secret-dashboard"
								className='bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-semibold 
									transition duration-300 ease-in-out flex items-center shadow-md hover:shadow-lg transform hover:scale-105'
							>
								<Lock className='mr-2' size={18} />
								Dashboard
							</Link>
						)}

						{/* Auth / Profile Dropdown - for both user and admin */}
						{user ? (
							<div className="relative">
								<button
									className='flex items-center gap-1 sm:gap-2 text-gray-300 hover:text-emerald-400 md:bg-gray-700 md:hover:bg-gray-600 md:text-white py-2 px-3 sm:px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 md:transform-none'
									onClick={toggleProfileDropdown}
								>
									<User size={18} />
									<ChevronDown size={16} className={`ml-1 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
								</button>
								{isProfileDropdownOpen && (
									<div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
										{!isAdmin && (
											<>
	
											</>
										)}
										<Link
											to="/profile"
											className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-emerald-400 transition duration-200"
											onClick={() => setIsProfileDropdownOpen(false)}
										>
											My Profile
										</Link>
										{isAdmin && (
											<Link
												to="/secret-dashboard"
												className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-emerald-400 transition duration-200"
												onClick={() => setIsProfileDropdownOpen(false)}
											>
												Dashboard
											</Link>
										)}
										<button
											onClick={handleLogout}
											className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-emerald-400 transition duration-200"
										>
											Log Out
										</button>
									</div>
								)}
							</div>
						) : (
							<Link
								to="/login"
								className='flex items-center gap-1 sm:gap-2 text-gray-300 hover:text-emerald-400 md:bg-emerald-600 md:hover:bg-emerald-700 md:text-white py-2 px-3 sm:px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 md:transform-none'
							>
								<User size={18} />
								<span className='hidden md:inline'>Sign In</span>
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
								className="pl-12 py-2.5 w-full rounded-full border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-sm hover:shadow-md"
							/>
						</div>

						{/* Mobile Profile Dropdown Trigger */}
						{user && (
							<div className="relative w-full max-w-sm mx-auto px-4">
								<button
									className="flex items-center gap-2 w-full justify-center text-gray-300 hover:text-emerald-400 py-2 transition duration-300"
									onClick={toggleProfileDropdown}
								>
									<User size={18} />
									<ChevronDown size={16} className={`transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
								</button>
								{isProfileDropdownOpen && (
									<div className="absolute top-full right-4 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
										
										<Link
											to="/my-orders"
											className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-emerald-400 transition duration-200"
											onClick={() => {
												setIsProfileDropdownOpen(false);
												setIsMobileMenuOpen(false);
											}}
										>
											Manage My Orders
										</Link>
										<Link
											to="/profile"
											className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-emerald-400 transition duration-200"
											onClick={() => {
												setIsProfileDropdownOpen(false);
												setIsMobileMenuOpen(false);
											}}
										>
											My Profile
										</Link>
										<button
											onClick={handleLogout}
											className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-emerald-400 transition duration-200"
										>
											Log Out
										</button>
									</div>
								)}
							</div>
						)}
					</nav>
				</div>
			)}
		</header>
	);
};
export default Navbar;
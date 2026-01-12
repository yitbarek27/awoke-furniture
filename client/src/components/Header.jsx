import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi'; // Import icons

const Header = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu
    const navigate = useNavigate();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass shadow-sm py-2' : 'bg-transparent py-4'} `}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
                    <span className="text-secondary text-4xl">.</span>Awoke
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-6">
                    <Link to="/" className="text-slate-600 hover:text-secondary font-medium transition-colors">Home</Link>
                    <a href="/#about" className="text-slate-600 hover:text-secondary font-medium transition-colors">About Us</a>
                    <a href="/#catalog" className="text-slate-600 hover:text-secondary font-medium transition-colors">Shop</a>
                    <Link to="/customer/dashboard" className="text-slate-600 hover:text-secondary font-medium transition-colors">Customer Service</Link>
                    <Link to="/seller/dashboard" className="text-slate-600 hover:text-secondary font-medium transition-colors">Seller Portal</Link>

                    {user && user.isAdmin && (
                        <div className="relative group">
                            <button className="text-slate-600 hover:text-secondary font-medium flex items-center gap-1">
                                Admin Dashboard <span>▼</span>
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                                <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-50 text-sm font-medium">Overview</Link>
                                <Link to="/admin/products" className="block px-4 py-2 hover:bg-gray-50 text-sm font-medium">Manage Products</Link>
                                <Link to="/admin/users" className="block px-4 py-2 hover:bg-gray-50 text-sm font-medium">Manage Workers</Link>
                                <Link to="/admin/orders" className="block px-4 py-2 hover:bg-gray-50 text-sm font-medium">Manage Orders</Link>
                            </div>
                        </div>
                    )}
                </nav>

                <div className="flex items-center space-x-6">
                    <Link to="/cart" className="relative text-primary hover:text-secondary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                            </span>
                        )}
                    </Link>
                    
                    {/* Mobile Menu Button */}
                    <button onClick={toggleMobileMenu} className="md:hidden text-2xl text-primary focus:outline-none">
                        {mobileMenuOpen ? <FiX /> : <FiMenu />}
                    </button>

                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="hidden lg:inline text-sm font-semibold text-primary">{user.name}</span>
                                <button onClick={handleLogout} className="btn btn-secondary text-sm px-4 py-1">Logout</button>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-primary text-sm px-5 py-2">Login</Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col space-y-4 border-t border-gray-100 animate-fade-in z-40">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-secondary font-medium">Home</Link>
                    <a href="/#about" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-secondary font-medium">About Us</a>
                    <a href="/#catalog" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-secondary font-medium">Shop</a>
                    <Link to="/customer/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-secondary font-medium">Customer Service</Link>
                    <Link to="/seller/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-secondary font-medium">Seller Portal</Link>
                    
                    {user && user.isAdmin && (
                        <div className="border-t pt-2 mt-2">
                             <p className="text-xs text-gray-400 font-bold uppercase mb-2">Admin Menu</p>
                            <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-secondary text-sm">Overview</Link>
                            <Link to="/admin/products" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-secondary text-sm">Manage Products</Link>
                            <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-secondary text-sm">Manage Workers</Link>
                            <Link to="/admin/orders" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-secondary text-sm">Manage Orders</Link>
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                         {user ? (
                            <div className="flex items-center w-full justify-between">
                                <span className="text-sm font-semibold text-primary">{user.name}</span>
                                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn btn-secondary text-sm px-4 py-1">Logout</button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary text-sm px-5 py-2 w-full text-center">Login</Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;

import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CustomerDashboard = () => {
    const { cartItems } = useCart();
    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const navigate = useNavigate();

    const handleBrowseCatalog = () => {
        // Navigate to HomePage and scroll to the catalog section (list of all products)
        navigate('/', { state: { scrollTo: 'catalog' } });
    };

    return (
        <div className="space-y-10 pb-12">
            {/* Header Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
                <h1 className="text-3xl font-heading font-bold text-primary">Customer Services Portal</h1>
                <p className="text-gray-500 mt-1">One-stop solution for all your shopping and service needs.</p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* 1. View Products / Catalog */}
                <button
                    type="button"
                    onClick={handleBrowseCatalog}
                    className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden text-left"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-bold text-secondary group-hover:opacity-10 transition-opacity">
                        1
                    </div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                            🛍️
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Browse Catalog</h3>
                        <p className="text-gray-500 mb-6">See types of available products with their prices. Explore our premium MDF collection.</p>
                        <span className="text-secondary font-bold flex items-center gap-2">
                            View Products →
                        </span>
                    </div>
                </button>

                {/* 2. Make Decision / Cart */}
                <Link to="/cart" className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-bold text-emerald-500 group-hover:opacity-10 transition-opacity">
                        2
                    </div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            🛒
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-2">My Cart & Decisions</h3>
                        <p className="text-gray-500 mb-6">Review your selections and make a decision to buy. Manage your potential orders.</p>
                        <div className="flex items-center justify-between">
                            <span className="text-emerald-600 font-bold flex items-center gap-2">Go to Cart →</span>
                            {cartCount > 0 && (
                                <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                                    {cartCount} Items Selected
                                </span>
                            )}
                        </div>
                    </div>
                </Link>

                {/* 3. Make Order / Checkout */}
                <Link to="/shipping" className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-bold text-blue-500 group-hover:opacity-10 transition-opacity">
                        3
                    </div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            📦
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Finalize Order</h3>
                        <p className="text-gray-500 mb-6">Proceed to shipping and place your order securely. We ensure fast delivery.</p>
                        <span className="text-blue-600 font-bold flex items-center gap-2">Checkout Now →</span>
                    </div>
                </Link>

                {/* 4. Payment Methods */}
                <Link to="/customer/payments" className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-bold text-purple-500 group-hover:opacity-10 transition-opacity">
                        4
                    </div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            💳
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Payment Methods</h3>
                        <p className="text-gray-500 mb-6">We accept Bank Transfer, CBE Birr, and Telebirr. Pay securely upon order confirmation.</p>
                        <div className="flex gap-2 mt-4 opacity-70">
                            <span className="text-purple-600 font-bold flex items-center gap-2">View Details →</span>
                        </div>
                    </div>
                </Link>

                {/* 5. Support */}
                <Link to="/customer/support" className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-bold text-orange-500 group-hover:opacity-10 transition-opacity">
                        ?
                    </div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            📞
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Live Support</h3>
                        <p className="text-gray-500 mb-6">Need help guiding you through the process? Call our agents directly.</p>
                        <span className="text-orange-600 font-bold flex items-center gap-2">Contact Us →</span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default CustomerDashboard;

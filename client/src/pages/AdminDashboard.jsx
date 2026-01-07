import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        revenue: 0
    });
    const [creatingProduct, setCreatingProduct] = useState(false);

    useEffect(() => {
        // In a real app, you'd fetch these stats from the backend.
        // For now, we'll just fetch counts if possible or mock them slightly.
        const fetchStats = async () => {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            // Fetch products (Public)
            try {
                const { data } = await axios.get('/api/products');
                setStats(prev => ({ ...prev, products: (data || []).length }));
            } catch (err) {
                console.error("Error fetching products count", err);
            }

            // Fetch orders (Admin)
            try {
                const { data } = await axios.get('/api/orders', config);
                const orders = data || [];
                const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
                setStats(prev => ({
                    ...prev,
                    orders: orders.length,
                    revenue: totalRevenue
                }));
            } catch (err) {
                console.error("Error fetching orders count", err);
            }

            // Fetch users (Admin)
            try {
                const { data } = await axios.get('/api/users', config);
                setStats(prev => ({ ...prev, users: (data || []).length }));
            } catch (err) {
                console.error("Error fetching users count", err);
            }
        };

        if (user && user.token) {
            fetchStats();
        }
    }, [user]);

    const createProductHandler = async () => {
        if (!user || !user.isAdmin) {
            alert('You must be logged in as an admin to create products');
            return;
        }

        setCreatingProduct(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post('/api/products', {}, config);
            navigate(`/admin/products/${data._id}/edit`);
        } catch (err) {
            setCreatingProduct(false);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to create product';
            alert(`Error: ${errorMessage}`);
            console.error('Create product error:', err);
        }
    };

    return (
        <div className="space-y-10 pb-12">
            {/* Header Section */}
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary">Admin Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, <span className="text-secondary font-bold">{user?.name}</span></p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={createProductHandler}
                        disabled={creatingProduct}
                        className={`px-6 py-2 bg-secondary text-white rounded-full font-bold transition-colors flex items-center gap-2 ${creatingProduct ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'}`}
                    >
                        {creatingProduct ? (
                            <>
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Product
                            </>
                        )}
                    </button>
                    <button className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full font-bold hover:bg-gray-200 transition-colors">
                        Settings
                    </button>
                    {/* Logout is managed in Header, but we can add quick action here too if needed */}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Sales</p>
                        <h3 className="text-3xl font-bold text-primary mt-1">${stats.revenue.toLocaleString()}</h3>
                    </div>
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                        $
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Orders</p>
                        <h3 className="text-3xl font-bold text-primary mt-1">{stats.orders}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                        📦
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Products</p>
                        <h3 className="text-3xl font-bold text-primary mt-1">{stats.products}</h3>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                        🏷️
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Customers</p>
                        <h3 className="text-3xl font-bold text-primary mt-1">{stats.users}+</h3>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                        👥
                    </div>
                </div>
            </div>

            {/* Quick Actions / Management Modules */}
            <div>
                <h2 className="text-2xl font-heading font-bold text-primary mb-6">Management Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Material Management */}
                    <Link to="/admin/products" className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-bold text-secondary group-hover:opacity-10 transition-opacity">
                            M
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                                🏗️
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-2">Material Management</h3>
                            <p className="text-gray-500 mb-6">Create, edit, and delete MDF products. Manage pricing, images, and stock details.</p>
                            <span className="text-secondary font-bold flex items-center gap-2">Manage Products →</span>
                        </div>
                    </Link>

                    {/* Order Management */}
                    <Link to="/admin/orders" className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-bold text-blue-500 group-hover:opacity-10 transition-opacity">
                            O
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                📋
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-2">Order Management</h3>
                            <p className="text-gray-500 mb-6">Track and update customer orders. View shipping details and payment statuses.</p>
                            <span className="text-blue-600 font-bold flex items-center gap-2">View Orders →</span>
                        </div>
                    </Link>

                    {/* User Management */}
                    <Link to="/admin/users" className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-bold text-emerald-500 group-hover:opacity-10 transition-opacity">
                            U
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                👥
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-2">Manage Workers</h3>
                            <p className="text-gray-500 mb-6">Create and manage accounts for your sales team. Assign roles and provide login credentials.</p>
                            <span className="text-emerald-600 font-bold flex items-center gap-2">Manage Users →</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

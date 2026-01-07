import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const SellerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [workers, setWorkers] = useState([]);

    useEffect(() => {
        const fetchWorkers = async () => {
            if (!user || !user.token) return;
            try {
                const response = await fetch('/api/users/sales', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await response.json();
                setWorkers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching workers:', error);
            }
        };
        fetchWorkers();
    }, [user]);

    const stats = [
        { label: 'My Sales today', value: '4', icon: '📈', color: 'bg-blue-500' },
        { label: 'Pending Orders', value: '12', icon: '⏳', color: 'bg-amber-500' },
        { label: 'Completed Deliveries', value: '85', icon: '✅', color: 'bg-emerald-500' },
        { label: 'My Commission', value: '$420', icon: '💰', color: 'bg-purple-500' },
    ];

    const handleCheckCatalog = () => {
        // Navigate to home and request new arrivals view
        navigate('/?new=1');
    };

    const handleRequestStock = () => {
        // Navigate to support page with stock topic
        navigate('/support?topic=stock');
    };

    const handleContactManager = () => {
        // Open default mail client to contact manager
        window.location.href = 'mailto:manager@awoke.com?subject=Seller%20Contact%20Request';
    };

    return (
        <div className="space-y-10 pb-12">
            {/* Header Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <span className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Official Seller Portal</span>
                    <h1 className="text-3xl font-heading font-bold text-primary">Seller Portal: Welcome, {user?.name}!</h1>
                    <p className="text-gray-500 mt-1">Manage your customer orders and track your sales performance from your dedicated dashboard.</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn btn-primary px-6">New Manual Order</button>
                    <button className="btn btn-light px-6 border-gray-200">Export Report</button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-3xl shadow-md border border-gray-50 flex items-center gap-6">
                        <div className={`w-14 h-14 ${stat.color} text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-gray-200`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Sales Activity */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-xl text-primary font-heading">Recent Order Activity</h3>
                        <button className="text-secondary font-bold text-sm">View All Orders →</button>
                    </div>
                    <div className="p-6 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-400 text-xs uppercase tracking-widest font-bold border-b border-gray-50">
                                    <th className="pb-4">Customer</th>
                                    <th className="pb-4">Product</th>
                                    <th className="pb-4">Amount</th>
                                    <th className="pb-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <tr key={item} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4">
                                            <p className="font-bold text-primary text-sm">Customer #{item}</p>
                                            <p className="text-gray-400 text-xs">Addis Ababa</p>
                                        </td>
                                        <td className="py-4">
                                            <p className="text-gray-600 text-sm italic">MDF Wardrobe x1</p>
                                        </td>
                                        <td className="py-4">
                                            <p className="font-bold text-primary">$450.00</p>
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Pending Delivery</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Seller Tools */}
                <div className="space-y-6">
                    <div className="bg-primary text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-4">Seller Quick Actions</h3>
                            <div className="space-y-3">
                                <button onClick={handleCheckCatalog} className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-xl text-sm font-bold text-left flex items-center gap-3 transition-colors">
                                    📋 Check Today's Catalog
                                </button>
                                <button onClick={handleRequestStock} className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-xl text-sm font-bold text-left flex items-center gap-3 transition-colors">
                                    🏗️ Request Stock Update
                                </button>
                                <button onClick={handleContactManager} className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-xl text-sm font-bold text-left flex items-center gap-3 transition-colors">
                                    ☎️ Contact Manager
                                </button>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 text-9xl font-bold opacity-10">💼</div>
                    </div>

                    <div className="bg-secondary/10 p-8 rounded-3xl border border-secondary/20">
                        <h4 className="font-bold text-secondary mb-2">Performance Tip</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Focus on the New MDF Arrivals this week. They have a 15% higher conversion rate!
                        </p>
                    </div>
                </div>
            </div>

            {/* Workers Section */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-xl text-primary font-heading">Workers Created by Admin</h3>
                </div>
                <div className="p-6 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 text-xs uppercase tracking-widest font-bold border-b border-gray-50">
                                <th className="pb-4">Name</th>
                                <th className="pb-4">Email</th>
                                <th className="pb-4">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {workers.map((worker) => (
                                <tr key={worker._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4">
                                        <p className="font-bold text-primary text-sm">{worker.name}</p>
                                    </td>
                                    <td className="py-4">
                                        <p className="text-gray-600 text-sm">{worker.email || 'N/A'}</p>
                                    </td>
                                    <td className="py-4">
                                        <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase">{worker.role}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;

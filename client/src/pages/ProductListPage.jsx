import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import { formatETB } from '../utils/currency';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/products');
            setProducts(data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const createProductHandler = async () => {
        if (!user || !user.isAdmin) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post('/api/products', {}, config);
            navigate(`/admin/products/${data._id}/edit`);
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const deleteHandler = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        setDeletingId(id);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.delete(`/api/products/${id}`, config);
            await fetchProducts();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary">Material Inventory</h1>
                    <p className="text-gray-500 mt-1">Manage your MDF products, pricing, and stock levels.</p>
                </div>
                <button
                    onClick={createProductHandler}
                    className="bg-secondary text-white px-6 py-3 rounded-full font-bold hover:bg-yellow-600 transition-all shadow-lg flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Product
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center gap-4">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="font-bold">Error Loading Products</p>
                        <p className="text-sm opacity-80">{error}</p>
                    </div>
                    <button onClick={fetchProducts} className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Retry</button>
                </div>
            )}

            {/* Table Section */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        <p className="text-gray-500 font-medium italic">Scanning inventory...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 px-4">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-bold text-primary">No Products Found</h3>
                        <p className="text-gray-500 mt-2 max-w-sm mx-auto">Your inventory is currently empty. Start by creating your first premium product.</p>
                        <button onClick={createProductHandler} className="mt-6 text-secondary font-bold hover:underline underline-offset-4">Add your first product &rarr;</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-widest font-bold border-b border-gray-100">
                                    <th className="px-8 py-5">Product Info</th>
                                    <th className="px-8 py-5">Category</th>
                                    <th className="px-8 py-5">Pricing</th>
                                    <th className="px-8 py-5">Stock</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                                    <img
                                                        src={getImageUrl(product.imageUrl)}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = '/images/hero.png'; }}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-primary group-hover:text-secondary transition-colors">{product.name}</p>
                                                    <p className="text-gray-400 text-xs font-mono mt-1">ID: {product._id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-primary/5 text-primary text-xs font-bold rounded-full border border-primary/10">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 font-bold text-primary">
                                            {formatETB(product.price)}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${product.quantity > 10 ? 'bg-green-500' : product.quantity > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                                                <span className={`text-sm font-medium ${product.quantity === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                                                    {product.quantity} in stock
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-3">
                                                <Link
                                                    to={`/admin/products/${product._id}/edit`}
                                                    className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                    title="Edit Product"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => deleteHandler(product._id)}
                                                    disabled={deletingId === product._id}
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${deletingId === product._id ? 'bg-gray-100 text-gray-400' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`}
                                                    title="Delete Product"
                                                >
                                                    {deletingId === product._id ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListPage;

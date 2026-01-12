import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { formatETB } from '../utils/currency';

const OrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [approvingId, setApprovingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('/api/orders', config);
            setOrders(data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user.token]);

    const approveHandler = async (orderId) => {
        if (!window.confirm('Approve this order?')) return;

        setApprovingId(orderId);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.put(`/api/orders/${orderId}/approve`, {}, config);
            await fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setApprovingId(null);
        }
    };

    const deleteHandler = async (orderId) => {
        if (!window.confirm('Delete this order? This cannot be undone.')) return;

        setDeletingId(orderId);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.delete(`/api/orders/${orderId}`, config);
            await fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-primary">Admin Orders</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order._id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.user && order.user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user && order.user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.createdAt && order.createdAt.substring(0, 10)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatETB(order.totalPrice)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {order.status === 'Approved' ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">Approved</span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">Pending</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.isPaid ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Not Paid</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.isDelivered ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Pending</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-3">
                                        <Link to={`/order/${order._id}`} className="text-indigo-600 hover:text-indigo-900">Details</Link>
                                        {order.status !== 'Approved' && (
                                            <button
                                                onClick={() => approveHandler(order._id)}
                                                disabled={approvingId === order._id}
                                                className="px-3 py-1 rounded bg-secondary text-white text-xs font-bold hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {approvingId === order._id ? 'Approving…' : 'Approve'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteHandler(order._id)}
                                            disabled={deletingId === order._id}
                                            className="px-3 py-1 rounded bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {deletingId === order._id ? 'Deleting…' : 'Delete'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderListPage;

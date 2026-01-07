import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrderPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(`/api/orders/${id}`, config);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        if (user) {
            fetchOrder();
        }
    }, [id, user]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6 text-primary">Order {order._id}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-semibold mb-4 text-primary">Shipping</h2>
                        <p><strong>Name:</strong> {order.user.name}</p>
                        <p><strong>Email:</strong> <a href={`mailto:${order.user.email}`} className="text-blue-600">{order.user.email}</a></p>
                        <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                        {order.isDelivered ? <div className="mt-2 bg-green-100 text-green-700 p-2 rounded">Delivered on {order.deliveredAt}</div> : <div className="mt-2 bg-red-100 text-red-700 p-2 rounded">Not Delivered</div>}
                    </div>

                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-semibold mb-4 text-primary">Payment Method</h2>
                        <p><strong>Method:</strong> {order.paymentMethod}</p>
                        {order.isPaid ? <div className="mt-2 bg-green-100 text-green-700 p-2 rounded">Paid on {order.paidAt}</div> : <div className="mt-2 bg-red-100 text-red-700 p-2 rounded">Not Paid</div>}
                    </div>

                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-semibold mb-4 text-primary">Order Items</h2>
                        {order.orderItems.length === 0 ? <p>Order is empty</p> : (
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center border-b pb-2 last:border-0 last:pb-0">
                                        <img src={getImageUrl(item.image)} alt={item.name} className="w-12 h-12 object-cover rounded mr-4" />
                                        <div className="flex-1">
                                            <Link to={`/product/${item.product}`} className="hover:text-secondary">{item.name}</Link>
                                        </div>
                                        <div>
                                            {item.qty} x ${item.price} = ${item.qty * item.price}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded shadow h-fit">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="flex justify-between py-2 border-b">
                        <span>Items</span>
                        <span>${order.itemsPrice}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span>Shipping</span>
                        <span>${order.shippingPrice}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span>Tax</span>
                        <span>${order.taxPrice}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold text-lg">
                        <span>Total</span>
                        <span>${order.totalPrice}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;

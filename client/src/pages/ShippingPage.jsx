import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ShippingPage = () => {
    const { saveShippingAddress, shippingAddress, cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    // Payment method state (simplified)
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');

    const submitHandler = async (e) => {
        e.preventDefault();
        saveShippingAddress({ address, city, postalCode, country });

        // Place Order Logic directly here for simplicity in this turn
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

            const { data } = await axios.post(
                '/api/orders',
                {
                    orderItems: cartItems,
                    shippingAddress: { address, city, postalCode, country },
                    paymentMethod,
                    itemsPrice,
                    taxPrice: 0,
                    shippingPrice: 0,
                    totalPrice: itemsPrice,
                },
                config
            );

            clearCart();
            navigate(`/order/${data._id}`);

        } catch (error) {
            alert(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="flex justify-center mt-10">
            <div className="w-full max-w-lg bg-white p-8 rounded shadow">
                <h1 className="text-2xl font-bold mb-6 text-primary">Shipping & Checkout</h1>
                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 mt-1 border rounded focus:ring-secondary focus:border-secondary"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 mt-1 border rounded focus:ring-secondary focus:border-secondary"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 mt-1 border rounded focus:ring-secondary focus:border-secondary"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 mt-1 border rounded focus:ring-secondary focus:border-secondary"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Credit Card"
                                    checked={paymentMethod === 'Credit Card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mr-2"
                                />
                                Credit Card
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="PayPal"
                                    checked={paymentMethod === 'PayPal'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mr-2"
                                />
                                PayPal
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-secondary rounded hover:bg-yellow-600 mt-6"
                    >
                        Place Order
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ShippingPage;

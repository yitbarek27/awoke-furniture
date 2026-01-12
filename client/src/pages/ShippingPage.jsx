import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ShippingPage = () => {
    const { saveShippingAddress, shippingAddress, cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState(() => {
        const stored = (shippingAddress?.fullName || '').trim();
        // Don't prefill with company/placeholder name
        if (!stored) return '';
        if (/^awoke\b/i.test(stored)) return '';
        return stored;
    });

    // Required payment method options
    const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');

    // Payment screenshot upload
    const [paymentScreenshotFile, setPaymentScreenshotFile] = useState(null);
    const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!cartItems || cartItems.length === 0) {
            alert('Your cart is empty');
            navigate('/cart');
            return;
        }

        if (uploading || submitting) return;

        if (!fullName.trim()) {
            alert('Full name is required');
            return;
        }

        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        if (!paymentScreenshotFile && !paymentScreenshotUrl) {
            alert('Please upload a payment screenshot');
            return;
        }

        setSubmitting(true);
        try {
            saveShippingAddress({ fullName });

            let uploadedUrl = paymentScreenshotUrl;

            // Upload screenshot first (if user selected a new file)
            if (paymentScreenshotFile) {
                setUploading(true);
                const formData = new FormData();
                formData.append('image', paymentScreenshotFile);
                const { data } = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                uploadedUrl = data;
                setPaymentScreenshotUrl(data);
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            if (user && user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }

            const itemsPrice = cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.qty), 0);

            const { data } = await axios.post(
                '/api/orders',
                {
                    orderItems: cartItems,
                    shippingAddress: { fullName },
                    paymentMethod,
                    paymentScreenshotUrl: uploadedUrl,
                    itemsPrice,
                    taxPrice: 0,
                    shippingPrice: 0,
                    totalPrice: itemsPrice,
                },
                config
            );

            clearCart();
            navigate(`/order-success/${data._id}`);
        } catch (error) {
            alert(error.response?.data?.message || error.message);
        } finally {
            setUploading(false);
            setSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center mt-10">
            <div className="w-full max-w-lg bg-white p-8 rounded shadow">
                <h1 className="text-2xl font-bold mb-6 text-primary">Shipping & Checkout/ጭነት እና ክፍያ</h1>
                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 mt-1 border rounded focus:ring-secondary focus:border-secondary"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                        <select
                            className="w-full px-4 py-2 mt-1 border rounded focus:ring-secondary focus:border-secondary"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                        >
                            <option value="Bank Transfer">Bank</option>
                            <option value="Telebirr">Telebirr</option>
                            <option value="CBE Birr">CBE Birr</option>
                        </select>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Payment Screenshot</label>
                        <input
                            type="file"
                            accept="image/png,image/jpeg"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setPaymentScreenshotFile(file);
                            }}
                            className="w-full"
                            required={!paymentScreenshotUrl}
                        />
                        {paymentScreenshotUrl && (
                            <div className="mt-3">
                                <img
                                    src={paymentScreenshotUrl}
                                    alt="Payment screenshot"
                                    className="w-full max-h-64 object-contain rounded border"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={uploading || submitting}
                        className="w-full px-4 py-2 font-bold text-white bg-secondary rounded hover:bg-yellow-600 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Uploading…' : submitting ? 'Placing Order…' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ShippingPage;

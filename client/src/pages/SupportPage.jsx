import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getImageUrl } from '../utils/imageUtils';
import { formatETB } from '../utils/currency';

const SupportPage = () => {
    const contacts = [
        {
            title: 'Customer Service',
            value: '+251 911 234 567',
            icon: '📞',
            action: 'tel:+251911234567',
            desc: 'Available Mon-Sat, 8am - 6pm'
        },
        {
            title: 'WhatsApp Support',
            value: '+251 911 234 567',
            icon: '💬',
            action: 'https://wa.me/251911234567',
            desc: 'Instant messaging for quick queries'
        },
        {
            title: 'Email Us',
            value: 'support@awoke.com',
            icon: '✉️',
            action: 'mailto:support@awoke.com',
            desc: 'Detailed inquiries and feedback'
        }
    ];

    const faqs = [
        {
            q: 'How long does delivery take?',
            a: 'For items in stock, delivery within Addis Ababa usually takes 2-4 business days.'
        },
        {
            q: 'Do you offer custom furniture?',
            a: 'Yes, we specialize in high-quality finished furniture and custom MDF work.'
        },
        {
            q: 'How do I track my order?',
            a: 'You can view your order status in the Customer Dashboard or contact our support agents.'
        }
    ];

    const [showProducts, setShowProducts] = useState(true);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await axios.get('/api/products');
            const list = Array.isArray(data) ? data : [];
            // Show newest added first (backend uses numeric ids mapped to _id)
            const sorted = list.slice().sort((a, b) => Number(b?._id ?? 0) - Number(a?._id ?? 0));
            setProducts(sorted);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleToggleProducts = () => {
        setShowProducts((prev) => !prev);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-12">
            <Link to="/customer/dashboard" className="text-gray-500 hover:text-gray-700 flex items-center gap-2 mb-4">
                &larr; Back to Dashboard
            </Link>

            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
                <h1 className="text-4xl font-heading font-bold text-primary mb-4">How can we help?</h1>
                <p className="text-gray-500 text-lg max-w-xl mx-auto">
                    We're here to assist you with your orders, payments, and product inquiries.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contacts.map((contact, index) => (
                    <a
                        key={index}
                        href={contact.action}
                        className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50 hover:border-secondary/30 transition-all text-center group"
                    >
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{contact.icon}</div>
                        <h3 className="text-lg font-bold text-primary mb-2">{contact.title}</h3>
                        <p className="text-secondary font-bold mb-1">{contact.value}</p>
                        <p className="text-gray-400 text-xs">{contact.desc}</p>
                    </a>
                ))}
            </div>

            {/* View Products CTA */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-heading font-bold text-primary">Browse Products</h2>
                        <p className="text-gray-500 text-sm">See available items right here without leaving support.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchProducts}
                            disabled={loading}
                            className="btn btn-light px-5 py-3"
                        >
                            {loading ? 'Refreshing…' : 'Refresh'}
                        </button>
                        <button
                            onClick={handleToggleProducts}
                            className="btn btn-secondary px-6 py-3 text-white"
                        >
                            {showProducts ? 'Hide Products' : 'Show Products'}
                        </button>
                    </div>
                </div>

                {/* Product List */}
                {loading && (
                    <div className="mt-6 text-gray-500">Loading products...</div>
                )}
                {error && (
                    <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">{error}</div>
                )}
                {showProducts && !loading && !error && (
                    products.length === 0 ? (
                        <div className="mt-6 text-gray-500">No products available.</div>
                    ) : (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {products.map((p) => (
                                <div key={p._id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                                        <img
                                            src={getImageUrl(p.imageUrl)}
                                            alt={p.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = '/images/hero.png'; }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Link to={`/product/${p._id}`} className="font-bold text-primary hover:text-secondary">
                                            {p.name}
                                        </Link>
                                        <div className="text-gray-600 text-sm">{formatETB(p.price)}</div>
                                        <div className="text-xs text-gray-400">{p.category}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-heading font-bold text-primary px-2">Frequently Asked Questions</h2>
                <div className="grid gap-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                                <span className="text-secondary">Q:</span> {faq.q}
                            </h4>
                            <p className="text-gray-600 text-sm pl-6 leading-relaxed">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-primary text-white p-10 rounded-3xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Visit our Showroom</h3>
                        <p className="text-gray-400">Addis Ababa, AYAT ARBAZETEGN, Near SUNSHINE CONSTRUCTION</p>
                    </div>
                    <button className="btn bg-secondary border-none text-white hover:bg-yellow-600 px-8 py-3 rounded-full font-bold">
                        Get Directions
                    </button>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl font-bold">📍</div>
            </div>
        </div>
    );
};

export default SupportPage;

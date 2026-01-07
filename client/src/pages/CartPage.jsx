import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUtils';

const CartPage = () => {
    const { cartItems, removeFromCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const checkoutHandler = () => {
        if (!user) {
            navigate('/login?redirect=shipping');
        } else {
            navigate('/shipping');
        }
    };

    const total = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <h1 className="text-4xl font-heading font-bold mb-10 text-primary">Your Shopping Selection</h1>
            {cartItems.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl shadow-lg border border-gray-100 text-center space-y-6">
                    <div className="text-6xl text-gray-200">🛒</div>
                    <h2 className="text-2xl font-bold text-gray-400">Your cart looks a bit lonely.</h2>
                    <p className="text-gray-500 max-w-sm mx-auto">Explore our collection and add some premium furniture to your selection.</p>
                    <Link to="/" className="btn btn-secondary px-8 py-3 inline-block">Start Shopping</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map(item => (
                            <div key={item.product} className="flex flex-col sm:flex-row items-center bg-white p-6 rounded-3xl shadow-md border border-gray-50 hover:border-secondary/20 transition-all group">
                                <img
                                    src={getImageUrl(item.image)}
                                    alt={item.name}
                                    className="w-32 h-32 object-cover rounded-2xl mb-4 sm:mb-0 sm:mr-6 shadow-sm group-hover:scale-105 transition-transform"
                                />
                                <div className="flex-1 text-center sm:text-left">
                                    <Link to={`/product/${item.product}`} className="text-xl font-bold text-primary hover:text-secondary transition-colors">{item.name}</Link>
                                    <p className="text-secondary font-bold text-lg mt-1">${item.price}</p>
                                    <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full uppercase font-bold tracking-wider">
                                        Quantity: {item.qty}
                                    </span>
                                </div>
                                <div className="mt-4 sm:mt-0 flex items-center space-x-6">
                                    <button
                                        onClick={() => removeFromCart(item.product)}
                                        className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        title="Remove Item"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 h-fit sticky top-24">
                        <h2 className="text-2xl font-bold text-primary mb-6 pb-4 border-b">Order Summary</h2>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-500">
                                <span>Total Quantity:</span>
                                <span className="font-bold text-primary">{cartItems.reduce((acc, item) => acc + Number(item.qty), 0)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal:</span>
                                <span>${total}</span>
                            </div>
                            <div className="flex justify-between border-t pt-4">
                                <span className="text-xl font-bold text-primary">Estimated Total:</span>
                                <span className="text-2xl font-bold text-secondary">${total}</span>
                            </div>
                        </div>
                        <button
                            onClick={checkoutHandler}
                            className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-primary/20"
                        >
                            Proceed to Completion
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;

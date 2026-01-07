import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../utils/imageUtils';
import { useCart } from '../context/CartContext';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    const addToCartHandler = () => {
        addToCart(product, Number(qty));
        navigate('/cart');
    };

    return (
        <div>
            <Link to="/" className="text-gray-500 hover:text-gray-700 mb-4 inline-block">&larr; Go Back</Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img
                        src={getImageUrl(product.imageUrl)}
                        alt={product.name}
                        className="w-full h-96 object-cover rounded-lg shadow-lg"
                    />
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                    <p className="text-2xl font-semibold text-secondary">${product.price}</p>
                    <p className="text-gray-600 border-t border-b py-4 whitespace-pre-wrap">{product.description}</p>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex justify-between mb-2">
                            <span>Price:</span>
                            <span className="font-bold">${product.price}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span>Status:</span>
                            <span className={product.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                                {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {product.quantity > 0 && (
                            <div className="flex justify-between mb-4 items-center">
                                <span>Qty:</span>
                                <select
                                    className="border rounded p-1"
                                    value={qty}
                                    onChange={(e) => setQty(e.target.value)}
                                >
                                    {[...Array(product.quantity).keys()].map(x => ( // Limit max for demo?
                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                    )).slice(0, 10)}
                                </select>
                            </div>
                        )}

                        <button
                            className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${product.quantity > 0
                                ? 'bg-primary hover:bg-gray-800'
                                : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            disabled={product.quantity === 0}
                            onClick={addToCartHandler}
                        >
                            {product.quantity > 0 ? 'Add To Cart' : 'Out Of Stock'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;

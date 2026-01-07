import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUtils';

const ProductEditPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${productId}`);
                setName(data.name);
                setPrice(data.price);
                setImage(data.imageUrl);
                setCategory(data.category);
                setQuantity(data.quantity);
                setDescription(data.description);
                setImagePreview(getImageUrl(data.imageUrl));
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);
            setImage(data);
            setImagePreview(getImageUrl(data));
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!user || !user.token) {
            setError('You must be logged in as an admin to update products.');
            return;
        }

        setUpdating(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            // Add features to description - clean existing "Features:" lines first to avoid duplicates
            const featuresText = `Features: ${category}`;
            const cleanDescription = description.split('\n').filter(line => !line.startsWith('Features:')).join('\n').trim();
            const updatedDescription = `${featuresText}\n\n${cleanDescription}`;

            // Ensure numeric values are numbers
            const payload = {
                name,
                price: Number(price) || 0,
                description: updatedDescription,
                imageUrl: image,
                category,
                quantity: Number(quantity) || 0,
            };

            await axios.put(`/api/products/${productId}`, payload, config);
            setIsSuccess(true);
            setError('');
            setTimeout(() => {
                navigate('/admin/products');
            }, 1200);
        } catch (err) {
            console.error('Update Error:', err);
            setError(err.response?.data?.message || err.message || 'Update failed');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
            <Link to="/admin/products" className="text-gray-500 hover:text-gray-700 mb-4 inline-block">
                &larr; Go Back
            </Link>
            <h1 className="text-2xl font-bold mb-6 text-primary">Edit Product</h1>
            {error && <div className="bg-red-100 text-red-500 p-3 mb-4 rounded border border-red-200">{error}</div>}
            {isSuccess && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded border border-green-200">Product updated successfully! Redirecting...</div>}

            <form onSubmit={submitHandler} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 mt-1 border rounded focus:ring-secondary focus:border-secondary"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        className="w-full px-4 py-2 mt-1 border rounded focus:ring-secondary focus:border-secondary"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 mt-1 border rounded focus:ring-secondary focus:border-secondary mb-2"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="Enter image url"
                    />
                    <div className="mt-2">
                        <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-light transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Choose Image
                            <input
                                type="file"
                                onChange={uploadFileHandler}
                                className="hidden"
                                accept="image/*"
                            />
                        </label>
                    </div>
                    {uploading && (
                        <div className="mt-3 flex items-center text-secondary">
                            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading image...
                        </div>
                    )}
                    {imagePreview && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                            <div className="border-2 border-gray-200 rounded-lg p-2 bg-gray-50">
                                <img
                                    src={imagePreview}
                                    alt="Product Preview"
                                    className="w-full max-w-md h-64 object-contain rounded"
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        className="w-full px-4 py-2 mt-1 border rounded focus:ring-secondary focus:border-secondary"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        <option value="MDF Sheets">MDF Sheets</option>
                        <option value="Finished Furniture">Finished Furniture</option>
                        <option value="Accessories">Accessories</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                        type="number"
                        className="w-full px-4 py-2 mt-1 border rounded focus:ring-secondary focus:border-secondary"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        className="w-full px-4 py-2 mt-1 border rounded focus:ring-secondary focus:border-secondary"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    disabled={updating}
                    className={`w-full px-4 py-2 font-bold text-white rounded ${updating ? 'bg-gray-400 cursor-not-allowed' : 'bg-secondary hover:bg-yellow-600'}`}
                >
                    {updating ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            Updating...
                        </span>
                    ) : (
                        'Update'
                    )}
                </button>
            </form>
        </div>
    );
};

export default ProductEditPage;

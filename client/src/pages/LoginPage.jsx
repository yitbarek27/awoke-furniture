import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loginType, setLoginType] = useState('');
    const [error, setError] = useState('');
    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!loginType) {
            setError('Please select login type.');
            return;
        }
        try {
            const loggedInUser = await login(name, password);
            if (loginType === 'admin' && loggedInUser.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (loginType === 'seller' && loggedInUser.role === 'sales') {
                navigate('/seller/dashboard');
            } else if (loginType === 'customer') {
                navigate('/customer/dashboard');
            } else {
                logout();
                setError(`Access Denied: Invalid credentials for ${loginType} login.`);
            }
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary">Login Portal</h1>
                    <p className="text-gray-500">Select your login type</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            setLoginType('customer');
                            setName('');
                            setPassword('');
                        }}
                        className={`flex-1 px-4 py-2 font-bold rounded-md transition-all shadow-lg text-sm ${loginType === 'customer'
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Customer
                    </button>
                    <button
                        onClick={() => {
                            setLoginType('seller');
                            setName('');
                            setPassword('');
                        }}
                        className={`flex-1 px-4 py-2 font-bold rounded-md transition-all shadow-lg text-sm ${loginType === 'seller'
                                ? 'bg-secondary text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Seller
                    </button>
                    <button
                        onClick={() => {
                            setLoginType('admin');
                            setName('Awoke');
                            setPassword('12345');
                        }}
                        className={`flex-1 px-4 py-2 font-bold rounded-md transition-all shadow-lg text-sm ${loginType === 'admin'
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Admin
                    </button>
                </div>
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-100 rounded border border-red-200">
                        {error}
                        {error.includes('credentials') && loginType === 'admin' && (
                            <p className="mt-2 text-xs text-red-700 font-bold italic underline">Tip: Default Admin is 'Awoke' with password '12345'</p>
                        )}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-secondary focus:border-secondary transition-all"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-secondary focus:border-secondary transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none transition-all shadow-lg"
                    >
                        {loginType === 'seller' ? 'Seller Login' : loginType === 'admin' ? 'Admin Login' : 'Login'}
                    </button>
                </form>
                {/* <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-secondary hover:underline">
                            Register
                        </Link>
                    </p>
                </div> */}
            </div>
        </div>
    );
};

export default LoginPage;

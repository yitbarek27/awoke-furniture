import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createLoading, setCreateLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const { user: currentUser } = useAuth();

    // Form states
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('sales');

    const fetchUsers = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            };
            const { data } = await axios.get('/api/users', config);
            setUsers(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log('Submitting worker registration for:', name);

        if (!currentUser || !currentUser.token) {
            setError('System Error: Admin authentication token is missing. Please re-login.');
            return;
        }

        setCreateLoading(true);
        setError('');
        setSuccess('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${currentUser.token}`,
                },
            };
            const payload = { name, password, role };
            console.log('Frontend: Attempting to register worker with payload:', payload);

            const url = '/api/users/admin';
            const { data } = await axios.post(
                url,
                payload,
                config
            );

            setSuccess(`Successfully created ${role}: ${name}`);
            setName('');
            setPassword('');
            fetchUsers();
        } catch (err) {
            console.error('Frontend: Registration error detail:', err);
            const errorMessage = err.response?.data?.message || err.message;
            const url = '/api/users/admin';
            setError(`Registration failed [${url}]: ${errorMessage}`);
        } finally {
            setCreateLoading(false);
        }
    };

    const deleteHandler = async (id, name) => {
        const url = `/api/users/${id}`;
        console.log(`Frontend: Attempting to delete user ${name} with URL: ${url}`);
        setDeletingId(id);
        setError('');
        setSuccess('');

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            };
            const response = await axios.delete(url, config);
            console.log('Frontend: Delete response:', response.data);
            setSuccess(`User "${name}" deleted successfully`);
            fetchUsers();
        } catch (err) {
            console.error('Frontend: Delete failed:', err);
            const errorMessage = err.response?.data?.message || err.message;
            setError(`Delete failed [${url}]: ${errorMessage}`);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-10 pb-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-heading font-bold text-primary">Manage Workers & Users</h1>
                <p className="text-gray-500 mt-1">Create accounts for your sales team and manage existing users.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create User Form */}
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-fit">
                    <h2 className="text-xl font-bold text-primary mb-6">Create New Official Account</h2>
                    <form onSubmit={submitHandler} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Username / Login Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                                placeholder="Enter username"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Account Type / Role</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="sales">Seller / Sales Agent</option>
                                <option value="admin">Administrator</option>
                                <option value="customer">Customer</option>
                            </select>
                        </div>

                        {error && <div className="p-4 bg-red-50 text-red-500 rounded-xl text-sm font-medium">{error}</div>}
                        {success && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium">{success}</div>}

                        <button
                            type="submit"
                            disabled={createLoading}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${createLoading ? 'bg-gray-400' : 'bg-primary hover:bg-primary/90 hover:shadow-primary/20 active:scale-[0.98]'
                                }`}
                        >
                            {createLoading ? 'Registering...' : 'Register Worker'}
                        </button>
                    </form>
                </div>

                {/* Users List */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-xl text-primary font-heading">Active Accounts</h3>
                        <div className="flex gap-2">
                            <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Total: {users.length}</span>
                        </div>
                    </div>
                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center p-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-gray-400 text-xs uppercase tracking-widest font-bold border-b border-gray-50">
                                            <th className="pb-4">User Details</th>
                                            <th className="pb-4">Role</th>
                                            <th className="pb-4">ID</th>
                                            <th className="pb-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {users.map((u) => (
                                            <tr key={u._id || u.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold">
                                                            {u.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-primary">{u.name}</p>
                                                            <p className="text-gray-400 text-xs">{u.email || 'No email provided'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                                                        u.role === 'sales' ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="py-4 font-mono text-xs text-gray-400">
                                                    {u._id || u.id}
                                                </td>
                                                <td className="py-4 text-right">
                                                    <button
                                                        onClick={() => deleteHandler(u._id || u.id, u.name)}
                                                        disabled={deletingId === (u._id || u.id)}
                                                        className={`flex items-center gap-1 ml-auto font-bold text-xs px-3 py-2 rounded-xl transition-all ${deletingId === (u._id || u.id)
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100'
                                                            }`}
                                                        title="Delete User"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${deletingId === (u._id || u.id) ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        {deletingId === (u._id || u.id) ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserListPage;

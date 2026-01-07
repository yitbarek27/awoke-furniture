import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    // Strictly only allow 'admin' role
    const isAdmin = user && (user.role === 'admin' || user.isAdmin);

    return isAdmin ? <Outlet /> : <Navigate to="/login?redirect=admin" replace />;
};

export default AdminProtectedRoute;

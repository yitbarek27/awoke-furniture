import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SellerProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
    );

    // Only allow 'sales' or 'admin' roles to access the Seller Portal
    const isAuthorized = user && (user.role === 'sales' || user.role === 'admin' || user.isAdmin || user.isSales);

    return isAuthorized ? <Outlet /> : <Navigate to="/login?redirect=seller" replace />;
};

export default SellerProtectedRoute;

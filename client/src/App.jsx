import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Header from './components/Header';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import ProductListPage from './pages/ProductListPage';
import ProductEditPage from './pages/ProductEditPage';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import OrderPage from './pages/OrderPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderListPage from './pages/OrderListPage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import SupportPage from './pages/SupportPage';
import UserListPage from './pages/UserListPage';
import SellerDashboard from './pages/SellerDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import SellerProtectedRoute from './components/SellerProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
                        <Header />
                        <main className="p-4 container mx-auto">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/search/:keyword" element={<HomePage />} />
                                <Route path="/product/:id" element={<ProductDetailsPage />} />
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/shipping" element={<ShippingPage />} />
                                <Route path="/order-success/:id" element={<OrderSuccessPage />} />
                                <Route path="/order/:id" element={<OrderPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                                <Route path="/customer/payments" element={<PaymentMethodsPage />} />
                                <Route path="/customer/support" element={<SupportPage />} />

                                {/* Seller Portal - Protected */}
                                <Route element={<SellerProtectedRoute />}>
                                    <Route path="/seller/dashboard" element={<SellerDashboard />} />
                                </Route>
                                {/* Admin Routes - Protected */}
                                <Route element={<AdminProtectedRoute />}>
                                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                    <Route path="/admin/products" element={<ProductListPage />} />
                                    <Route path="/admin/products/:id/edit" element={<ProductEditPage />} />
                                    <Route path="/admin/orders" element={<OrderListPage />} />
                                    <Route path="/admin/users" element={<UserListPage />} />
                                </Route>
                            </Routes>
                        </main>
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    )
}

export default App

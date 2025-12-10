import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Retail from './pages/Retail';
import Wholesale from './pages/Wholesale';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import Contact from './pages/Contact';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';

// Admin Layout and Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminProductEdit from './pages/admin/ProductEdit';
import AdminUsers from './pages/admin/Users';
import AdminOrders from './pages/admin/Orders';
import AdminSettings from './pages/admin/Settings'; // NEW: Component-based structure
import AdminProfile from './pages/admin/Profile';

function App() {
    return (
        <Router>
            <AuthProvider>
                <SocketProvider>
                    <CartProvider>
                        <div className="flex flex-col min-h-screen">
                            <Navbar />
                            <main className="flex-1">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/retail" element={<Retail />} />
                                    <Route path="/wholesale" element={<Wholesale />} />
                                    <Route path="/product/:id" element={<ProductDetails />} />
                                    <Route path="/cart" element={<Cart />} />
                                    <Route path="/checkout" element={<Checkout />} />
                                    <Route path="/payment-success" element={<PaymentSuccess />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/verify-email" element={<VerifyEmail />} />
                                    <Route path="/forgot-password" element={<ForgotPassword />} />
                                    <Route path="/reset-password" element={<ResetPassword />} />
                                    <Route
                                        path="/profile"
                                        element={
                                            <ProtectedRoute>
                                                <Profile />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/my-orders"
                                        element={
                                            <ProtectedRoute>
                                                <MyOrders />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/my-orders/:id"
                                        element={
                                            <ProtectedRoute>
                                                <OrderDetails />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin"
                                        element={
                                            <ProtectedRoute adminOnly>
                                                <AdminLayout />
                                            </ProtectedRoute>
                                        }
                                    >
                                        <Route path="dashboard" element={<AdminDashboard />} />
                                        <Route path="products" element={<AdminProducts />} />
                                        <Route path="products/new" element={<AdminProductEdit />} />
                                        <Route path="products/:id/edit" element={<AdminProductEdit />} />
                                        <Route path="users" element={<AdminUsers />} />
                                        <Route path="orders" element={<AdminOrders />} />
                                        <Route path="settings" element={<AdminSettings />} />
                                        <Route path="profile" element={<AdminProfile />} />
                                    </Route>
                                </Routes>
                            </main>
                            <Footer />
                        </div>
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 3000,
                                style: {
                                    background: '#fff',
                                    color: '#333',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                                },
                                success: {
                                    iconTheme: {
                                        primary: '#22c55e',
                                        secondary: '#fff',
                                    },
                                },
                                error: {
                                    iconTheme: {
                                        primary: '#ef4444',
                                        secondary: '#fff',
                                    },
                                },
                            }}
                        />
                    </CartProvider>
                </SocketProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;

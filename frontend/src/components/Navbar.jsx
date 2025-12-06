import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { getCartCount } = useCart();
    const { user, logout, isAdmin } = useAuth();
    const cartCount = getCartCount();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Retail', path: '/retail' },
        { name: 'Wholesale', path: '/wholesale' },
        ...(user ? [{ name: 'My Orders', path: '/my-orders' }] : []),
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 glass border-b border-gray-200/50 shadow-lg"
        >
            <div className="container-custom">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl"
                        >
                            🍎
                        </motion.div>
                        <span className="text-2xl font-display font-bold gradient-text">
                            Fruitify
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Right Side - Cart, Login, Profile */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative p-2 hover:bg-primary-50 rounded-xl transition-colors"
                        >
                            <ShoppingCart className="w-6 h-6 text-gray-700" />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {user ? (
                            <div className="flex items-center space-x-3">
                                {isAdmin() && (
                                    <Link
                                        to="/admin"
                                        className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors text-sm font-semibold"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <Link
                                    to="/profile"
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                    title="My Profile"
                                >
                                    <User className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {user.name || user.email.split('@')[0]}
                                    </span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2 hover:bg-red-50 rounded-xl transition-colors text-red-600"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary text-sm">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isOpen ? (
                            <X className="w-6 h-6 text-gray-700" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-700" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden py-4 border-t border-gray-200"
                    >
                        <div className="flex flex-col space-y-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <Link
                                to="/cart"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-colors flex items-center justify-between"
                            >
                                <span>Cart</span>
                                {cartCount > 0 && (
                                    <span className="bg-secondary-500 text-white text-xs font-bold rounded-full px-2 py-1">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <>
                                    {isAdmin() && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsOpen(false)}
                                            className="px-4 py-2 bg-purple-500 text-white rounded-lg text-center"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <User className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm font-medium text-gray-700">
                                                My Profile
                                            </span>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsOpen(false);
                                        }}
                                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-left"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="btn btn-primary mx-4"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
};

export default Navbar;

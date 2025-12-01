import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6"
                >
                    <div className="text-8xl">🛒</div>
                    <h2 className="text-3xl font-bold text-gray-900">Your cart is empty</h2>
                    <p className="text-gray-600">Start adding some fresh fruits!</p>
                    <Link to="/retail" className="btn btn-primary inline-flex items-center space-x-2">
                        <ShoppingBag className="w-5 h-5" />
                        <span>Shop Now</span>
                    </Link>
                </motion.div>
            </div>
        );
    }

    const subtotal = getCartTotal();
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + tax + shipping;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">Shopping Cart</h1>
                    <p className="text-gray-600">{cart.length} item(s) in your cart</p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item, index) => (
                            <motion.div
                                key={`${item.product.id}-${item.orderType}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card p-6"
                            >
                                <div className="flex gap-6">
                                    {/* Image */}
                                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50 flex-shrink-0">
                                        <img
                                            src={item.product.imageUrl}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">{item.product.category}</p>
                                                <div className="mt-1">
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded-full ${item.orderType === 'WHOLESALE'
                                                                ? 'bg-purple-100 text-purple-700'
                                                                : 'bg-primary-100 text-primary-700'
                                                            }`}
                                                    >
                                                        {item.orderType}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.product.id, item.orderType)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Quantity and Price */}
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.product.id, item.orderType, item.quantity - 1)
                                                    }
                                                    className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-primary-500 flex items-center justify-center transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="text-lg font-bold w-12 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.product.id, item.orderType, item.quantity + 1)
                                                    }
                                                    className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-primary-500 flex items-center justify-center transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-lg font-bold text-gray-900">
                                                    $
                                                    {(
                                                        (item.orderType === 'WHOLESALE'
                                                            ? parseFloat(item.product.wholesalePrice)
                                                            : parseFloat(item.product.retailPrice)) * item.quantity
                                                    ).toFixed(2)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    $
                                                    {(item.orderType === 'WHOLESALE'
                                                        ? parseFloat(item.product.wholesalePrice)
                                                        : parseFloat(item.product.retailPrice)
                                                    ).toFixed(2)}{' '}
                                                    each
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <button
                            onClick={clearCart}
                            className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center space-x-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Clear Cart</span>
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card p-6 sticky top-24"
                        >
                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (8%)</span>
                                    <span className="font-semibold">${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-semibold">
                                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                {subtotal < 50 && (
                                    <p className="text-xs text-green-600 bg-green-50 p-2 rounded-lg">
                                        Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                                    </p>
                                )}
                                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-primary-600">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Link to="/checkout" className="btn btn-primary w-full flex items-center justify-center space-x-2">
                                <span>Proceed to Checkout</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>

                            <Link
                                to="/retail"
                                className="btn btn-outline w-full mt-3 flex items-center justify-center"
                            >
                                Continue Shopping
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

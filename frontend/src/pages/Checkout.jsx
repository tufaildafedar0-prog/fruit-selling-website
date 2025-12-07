import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatINR } from '../utils/currency';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false); // ADDED: Track Razorpay script loading
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: '',
        shippingCity: '',
        shippingZip: '',
    });

    // ADDED: Load Razorpay script on component mount
    useEffect(() => {
        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                // Check if script already loaded
                if (window.Razorpay) {
                    setRazorpayLoaded(true);
                    resolve(true);
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.async = true;
                script.onload = () => {
                    setRazorpayLoaded(true);
                    resolve(true);
                };
                script.onerror = () => {
                    console.error('Failed to load Razorpay script');
                    resolve(false);
                };
                document.body.appendChild(script);
            });
        };

        loadRazorpayScript();
    }, []);

    // Pre-fill form with user data if logged in
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                customerName: user.name || '',
                customerEmail: user.email || '',
                customerPhone: user.phone || '',
                shippingAddress: user.address || '',
                shippingCity: user.city || '',
                shippingZip: user.zip || '',
            }));
        }
    }, [user]);

    const subtotal = getCartTotal();
    const tax = subtotal * 0.05; // 5% GST for India
    const shipping = subtotal > 500 ? 0 : 40; // Free shipping above ₹500
    const total = subtotal + tax + shipping;

    // MODIFIED: Handle Razorpay payment flow
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Step 1: Create order in database (existing logic preserved)
            const orderData = {
                items: cart.map((item) => ({
                    productId: item.product.id,
                    variantId: item.variant?.id, // NEW: Include variant ID
                    quantity: item.quantity,
                    orderType: item.orderType,
                })),
                ...formData,
            };

            const orderResponse = await api.post('/orders', orderData);
            const order = orderResponse.data.data.order;

            // Step 2: Create Razorpay payment order
            const paymentOrderResponse = await api.post('/payments/create-order', {
                orderId: order.id,
                amount: order.total,
            });

            const { orderId: razorpayOrderId, amount, currency, keyId } = paymentOrderResponse.data.data;

            // Step 3: Open Razorpay checkout
            const options = {
                key: keyId,
                amount: amount,
                currency: currency,
                name: 'Fruitify',
                description: `Order #${order.id}`,
                order_id: razorpayOrderId,
                handler: async function (response) {
                    // Payment success handler
                    await handlePaymentSuccess(response, order.id);
                },
                prefill: {
                    name: formData.customerName,
                    email: formData.customerEmail,
                    contact: formData.customerPhone || '',
                },
                theme: {
                    color: '#10b981', // Primary green color
                },
                modal: {
                    ondismiss: function () {
                        // Payment cancelled/failed
                        handlePaymentFailure(order.id, 'Payment cancelled by user');
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error('Error creating order:', error);
            toast.error(error.response?.data?.error || 'Failed to place order');
            setLoading(false);
        }
    };

    // ADDED: Handle successful payment
    const handlePaymentSuccess = async (paymentResponse, orderId) => {
        try {
            // Verify payment on backend
            await api.post('/payments/verify', {
                razorpayOrderId: paymentResponse.razorpay_order_id,
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpaySignature: paymentResponse.razorpay_signature,
                orderId: orderId,
            });

            // Payment verified successfully
            clearCart();
            toast.success('Payment successful! Order confirmed.');
            navigate(`/payment-success?orderId=${orderId}`);
        } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed. Please contact support.');
        } finally {
            setLoading(false);
        }
    };

    // ADDED: Handle payment failure
    const handlePaymentFailure = async (orderId, reason) => {
        try {
            await api.post('/payments/failure', {
                orderId: orderId,
                reason: reason,
            });

            toast.error('Payment failed. Please try again.');
        } catch (error) {
            console.error('Error handling payment failure:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">Checkout</h1>
                    <p className="text-gray-600">Complete your order</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card p-6"
                    >
                        <h2 className="text-2xl font-bold mb-6">Customer Information</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="customerEmail"
                                    value={formData.customerEmail}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="customerPhone"
                                    value={formData.customerPhone}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Shipping Address */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card p-6"
                    >
                        <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    name="shippingAddress"
                                    value={formData.shippingAddress}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                    placeholder="123 Main Street"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="shippingCity"
                                        value={formData.shippingCity}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                        placeholder="New York"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        ZIP Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="shippingZip"
                                        value={formData.shippingZip}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                        placeholder="10001"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Payment - Razorpay */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card p-6"
                    >
                        <h2 className="text-2xl font-bold mb-4">Payment</h2>
                        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6 rounded-xl">
                            <div className="flex items-center space-x-3 mb-4">
                                <CreditCard className="w-6 h-6" />
                                <span className="text-lg font-semibold">Secure Payment via Razorpay</span>
                            </div>
                            <p className="text-sm text-primary-50 mb-2">
                                Pay securely using Credit Card, Debit Card, UPI, or Net Banking.
                            </p>
                            <p className="text-xs text-primary-100">
                                🔒 TEST MODE - Use test cards only
                            </p>
                        </div>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card p-6"
                    >
                        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({cart.length} items)</span>
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
                            <div className="border-t pt-3 flex justify-between text-2xl font-bold">
                                <span>Total</span>
                                <span className="text-primary-600">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full flex items-center justify-center space-x-2 text-lg"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    <span>Place Order</span>
                                </>
                            )}
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            By placing this order, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </motion.div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;

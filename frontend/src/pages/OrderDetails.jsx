import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Check } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useOrderUpdates } from '../hooks/useOrderUpdates';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get(`/orders/my-orders/${id}`);
            setOrder(response.data.data.order);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch order details');
            if (error.response?.status === 404) {
                setTimeout(() => navigate('/my-orders'), 2000);
            }
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    // Real-time order status updates
    const handleOrderStatusUpdate = useCallback((data) => {
        // Only update if it's the current order
        if (data.orderId === parseInt(id)) {
            console.log('📡 Live update for current order:', data);
            toast.success(`Order status updated to ${data.newStatus.replace(/_/g, ' ')}`);
            // Refresh order details
            fetchOrderDetails();
        }
    }, [id, fetchOrderDetails]);

    useOrderUpdates(handleOrderStatusUpdate, null);

    const getStatusColor = (status) => {
        const colors = {
            'PENDING': 'yellow',
            'PROCESSING': 'blue',
            'OUT_FOR_DELIVERY': 'purple',
            'DELIVERED': 'green',
            'CANCELLED': 'red',
        };
        return colors[status] || 'gray';
    };

    const timelineSteps = [
        { key: 'ordered', label: 'Order Placed', icon: Package },
        { key: 'processed', label: 'Processing', icon: Calendar },
        { key: 'shipped', label: 'Out for Delivery', icon: Package },
        { key: 'delivered', label: 'Delivered', icon: Check },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Order Not Found</h2>
                    <Link to="/my-orders" className="text-primary-600 hover:underline">
                        Back to My Orders
                    </Link>
                </div>
            </div>
        );
    }

    const statusColor = getStatusColor(order.status);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom max-w-5xl">
                {/* Back Button */}
                <Link
                    to="/my-orders"
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to My Orders
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                                Order #{order.id}
                            </h1>
                            <p className="text-gray-600">
                                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                        <div className="flex flex-col items-start md:items-end space-y-2">
                            <span className={`px-4 py-2 rounded-xl text-sm font-semibold bg-${statusColor}-100 text-${statusColor}-800`}>
                                {order.status.replace(/_/g, ' ')}
                            </span>
                            <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-6 md:p-8 mb-6"
                >
                    <h2 className="text-xl font-bold mb-6">Order Timeline</h2>
                    <div className="relative">
                        {timelineSteps.map((step, index) => {
                            // Determine if step is completed based on current order status
                            const statusOrder = ['PENDING', 'PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
                            const currentStatusIndex = statusOrder.indexOf(order.status);

                            let isCompleted = false;
                            let isCurrent = false;

                            if (step.key === 'ordered') {
                                isCompleted = true; // Always completed
                            } else if (step.key === 'processed') {
                                isCompleted = currentStatusIndex >= 1;
                                isCurrent = currentStatusIndex === 1;
                            } else if (step.key === 'shipped') {
                                isCompleted = currentStatusIndex >= 2;
                                isCurrent = currentStatusIndex === 2;
                            } else if (step.key === 'delivered') {
                                isCompleted = currentStatusIndex >= 3;
                                isCurrent = currentStatusIndex === 3;
                            }

                            const Icon = step.icon;

                            return (
                                <div key={step.key} className="flex items-start mb-8 last:mb-0 relative">
                                    {/* Vertical Line */}
                                    {index < timelineSteps.length - 1 && (
                                        <div className={`absolute left-6 top-12 w-0.5 h-full ${isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                            }`} style={{ height: 'calc(100% + 2rem)' }}></div>
                                    )}

                                    {/* Icon */}
                                    <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${isCompleted ? 'bg-green-500 text-white' :
                                            isCurrent ? 'bg-blue-500 text-white' :
                                                'bg-gray-200 text-gray-500'
                                        }`}>
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    {/* Content */}
                                    <div className="ml-4 flex-1">
                                        <h3 className={`font-semibold ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>
                                            {step.label}
                                        </h3>
                                        {step.key === 'ordered' && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {new Date(order.createdAt).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Shipping Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card p-6"
                    >
                        <div className="flex items-center space-x-2 mb-4">
                            <MapPin className="w-5 h-5 text-primary-600" />
                            <h2 className="text-lg font-bold">Shipping Address</h2>
                        </div>
                        <div className="text-gray-700 space-y-1">
                            <p className="font-semibold">{order.customerName}</p>
                            <p>{order.shippingAddress}</p>
                            <p>{order.shippingCity}, {order.shippingZip}</p>
                            <p className="pt-2 text-sm text-gray-600">
                                Phone: {order.customerPhone || 'N/A'}
                            </p>
                        </div>
                    </motion.div>

                    {/* Payment Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card p-6"
                    >
                        <div className="flex items-center space-x-2 mb-4">
                            <CreditCard className="w-5 h-5 text-primary-600" />
                            <h2 className="text-lg font-bold">Payment Details</h2>
                        </div>
                        <div className="space-y-2 text-gray-700">
                            <div className="flex justify-between">
                                <span>Method:</span>
                                <span className="font-semibold">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className={`font-semibold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            {order.transactionId && (
                                <div className="flex justify-between text-sm">
                                    <span>Transaction ID:</span>
                                    <span className="font-mono">{order.transactionId}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Order Items */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card p-6 md:p-8 mt-6"
                >
                    <h2 className="text-xl font-bold mb-6">Order Items</h2>
                    <div className="space-y-4">
                        {order.orderItems.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 pb-4 border-b last:border-0">
                                {item.product.imageUrl && (
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        className="w-20 h-20 rounded-lg object-cover"
                                    />
                                )}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                                    <p className="text-sm text-gray-600">{item.product.category}</p>
                                    <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-lg">
                                        ${parseFloat(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        ${parseFloat(item.price).toFixed(2)} each
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Total */}
                    <div className="mt-6 pt-6 border-t">
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span>Total</span>
                            <span className="text-primary-600">
                                ${parseFloat(order.total).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderDetails;

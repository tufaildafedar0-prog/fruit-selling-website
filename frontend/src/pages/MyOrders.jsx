import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Package, Filter, Search } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useOrderUpdates } from '../hooks/useOrderUpdates';

const OrderStatusBadge = ({ status }) => {
    const statusConfig = {
        'PENDING': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
        'PROCESSING': { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
        'OUT_FOR_DELIVERY': { color: 'bg-purple-100 text-purple-800', label: 'Out for Delivery' },
        'DELIVERED': { color: 'bg-green-100 text-green-800', label: 'Delivered' },
        'CANCELLED': { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
            {config.label}
        </span>
    );
};

const PaymentStatusBadge = ({ status }) => {
    const statusConfig = {
        'PAID': { color: 'bg-green-100 text-green-800', label: '✓ Paid' },
        'PENDING': { color: 'bg-yellow-100 text-yellow-800', label: '⏳ Pending' },
        'FAILED': { color: 'bg-red-100 text-red-800', label: '✗ Failed' },
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
            {config.label}
        </span>
    );
};

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    useEffect(() => {
        fetchOrders();
    }, [filter, pagination.page]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
            };

            if (filter !== 'ALL') {
                params.status = filter;
            }

            const response = await api.get('/orders/my-orders', { params });
            setOrders(response.data.data.orders);
            setPagination(prev => ({
                ...prev,
                ...response.data.data.pagination,
            }));
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    // Real-time order status updates
    const handleOrderStatusUpdate = useCallback((data) => {
        console.log('📡 Order status updated:', data);
        toast.success(`Order #${data.orderId} status updated to ${data.newStatus.replace(/_/g, ' ')}`);
        // Refresh orders list
        fetchOrders();
    }, []);

    useOrderUpdates(handleOrderStatusUpdate, null);

    const filteredOrders = orders.filter(order => {
        if (!searchQuery) return true;
        return order.id.toString().includes(searchQuery) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">My Orders</h1>
                    <p className="text-gray-600">Track and manage your orders</p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-4 md:p-6 mb-6"
                >
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by order ID or name..."
                                className="input pl-10 w-full"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center space-x-2 w-full md:w-auto">
                            <Filter className="w-5 h-5 text-gray-600" />
                            <select
                                value={filter}
                                onChange={(e) => {
                                    setFilter(e.target.value);
                                    setPagination(prev => ({ ...prev, page: 1 }));
                                }}
                                className="input w-full md:w-auto"
                            >
                                <option value="ALL">All Orders</option>
                                <option value="PENDING">Pending</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Orders List */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="card p-12 text-center"
                    >
                        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No Orders Found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery ? 'Try a different search term' : 'Start shopping to see your orders here!'}
                        </p>
                        <Link to="/retail" className="btn btn-primary inline-flex items-center">
                            Start Shopping
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    to={`/my-orders/${order.id}`}
                                    className="card p-4 md:p-6 hover:shadow-lg transition-shadow block"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        {/* Left - Order Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-bold">Order #{order.id}</h3>
                                                <OrderStatusBadge status={order.status} />
                                                <PaymentStatusBadge status={order.paymentStatus} />
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <span>{order.orderItems.length} item(s)</span>
                                                <span>•</span>
                                                <span className="font-semibold text-gray-900">
                                                    ${parseFloat(order.total).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right - View Button */}
                                        <div className="flex items-center space-x-3">
                                            <button className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm">
                                                View Details →
                                            </button>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="mt-4 pt-4 border-t flex items-center space-x-3 overflow-x-auto">
                                        {order.orderItems.slice(0, 3).map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2 flex-shrink-0"
                                            >
                                                {item.product.imageUrl && (
                                                    <img
                                                        src={item.product.imageUrl}
                                                        alt={item.product.name}
                                                        className="w-10 h-10 rounded object-cover"
                                                    />
                                                )}
                                                <div className="text-xs">
                                                    <p className="font-medium text-gray-700">
                                                        {item.product.name}
                                                    </p>
                                                    <p className="text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.orderItems.length > 3 && (
                                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                                +{order.orderItems.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && filteredOrders.length > 0 && pagination.totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 flex justify-center items-center space-x-4"
                    >
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 1}
                            className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page === pagination.totalPages}
                            className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;

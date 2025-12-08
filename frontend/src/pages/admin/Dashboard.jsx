import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    ShoppingBag,
    Package,
    Users,
    AlertTriangle,
    TrendingUp,
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatCard from '../../components/admin/StatCard';
import { Link } from 'react-router-dom';
import { formatINR } from '../../utils/currency'; // NEW: INR formatter

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/admin/dashboard');
            setAnalytics(response.data.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner />
            </div>
        );
    }

    const { overview, recentOrders, lowStockProducts, ordersByStatus, revenueByType } = analytics || {};

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={DollarSign}
                    label="Total Revenue"
                    value={formatINR(overview?.totalRevenue || 0)}
                    color="green"
                />
                <StatCard
                    icon={ShoppingBag}
                    label="Total Orders"
                    value={overview?.totalOrders || 0}
                    color="blue"
                />
                <StatCard
                    icon={Package}
                    label="Total Products"
                    value={overview?.totalProducts || 0}
                    color="purple"
                />
                <StatCard
                    icon={Users}
                    label="Total Customers"
                    value={overview?.totalUsers || 0}
                    color="orange"
                />
            </div>

            {/* Revenue by Type */}
            {revenueByType && revenueByType.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Revenue by Order Type</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {revenueByType.map((item) => (
                            <div
                                key={item.type}
                                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                            >
                                <p className="text-sm text-gray-600">{item.type}</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatINR(item.revenue)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Orders by Status */}
            {ordersByStatus && ordersByStatus.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Orders by Status</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {ordersByStatus.map((item) => (
                            <div
                                key={item.status}
                                className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                            >
                                <p className="text-sm text-gray-600 mb-1">{item.status}</p>
                                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                        <Link
                            to="/admin/orders"
                            className="text-sm text-green-600 hover:text-green-700 font-semibold"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentOrders && recentOrders.length > 0 ? (
                            recentOrders.slice(0, 5).map((order) => (
                                <Link
                                    key={order.id}
                                    to={`/admin/orders`}
                                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {order.customerName}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Order #{order.id}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">
                                                {formatINR(parseFloat(order.total))}
                                            </p>
                                            <p
                                                className={`text-xs font-semibold px-2 py-1 rounded-full ${order.status === 'DELIVERED'
                                                    ? 'bg-green-100 text-green-700'
                                                    : order.status === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                    }`}
                                            >
                                                {order.status}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8">No recent orders</p>
                        )}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            <span>Low Stock Alerts</span>
                        </h2>
                        <Link
                            to="/admin/products"
                            className="text-sm text-green-600 hover:text-green-700 font-semibold"
                        >
                            Manage
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {lowStockProducts && lowStockProducts.length > 0 ? (
                            lowStockProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                                >
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {product.name}
                                            </p>
                                            <p className="text-sm text-gray-600">{product.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-orange-600">
                                            {product.stock}
                                        </p>
                                        <p className="text-xs text-gray-600">in stock</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8">
                                All products are well stocked!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Get dashboard analytics and statistics
 */
export const getDashboardAnalytics = async (req, res, next) => {
    try {
        // Get date range (last 30 days by default)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        // Total revenue from all orders
        const revenueData = await prisma.order.aggregate({
            _sum: {
                total: true,
            },
        });
        const totalRevenue = revenueData._sum.total || 0;

        // Total orders count
        const totalOrders = await prisma.order.count();

        // Total products count
        const totalProducts = await prisma.product.count();

        // Total users count
        const totalUsers = await prisma.user.count({
            where: {
                role: 'CUSTOMER',
            },
        });

        // Recent orders (last 10)
        const recentOrders = await prisma.order.findMany({
            take: 10,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        // Low stock alerts (products with stock < 10)
        const lowStockProducts = await prisma.product.findMany({
            where: {
                stock: {
                    lt: 10,
                },
            },
            orderBy: {
                stock: 'asc',
            },
        });

        // Order statistics by status
        const ordersByStatus = await prisma.order.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        });

        // Revenue by order type
        const revenueByType = await prisma.order.groupBy({
            by: ['orderType'],
            _sum: {
                total: true,
            },
        });

        // Recent 30 days revenue trend
        const dailyRevenue = await prisma.$queryRaw`
            SELECT 
                DATE(createdAt) as date,
                SUM(total) as revenue,
                COUNT(*) as orderCount
            FROM orders
            WHERE createdAt >= ${startDate}
            GROUP BY DATE(createdAt)
            ORDER BY DATE(createdAt) ASC
        `;

        res.json({
            success: true,
            data: {
                overview: {
                    totalRevenue: parseFloat(totalRevenue),
                    totalOrders,
                    totalProducts,
                    totalUsers,
                },
                recentOrders,
                lowStockProducts,
                ordersByStatus: ordersByStatus.map(item => ({
                    status: item.status,
                    count: item._count.status,
                })),
                revenueByType: revenueByType.map(item => ({
                    type: item.orderType,
                    revenue: parseFloat(item._sum.total || 0),
                })),
                dailyRevenue: dailyRevenue.map(item => ({
                    date: item.date,
                    revenue: parseFloat(item.revenue),
                    orderCount: Number(item.orderCount),
                })),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get dashboard statistics for a specific date range
 */
export const getDashboardStatsByDateRange = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            throw new AppError('Start date and end date are required', 400);
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
        });

        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);

        res.json({
            success: true,
            data: {
                totalRevenue,
                totalOrders: orders.length,
                startDate: start,
                endDate: end,
            },
        });
    } catch (error) {
        next(error);
    }
};

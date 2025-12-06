import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Get all orders with advanced filtering
 */
export const getAllOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const status = req.query.status;
        const orderType = req.query.orderType;
        const search = req.query.search || '';
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        // Build where clause
        const where = {
            ...(status && { status }),
            ...(orderType && { orderType }),
            ...(search && {
                OR: [
                    { customerName: { contains: search } },
                    { customerEmail: { contains: search } },
                    { customerPhone: { contains: search } },
                ],
            }),
            ...(startDate && endDate && {
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            }),
        };

        const [orders, totalCount] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: limit,
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
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    imageUrl: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.order.count({ where }),
        ]);

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    page,
                    limit,
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get order by ID with full details
 */
export const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        res.json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Export orders as JSON
 */
export const exportOrders = async (req, res, next) => {
    try {
        const status = req.query.status;
        const orderType = req.query.orderType;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        const where = {
            ...(status && { status }),
            ...(orderType && { orderType }),
            ...(startDate && endDate && {
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            }),
        };

        const orders = await prisma.order.findMany({
            where,
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
                orderItems: {
                    include: {
                        product: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        // Transform data for export
        const exportData = orders.map(order => ({
            orderId: order.id,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            total: parseFloat(order.total),
            status: order.status,
            orderType: order.orderType,
            shippingAddress: `${order.shippingAddress}, ${order.shippingCity} ${order.shippingZip}`,
            itemCount: order.orderItems.length,
            items: order.orderItems.map(item =>
                `${item.product.name} (x${item.quantity})`
            ).join(', '),
            createdAt: order.createdAt,
        }));

        res.json({
            success: true,
            data: exportData,
        });
    } catch (error) {
        next(error);
    }
};

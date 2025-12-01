import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const createOrder = async (req, res, next) => {
    try {
        const {
            items, // [{ productId, quantity, orderType }]
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            shippingCity,
            shippingZip,
        } = req.body;

        // Validate items and calculate total
        let total = 0;
        const orderItemsData = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: parseInt(item.productId) },
            });

            if (!product) {
                throw new AppError(`Product with ID ${item.productId} not found`, 404);
            }

            // Check stock
            if (product.stock < item.quantity) {
                throw new AppError(`Insufficient stock for ${product.name}`, 400);
            }

            // Check minimum wholesale quantity
            if (item.orderType === 'WHOLESALE' && item.quantity < product.minQtyWholesale) {
                throw new AppError(
                    `Minimum wholesale quantity for ${product.name} is ${product.minQtyWholesale}`,
                    400
                );
            }

            // Calculate price based on order type
            const price =
                item.orderType === 'WHOLESALE'
                    ? parseFloat(product.wholesalePrice)
                    : parseFloat(product.retailPrice);

            const itemTotal = price * item.quantity;
            total += itemTotal;

            orderItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                price,
                orderType: item.orderType || 'RETAIL',
            });
        }

        // Determine order type (WHOLESALE if any item is wholesale)
        const orderType = items.some(item => item.orderType === 'WHOLESALE')
            ? 'WHOLESALE'
            : 'RETAIL';

        // Create order with items in a transaction
        const order = await prisma.$transaction(async (tx) => {
            // Create order
            const newOrder = await tx.order.create({
                data: {
                    userId: req.user?.id || null,
                    total,
                    status: 'PENDING',
                    orderType,
                    customerName,
                    customerEmail,
                    customerPhone: customerPhone || null,
                    shippingAddress,
                    shippingCity,
                    shippingZip,
                    orderItems: {
                        create: orderItemsData,
                    },
                },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            // Update product stock
            for (const item of items) {
                await tx.product.update({
                    where: { id: parseInt(item.productId) },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            return newOrder;
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: { order },
        });
    } catch (error) {
        next(error);
    }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const where = {};

        // If user is not admin, only show their orders
        if (req.user.role !== 'ADMIN') {
            where.userId = req.user.id;
        }

        if (status) {
            where.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
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
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / parseInt(limit)),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        // Check if user can access this order
        if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
            throw new AppError('Not authorized to view this order', 403);
        }

        res.json({
            success: true,
            data: { order },
        });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            throw new AppError('Invalid order status', 400);
        }

        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: { order },
        });
    } catch (error) {
        next(error);
    }
};

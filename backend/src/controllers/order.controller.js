import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import telegramService from '../services/telegram.service.js';
import emailService from '../services/email.service.js';
import socketService from '../services/socket.service.js';

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

        // Send notifications (don't await - run in background)
        telegramService.notifyNewOrder(order).catch(err =>
            console.error('Telegram notification failed:', err.message)
        );
        emailService.notifyNewOrder(order).catch(err =>
            console.error('Email notification failed:', err.message)
        );

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
        const {
            deliveryStatus,
            status,
            paymentStatus,
            paymentMethod,
            transactionId,
            paidAt
        } = req.body;

        // Get current order before update to capture old status
        const currentOrder = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            select: { status: true, userId: true },
        });

        if (!currentOrder) {
            throw new AppError('Order not found', 404);
        }

        const oldStatus = currentOrder.status;

        // Build update data
        const updateData = {};
        let statusChanged = false;
        let paymentChanged = false;

        if (deliveryStatus || status) {
            const newStatus = deliveryStatus || status;
            const validStatuses = ['PENDING', 'PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
            if (!validStatuses.includes(newStatus)) {
                throw new AppError('Invalid delivery status', 400);
            }
            updateData.status = newStatus;
            statusChanged = true;
        }

        if (paymentStatus) {
            const validPaymentStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
            if (!validPaymentStatuses.includes(paymentStatus)) {
                throw new AppError('Invalid payment status', 400);
            }
            updateData.paymentStatus = paymentStatus;
            paymentChanged = true;

            if (paymentStatus === 'PAID' && !currentOrder.paidAt) {
                updateData.paidAt = paidAt || new Date();
            }
        }

        if (paymentMethod) {
            updateData.paymentMethod = paymentMethod;
        }

        if (transactionId) {
            updateData.transactionId = transactionId;
        }

        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Send email notifications (don't await - run in background)
        if (paymentChanged) {
            emailService.sendPaymentUpdate(order).catch(err =>
                console.error('Payment email failed:', err.message)
            );
        }

        if (statusChanged) {
            emailService.sendDeliveryUpdate(order).catch(err =>
                console.error('Delivery email failed:', err.message)
            );

            // Emit real-time socket event for order status update
            if (order.userId) {
                socketService.emitOrderStatusUpdate(order.userId, {
                    orderId: order.id,
                    userId: order.userId,
                    oldStatus: oldStatus,
                    newStatus: order.status,
                    updatedAt: new Date().toISOString(),
                });
            }
        }

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: { order },
        });
    } catch (error) {
        next(error);
    }
};

// ============ CUSTOMER ORDER ENDPOINTS ============

export const getMyOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const userId = req.user.id;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // Build where clause
        const where = { userId: userId };

        if (status && status !== 'ALL') {
            where.status = status;
        }

        // Get total count for pagination
        const total = await prisma.order.count({ where });

        // Get orders with related data
        const orders = await prisma.order.findMany({
            where,
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take,
        });

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

export const getMyOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await prisma.order.findFirst({
            where: {
                id: parseInt(id),
                userId: userId,
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                imageUrl: true,
                                category: true,
                            },
                        },
                    },
                },
            },
        });

        if (!order) {
            throw new AppError('Order not found or you do not have permission to view it', 404);
        }

        // Build timeline
        const timeline = {
            ordered: order.createdAt,
            processed: order.processedAt,
            shipped: order.shippedAt,
            delivered: order.deliveredAt,
        };

        res.json({
            success: true,
            data: {
                order: {
                    ...order,
                    timeline,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};
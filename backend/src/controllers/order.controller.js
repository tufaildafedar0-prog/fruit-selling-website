import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import telegramService from '../services/telegram.service.js';
import emailService from '../services/email.service.js';
import socketService from '../services/socket.service.js';

export const createOrder = async (req, res, next) => {
    try {
        const {
            items, // [{ productId, variantId?, quantity, orderType }]
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
            let product, variant, price, stock, minQtyWholesale;

            // NEW: If variantId provided, use variant pricing and stock
            if (item.variantId) {
                variant = await prisma.productVariant.findUnique({
                    where: { id: parseInt(item.variantId) },
                    include: { product: true }
                });

                if (!variant) {
                    throw new AppError(`Variant with ID ${item.variantId} not found`, 404);
                }

                product = variant.product;
                price = item.orderType === 'WHOLESALE'
                    ? parseFloat(variant.wholesalePrice)
                    : parseFloat(variant.retailPrice);
                stock = variant.stock;
                minQtyWholesale = variant.minQtyWholesale;

                // Check variant stock
                if (stock < item.quantity) {
                    throw new AppError(
                        `Insufficient stock for ${product.name} (${variant.displayName})`,
                        400
                    );
                }
            } else {
                // Fallback to product-level pricing (backward compatibility)
                product = await prisma.product.findUnique({
                    where: { id: parseInt(item.productId) },
                });

                if (!product) {
                    throw new AppError(`Product with ID ${item.productId} not found`, 404);
                }

                price = item.orderType === 'WHOLESALE'
                    ? parseFloat(product.wholesalePrice)
                    : parseFloat(product.retailPrice);
                stock = product.stock;
                minQtyWholesale = product.minQtyWholesale;

                // Check product stock
                if (stock < item.quantity) {
                    throw new AppError(`Insufficient stock for ${product.name}`, 400);
                }
            }

            // Check minimum wholesale quantity
            if (item.orderType === 'WHOLESALE' && item.quantity < minQtyWholesale) {
                throw new AppError(
                    `Minimum wholesale quantity for ${product.name} is ${minQtyWholesale}`,
                    400
                );
            }

            const itemTotal = price * item.quantity;
            total += itemTotal;

            orderItemsData.push({
                productId: product.id,
                variantId: variant?.id || null, // NEW: Store variant ID
                quantity: item.quantity,
                price,
                orderType: item.orderType || 'RETAIL',
                selectedQuantity: variant?.quantity || null, // NEW: Store selected quantity
                selectedUnit: variant?.unit || null, // NEW: Store selected unit
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
                            variant: true, // NEW: Include variant in response
                        },
                    },
                },
            });

            // NEW: Update stock (variant or product level)
            for (const item of items) {
                if (item.variantId) {
                    // Update variant stock
                    await tx.productVariant.update({
                        where: { id: parseInt(item.variantId) },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    });
                } else {
                    // Update product stock (backward compatibility)
                    await tx.product.update({
                        where: { id: parseInt(item.productId) },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    });
                }
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
        const { status, page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = req.user?.role === 'ADMIN' ? {} : { userId: req.user.id };

        if (status) {
            where.status = status;
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                            variant: true, // NEW: Include variant in response
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
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                orderItems: {
                    include: {
                        product: true,
                        variant: true, // NEW: Include variant in response
                    },
                },
            },
        });

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        // Check authorization
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

// NEW: Get my order by ID (for authenticated users)
export const getMyOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findFirst({
            where: {
                id: parseInt(id),
                userId: req.user.id // Only user's own orders
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                        variant: true, // NEW: Include variant in response
                    },
                },
            },
        });

        if (!order) {
            throw new AppError('Order not found', 404);
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

        const validStatuses = ['PENDING', 'PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
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
                        variant: true, // NEW: Include variant in response
                    },
                },
            },
        });

        // Emit socket event for real-time updates
        socketService.emitOrderUpdate(order);

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: { order },
        });
    } catch (error) {
        next(error);
    }
};

// NEW: Get my orders (for authenticated users)
export const getMyOrders = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = { userId: req.user.id };

        if (status) {
            where.status = status;
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                            variant: true, // NEW: Include variant in response
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
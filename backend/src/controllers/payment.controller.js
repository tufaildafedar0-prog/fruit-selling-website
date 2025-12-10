/**
 * Payment Controller - Razorpay Integration (TEST MODE ONLY)
 * 
 * This controller handles all Razorpay payment operations for the Fruitify platform.
 * It provides endpoints for creating payment orders, verifying payment signatures,
 * and handling payment failures.
 * 
 * IMPORTANT: This is for TEST MODE only. Do not use production keys.
 * 
 * Dependencies:
 * - razorpay: Official Razorpay SDK
 * - crypto: For signature verification
 * - prisma: Database operations
 * 
 * Environment Variables Required:
 * - RAZORPAY_KEY_ID: Your Razorpay test key ID (starts with rzp_test_)
 * - RAZORPAY_KEY_SECRET: Your Razorpay test secret key
 */

import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

// Lazy initialization of Razorpay instance
// This prevents server crash on startup if keys are not configured
// Keys are only required when payment endpoints are actually called
let razorpayInstance = null;

const getRazorpayInstance = () => {
    if (!razorpayInstance) {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new AppError(
                'Razorpay credentials not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file',
                500
            );
        }

        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    return razorpayInstance;
};

/**
 * Create Razorpay Order
 * 
 * This endpoint creates a Razorpay order that will be used to open the
 * Razorpay checkout on the frontend.
 * 
 * Flow:
 * 1. Receive order details from frontend (orderId, amount)
 * 2. Fetch order from database to validate
 * 3. Create Razorpay order with amount in paise (₹1 = 100 paise)
 * 4. Store razorpayOrderId in database
 * 5. Return Razorpay order details to frontend
 * 
 * @route POST /api/payments/create-order
 * @access Public (guests can also checkout)
 */
export const createPaymentOrder = async (req, res, next) => {
    try {
        const { orderId, amount } = req.body;

        // Validate input
        if (!orderId || !amount) {
            throw new AppError('Order ID and amount are required', 400);
        }

        // Fetch order from database
        const order = await prisma.order.findUnique({
            where: { id: parseInt(orderId) },
        });

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        // Validate amount matches order total
        if (parseFloat(amount) !== parseFloat(order.total)) {
            throw new AppError('Amount mismatch', 400);
        }

        // FIXED: Check if Razorpay is configured - if not, skip gracefully
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.log('⚠️ Razorpay not configured - order will proceed as COD/PENDING');

            // Update order to COD method
            await prisma.order.update({
                where: { id: parseInt(orderId) },
                data: {
                    paymentMethod: 'COD',
                    paymentStatus: 'PENDING',
                },
            });

            // Return skip response (NOT an error!)
            return res.status(200).json({
                success: false, // Frontend checks this to know to skip payment
                message: 'Payment gateway not configured - order will be COD',
                payment: 'SKIPPED',
                method: 'COD'
            });
        }

        // Create Razorpay order
        // Amount must be in paise (smallest currency unit)
        // ₹100 = 10000 paise
        const razorpay = getRazorpayInstance();
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(parseFloat(amount) * 100), // Convert to paise
            currency: 'INR',
            receipt: `order_${orderId}`,
            notes: {
                orderId: orderId.toString(),
                customerEmail: order.customerEmail,
                customerName: order.customerName,
            },
        });

        // Update order with Razorpay order ID
        await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: {
                razorpayOrderId: razorpayOrder.id,
                paymentMethod: 'razorpay',
            },
        });

        // Return Razorpay order details to frontend
        res.status(200).json({
            success: true,
            data: {
                orderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                keyId: process.env.RAZORPAY_KEY_ID, // Frontend needs this
            },
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        next(error);
    }
};

/**
 * Verify Payment Signature
 * 
 * This endpoint verifies the payment signature returned by Razorpay after
 * successful payment. This is critical for security - never trust the frontend!
 * 
 * Flow:
 * 1. Receive payment details from frontend (orderId, paymentId, signature)
 * 2. Generate expected signature using HMAC SHA256
 * 3. Compare with received signature
 * 4. If valid, update order status to PAID
 * 5. Store payment details in database
 * 6. Return success response (triggers email/telegram via existing logic)
 * 
 * Security Note:
 * The signature verification ensures the payment details haven't been tampered with.
 * 
 * @route POST /api/payments/verify
 * @access Public
 */
export const verifyPayment = async (req, res, next) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

        // Validate input
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
            throw new AppError('Missing payment verification details', 400);
        }

        // Generate expected signature
        // Format: razorpay_order_id + "|" + razorpay_payment_id
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');

        // Verify signature
        if (generatedSignature !== razorpaySignature) {
            // Payment signature verification failed - possible tampering
            await prisma.order.update({
                where: { id: parseInt(orderId) },
                data: {
                    paymentStatus: 'FAILED',
                },
            });

            throw new AppError('Invalid payment signature', 400);
        }

        // Signature is valid - payment is genuine
        // Update order with payment details and mark as PAID
        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: {
                paymentStatus: 'PAID',
                razorpayPaymentId,
                razorpaySignature,
                paidAt: new Date(),
                status: 'PROCESSING', // Move order to processing
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // NOTE: Email and Telegram notifications are NOT sent here
        // They should be triggered by the existing order status update logic
        // We're keeping this additive - no modifications to existing services

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            data: {
                order: updatedOrder,
            },
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        next(error);
    }
};

/**
 * Handle Payment Failure
 * 
 * This endpoint handles cases where payment fails or user cancels payment.
 * 
 * Flow:
 * 1. Receive order ID and failure reason
 * 2. Update order payment status to FAILED
 * 3. Log failure for debugging
 * 4. Return appropriate error response
 * 
 * Note: Order remains in PENDING status so user can retry payment
 * 
 * @route POST /api/payments/failure
 * @access Public
 */
export const handlePaymentFailure = async (req, res, next) => {
    try {
        const { orderId, reason } = req.body;

        if (!orderId) {
            throw new AppError('Order ID is required', 400);
        }

        // Update order payment status to FAILED
        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: {
                paymentStatus: 'FAILED',
                // Keep order status as PENDING so user can retry
            },
        });

        console.log(`Payment failed for order ${orderId}. Reason: ${reason || 'Not provided'}`);

        res.status(200).json({
            success: false,
            message: 'Payment failed',
            data: {
                orderId: updatedOrder.id,
                paymentStatus: updatedOrder.paymentStatus,
            },
        });
    } catch (error) {
        console.error('Error handling payment failure:', error);
        next(error);
    }
};

/**
 * Get Payment Status
 * 
 * This endpoint allows checking the payment status of an order.
 * Useful for debugging and customer support.
 * 
 * @route GET /api/payments/status/:orderId
 * @access Public
 */
export const getPaymentStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: parseInt(orderId) },
            select: {
                id: true,
                paymentStatus: true,
                paymentMethod: true,
                razorpayOrderId: true,
                razorpayPaymentId: true,
                paidAt: true,
                total: true,
            },
        });

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        res.status(200).json({
            success: true,
            data: {
                paymentStatus: order.paymentStatus || 'PENDING',
                paymentMethod: order.paymentMethod,
                paidAt: order.paidAt,
                amount: order.total,
            },
        });
    } catch (error) {
        console.error('Error fetching payment status:', error);
        next(error);
    }
};

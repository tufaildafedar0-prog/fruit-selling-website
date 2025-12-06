/**
 * Payment Routes - Razorpay Integration
 * 
 * This file defines all API routes for payment operations using Razorpay.
 * 
 * Available Routes:
 * - POST /api/payments/create-order : Create Razorpay order before checkout
 * - POST /api/payments/verify       : Verify payment signature after payment
 * - POST /api/payments/failure      : Handle payment failure
 * - GET  /api/payments/status/:orderId : Get payment status
 * 
 * Authentication: All routes are public (supports guest checkout)
 * 
 * IMPORTANT: This is for TEST MODE only.
 */

import express from 'express';
import {
    createPaymentOrder,
    verifyPayment,
    handlePaymentFailure,
    getPaymentStatus,
} from '../controllers/payment.controller.js';

const router = express.Router();

/**
 * @route   POST /api/payments/create-order
 * @desc    Create a Razorpay order for checkout
 * @access  Public
 * @body    { orderId: number, amount: number }
 * @returns { success, data: { orderId, amount, currency, keyId } }
 */
router.post('/create-order', createPaymentOrder);

/**
 * @route   POST /api/payments/verify
 * @desc    Verify payment signature after successful payment
 * @access  Public
 * @body    { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId }
 * @returns { success, message, data: { order } }
 */
router.post('/verify', verifyPayment);

/**
 * @route   POST /api/payments/failure
 * @desc    Handle payment failure
 * @access  Public
 * @body    { orderId: number, reason?: string }
 * @returns { success: false, message, data: { orderId, paymentStatus } }
 */
router.post('/failure', handlePaymentFailure);

/**
 * @route   GET /api/payments/status/:orderId
 * @desc    Get payment status for an order
 * @access  Public
 * @params  orderId (in URL)
 * @returns { success, data: { paymentStatus, paymentMethod, paidAt, amount } }
 */
router.get('/status/:orderId', getPaymentStatus);

export default router;

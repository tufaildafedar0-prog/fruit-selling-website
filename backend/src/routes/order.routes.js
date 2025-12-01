import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
} from '../controllers/order.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, orderValidation } from '../middleware/validation.js';

const router = express.Router();

// All order routes require authentication
router.post('/', validate(orderValidation.create), createOrder);

// Get orders - returns user's orders or all orders for admin
router.get('/', authenticate, getAllOrders);

// Get specific order
router.get('/:id', authenticate, getOrderById);

// Update order status - admin only
router.patch('/:id/status', authenticate, authorize('ADMIN'), updateOrderStatus);

export default router;

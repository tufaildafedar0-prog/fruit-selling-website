import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getMyOrders,
    getMyOrderById,
} from '../controllers/order.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, orderValidation } from '../middleware/validation.js';

const router = express.Router();

// Public route - create order
router.post('/', authenticate, validate(orderValidation.create), createOrder);


// Customer routes - view own orders
router.get('/my-orders', authenticate, getMyOrders);
router.get('/my-orders/:id', authenticate, getMyOrderById);

// Admin routes - manage all orders
router.get('/', authenticate, getAllOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/status', authenticate, authorize('ADMIN'), updateOrderStatus);

export default router;

import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

// Import admin controllers
import {
    getDashboardAnalytics,
    getDashboardStatsByDateRange,
} from '../controllers/adminDashboard.controller.js';
import {
    getSettings,
    updateSettings,
} from '../controllers/adminSettings.controller.js';
import {
    getAllUsers,
    getUserById,
    deleteUser,
    resetUserPassword,
} from '../controllers/adminUsers.controller.js';
import {
    getAllOrders,
    getOrderById,
    exportOrders,
} from '../controllers/adminOrders.controller.js';
import { updateOrderStatus } from '../controllers/order.controller.js';
import {
    testTelegram,
    getTelegramLogs,
    getTelegramStatus
} from '../controllers/adminTelegram.controller.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('ADMIN'));

// Dashboard routes
router.get('/dashboard', getDashboardAnalytics);
router.get('/dashboard/stats', getDashboardStatsByDateRange);

// Settings routes
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/reset-password', resetUserPassword);

// Order management routes
router.get('/orders', getAllOrders);
router.get('/orders/export', exportOrders);
router.get('/orders/:id', getOrderById);
router.patch('/orders/:id/status', updateOrderStatus);

// Telegram management routes (NEW)
router.get('/test-telegram', testTelegram);
router.get('/telegram-logs', getTelegramLogs);
router.get('/telegram-status', getTelegramStatus);

export default router;

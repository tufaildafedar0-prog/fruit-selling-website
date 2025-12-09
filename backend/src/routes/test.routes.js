import express from 'express';
import { testEmail, testTelegram, getServiceStatus } from '../controllers/test.controller.js';
import { deleteAllProducts, addFourProducts } from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Service status (no auth needed - doesn't expose secrets)
router.get('/status', getServiceStatus);

// Test endpoints (admin only for security)
router.post('/email', authenticate, authorize('ADMIN'), testEmail);
router.post('/telegram', authenticate, authorize('ADMIN'), testTelegram);

// Emergency product reset (admin only)
router.post('/delete-all-products', authenticate, authorize('ADMIN'), deleteAllProducts);
router.post('/add-four-products', authenticate, authorize('ADMIN'), addFourProducts);

export default router;

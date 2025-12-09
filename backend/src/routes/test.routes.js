import express from 'express';
import { testEmail, testTelegram, getServiceStatus } from '../controllers/test.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Service status (no auth needed - doesn't expose secrets)
router.get('/status', getServiceStatus);

// Test endpoints (admin only for security)
router.post('/email', authenticate, authorize('ADMIN'), testEmail);
router.post('/telegram', authenticate, authorize('ADMIN'), testTelegram);

export default router;

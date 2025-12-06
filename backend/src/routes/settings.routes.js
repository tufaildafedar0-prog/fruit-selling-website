import express from 'express';
import { getPublicSettings } from '../controllers/adminSettings.controller.js';

const router = express.Router();

// Public route to get website settings (no auth required)
router.get('/settings', getPublicSettings);

export default router;

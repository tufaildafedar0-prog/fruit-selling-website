import express from 'express';
import {
    register,
    login,
    getMe,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate, authValidation } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validate(authValidation.register), register);
router.post('/login', validate(authValidation.login), login);

// Protected routes
router.get('/me', authenticate, getMe);

export default router;

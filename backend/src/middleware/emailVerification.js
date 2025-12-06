import { AppError } from './errorHandler.js';

/**
 * Email Verification Middleware
 * Checks if user has verified their email before allowing certain actions
 */

export const requireEmailVerification = (req, res, next) => {
    // Skip verification check for admins
    if (req.user.role === 'ADMIN') {
        return next();
    }

    // Check if email is verified
    if (!req.user.emailVerified) {
        throw new AppError(
            'Please verify your email address before proceeding. Check your inbox for the verification link.',
            403
        );
    }

    next();
};

/**
 * Optional email verification check
 * Warns but doesn't block if email is not verified
 */
export const suggestEmailVerification = (req, res, next) => {
    if (!req.user.emailVerified && req.user.role !== 'ADMIN') {
        // Add a warning header
        res.setHeader('X-Email-Verification-Status', 'pending');
    }
    next();
};

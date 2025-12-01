import { body, validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

export const validate = (validations) => {
    return async (req, res, next) => {
        // Run all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        // Check for errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg).join(', ');
            return next(new AppError(errorMessages, 400));
        }

        next();
    };
};

// Common validation rules
export const authValidation = {
    register: [
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    ],
    login: [
        body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
};

export const productValidation = {
    create: [
        body('name').trim().notEmpty().withMessage('Product name is required'),
        body('description').trim().notEmpty().withMessage('Description is required'),
        body('retailPrice').isFloat({ min: 0 }).withMessage('Retail price must be a positive number'),
        body('wholesalePrice').isFloat({ min: 0 }).withMessage('Wholesale price must be a positive number'),
        body('minQtyWholesale').isInt({ min: 1 }).withMessage('Minimum wholesale quantity must be at least 1'),
        body('imageUrl').isURL().withMessage('Valid image URL is required'),
        body('category').trim().notEmpty().withMessage('Category is required'),
        body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    ],
    update: [
        body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
        body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
        body('retailPrice').optional().isFloat({ min: 0 }).withMessage('Retail price must be a positive number'),
        body('wholesalePrice').optional().isFloat({ min: 0 }).withMessage('Wholesale price must be a positive number'),
        body('minQtyWholesale').optional().isInt({ min: 1 }).withMessage('Minimum wholesale quantity must be at least 1'),
        body('imageUrl').optional().isURL().withMessage('Valid image URL is required'),
        body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
        body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    ],
};

export const orderValidation = {
    create: [
        body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
        body('items.*.productId').isInt().withMessage('Valid product ID is required'),
        body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
        body('items.*.orderType').isIn(['RETAIL', 'WHOLESALE']).withMessage('Order type must be RETAIL or WHOLESALE'),
        body('customerName').trim().notEmpty().withMessage('Customer name is required'),
        body('customerEmail').isEmail().normalizeEmail().withMessage('Valid email is required'),
        body('shippingAddress').trim().notEmpty().withMessage('Shipping address is required'),
        body('shippingCity').trim().notEmpty().withMessage('City is required'),
        body('shippingZip').trim().notEmpty().withMessage('ZIP code is required'),
    ],
};

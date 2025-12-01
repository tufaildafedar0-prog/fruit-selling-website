import express from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
} from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, productValidation } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Admin-only routes
router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate(productValidation.create),
    createProduct
);
router.put(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate(productValidation.update),
    updateProduct
);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteProduct);

export default router;

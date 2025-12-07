import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAllProducts = async (req, res, next) => {
    try {
        const {
            category,
            search,
            minPrice,
            maxPrice,
            featured,
            page = 1,
            limit = 12,
            sortBy = 'createdAt',
            order = 'desc',
        } = req.query;

        // Build where clause
        const where = {};

        if (category) {
            where.category = category;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (minPrice || maxPrice) {
            where.retailPrice = {};
            if (minPrice) where.retailPrice.gte = parseFloat(minPrice);
            if (maxPrice) where.retailPrice.lte = parseFloat(maxPrice);
        }

        if (featured !== undefined) {
            where.featured = featured === 'true';
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // Sorting
        const orderBy = { [sortBy]: order === 'asc' ? 'asc' : 'desc' };

        // Fetch products and total count
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take,
                orderBy,
                // NEW: Include variants for India-specific quantity selection
                include: {
                    variants: {
                        orderBy: { sortOrder: 'asc' }
                    }
                }
            }),
            prisma.product.count({ where }),
        ]);

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / parseInt(limit)),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            // NEW: Include variants for India-specific quantity selection
            include: {
                variants: {
                    orderBy: { sortOrder: 'asc' }
                }
            }
        });

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        res.json({
            success: true,
            data: { product },
        });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const {
            name,
            description,
            retailPrice,
            wholesalePrice,
            minQtyWholesale,
            imageUrl,
            category,
            stock,
            featured = false,
            defaultUnit = 'kg', // NEW: Default unit for variants
            variants = [] // NEW: Variants array
        } = req.body;

        // Calculate total stock across all variants
        const totalStock = variants.length > 0
            ? variants.reduce((sum, v) => sum + (v.stock || 0), 0)
            : parseInt(stock || 0);

        const productData = {
            name,
            description,
            retailPrice: parseFloat(retailPrice),
            wholesalePrice: parseFloat(wholesalePrice),
            minQtyWholesale: parseInt(minQtyWholesale),
            imageUrl,
            category,
            stock: totalStock,
            featured,
            defaultUnit
        };

        // NEW: Create variants if provided
        if (variants.length > 0) {
            productData.variants = {
                create: variants.map((variant, index) => ({
                    quantity: parseFloat(variant.quantity),
                    unit: variant.unit,
                    displayName: variant.displayName || `${variant.quantity} ${variant.unit}`,
                    retailPrice: parseFloat(variant.retailPrice),
                    wholesalePrice: parseFloat(variant.wholesalePrice),
                    minQtyWholesale: parseInt(variant.minQtyWholesale || minQtyWholesale),
                    stock: parseInt(variant.stock || 0),
                    sortOrder: variant.sortOrder !== undefined ? variant.sortOrder : index,
                    isDefault: variant.isDefault || index === 0
                }))
            };
        }

        const product = await prisma.product.create({
            data: productData,
            include: {
                variants: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { product },
        });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = {};

        // Only include fields that are provided
        const fields = [
            'name',
            'description',
            'retailPrice',
            'wholesalePrice',
            'minQtyWholesale',
            'imageUrl',
            'category',
            'stock',
            'featured',
        ];

        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                if (['retailPrice', 'wholesalePrice'].includes(field)) {
                    updateData[field] = parseFloat(req.body[field]);
                } else if (['minQtyWholesale', 'stock'].includes(field)) {
                    updateData[field] = parseInt(req.body[field]);
                } else {
                    updateData[field] = req.body[field];
                }
            }
        });

        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: { product },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.product.delete({
            where: { id: parseInt(id) },
        });

        res.json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const getCategories = async (req, res, next) => {
    try {
        const categories = await prisma.product.findMany({
            distinct: ['category'],
            select: {
                category: true,
            },
        });

        const categoryList = categories.map(c => c.category);

        res.json({
            success: true,
            data: { categories: categoryList },
        });
    } catch (error) {
        next(error);
    }
};

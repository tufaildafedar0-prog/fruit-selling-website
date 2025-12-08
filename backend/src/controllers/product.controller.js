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

        // NEW: Add cache headers for better performance (cache for 2 minutes)
        res.setHeader('Cache-Control', 'public, max-age=120, s-maxage=120');

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
            // NEW: Include variants
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
            featured,
            defaultUnit,
            variants
        } = req.body;

        const productData = {
            name,
            description,
            retailPrice: parseFloat(retailPrice),
            wholesalePrice: parseFloat(wholesalePrice),
            minQtyWholesale: parseInt(minQtyWholesale),
            imageUrl,
            category,
            stock: parseInt(stock),
            featured: featured || false,
            defaultUnit: defaultUnit || 'kg',
        };

        // NEW: Handle variants if provided
        if (variants && Array.isArray(variants) && variants.length > 0) {
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

            // Calculate total stock from variants
            const totalStock = variants.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0);
            productData.stock = totalStock;
        }

        const product = await prisma.product.create({
            data: productData,
            include: { variants: { orderBy: { sortOrder: 'asc' } } }
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
        const { variants, ...otherData } = req.body;
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
            'defaultUnit',
        ];

        fields.forEach(field => {
            if (otherData[field] !== undefined) {
                if (['retailPrice', 'wholesalePrice'].includes(field)) {
                    updateData[field] = parseFloat(otherData[field]);
                } else if (['minQtyWholesale', 'stock'].includes(field)) {
                    updateData[field] = parseInt(otherData[field]);
                } else {
                    updateData[field] = otherData[field];
                }
            }
        });

        // NEW: Handle variants update (delete and recreate for simplicity)
        if (variants && Array.isArray(variants)) {
            // Delete all existing variants
            await prisma.productVariant.deleteMany({
                where: { productId: parseInt(id) }
            });

            // Create new variants
            if (variants.length > 0) {
                updateData.variants = {
                    create: variants.map((variant, index) => ({
                        quantity: parseFloat(variant.quantity),
                        unit: variant.unit,
                        displayName: variant.displayName || `${variant.quantity} ${variant.unit}`,
                        retailPrice: parseFloat(variant.retailPrice),
                        wholesalePrice: parseFloat(variant.wholesalePrice),
                        minQtyWholesale: parseInt(variant.minQtyWholesale || otherData.minQtyWholesale || 10),
                        stock: parseInt(variant.stock || 0),
                        sortOrder: variant.sortOrder !== undefined ? variant.sortOrder : index,
                        isDefault: variant.isDefault || index === 0
                    }))
                };

                // Calculate total stock from variants
                const totalStock = variants.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0);
                updateData.stock = totalStock;
            }
        }

        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: { variants: { orderBy: { sortOrder: 'asc' } } }
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
            select: {
                category: true,
            },
            distinct: ['category'],
        });

        res.json({
            success: true,
            data: {
                categories: categories.map((c) => c.category),
            },
        });
    } catch (error) {
        next(error);
    }
};

import prisma from '../config/database.js';

/**
 * DELETE ALL PRODUCTS - Nuclear option
 */
export const deleteAllProducts = async (req, res, next) => {
    try {
        const result = await prisma.product.deleteMany({});

        res.json({
            success: true,
            message: `Deleted ALL ${result.count} products`,
            data: { deletedCount: result.count }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Add ONLY 4 specific products
 */
export const addFourProducts = async (req, res, next) => {
    try {
        const products = [
            {
                name: 'Watermelon',
                description: 'Fresh and juicy watermelon, perfect for hot summer days. Sweet and refreshing.',
                category: 'FRUIT',
                imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784fa4?w=500',
                retailPrice: 40.00,
                wholesalePrice: 30.00,
                wholesaleMinQty: 10,
                unit: 'kg',
                stock: 100,
                featured: true
            },
            {
                name: 'Banana',
                description: 'Fresh yellow bananas, rich in potassium. Great for energy and health.',
                category: 'FRUIT',
                imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500',
                retailPrice: 50.00,
                wholesalePrice: 40.00,
                wholesaleMinQty: 12,
                unit: 'dozen',
                stock: 150,
                featured: true
            },
            {
                name: 'Apple',
                description: 'Crisp and sweet apples, perfect for snacking. Rich in fiber and vitamins.',
                category: 'FRUIT',
                imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500',
                retailPrice: 120.00,
                wholesalePrice: 100.00,
                wholesaleMinQty: 10,
                unit: 'kg',
                stock: 80,
                featured: true
            },
            {
                name: 'Grapes',
                description: 'Sweet seedless grapes, fresh and juicy. Perfect for snacking or desserts.',
                category: 'FRUIT',
                imageUrl: 'https://images.unsplash.com/photo-1599819177877-ed2c9f0d1e13?w=500',
                retailPrice: 80.00,
                wholesalePrice: 65.00,
                wholesaleMinQty: 10,
                unit: 'kg',
                stock: 60,
                featured: true
            }
        ];

        // Create all 4 products
        const created = await prisma.product.createMany({
            data: products
        });

        res.json({
            success: true,
            message: `Added ${created.count} products successfully`,
            data: {
                count: created.count,
                products: products.map(p => p.name)
            }
        });
    } catch (error) {
        next(error);
    }
};

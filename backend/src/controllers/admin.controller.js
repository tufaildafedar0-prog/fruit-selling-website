import prisma from '../config/database.js';

/**
 * ADMIN ONLY - Clean up unwanted products
 * Keeps only: watermelon, banana, apple, grapes
 */
export const cleanupProducts = async (req, res, next) => {
    try {
        const KEEP_PRODUCTS = ['watermelon', 'banana', 'apple', 'grapes'];

        // Get all products
        const allProducts = await prisma.product.findMany({
            select: { id: true, name: true }
        });

        // Find products to delete
        const productsToDelete = allProducts.filter(product =>
            !KEEP_PRODUCTS.some(keepName =>
                product.name.toLowerCase().includes(keepName.toLowerCase())
            )
        );

        // Find products to keep
        const productsToKeep = allProducts.filter(product =>
            KEEP_PRODUCTS.some(keepName =>
                product.name.toLowerCase().includes(keepName.toLowerCase())
            )
        );

        // Delete unwanted products
        let deletedCount = 0;
        if (productsToDelete.length > 0) {
            const result = await prisma.product.deleteMany({
                where: {
                    id: {
                        in: productsToDelete.map(p => p.id)
                    }
                }
            });
            deletedCount = result.count;
        }

        res.json({
            success: true,
            message: 'Product cleanup complete',
            data: {
                totalBefore: allProducts.length,
                deleted: deletedCount,
                deletedProducts: productsToDelete.map(p => p.name),
                remaining: productsToKeep.length,
                remainingProducts: productsToKeep.map(p => p.name)
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ONE-TIME CLEANUP SCRIPT
 * Deletes all products except: watermelon, banana, apple, grapes
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const KEEP_PRODUCTS = [
    'watermelon',
    'banana',
    'apple',
    'grapes'
];

async function cleanup() {
    try {
        console.log('🧹 Starting product cleanup...\n');

        // Get all products
        const allProducts = await prisma.product.findMany({
            select: { id: true, name: true }
        });

        console.log(`📦 Found ${allProducts.length} total products`);

        // Find products to delete
        const productsToDelete = allProducts.filter(product =>
            !KEEP_PRODUCTS.some(keepName =>
                product.name.toLowerCase().includes(keepName.toLowerCase())
            )
        );

        console.log(`🗑️  Will delete ${productsToDelete.length} products:`);
        productsToDelete.forEach(p => console.log(`   - ${p.name} (ID: ${p.id})`));

        // Find products to keep
        const productsToKeep = allProducts.filter(product =>
            KEEP_PRODUCTS.some(keepName =>
                product.name.toLowerCase().includes(keepName.toLowerCase())
            )
        );

        console.log(`\n✅ Will keep ${productsToKeep.length} products:`);
        productsToKeep.forEach(p => console.log(`   - ${p.name} (ID: ${p.id})`));

        // Delete unwanted products
        if (productsToDelete.length > 0) {
            console.log('\n🔥 Deleting unwanted products...');

            const result = await prisma.product.deleteMany({
                where: {
                    id: {
                        in: productsToDelete.map(p => p.id)
                    }
                }
            });

            console.log(`✅ Deleted ${result.count} products successfully!`);
        } else {
            console.log('\n✅ No products to delete - database is clean!');
        }

        console.log('\n🎉 Cleanup complete!');
        console.log(`📦 Final product count: ${productsToKeep.length}`);

    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

cleanup();

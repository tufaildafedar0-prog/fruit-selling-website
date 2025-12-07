/**
 * Data Migration Script: Convert Existing Products to Variants
 * 
 * This script creates a default variant for each existing product
 * ensuring backward compatibility with the new variants system.
 * 
 * Run this ONCE after the schema migration.
 */

import prisma from '../src/config/database.js';

async function migrateProductsToVariants() {
    console.log('🔄 Starting product-to-variant migration...\n');

    try {
        // Get all existing products
        const products = await prisma.product.findMany({
            include: {
                variants: true
            }
        });

        console.log(`📦 Found ${products.length} products to migrate\n`);

        let migratedCount = 0;
        let skippedCount = 0;

        for (const product of products) {
            // Skip if product already has variants
            if (product.variants.length > 0) {
                console.log(`⏭️  Skipping "${product.name}" - already has ${product.variants.length} variant(s)`);
                skippedCount++;
                continue;
            }

            // Create default variant from product's legacy pricing
            const defaultVariant = await prisma.productVariant.create({
                data: {
                    productId: product.id,
                    quantity: 1,
                    unit: product.defaultUnit || 'kg',
                    displayName: `1 ${product.defaultUnit || 'kg'}`,
                    retailPrice: product.retailPrice,
                    wholesalePrice: product.wholesalePrice,
                    minQtyWholesale: product.minQtyWholesale,
                    stock: product.stock,
                    sortOrder: 0,
                    isDefault: true
                }
            });

            console.log(`✅ Migrated "${product.name}" → Created default variant: ${defaultVariant.displayName} at ₹${defaultVariant.retailPrice}`);
            migratedCount++;
        }

        console.log(`\n✨ Migration Complete!`);
        console.log(`   Migrated: ${migratedCount} products`);
        console.log(`   Skipped: ${skippedCount} products (already have variants)`);
        console.log(`   Total: ${products.length} products\n`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run migration
migrateProductsToVariants()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

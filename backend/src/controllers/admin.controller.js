import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Reseed database with India products
 * DELETE /api/admin/reseed-india
 * Protected: Admin only
 */
export const reseedIndiaProducts = async (req, res, next) => {
    try {
        console.log('🇮🇳 Starting database reseed with India products...');

        // Step 1: Delete existing products
        const deleteResult = await prisma.product.deleteMany({});
        console.log(`✅ Deleted ${deleteResult.count} products`);

        // Step 2: Seed India products
        const indiaProducts = [
            {
                name: 'Fresh Red Apples (Shimla)',
                description: 'Premium quality red apples from Himachal Pradesh. Crisp, sweet, and fresh.',
                category: 'Classic',
                defaultUnit: 'kg',
                featured: true,
                imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800',
                retailPrice: 150,
                wholesalePrice: 130,
                minQtyWholesale: 10,
                stock: 190,
                variants: {
                    create: [
                        { quantity: 500, unit: 'g', displayName: '500 g', retailPrice: 80, wholesalePrice: 70, minQtyWholesale: 10, stock: 50, sortOrder: 0, isDefault: false },
                        { quantity: 1, unit: 'kg', displayName: '1 kg', retailPrice: 150, wholesalePrice: 130, minQtyWholesale: 10, stock: 100, sortOrder: 1, isDefault: true },
                        { quantity: 2, unit: 'kg', displayName: '2 kg', retailPrice: 280, wholesalePrice: 250, minQtyWholesale: 5, stock: 40, sortOrder: 2, isDefault: false }
                    ]
                }
            },
            {
                name: 'Bananas (Robusta)',
                description: 'Fresh yellow robusta bananas, rich in potassium. Perfect for daily energy.',
                category: 'Tropical',
                defaultUnit: 'pcs',
                featured: true,
                imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800',
                retailPrice: 75,
                wholesalePrice: 65,
                minQtyWholesale: 15,
                stock: 350,
                variants: {
                    create: [
                        { quantity: 6, unit: 'pcs', displayName: '6 pcs', retailPrice: 40, wholesalePrice: 35, minQtyWholesale: 20, stock: 200, sortOrder: 0, isDefault: false },
                        { quantity: 12, unit: 'pcs', displayName: '12 pcs (1 dozen)', retailPrice: 75, wholesalePrice: 65, minQtyWholesale: 15, stock: 150, sortOrder: 1, isDefault: true }
                    ]
                }
            },
            {
                name: 'Nagpur Oranges',
                description: 'Juicy Nagpur oranges, packed with Vitamin C. Freshly harvested from Maharashtra.',
                category: 'Citrus',
                defaultUnit: 'kg',
                featured: true,
                imageUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800',
                retailPrice: 110,
                wholesalePrice: 95,
                minQtyWholesale: 10,
                stock: 260,
                variants: {
                    create: [
                        { quantity: 500, unit: 'g', displayName: '500 g', retailPrice: 60, wholesalePrice: 50, minQtyWholesale: 10, stock: 80, sortOrder: 0, isDefault: false },
                        { quantity: 1, unit: 'kg', displayName: '1 kg', retailPrice: 110, wholesalePrice: 95, minQtyWholesale: 10, stock: 120, sortOrder: 1, isDefault: true },
                        { quantity: 2, unit: 'kg', displayName: '2 kg', retailPrice: 200, wholesalePrice: 180, minQtyWholesale: 5, stock: 60, sortOrder: 2, isDefault: false }
                    ]
                }
            },
            {
                name: 'Cherries',
                description: 'Sweet dark cherries, perfect for snacking and baking. Rich in antioxidants.',
                category: 'Stone Fruits',
                defaultUnit: 'kg',
                featured: true,
                imageUrl: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=800',
                retailPrice: 450,
                wholesalePrice: 400,
                minQtyWholesale: 5,
                stock: 80,
                variants: {
                    create: [
                        { quantity: 250, unit: 'g', displayName: '250 g', retailPrice: 120, wholesalePrice: 105, minQtyWholesale: 10, stock: 50, sortOrder: 0, isDefault: false },
                        { quantity: 500, unit: 'g', displayName: '500 g', retailPrice: 230, wholesalePrice: 200, minQtyWholesale: 8, stock: 30, sortOrder: 1, isDefault: true }
                    ]
                }
            },
            {
                name: 'Alphonso Mangoes (Ratnagiri)',
                description: 'King of mangoes! Premium Alphonso mangoes from Ratnagiri. Sweet and aromatic.',
                category: 'Tropical',
                defaultUnit: 'pcs',
                featured: true,
                imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800',
                retailPrice: 280,
                wholesalePrice: 250,
                minQtyWholesale: 10,
                stock: 220,
                variants: {
                    create: [
                        { quantity: 1, unit: 'pcs', displayName: '1 pc', retailPrice: 50, wholesalePrice: 45, minQtyWholesale: 50, stock: 100, sortOrder: 0, isDefault: false },
                        { quantity: 6, unit: 'pcs', displayName: '6 pcs', retailPrice: 280, wholesalePrice: 250, minQtyWholesale: 10, stock: 80, sortOrder: 1, isDefault: true },
                        { quantity: 12, unit: 'pcs', displayName: '12 pcs (1 dozen)', retailPrice: 550, wholesalePrice: 500, minQtyWholesale: 5, stock: 40, sortOrder: 2, isDefault: false }
                    ]
                }
            },
            {
                name: 'Watermelon (Seedless)',
                description: 'Sweet and juicy seedless watermelon. Perfect for summer refreshment.',
                category: 'Melons',
                defaultUnit: 'pcs',
                featured: true,
                imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784578?w=800',
                retailPrice: 150,
                wholesalePrice: 130,
                minQtyWholesale: 10,
                stock: 30,
                variants: {
                    create: [
                        { quantity: 1, unit: 'pcs', displayName: '1 pc (~3-4 kg)', retailPrice: 150, wholesalePrice: 130, minQtyWholesale: 10, stock: 30, sortOrder: 0, isDefault: true }
                    ]
                }
            },
            {
                name: 'Green Grapes',
                description: 'Seedless green grapes, sweet and crisp. Perfect for snacking.',
                category: 'Classic',
                defaultUnit: 'kg',
                featured: false,
                imageUrl: 'https://images.unsplash.com/photo-1599819177401-d3b5a0f3a8c3?w=800',
                retailPrice: 95,
                wholesalePrice: 85,
                minQtyWholesale: 15,
                stock: 180,
                variants: {
                    create: [
                        { quantity: 250, unit: 'g', displayName: '250 g', retailPrice: 50, wholesalePrice: 45, minQtyWholesale: 20, stock: 60, sortOrder: 0, isDefault: false },
                        { quantity: 500, unit: 'g', displayName: '500 g', retailPrice: 95, wholesalePrice: 85, minQtyWholesale: 15, stock: 80, sortOrder: 1, isDefault: true },
                        { quantity: 1, unit: 'kg', displayName: '1 kg', retailPrice: 180, wholesalePrice: 160, minQtyWholesale: 10, stock: 40, sortOrder: 2, isDefault: false }
                    ]
                }
            },
            {
                name: 'Pomegranates (Anaar)',
                description: 'Fresh pomegranates from Maharashtra. Rich in antioxidants and sweet-tart flavor.',
                category: 'Classic',
                defaultUnit: 'pcs',
                featured: false,
                imageUrl: 'https://images.unsplash.com/photo-1571915374126-9c0e8c7df9e1?w=800',
                retailPrice: 70,
                wholesalePrice: 60,
                minQtyWholesale: 30,
                stock: 140,
                variants: {
                    create: [
                        { quantity: 1, unit: 'pcs', displayName: '1 pc', retailPrice: 70, wholesalePrice: 60, minQtyWholesale: 30, stock: 90, sortOrder: 0, isDefault: true },
                        { quantity: 4, unit: 'pcs', displayName: '4 pcs', retailPrice: 260, wholesalePrice: 230, minQtyWholesale: 10, stock: 50, sortOrder: 1, isDefault: false }
                    ]
                }
            }
        ];

        let createdCount = 0;
        for (const productData of indiaProducts) {
            await prisma.product.create({
                data: productData
            });
            createdCount++;
        }

        console.log(`✅ Created ${createdCount} India products with variants`);

        res.json({
            success: true,
            message: 'Database reseeded with India products successfully',
            stats: {
                deleted: deleteResult.count,
                created: createdCount
            }
        });
    } catch (error) {
        console.error('❌ Error reseeding database:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reseed database',
            error: error.message
        });
    }
};

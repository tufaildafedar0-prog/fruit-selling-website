/**
 * India-Specific Product Seed with Quantity Variants
 * 
 * Seeds products with multiple variants (500g, 1kg, 6pcs, etc.)
 * Following Zepto/BigBasket style for Indian market
 * 
 * Currency: ₹ INR only
 * Units: g, kg, pcs, dozen
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🇮🇳 Seeding India-specific products with variants...\n');

    // India-specific products with realistic Pune pricing
    const indiaProducts = [
        {
            name: 'Fresh Red Apples (Shimla)',
            description: 'Premium quality red apples from Himachal Pradesh. Crisp, sweet, and fresh.',
            category: 'Fruits',
            defaultUnit: 'kg',
            featured: true,
            imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800',
            variants: [
                {
                    quantity: 500,
                    unit: 'g',
                    displayName: '500 g',
                    retailPrice: 80,
                    wholesalePrice: 70,
                    minQtyWholesale: 10,
                    stock: 50,
                    sortOrder: 0,
                    isDefault: false
                },
                {
                    quantity: 1,
                    unit: 'kg',
                    displayName: '1 kg',
                    retailPrice: 150,
                    wholesalePrice: 130,
                    minQtyWholesale: 10,
                    stock: 100,
                    sortOrder: 1,
                    isDefault: true
                },
                {
                    quantity: 2,
                    unit: 'kg',
                    displayName: '2 kg',
                    retailPrice: 280,
                    wholesalePrice: 250,
                    minQtyWholesale: 5,
                    stock: 40,
                    sortOrder: 2,
                    isDefault: false
                }
            ]
        },
        {
            name: 'Bananas (Robusta)',
            description: 'Fresh yellow robusta bananas, rich in potassium. Perfect for daily energy.',
            category: 'Fruits',
            defaultUnit: 'pcs',
            featured: true,
            imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800',
            variants: [
                {
                    quantity: 6,
                    unit: 'pcs',
                    displayName: '6 pcs',
                    retailPrice: 40,
                    wholesalePrice: 35,
                    minQtyWholesale: 20,
                    stock: 200,
                    sortOrder: 0,
                    isDefault: false
                },
                {
                    quantity: 12,
                    unit: 'pcs',
                    displayName: '12 pcs (1 dozen)',
                    retailPrice: 75,
                    wholesalePrice: 65,
                    minQtyWholesale: 15,
                    stock: 150,
                    sortOrder: 1,
                    isDefault: true
                }
            ]
        },
        {
            name: 'Nagpur Oranges',
            description: 'Juicy Nagpur oranges, packed with Vitamin C. Freshly harvested from Maharashtra.',
            category: 'Citrus',
            defaultUnit: 'kg',
            featured: true,
            imageUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800',
            variants: [
                {
                    quantity: 500,
                    unit: 'g',
                    displayName: '500 g',
                    retailPrice: 60,
                    wholesalePrice: 50,
                    minQtyWholesale: 10,
                    stock: 80,
                    sortOrder: 0,
                    isDefault: false
                },
                {
                    quantity: 1,
                    unit: 'kg',
                    displayName: '1 kg',
                    retailPrice: 110,
                    wholesalePrice: 95,
                    minQtyWholesale: 10,
                    stock: 120,
                    sortOrder: 1,
                    isDefault: true
                },
                {
                    quantity: 2,
                    unit: 'kg',
                    displayName: '2 kg',
                    retailPrice: 200,
                    wholesalePrice: 180,
                    minQtyWholesale: 5,
                    stock: 60,
                    sortOrder: 2,
                    isDefault: false
                }
            ]
        },
        {
            name: 'Alphonso Mangoes (Ratnagiri)',
            description: 'King of mangoes! Premium Alphonso mangoes from Ratnagiri. Sweet and aromatic.',
            category: 'Seasonal',
            defaultUnit: 'pcs',
            featured: true,
            imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800',
            variants: [
                {
                    quantity: 1,
                    unit: 'pcs',
                    displayName: '1 pc',
                    retailPrice: 50,
                    wholesalePrice: 45,
                    minQtyWholesale: 50,
                    stock: 100,
                    sortOrder: 0,
                    isDefault: false
                },
                {
                    quantity: 6,
                    unit: 'pcs',
                    displayName: '6 pcs',
                    retailPrice: 280,
                    wholesalePrice: 250,
                    minQtyWholesale: 10,
                    stock: 80,
                    sortOrder: 1,
                    isDefault: true
                },
                {
                    quantity: 12,
                    unit: 'pcs',
                    displayName: '12 pcs (1 dozen)',
                    retailPrice: 550,
                    wholesalePrice: 500,
                    minQtyWholesale: 5,
                    stock: 40,
                    sortOrder: 2,
                    isDefault: false
                }
            ]
        },
        {
            name: 'Pomegranates (Anaar)',
            description: 'Fresh pomegranates from Maharashtra. Rich in antioxidants and sweet-tart flavor.',
            category: 'Fruits',
            defaultUnit: 'pcs',
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1571915374126-9c0e8c7df9e1?w=800',
            variants: [
                {
                    quantity: 1,
                    unit: 'pcs',
                    displayName: '1 pc',
                    retailPrice: 70,
                    wholesalePrice: 60,
                    minQtyWholesale: 30,
                    stock: 90,
                    sortOrder: 0,
                    isDefault: true
                },
                {
                    quantity: 4,
                    unit: 'pcs',
                    displayName: '4 pcs',
                    retailPrice: 260,
                    wholesalePrice: 230,
                    minQtyWholesale: 10,
                    stock: 50,
                    sortOrder: 1,
                    isDefault: false
                }
            ]
        },
        {
            name: 'Green Grapes',
            description: 'Seedless green grapes, sweet and crisp. Perfect for snacking.',
            category: 'Fruits',
            defaultUnit: 'kg',
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1599819177401-d3b5a0f3a8c3?w=800',
            variants: [
                {
                    quantity: 250,
                    unit: 'g',
                    displayName: '250 g',
                    retailPrice: 50,
                    wholesalePrice: 45,
                    minQtyWholesale: 20,
                    stock: 60,
                    sortOrder: 0,
                    isDefault: false
                },
                {
                    quantity: 500,
                    unit: 'g',
                    displayName: '500 g',
                    retailPrice: 95,
                    wholesalePrice: 85,
                    minQtyWholesale: 15,
                    stock: 80,
                    sortOrder: 1,
                    isDefault: true
                },
                {
                    quantity: 1,
                    unit: 'kg',
                    displayName: '1 kg',
                    retailPrice: 180,
                    wholesalePrice: 160,
                    minQtyWholesale: 10,
                    stock: 40,
                    sortOrder: 2,
                    isDefault: false
                }
            ]
        },
        {
            name: 'Papaya (Ripe)',
            description: 'Fresh ripe papaya, perfect for breakfast. Rich in vitamins and digestive enzymes.',
            category: 'Fruits',
            defaultUnit: 'pcs',
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=800',
            variants: [
                {
                    quantity: 1,
                    unit: 'pcs',
                    displayName: '1 pc (~500g)',
                    retailPrice: 40,
                    wholesalePrice: 35,
                    minQtyWholesale: 20,
                    stock: 70,
                    sortOrder: 0,
                    isDefault: true
                }
            ]
        },
        {
            name: 'Watermelon (Seedless)',
            description: 'Sweet and juicy seedless watermelon. Perfect for summer refreshment.',
            category: 'Fruits',
            defaultUnit: 'kg',
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784578?w=800',
            variants: [
                {
                    quantity: 1,
                    unit: 'pcs',
                    displayName: '1 pc (~3-4 kg)',
                    retailPrice: 150,
                    wholesalePrice: 130,
                    minQtyWholesale: 10,
                    stock: 30,
                    sortOrder: 0,
                    isDefault: true
                }
            ]
        }
    ];

    let createdCount = 0;

    for (const productData of indiaProducts) {
        const { variants, ...product } = productData;

        // Set legacy pricing from first variant for backward compatibility
        const defaultVariant = variants.find(v => v.isDefault) || variants[0];
        product.retailPrice = defaultVariant.retailPrice;
        product.wholesalePrice = defaultVariant.wholesalePrice;
        product.minQtyWholesale = defaultVariant.minQtyWholesale;
        product.stock = variants.reduce((sum, v) => sum + v.stock, 0);

        const createdProduct = await prisma.product.create({
            data: {
                ...product,
                variants: {
                    create: variants
                }
            },
            include: {
                variants: true
            }
        });

        console.log(`✅ Created "${createdProduct.name}" with ${createdProduct.variants.length} variant(s):`);
        createdProduct.variants.forEach(v => {
            console.log(`   - ${v.displayName}: ₹${v.retailPrice} (stock: ${v.stock})`);
        });
        createdCount++;
    }

    console.log(`\n✨ Successfully seeded ${createdCount} India-specific products with variants!\n`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding India products:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');


  // Create admin user with secure credentials
  const hashedPassword = await bcrypt.hash('FRT!2025$SecurePanel@92', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'fruitify.admin@secure.com' },
    update: {},
    create: {
      email: 'fruitify.admin@secure.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create default website settings
  const settings = await prisma.websiteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      siteName: 'Fruitify',
      tagline: 'Fresh Fruits Delivered to Your Door',
      contactEmail: 'contact@fruitify.com',
      footerText: '© 2025 Fruitify. All rights reserved. Delivering fresh, quality fruits to your doorstep.',
      maintenanceMode: false,
    },
  });
  console.log('✅ Website settings created');


  // Sample products with professional fruit data
  const products = [
    // Citrus
    {
      name: 'Fresh Oranges',
      description: 'Sweet and juicy navel oranges, packed with Vitamin C. Perfect for fresh juice or snacking.',
      retailPrice: 3.99,
      wholesalePrice: 2.50,
      minQtyWholesale: 20,
      imageUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800',
      category: 'Citrus',
      stock: 150,
      featured: true,
    },
    {
      name: 'Lemons',
      description: 'Bright yellow lemons with a tangy flavor. Essential for cooking, baking, and beverages.',
      retailPrice: 2.99,
      wholesalePrice: 1.75,
      minQtyWholesale: 25,
      imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800',
      category: 'Citrus',
      stock: 200,
      featured: false,
    },
    {
      name: 'Grapefruits',
      description: 'Ruby red grapefruits, sweet and slightly tart. Great for breakfast and salads.',
      retailPrice: 4.49,
      wholesalePrice: 2.99,
      minQtyWholesale: 15,
      imageUrl: 'https://images.unsplash.com/photo-1623066463831-4deed5d8a6d7?w=800',
      category: 'Citrus',
      stock: 100,
      featured: false,
    },

    // Berries
    {
      name: 'Strawberries',
      description: 'Premium red strawberries, handpicked for sweetness. Perfect for desserts and smoothies.',
      retailPrice: 5.99,
      wholesalePrice: 3.99,
      minQtyWholesale: 10,
      imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800',
      category: 'Berries',
      stock: 75,
      featured: true,
    },
    {
      name: 'Blueberries',
      description: 'Fresh blueberries bursting with antioxidants. Great for breakfast bowls and baking.',
      retailPrice: 6.99,
      wholesalePrice: 4.50,
      minQtyWholesale: 10,
      imageUrl: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800',
      category: 'Berries',
      stock: 60,
      featured: true,
    },
    {
      name: 'Raspberries',
      description: 'Delicate red raspberries with a sweet-tart flavor. Perfect for desserts and garnishes.',
      retailPrice: 7.99,
      wholesalePrice: 5.25,
      minQtyWholesale: 12,
      imageUrl: 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=800',
      category: 'Berries',
      stock: 50,
      featured: false,
    },

    // Tropical
    {
      name: 'Mangoes',
      description: 'Sweet and creamy mangoes from the tropics. Ideal for smoothies, salads, and eating fresh.',
      retailPrice: 4.99,
      wholesalePrice: 3.25,
      minQtyWholesale: 20,
      imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800',
      category: 'Tropical',
      stock: 120,
      featured: true,
    },
    {
      name: 'Pineapples',
      description: 'Golden ripe pineapples with tropical sweetness. Perfect for grilling and tropical dishes.',
      retailPrice: 5.49,
      wholesalePrice: 3.75,
      minQtyWholesale: 15,
      imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800',
      category: 'Tropical',
      stock: 80,
      featured: false,
    },
    {
      name: 'Bananas',
      description: 'Fresh yellow bananas, rich in potassium. Perfect for snacking and smoothies.',
      retailPrice: 2.49,
      wholesalePrice: 1.50,
      minQtyWholesale: 30,
      imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800',
      category: 'Tropical',
      stock: 250,
      featured: false,
    },

    // Stone Fruits
    {
      name: 'Peaches',
      description: 'Juicy summer peaches with a sweet aroma. Great for pies, jams, and fresh eating.',
      retailPrice: 4.49,
      wholesalePrice: 2.99,
      minQtyWholesale: 18,
      imageUrl: 'https://images.unsplash.com/photo-1629828874514-944937303da9?w=800',
      category: 'Stone Fruits',
      stock: 90,
      featured: false,
    },
    {
      name: 'Cherries',
      description: 'Sweet dark cherries, perfect for snacking and baking. Rich in antioxidants.',
      retailPrice: 8.99,
      wholesalePrice: 6.00,
      minQtyWholesale: 10,
      imageUrl: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=800',
      category: 'Stone Fruits',
      stock: 45,
      featured: true,
    },
    {
      name: 'Plums',
      description: 'Fresh plums with a sweet-tart taste. Excellent for eating fresh or making preserves.',
      retailPrice: 3.99,
      wholesalePrice: 2.50,
      minQtyWholesale: 20,
      imageUrl: 'https://images.unsplash.com/photo-1604849678370-2b0d37b97c49?w=800',
      category: 'Stone Fruits',
      stock: 70,
      featured: false,
    },

    // Other Popular Fruits
    {
      name: 'Apples',
      description: 'Crisp and sweet apples, perfect for snacking and baking. Fresh from the orchard.',
      retailPrice: 3.49,
      wholesalePrice: 2.25,
      minQtyWholesale: 25,
      imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800',
      category: 'Classic',
      stock: 200,
      featured: true,
    },
    {
      name: 'Grapes',
      description: 'Seedless green grapes, sweet and refreshing. Perfect for snacking and wine making.',
      retailPrice: 4.99,
      wholesalePrice: 3.25,
      minQtyWholesale: 15,
      imageUrl: 'https://images.unsplash.com/photo-1599819177401-d3b5a0f3a8c3?w=800',
      category: 'Classic',
      stock: 110,
      featured: false,
    },
    {
      name: 'Watermelon',
      description: 'Sweet and juicy watermelon, perfect for hot summer days. Hydrating and refreshing.',
      retailPrice: 6.99,
      wholesalePrice: 4.50,
      minQtyWholesale: 10,
      imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784578?w=800',
      category: 'Melons',
      stock: 60,
      featured: true,
    },
  ];

  console.log('🍎 Creating products...');
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }
  console.log(`✅ Created ${products.length} products`);

  console.log('✨ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
    try {
        console.log('🔧 Creating/Updating Admin User...\n');

        const adminEmail = 'fruitify.admin@secure.com';
        const adminPassword = 'FRT!2025$SecurePanel@92';
        const adminName = 'Admin';

        // Hash the password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Delete existing admin if exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            console.log('⚠️  Existing admin found. Updating password...');
            await prisma.user.update({
                where: { email: adminEmail },
                data: {
                    password: hashedPassword,
                    role: 'ADMIN',
                    name: adminName
                }
            });
            console.log('✅ Admin user updated successfully!\n');
        } else {
            console.log('➕ Creating new admin user...');
            await prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    name: adminName,
                    role: 'ADMIN'
                }
            });
            console.log('✅ Admin user created successfully!\n');
        }

        console.log('📧 Admin Login Credentials:');
        console.log('   Email:', adminEmail);
        console.log('   Password:', adminPassword);
        console.log('\n🎉 You can now login to the admin panel!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();

#!/usr/bin/env node

/**
 * Railway startup script
 * Automatically handles database setup and seeding on first deployment
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runCommand(command, description) {
    console.log(`\n🔄 ${description}...`);
    try {
        const { stdout, stderr } = await execAsync(command);
        if (stdout) console.log(stdout);
        if (stderr && !stderr.includes('warning')) console.error(stderr);
        console.log(`✅ ${description} completed`);
        return true;
    } catch (error) {
        console.error(`❌ ${description} failed:`, error.message);
        return false;
    }
}

async function startup() {
    console.log('🚀 Railway Startup Script - Fruitify Backend\n');

    // Step 1: Generate Prisma Client
    await runCommand('npx prisma generate', 'Generating Prisma Client');

    // Step 2: Push database schema (creates tables if they don't exist)
    const dbPushSuccess = await runCommand(
        'npx prisma db push --accept-data-loss --skip-generate',
        'Setting up database schema'
    );

    // Step 3: Check if database already has data (skip seed if data exists)
    if (dbPushSuccess) {
        console.log('\n🔍 Checking if database needs seeding...');
        try {
            const { execSync } = await import('child_process');
            const result = execSync('npx prisma db execute --stdin', {
                input: 'SELECT COUNT(*) FROM "Product";',
                encoding: 'utf8'
            });

            const hasProducts = result && !result.includes('0');

            if (hasProducts) {
                console.log('✅ Database already has products - skipping seed');
            } else {
                console.log('📦 Empty database detected - running seed...');
                await runCommand('npx prisma db seed', 'Seeding database with initial data');
            }
        } catch (error) {
            console.log('⚠️  Could not check product count, skipping seed to be safe');
            console.log('   (Run seed manually if needed: npx prisma db seed)');
        }
    }

    // Step 4: Start the server
    console.log('\n🌟 Starting Fruitify Backend Server...\n');
    exec('node src/server.js', (error, stdout, stderr) => {
        if (stdout) process.stdout.write(stdout);
        if (stderr) process.stderr.write(stderr);
        if (error) {
            console.error('❌ Server error:', error);
            process.exit(1);
        }
    });
}

startup();

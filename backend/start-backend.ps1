# Fruitify Backend - Quick Start Script

# IMPORTANT: Before running the backend, you need to:
# 1. Have MySQL installed and running on port 3306
# 2. Create a database named 'fruitify' or update the DATABASE_URL below

# Create .env file
@"
DATABASE_URL=mysql://root:password@localhost:3306/fruitify
PORT=5000
NODE_ENV=development
JWT_SECRET=fruitify-super-secret-jwt-key-2024-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=fruitify-refresh-secret-key-2024
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=http://localhost:5174
"@ | Out-File -FilePath ".env" -Encoding UTF8

Write-Host "✅ Created .env file" -ForegroundColor Green
Write-Host "⚠️  IMPORTANT: Update DATABASE_URL in .env with your MySQL credentials!" -ForegroundColor Yellow
Write-Host ""

# Generate Prisma Client
Write-Host "📦 Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

# Run migrations
Write-Host "🔄 Running database migrations..." -ForegroundColor Cyan
npx prisma migrate dev --name init

# Seed database
Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Cyan
npx prisma db seed

# Start server
Write-Host "🚀 Starting backend server..." -ForegroundColor Green
npm run dev

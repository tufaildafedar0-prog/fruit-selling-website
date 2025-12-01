# Fruitify - Quick Start Script
# This script will help you set up the entire Fruitify application

Write-Host "🍎 Fruitify E-Commerce Platform Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Check if MySQL is running
Write-Host "📋 Step 1: Checking prerequisites..." -ForegroundColor Cyan
$mysqlRunning = Get-Process mysql* -ErrorAction SilentlyContinue
if (!$mysqlRunning) {
    Write-Host "⚠️  Warning: MySQL doesn't appear to be running." -ForegroundColor Yellow
    Write-Host "   Please start MySQL before continuing." -ForegroundColor Yellow
    Write-Host ""
}

# Backend Setup
Write-Host "📋 Step 2: Setting up Backend..." -ForegroundColor Cyan
Write-Host ""

Set-Location ".\backend"

# Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "   Creating .env file from template..."
    Copy-Item ".env.template" ".env"
    Write-Host "   ✅ Created .env file" -ForegroundColor Green
    Write-Host ""
    Write-Host "   ⚠️  IMPORTANT: Edit backend/.env and update your MySQL password!" -ForegroundColor Yellow
    Write-Host "   DATABASE_URL='mysql://root:YOUR_PASSWORD@localhost:3306/fruitify'" -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "   Have you updated the .env file with your MySQL password? (y/n)"
    if ($response -ne 'y') {
        Write-Host "   Please update the .env file and run this script again." -ForegroundColor Red
        exit
    }
}

# Install backend dependencies
Write-Host "   Installing backend dependencies..."
npm install

# Generate Prisma Client
Write-Host "   Generating Prisma Client..."
npx prisma generate

# Check if database exists
Write-Host ""
Write-Host "   📋 Make sure you have created the 'fruitify' database in MySQL:" -ForegroundColor Cyan
Write-Host "   CREATE DATABASE fruitify;" -ForegroundColor White
$response = Read-Host "   Have you created the database? (y/n)"
if ($response -ne 'y') {
    Write-Host "   Please create the database and run this script again." -ForegroundColor Red
    exit
}

# Run migrations
Write-Host "   Running database migrations..."
npx prisma migrate dev --name init

# Seed database
Write-Host "   Seeding database with sample data..."
npx prisma db seed

Write-Host "   ✅ Backend setup complete!" -ForegroundColor Green
Write-Host ""

# Frontend Setup  
Set-Location "../frontend"
Write-Host "📋 Step 3: Setting up Frontend..." -ForegroundColor Cyan
Write-Host ""

# Install frontend dependencies
Write-Host "   Installing frontend dependencies..."
npm install

Write-Host "   ✅ Frontend setup complete!" - ForegroundColor Green
Write-Host ""

# Final instructions
Write-Host "=====================================" -ForegroundColor Green
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then open: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default Admin Login:" -ForegroundColor Cyan
Write-Host "  Email: admin@fruitify.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Happy selling! 🍎🍊🍓" -ForegroundColor Green

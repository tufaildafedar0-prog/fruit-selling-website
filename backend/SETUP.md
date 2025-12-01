# 🚀 Fruitify Backend - Complete Setup Guide

## Prerequisites

Before starting, ensure you have:
- ✅ Node.js 18+ installed
- ✅ MySQL 8.0+ installed and running
- ✅ MySQL running on port 3306

## Quick Setup (5 Minutes)

### Step 1: Configure Database

1. **Create the MySQL database:**
   ```sql
   CREATE DATABASE fruitify;
   ```

2. **Create .env file** in the `backend` folder:
   ```bash
   cd d:\Fruits\fruitify\backend
   copy .env.template .env
   ```

3. **Edit .env file** and update your MySQL credentials:
   ```env
   DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/fruitify"
   ```
   Replace `YOUR_PASSWORD` with your MySQL root password.

### Step 2: Install Dependencies & Initialize Database

Open PowerShell in the backend folder and run:

```powershell
# Navigate to backend
cd d:\Fruits\fruitify\backend

# Install dependencies (if not already done)
npm install

# Generate Prisma Client
npx prisma generate

# Run database migrations (creates tables)
npx prisma migrate dev --name init

# Seed database with sample data (15 products + admin user)
npx prisma db seed

# Start the backend server
npm run dev
```

### Step 3: Verify Backend is Running

You should see:
```
✅ Database connected successfully
🚀 Fruitify Backend Server running on port 5000
📍 Environment: development
🌐 CORS enabled for: http://localhost:5174
```

The backend API is now live at: **http://localhost:5000/api**

## 📊 Sample Data Included

After seeding, you'll have:
- **15 Products** across 6 categories (Citrus, Berries, Tropical, Stone Fruits, Classic, Melons)
- **1 Admin User:**
  - Email: `admin@fruitify.com`
  - Password: `admin123`

## 🔧 Troubleshooting

### Issue: Port 5000 already in use

**Solution:** Kill the process using port 5000:
```powershell
# Find and kill process on port 5000
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($process) {
    Stop-Process -Id $process.OwningProcess -Force
    Write-Host "✅ Killed process on port 5000"
}
```

Then restart the server: `npm run dev`

### Issue: Prisma Client generation error

**Solution:** Close all terminals and VS Code, then reopen and try again:
```powershell
npx prisma generate
```

### Issue: Database connection failed

**Solutions:**
1. Verify MySQL is running: Open MySQL Workbench or run `mysql -u root -p`
2. Check DATABASE_URL in .env file has correct credentials
3. Ensure the `fruitify` database exists: `CREATE DATABASE fruitify;`

### Issue: Seed command not found

**Solution:** Make sure package.json has the prisma.seed configuration:
```json
"prisma": {
  "seed": "node prisma/seed.js"
}
```

## 🌐 API Endpoints

Once running, test the API:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all products
curl http://localhost:5000/api/products

# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fruitify.com","password":"admin123"}'
```

## 📝 Environment Variables

All environment variables are in `.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://root:password@localhost:3306/fruitify` |
| `PORT` | Backend server port | `5000` |
| `JWT_SECRET` | Secret key for JWT tokens | Change in production! |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5174` |

## 🚀 Production Deployment

For production deployment:

1. Update `.env` with production values
2. Change `JWT_SECRET` to a secure random string
3. Use a hosted MySQL database (PlanetScale, Railway, etc.)
4. Run: `npm start` instead of `npm run dev`

## 📚 Database Schema

View your database schema:
```powershell
npx prisma studio
```

This opens a web interface at `http://localhost:5555` to browse and edit your database.

## ✅ Success Checklist

- [ ] MySQL is installed and running
- [ ] Created `fruitify` database
- [ ] Created and configured `.env` file
- [ ] Ran `npm install`
- [ ] Ran `npx prisma generate`
- [ ] Ran `npx prisma migrate dev`
- [ ] Ran `npx prisma db seed`
- [ ] `npm run dev` shows server running on port 5000
- [ ] Can access http://localhost:5000/api/health

---

**Need Help?** Check the main README.md or review the API documentation in the backend README.md file.

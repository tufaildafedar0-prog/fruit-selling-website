# 🍎 Fruitify - Distribution Package

Complete production-ready e-commerce platform for selling fruits with retail and wholesale pricing.

## 📦 Package Contents

```
fruitify/
├── backend/          Backend API (Node.js + Express + MySQL + Prisma)
├── frontend/         Frontend App (React + Vite + TailwindCSS + Framer Motion)
└── README.md         This file
```

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- MySQL 8.0+ ([Download](https://dev.mysql.com/downloads/))
- Git (optional, for cloning)

### Installation (10 Minutes)

#### 1. Backend Setup

```powershell
# Navigate to backend
cd d:\Fruits\fruitify\backend

# Install dependencies
npm install

# Create .env file
copy .env.template .env

# Edit .env and set your MySQL password
# DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/fruitify"

# Create MySQL database
# Run in MySQL: CREATE DATABASE fruitify;

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample data
npx prisma db seed

# Start backend server
npm run dev
```

Backend will run on: **http://localhost:5000**

#### 2. Frontend Setup

Open a **new terminal**:

```powershell
# Navigate to frontend
cd d:\Fruits\fruitify\frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:5173** or **http://localhost:5174**

#### 3. Access the Application

Open your browser and go to:
- **Frontend:** http://localhost:5173 (or 5174)
- **Backend API:** http://localhost:5000/api

**Default Admin Login:**
- Email: `admin@fruitify.com`
- Password: `admin123`

## ✨ Features

### Customer Features
- 🛍️ Browse retail and wholesale products
- 🔍 Advanced search and filtering
- 🛒 Shopping cart with localStorage persistence
- 💳 Checkout process (demo payment)
- 📦 Order tracking
- 📱 Fully responsive design

### Admin Features
- 📊 Product management (CRUD)
- 💰 Dual pricing (retail + wholesale)
- 📦 Inventory management
- ⭐ Featured products
- 🏷️ Category management

### Design Features
- 🎨 v0.dev-style premium UI
- ✨ Smooth Framer Motion animations
- 🌈 Modern glassmorphism effects
- 📱 Mobile-first responsive design
- 🎯 Professional typography

## 📚 Documentation

- **Backend Setup:** `backend/SETUP.md`
- **Backend API:** `backend/README.md`
- **Frontend Guide:** `frontend/README.md`
- **Main Documentation:** `README.md`

## 🔧 Troubleshooting

### Port Already in Use

If port 5000 or 5173 is in use:

```powershell
# Kill process on port 5000 (backend)
Get-NetTCPConnection -Local Port 5000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Kill process on port 5173 (frontend)
Get-NetTCPConnection -LocalPort 5173 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Database Connection Issues

1. Verify MySQL is running
2. Check `.env` file has correct credentials
3. Ensure `fruitify` database exists

### Prisma Generation Errors

Close all terminals and VS Code, then reopen and run:
```powershell
npx prisma generate
```

## 🌐 Tech Stack

**Backend:**
- Node.js + Express
- Prisma ORM
- MySQL
- JWT Authentication
- bcrypt for password hashing

**Frontend:**
- React 18
- Vite (build tool)
- TailwindCSS
- Framer Motion
- Axios
- React Router v6

## 📊 Sample Data

After seeding, the database includes:
- 15 fruit products (Citrus, Berries, Tropical, etc.)
- 1 admin user account
- Multiple categories

## 🚢 Deployment

### Backend (Render/Railway)
1. Create MySQL database on hosting provider
2. Set environment variables
3. Deploy from GitHub
4. Run migrations and seed

### Frontend (Vercel)
1. Connect GitHub repository
2. Set `VITE_API_URL` environment variable
3. Deploy

## 📝 Project Structure

### Backend
```
backend/
├── prisma/
│   ├── schema.prisma    Database models
│   └── seed.js          Sample data
├── src/
│   ├── controllers/     Business logic
│   ├── middleware/      Auth & validation
│   ├── routes/          API endpoints
│   └── server.js        Express app
└── package.json
```

### Frontend
```
frontend/
├── src/
│   ├── components/      Reusable UI components
│   ├── pages/           Page components (10 pages)
│   ├── context/         State management
│   ├── utils/           Helper functions
│   └── App.jsx          Main app
└── package.json
```

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- SQL injection prevention (Prisma)
- CORS configuration

## 📱 Pages Included

1. **Home** - Hero, featured products, testimonials
2. **Retail** - Product grid with filters
3. **Wholesale** - Bulk orders with minimum quantities
4. **Product Details** - Detailed product view
5. **Cart** - Shopping cart management
6. **Checkout** - Order placement
7. **Payment Success** - Order confirmation
8. **Contact** - Contact form + WhatsApp
9. **Login** - Authentication
10. **Admin Dashboard** - Product CRUD

## 🎯 Default Credentials

**Admin Account:**
- Email: admin@fruitify.com
- Password: admin123

⚠️ **Change these in production!**

## 📞 Support

For issues or questions:
1. Check the troubleshooting sections in:
   - `backend/SETUP.md`
   - `frontend/README.md`
2. Review the main `README.md`
3. Check database with `npx prisma studio`

## 📄 License

MIT License - Feel free to use for personal or commercial projects.

---

**Built with ❤️ for fresh fruit lovers! 🍎🍊🍓🥭🍇**

Enjoy your Fruitify e-commerce platform!

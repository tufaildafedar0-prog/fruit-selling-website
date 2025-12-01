# Fruitify Backend API

Premium backend API for Fruitify E-Commerce Platform built with Node.js, Express, Prisma, and MySQL.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MySQL 8.0+ installed and running
- npm or yarn package manager

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
# Copy the example env file
copy .env.example .env

# Edit .env and update the following:
# DATABASE_URL="mysql://username:password@localhost:3306/fruitify"
# JWT_SECRET=your-secret-key
```

3. **Set up the database:**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with sample data
npm run seed
```

4. **Start the server:**
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Products

#### Get All Products
```http
GET /api/products?page=1&limit=12&category=Citrus&search=orange&featured=true
```

Query Parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `category` - Filter by category
- `search` - Search in name and description
- `featured` - Filter featured products
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sortBy` - Sort field (default: createdAt)
- `order` - Sort order: asc/desc (default: desc)

#### Get Single Product
```http
GET /api/products/:id
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "name": "Fresh Oranges",
  "description": "Sweet and juicy",
  "retailPrice": 3.99,
  "wholesalePrice": 2.50,
  "minQtyWholesale": 20,
  "imageUrl": "https://example.com/image.jpg",
  "category": "Citrus",
  "stock": 100,
  "featured": true
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "retailPrice": 4.99,
  "stock": 150
}
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Bearer {admin-token}
```

#### Get Categories
```http
GET /api/products/categories
```

### Orders

#### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "quantity": 5,
      "orderType": "RETAIL"
    },
    {
      "productId": 2,
      "quantity": 25,
      "orderType": "WHOLESALE"
    }
  ],
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "shippingAddress": "123 Main St",
  "shippingCity": "New York",
  "shippingZip": "10001"
}
```

#### Get All Orders (Authenticated)
```http
GET /api/orders?page=1&limit=10&status=PENDING
Authorization: Bearer {token}
```

#### Get Order Details
```http
GET /api/orders/:id
Authorization: Bearer {token}
```

#### Update Order Status (Admin Only)
```http
PATCH /api/orders/:id/status
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "status": "SHIPPED"
}
```

Order statuses: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`

## 🔐 Default Admin Credentials

After running the seed script, use these credentials to access admin features:

- **Email:** admin@fruitify.com
- **Password:** admin123

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js             # Database seeding
├── src/
│   ├── config/
│   │   └── database.js     # Prisma client configuration
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   └── order.controller.js
│   ├── middleware/
│   │   ├── auth.js         # JWT authentication
│   │   ├── errorHandler.js # Error handling
│   │   └── validation.js   # Input validation
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   └── order.routes.js
│   └── server.js           # Express app entry point
├── .env.example
├── .gitignore
└── package.json
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run seed         # Seed database with sample data
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate   # Run database migrations
```

## 🌟 Features

- ✅ JWT Authentication & Authorization
- ✅ Role-based access control (Admin/Customer)
- ✅ Retail & Wholesale pricing system
- ✅ Product management with CRUD operations
- ✅ Advanced filtering, search, and pagination
- ✅ Order management with stock tracking
- ✅ Input validation with express-validator
- ✅ Comprehensive error handling
- ✅ Database migrations with Prisma
- ✅ Transaction support for order creation

## 📝 License

MIT

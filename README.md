# 🍎 Fruitify - Premium Fruit E-Commerce Platform

A complete, production-ready full-stack e-commerce platform for fresh fruit delivery with retail and wholesale pricing options. Built with modern technologies and premium UI/UX design.

![Fruitify](https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=1200&h=400&fit=crop)

## ✨ Features

### 🇮🇳 India-First Features (NEW!)
- **₹ INR Currency** - Complete Indian Rupee pricing with proper number formatting (₹1,250)
- **Zepto/BigBasket Style Variants** - Product quantity & unit options (500g, 1kg, 6 pcs, dozen)
- **Performance Optimized** - 8-15s cold start, 1-3s warm (free tier optimized)
- **GST Display** - Proper 5% GST calculation and display
- **Variant Management** - Admin can create unlimited variants with individual pricing & stock
- **Consistent Display** - "Product - Quantity Unit - ₹Price" format everywhere
- **Warmup Endpoint** - `/api/warmup` for external ping services to prevent cold starts
- **Response Compression** - 70% smaller payloads with gzip

### 🛍️ Customer Features
- **Razorpay Payment Gateway** - Secure online payments (Cards, UPI, Net Banking, Wallets)
- **Dual Pricing System** - Retail and wholesale options with variant support
- **User Authentication** - Email verification, password reset, profile management
- **My Orders** - Track order status with real-time updates
- **Smart Product Search** - Advanced filtering and pagination
- **Shopping Cart** - Persistent cart with localStorage & variant selection
- **Secure Checkout** - Order placement with payment integration (₹ INR)
- **Order Tracking** - Real-time order status updates via WebSockets
- **Email Notifications** - Order confirmations and status updates
- **Contact Support** - WhatsApp integration + contact form

### 👨‍💼 Admin Features
- **Admin Dashboard** - Real-time statistics and analytics (₹ INR)
- **Variant Management** - Create/edit unlimited product variants (Zepto-style)
- **Product Management** - Full CRUD operations with variant support
- **Order Management** - View, update order status, payment tracking (₹ INR)
- **User Management** - View and manage customer accounts
- **Payment Tracking** - Razorpay payment status and transaction IDs
- **Inventory Control** - Stock management per variant with alerts
- **Price Management** - Separate retail/wholesale pricing per variant (₹ INR)
- **Category Management** - Organize products
- **Featured Products** - Highlight special items
- **Settings Management** - Configure site settings
- **Real-time Notifications** - Socket.io + Telegram integration

### 🎨 Design Excellence
- **v0.dev-style UI** - Premium, modern interface
- **Framer Motion** - Smooth animations throughout
- **Glassmorphism** - Transparent, blurred effects
- **Responsive Design** - Mobile-first approach
- **Premium Typography** - Google Fonts (Inter + Outfit)
- **Custom Color Palette** - Fresh fruit-inspired colors

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express** - RESTful API server
- **Prisma ORM** - Type-safe database client with variant support
- **MySQL** - Relational database
- **JWT** - Secure authentication
- **bcrypt** - Password hashing
- **compression** - Response compression (70% smaller payloads)
- **Razorpay SDK** - Payment gateway integration (India-first)
- **Socket.io** - Real-time order updates
- **Nodemailer** - Email notifications
- **Telegram Bot API** - Admin notifications

### Frontend
- **React** 18 - UI library
- **Vite** - Lightning-fast build tool
- **TailwindCSS** 3 - Utility-first CSS
- **Framer Motion** - Animation library
- **React Router** v6 - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### India-Specific Optimizations
- **HTTP Keep-Alive** - Persistent connections for free tier
- **Response Caching** - 2-minute cache on product endpoints
- **Warmup Endpoint** - `/api/warmup` for external monitoring
- **₹ INR Formatting** - `formatINR()` utility with Indian number format
- **Product Display Utility** - Consistent "Product - Unit - ₹Price" formatting

## 📁 Project Structure

```
fruitify/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database models
│   │   └── seed.js             # Sample data
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js     # Prisma client
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js
│   │   │   └── order.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT middleware
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── product.routes.js
│   │   │   └── order.routes.js
│   │   └── server.js           # Express app
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/         # Reusable UI components
    │   ├── pages/             # Page components
    │   ├── context/           # React Context providers
    │   ├── utils/             # Helper functions
    │   ├── App.jsx            # Main app with routing
    │   ├── main.jsx           # Entry point
    │   └── index.css          # Global styles
    ├── index.html
    ├── tailwind.config.js
    └── package.json
```

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="mysql://root:password@localhost:3306/fruitify"
# JWT_SECRET=your-secret-key

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file (optional, default proxy is configured)
copy .env.example .env

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔑 Default Credentials

**Admin Account:**
- Email: `admin@fruitify.com`
- Password: `admin123`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)

#### Products
- `GET /products` - Get all products (with filters)
- `GET /products/:id` - Get single product
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)
- `GET /products/categories` - Get all categories

#### Orders
- `POST /orders` - Create order
- `GET /orders` - Get orders (authenticated)
- `GET /orders/:id` - Get order details
- `PATCH /orders/:id/status` - Update order status (admin)

#### Payments (Razorpay)
- `POST /payments/create-order` - Create Razorpay payment order
- `POST /payments/verify` - Verify payment signature
- `POST /payments/failure` - Handle payment failure
- `GET /payments/status/:id` - Get payment status

#### Admin
- `GET /admin/dashboard` - Dashboard statistics
- `GET /admin/orders` - Manage all orders
- `GET /admin/users` - Manage users
- `GET /admin/settings` - Site settings

## 🎨 Design System

### Colors
```css
Primary (Green):   #22c55e - Fresh, natural
Secondary (Orange): #f97316 - Energetic, appetizing
Accent (Yellow):    #eab308 - Bright, attention-grabbing
```

### Typography
- **Headings:** Outfit (Bold, 700-900)
- **Body:** Inter (Regular, 400-600)

### Shadows
- `shadow-premium` - Standard card elevation
- `shadow-premium-lg` - Enhanced depth
- `shadow-glow` - Subtle green glow

## 🌐 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, featured products, testimonials |
| Retail Shop | `/retail` | Product grid with filters |
| Wholesale | `/wholesale` | Bulk order products |
| Product Details | `/product/:id` | Detailed product view |
| Cart | `/cart` | Shopping cart management |
| Checkout | `/checkout` | Order placement form |
| Success | `/payment-success` | Order confirmation |
| Contact | `/contact` | Contact form + WhatsApp |
| Login | `/login` | Authentication |
| Admin | `/admin` | Product CRUD (protected) |

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- SQL injection prevention (Prisma)
- XSS protection

## 🚢 Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Create new Web Service
3. Set environment variables
4. Deploy!

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set `VITE_API_URL` environment variable
4. Deploy!

### Database (PlanetScale/Railway)
1. Create MySQL database
2. Update `DATABASE_URL` in backend
3. Run migrations

## 📊 Database Schema

### Models
- **User** - Authentication and roles (customer/admin)
- **Product** - Fruit products with dual pricing and defaultUnit
- **ProductVariant** - Product variants (500g, 1kg, 6 pcs, etc.) with individual pricing & stock
- **Order** - Customer orders with payment tracking
- **OrderItem** - Order line items with variant selection
- **Settings** - Site configuration

### Key Relationships
- Product `1:N` ProductVariant (One product has many variants)
- Order `1:N` OrderItem (One order has many items)
- OrderItem `N:1` Product (Many items reference one product)
- OrderItem `N:1` ProductVariant (Many items reference one variant)

### India-First Schema Features
- **defaultUnit** - Product's default measurement unit (kg, g, pcs, dozen, etc.)
- **displayName** - Auto-generated variant display ("500 g", "1 kg")
- **retailPrice/wholesalePrice** - Per-variant pricing in ₹ INR
- **stock** - Individual stock tracking per variant
- **sortOrder** - Display order for variants
- **isDefault** - Default variant selection

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Fruitify Team**

## 🙏 Acknowledgments

- Design inspiration from [v0.dev](https://v0.dev)
- Icons from [Lucide](https://lucide.dev)
- Images from [Unsplash](https://unsplash.com)
- Fonts from [Google Fonts](https://fonts.google.com)

---

Built with ❤️ for fresh fruit lovers everywhere! 🍎🍊🍇🥭🍓

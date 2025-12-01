# Fruitify Frontend

Premium React-based frontend for Fruitify E-Commerce Platform built with Vite, TailwindCSS, and Framer Motion.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Backend API running on port 5000

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
# Copy the example env file
copy .env.example .env

# The default configuration should work if backend is running on port 5000
```

3. **Start development server:**
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Premium navbar with glass effect
│   │   ├── Footer.jsx              # Multi-column footer
│   │   ├── ProductCard.jsx         # Animated product cards
│   │   ├── Hero.jsx                # Landing page hero
│   │   ├── LoadingSpinner.jsx      # Loading state
│   │   └── ProtectedRoute.jsx      # Route protection
│   ├── pages/
│   │   ├── Home.jsx                # Landing page
│   │   ├── Retail.jsx              # Retail shop with filters
│   │   ├── Wholesale.jsx           # Wholesale shop
│   │   ├── ProductDetails.jsx      # Product detail view
│   │   ├── Cart.jsx                # Shopping cart
│   │   ├── Checkout.jsx            # Checkout process
│   │   ├── PaymentSuccess.jsx      # Order confirmation
│   │   ├── Contact.jsx             # Contact form
│   │   ├── Login.jsx               # Authentication
│   │   └── AdminDashboard.jsx      # Admin CRUD panel
│   ├── context/
│   │   ├── AuthContext.jsx         # Authentication state
│   │   └── CartContext.jsx         # Cart management
│   ├── utils/
│   │   └── api.js                  # Axios API client
│   ├── App.jsx                     # Main app with routing
│   ├── main.jsx                    # Entry point
│   └── index.css                   # TailwindCSS + custom styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🎨 Design Features

### Premium UI Components
- **Glassmorphism effects** - Transparent, blurred backgrounds
- **Smooth animations** - Framer Motion for all transitions
- **Gradient backgrounds** - Modern color combinations
- **Custom shadows** - Professional depth and elevation
- **Responsive design** - Mobile-first approach

### Color Palette
- **Primary (Green):** Fresh, natural fruit colors
- **Secondary (Orange):** Energetic, appetizing accents
- **Accent (Yellow):** Bright, attention-grabbing highlights

### Typography
- **Display Font:** Outfit - For headlines and branding
- **Body Font:** Inter - For readable content

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📱 Pages

### Public Pages
1. **Home (/)** - Hero section, featured products, testimonials, CTA
2. **Retail (/retail)** - Product grid with search, filters, pagination
3. **Wholesale (/wholesale)** - Bulk order products with minimum quantities
4. **Product Details (/product/:id)** - Detailed view with retail/wholesale toggle
5. **Cart (/cart)** - Shopping cart with quantity management
6. **Checkout (/checkout)** - Customer info and order placement
7. **Payment Success (/payment-success)** - Order confirmation with confetti
8. **Contact (/contact)** - Contact form with WhatsApp integration
9. **Login (/login)** - Authentication page

### Protected Pages
- **Admin Dashboard (/admin)** - Full product CRUD management (Admin only)

## 🔐 Authentication

The app uses JWT-based authentication. Login credentials are stored in localStorage.

**Demo Admin Credentials:**
- Email: admin@fruitify.com
- Password: admin123

## 🛒 Shopping Features

### Cart Management
- Add/remove items
- Update quantities
- Separate retail and wholesale items
- Persistent cart (localStorage)
- Real-time total calculation

### Order Types
- **Retail:** Single unit purchases at retail price
- **Wholesale:** Bulk orders with minimum quantities at discounted prices

## 🎯 Key Features

✅ **Premium Design** - v0.dev-style modern UI
✅ **Smooth Animations** - Framer Motion throughout
✅ **State Management** - React Context API
✅ **Form Validation** - Client-side validation
✅ **Error Handling** - Toast notifications
✅ **Responsive** - Works on all devices
✅ **Performance** - Optimized with Vite
✅ **Accessibility** - Semantic HTML
✅ **SEO Ready** - Meta tags included

## 🔌 API Integration

The frontend connects to the backend API using Axios with:
- Request/response interceptors
- Automatic JWT token injection
- Error handling and retries
- API base URL configuration

## 🚢 Deployment

### Build for production:
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy to Vercel (Recommended):
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `VITE_API_URL=your-backend-url`
4. Deploy!

### Environment Variables for Production:
```
VITE_API_URL=https://your-backend-api.com/api
```

## 📝 License

MIT

---

Built with ❤️ using React, Vite, TailwindCSS, and Framer Motion

import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression'; // NEW: Response compression for faster transfers
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import adminRoutes from './routes/admin.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import paymentRoutes from './routes/payment.routes.js'; // ADDED: Payment routes for Razorpay
import { errorHandler } from './middleware/errorHandler.js';
import socketService from './services/socket.service.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
// CORS - Allow multiple frontend origins
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'https://tufaildafedar0-prog.github.io',
    'https://fruit-selling-website-zeta.vercel.app'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // Allow specific origins or any Vercel deployment
        const isAllowed = allowedOrigins.some(allowed => origin.startsWith(allowed)) ||
            origin.endsWith('.vercel.app');  // Allow all Vercel preview deployments

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// NEW: Enable gzip compression for all responses (reduces transfer size)
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// NEW: Set keep-alive headers to maintain connections (helps prevent cold starts)
app.use((req, res, next) => {
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Keep-Alive', 'timeout=120');
    next();
});

// NEW: Warmup endpoint for external ping services (prevents cold starts on free tier)
app.get('/api/warmup', (req, res) => {
    res.json({
        status: 'warm',
        timestamp: new Date().toISOString(),
        message: 'Backend is awake and ready'
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Fruitify API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', settingsRoutes);
app.use('/api/payments', paymentRoutes); // ADDED: Payment routes for Razorpay

// Diagnostic test routes (admin only)
import testRoutes from './routes/test.routes.js';
app.use('/api/test', testRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Initialize Socket.io
socketService.initialize(httpServer);

// Start server
httpServer.listen(PORT, () => {
    console.log(`🚀 Fruitify Backend Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;


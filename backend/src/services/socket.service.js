import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

/**
 * Socket.io Service for Real-Time Order Tracking
 * Handles WebSocket connections, authentication, and room-based broadcasting
 */
class SocketService {
    constructor() {
        this.io = null;
        this.connectedUsers = new Map(); // userId -> socketId mapping
    }

    /**
     * Initialize Socket.io server
     * @param {http.Server} httpServer - Express HTTP server
     */
    initialize(httpServer) {
        // Allow multiple origins for CORS
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'http://localhost:5173',
            'https://tufaildafedar0-prog.github.io'
        ].filter(Boolean); // Remove undefined values

        this.io = new Server(httpServer, {
            cors: {
                origin: (origin, callback) => {
                    // Allow requests with no origin (like mobile apps or curl)
                    if (!origin) return callback(null, true);

                    // Check if origin is in allowed list or matches GitHub Pages
                    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
                        callback(null, true);
                    } else {
                        callback(new Error('Not allowed by CORS'));
                    }
                },
                credentials: true,
            },
            pingTimeout: 60000,
            pingInterval: 25000,
        });

        // Authentication middleware
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token;

                if (!token) {
                    return next(new Error('Authentication error: No token provided'));
                }

                // Verify JWT token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.userId = decoded.id;
                socket.userRole = decoded.role;

                next();
            } catch (error) {
                console.error('Socket authentication failed:', error.message);
                next(new Error('Authentication error: Invalid token'));
            }
        });

        // Connection handler
        this.io.on('connection', (socket) => {
            const userId = socket.userId;
            console.log(`✅ User ${userId} connected via Socket.io (${socket.id})`);

            // Join user's personal room
            const userRoom = `user-${userId}`;
            socket.join(userRoom);
            this.connectedUsers.set(userId, socket.id);

            // Send connection confirmation
            socket.emit('connected', {
                message: 'Connected to real-time order tracking',
                userId,
            });

            // Handle disconnection
            socket.on('disconnect', () => {
                console.log(`❌ User ${userId} disconnected (${socket.id})`);
                this.connectedUsers.delete(userId);
            });

            // Handle errors
            socket.on('error', (error) => {
                console.error(`Socket error for user ${userId}:`, error);
            });
        });

        console.log('✅ Socket.io server initialized');
    }

    /**
     * Emit order status update to specific user
     * @param {number} userId - User ID to send update to
     * @param {object} data - Order update data
     */
    emitOrderStatusUpdate(userId, data) {
        if (!this.io) {
            console.warn('Socket.io not initialized, skipping emit');
            return;
        }

        const userRoom = `user-${userId}`;

        this.io.to(userRoom).emit('order:status_updated', {
            orderId: data.orderId,
            userId: data.userId,
            oldStatus: data.oldStatus,
            newStatus: data.newStatus,
            updatedAt: data.updatedAt,
        });

        console.log(`📡 Emitted order:status_updated to user ${userId} (Order #${data.orderId})`);
    }

    /**
     * Emit new order notification to specific user
     * @param {number} userId - User ID to send notification to
     * @param {object} data - Order data
     */
    emitNewOrder(userId, data) {
        if (!this.io) {
            console.warn('Socket.io not initialized, skipping emit');
            return;
        }

        const userRoom = `user-${userId}`;

        this.io.to(userRoom).emit('order:created', {
            orderId: data.orderId,
            userId: data.userId,
            total: data.total,
            createdAt: data.createdAt,
        });

        console.log(`📡 Emitted order:created to user ${userId} (Order #${data.orderId})`);
    }

    /**
     * Broadcast to all connected users (use sparingly)
     */
    broadcastToAll(event, data) {
        if (!this.io) {
            console.warn('Socket.io not initialized, skipping broadcast');
            return;
        }

        this.io.emit(event, data);
    }

    /**
     * Get connected users count
     */
    getConnectedUsersCount() {
        return this.connectedUsers.size;
    }

    /**
     * Check if user is online
     */
    isUserOnline(userId) {
        return this.connectedUsers.has(userId);
    }
}

// Export singleton instance
export default new SocketService();

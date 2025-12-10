import axios from 'axios';
import prisma from '../config/database.js';

/**
 * Telegram Notification Service with Retry Logic & Persistent Logging
 * 
 * Features:
 * - 3 retry attempts with exponential backoff
 * - Persistent logging to database
 * - Detailed console logs
 * - Non-blocking async execution
 */

class TelegramService {
    constructor() {
        this.botToken = process.env.TELEGRAM_BOT_TOKEN;
        this.chatId = process.env.TELEGRAM_CHAT_ID;
        this.enabled = process.env.ENABLE_TELEGRAM_NOTIFICATIONS === 'true';
        this.maxRetries = 3;
        this.baseDelay = 500; // ms

        if (!this.botToken || !this.chatId) {
            console.warn('⚠️  Telegram notifications disabled: Missing BOT_TOKEN or CHAT_ID');
            this.enabled = false;
        } else {
            console.log('✅ Telegram notifications enabled');
            console.log(`   Bot Token: ${this.botToken ? '***present***' : 'missing'}`);
            console.log(`   Chat ID: ${this.chatId ? '***present***' : 'missing'}`);
        }
    }

    /**
     * Send message with retry logic and persistent logging
     */
    async sendMessageWithRetry(message, type = 'test', orderId = null) {
        const startTime = Date.now();
        let lastError = null;
        const payload = JSON.stringify({ message: message.substring(0, 500) });

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                console.log(`TELEGRAM ATTEMPT | type: ${type} | orderId: ${orderId || 'N/A'} | attempt: ${attempt}/${this.maxRetries}`);

                if (!this.enabled) {
                    throw new Error('Telegram disabled - BOT_TOKEN or CHAT_ID not configured');
                }

                const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
                const response = await axios.post(url, {
                    chat_id: this.chatId,
                    text: message,
                    parse_mode: 'HTML'
                }, {
                    timeout: 10000 // 10 second timeout
                });

                // SUCCESS!
                const duration = Date.now() - startTime;
                console.log(`TELEGRAM SUCCESS | type: ${type} | orderId: ${orderId || 'N/A'} | attempt: ${attempt} | duration: ${duration}ms | code: ${response.status}`);

                // Log success to database
                await this.logToDatabase({
                    orderId,
                    type,
                    payload,
                    attempts: attempt,
                    lastError: null,
                    status: 'success'
                });

                return {
                    success: true,
                    attempt,
                    response: response.data,
                    duration
                };

            } catch (error) {
                lastError = error.response?.data?.description || error.message;
                const httpCode = error.response?.status || 'N/A';

                console.error(`TELEGRAM ATTEMPT FAILED | type: ${type} | orderId: ${orderId || 'N/A'} | attempt: ${attempt}/${this.maxRetries} | code: ${httpCode} | error: ${lastError}`);

                // If not last attempt, wait with exponential backoff
                if (attempt < this.maxRetries) {
                    const delay = this.baseDelay * Math.pow(3, attempt - 1); // 500ms, 1500ms, 4500ms
                    console.log(`   Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        // All attempts failed - log final failure
        const duration = Date.now() - startTime;
        console.error(`TELEGRAM FAILED (persisted) | type: ${type} | orderId: ${orderId || 'N/A'} | attempts: ${this.maxRetries} | duration: ${duration}ms | error: ${lastError}`);

        // Persist failure to database
        await this.logToDatabase({
            orderId,
            type,
            payload,
            attempts: this.maxRetries,
            lastError,
            status: 'failed'
        });

        return {
            success: false,
            attempts: this.maxRetries,
            error: lastError,
            duration
        };
    }

    /**
     * Save log to database
     */
    async logToDatabase({ orderId, type, payload, attempts, lastError, status }) {
        try {
            await prisma.telegramLog.create({
                data: {
                    orderId,
                    type,
                    payload,
                    attempts,
                    lastError,
                    status
                }
            });
        } catch (dbError) {
            console.error('Failed to save telegram log to database:', dbError.message);
        }
    }

    /**
     * Send new order notification (primary method)
     */
    async sendOrderNotification(order) {
        const itemsText = order.orderItems.map(item =>
            `  • ${item.quantity}x ${item.product.name} - ₹${parseFloat(item.price).toFixed(2)}`
        ).join('\n');

        const message = `
🛒 <b>NEW ORDER</b> #${order.id}

👤 Customer: ${order.customerName}
📧 Email: ${order.customerEmail}
${order.customerPhone ? `📱 Phone: ${order.customerPhone}` : ''}

📦 Items:
${itemsText}

💰 Total: ₹${parseFloat(order.total).toFixed(2)}
📍 Type: ${order.orderType}
💳 Payment: ${order.paymentMethod || 'COD'}

🏠 Shipping:
${order.shippingAddress}
${order.shippingCity}, ${order.shippingZip}

⏰ ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        `.trim();

        return await this.sendMessageWithRetry(message, 'order', order.id);
    }

    /**
     * Send test message
     */
    async sendTestMessage(customPayload = null) {
        const message = customPayload || `
🧪 <b>TEST: Telegram Notification</b>

From: Fruitify Backend
Time: ${new Date().toISOString()}
Env: ${process.env.NODE_ENV || 'development'}
Status: ✅ Telegram service operational
        `.trim();

        return await this.sendMessageWithRetry(message, 'test', null);
    }

    /**
     * Get recent logs from database
     */
    async getRecentLogs(limit = 20) {
        try {
            const logs = await prisma.telegramLog.findMany({
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    order: {
                        select: {
                            id: true,
                            customerName: true,
                            total: true,
                            status: true
                        }
                    }
                }
            });
            return logs;
        } catch (error) {
            console.error('Failed to fetch telegram logs:', error);
            return [];
        }
    }

    /**
     * Check for consecutive failures and alert
     */
    async checkForConsecutiveFailures() {
        try {
            const recentLogs = await prisma.telegramLog.findMany({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 60 * 60 * 1000) // Last 1 hour
                    },
                    status: 'failed'
                },
                orderBy: { createdAt: 'desc' },
                take: 5
            });

            if (recentLogs.length >= 5) {
                console.warn('⚠️ ALERT: 5+ Telegram failures in last hour!');
                // TODO: Send email alert to ADMIN_EMAIL
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error checking failures:', error);
            return false;
        }
    }
}

// Export singleton instance
export default new TelegramService();

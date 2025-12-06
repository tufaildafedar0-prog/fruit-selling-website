import axios from 'axios';

/**
 * Telegram Notification Service
 * 
 * FREE service for sending instant notifications to admin via Telegram Bot
 */

class TelegramService {
    constructor() {
        this.botToken = process.env.TELEGRAM_BOT_TOKEN;
        this.chatId = process.env.TELEGRAM_CHAT_ID;
        this.enabled = process.env.ENABLE_TELEGRAM_NOTIFICATIONS === 'true';

        if (!this.botToken || !this.chatId) {
            console.warn('⚠️  Telegram notifications disabled: Missing BOT_TOKEN or CHAT_ID');
            this.enabled = false;
        } else {
            console.log('✅ Telegram notifications enabled');
        }
    }

    async sendMessage(message) {
        if (!this.enabled) {
            console.log('📱 Telegram disabled, message:', message.substring(0, 100));
            return false;
        }

        try {
            const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
            const response = await axios.post(url, {
                chat_id: this.chatId,
                text: message,
                parse_mode: 'HTML'
            });

            console.log('✅ Telegram notification sent successfully');
            return response.data;
        } catch (error) {
            console.error('❌ Telegram notification failed:', error.message);
            return false;
        }
    }

    async notifyNewOrder(order) {
        const itemsText = order.orderItems.map(item =>
            `  • ${item.quantity}x ${item.product.name} - $${parseFloat(item.price).toFixed(2)}`
        ).join('\n');

        const message = `
🆕 <b>NEW ORDER #${order.id}</b>

👤 <b>Customer:</b> ${order.customerName}
📧 <b>Email:</b> ${order.customerEmail}
📱 <b>Phone:</b> ${order.customerPhone || 'N/A'}

🛒 <b>Items:</b>
${itemsText}

💰 <b>Total:</b> $${parseFloat(order.total).toFixed(2)}
💳 <b>Payment:</b> ${order.paymentMethod} - ${order.paymentStatus}
🚚 <b>Type:</b> ${order.orderType}

📍 <b>Address:</b>
${order.shippingAddress}, ${order.shippingCity}, ${order.shippingZip}

🕐 ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        `.trim();

        return await this.sendMessage(message);
    }

    async notifyPaymentUpdate(order) {
        const statusEmoji = order.paymentStatus === 'PAID' ? '✅' :
            order.paymentStatus === 'FAILED' ? '❌' : '⏳';

        const message = `
${statusEmoji} <b>PAYMENT ${order.paymentStatus}</b>

📦 <b>Order #${order.id}</b>
👤 ${order.customerName}

💰 <b>Amount:</b> $${parseFloat(order.total).toFixed(2)}
💳 <b>Method:</b> ${order.paymentMethod}
🆔 <b>Transaction ID:</b> ${order.transactionId || 'N/A'}

${order.paidAt ? `✅ Paid at: ${new Date(order.paidAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}` : ''}

🕐 ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        `.trim();

        return await this.sendMessage(message);
    }

    async notifyStatusUpdate(order) {
        const statusEmoji = {
            'PENDING': '⏳',
            'PROCESSING': '⚙️',
            'OUT_FOR_DELIVERY': '🚚',
            'DELIVERED': '✅',
            'CANCELLED': '❌'
        };

        const emoji = statusEmoji[order.deliveryStatus] || '📦';

        const message = `
${emoji} <b>ORDER STATUS UPDATE</b>

📦 <b>Order #${order.id}</b>
👤 ${order.customerName}

🚀 <b>Status:</b> ${order.deliveryStatus.replace(/_/g, ' ')}
💰 <b>Total:</b> $${parseFloat(order.total).toFixed(2)}

${order.deliveredAt ? `✅ Delivered at: ${new Date(order.deliveredAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}` : ''}

🕐 ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        `.trim();

        return await this.sendMessage(message);
    }
}

export default new TelegramService();

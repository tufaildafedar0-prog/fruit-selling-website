import sgMail from '@sendgrid/mail';

/**
 * Email Notification Service
 * Uses SendGrid HTTP API (NOT SMTP) - works on ALL hosting platforms!
 * 
 * ⚠️ SECURITY: All credentials loaded from .env - NO hardcoded secrets
 * Required .env variables:
 * - SENDGRID_API_KEY (Your SendGrid API key)
 * - EMAIL_FROM (Verified sender email)
 * - ENABLE_EMAIL_NOTIFICATIONS (true/false)
 * 
 * Setup Guide: https://docs.sendgrid.com/for-developers/sending-email/api-getting-started
 */

class EmailService {
    constructor() {
        this.enabled = process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true';

        if (this.enabled) {
            // Validate required environment variables
            if (!process.env.SENDGRID_API_KEY) {
                console.error('❌ Email service: Missing SENDGRID_API_KEY in .env');
                this.enabled = false;
                return;
            }

            if (!process.env.EMAIL_FROM) {
                console.error('❌ Email service: Missing EMAIL_FROM in .env');
                this.enabled = false;
                return;
            }

            // Initialize SendGrid with API key
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            // Log initialization WITHOUT credentials
            console.log('✅ Email service initialized (SendGrid HTTP API)');
            console.log(`📧 From: ${process.env.EMAIL_FROM}`);
            console.log('📧 Using SendGrid HTTP API (works on all platforms!)');
        } else {
            console.log('⚠️  Email service disabled (set ENABLE_EMAIL_NOTIFICATIONS=true in .env)');
        }
    }

    async sendEmail({ to, subject, html, text }) {
        if (!this.enabled) {
            console.log(`📧 Email disabled - Would send: "${subject}" to ${to}`);
            return { success: false, message: 'Email service disabled' };
        }

        try {
            const msg = {
                to,
                from: process.env.EMAIL_FROM,
                subject,
                text,
                html,
            };

            const response = await sgMail.send(msg);

            console.log(`✅ Email sent via SendGrid: "${subject}" to ${to}`);
            return {
                success: true,
                messageId: response[0].headers['x-message-id']
            };
        } catch (error) {
            console.error(`❌ Email send failed:`, error.response?.body || error.message);
            return {
                success: false,
                error: error.response?.body?.errors?.[0]?.message || error.message
            };
        }
    }

    // ============ AUTHENTICATION EMAILS ============

    async sendVerificationEmail(user, token) {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .header h1 { color: white; margin: 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; padding: 15px 30px; background: #FF6B6B; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🍎 Welcome to Fruitify!</h1>
                    </div>
                    <div class="content">
                        <h2>Verify Your Email Address</h2>
                        <p>Hi ${user.name || 'there'},</p>
                        <p>Thank you for signing up with Fruitify! Please verify your email address to complete your registration.</p>
                        <p style="text-align: center;">
                            <a href="${verifyUrl}" class="button">Verify Email Address</a>
                        </p>
                        <p>Or copy and paste this link in your browser:</p>
                        <p style="word-break: break-all; color: #666;">${verifyUrl}</p>
                        <p><strong>This link will expire in 24 hours.</strong></p>
                        <p>If you didn't create an account, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2025 Fruitify. Fresh Fruits Delivered!</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        return await this.sendEmail({
            to: user.email,
            subject: '🍎 Verify Your Fruitify Account',
            html,
            text: `Welcome to Fruitify! Please verify your email by clicking: ${verifyUrl}`,
        });
    }

    async sendPasswordResetEmail(user, token) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .header h1 { color: white; margin: 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔒 Reset Your Password</h1>
                    </div>
                    <div class="content">
                        <h2>Password Reset Request</h2>
                        <p>Hi ${user.name || 'there'},</p>
                        <p>We received a request to reset your password for your Fruitify account.</p>
                        <p style="text-align: center;">
                            <a href="${resetUrl}" class="button">Reset Password</a>
                        </p>
                        <p>Or copy and paste this link in your browser:</p>
                        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                        <div class="warning">
                            <strong>⚠️ Security Notice:</strong>
                            <ul>
                                <li>This link will expire in 1 hour</li>
                                <li>If you didn't request this, please ignore this email</li>
                                <li>Your password won't change until you create a new one</li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; 2025 Fruitify. Fresh Fruits Delivered!</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        return await this.sendEmail({
            to: user.email,
            subject: '🔒 Reset Your Fruitify Password',
            html,
            text: `Reset your password by clicking: ${resetUrl}`,
        });
    }

    // ============ ORDER EMAILS ============

    async sendOrderConfirmation(order) {
        const itemsHtml = order.orderItems.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                    ${item.quantity}x ${item.product.name}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
                    $${parseFloat(item.price * item.quantity).toFixed(2)}
                </td>
            </tr>
        `).join('');

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .header h1 { color: white; margin: 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .order-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .order-id { font-size: 24px; font-weight: bold; color: #56ab2f; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
                    .total { font-size: 18px; font-weight: bold; color: #56ab2f; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Order Confirmed!</h1>
                    </div>
                    <div class="content">
                        <h2>Thank you for your order!</h2>
                        <p>Hi ${order.customerName},</p>
                        <p>We've received your order and it's being processed.</p>
                        
                        <div class="order-box">
                            <p>Order Number: <span class="order-id">#${order.id}</span></p>
                            <p>Order Date: ${new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}</p>
                        </div>

                        <h3>Order Details:</h3>
                        <table>
                            ${itemsHtml}
                            <tr>
                                <td style="padding: 15px; font-weight: bold;">Total</td>
                                <td style="padding: 15px; text-align: right;" class="total">$${parseFloat(order.total).toFixed(2)}</td>
                            </tr>
                        </table>

                        <h3>Delivery Information:</h3>
                        <p style="background: white; padding: 15px; border-radius: 5px;">
                            ${order.shippingAddress}<br>
                            ${order.shippingCity}, ${order.shippingZip}<br>
                            Phone: ${order.customerPhone || 'N/A'}
                        </p>

                        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                        <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>

                        <p style="margin-top: 30px;">We'll send you updates as your order progresses!</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2025 Fruitify. Fresh Fruits Delivered!</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        return await this.sendEmail({
            to: order.customerEmail,
            subject: `✅ Order #${order.id} Confirmed - Fruitify`,
            html,
            text: `Your order #${order.id} has been confirmed! Total: $${order.total}`,
        });
    }

    async sendPaymentUpdate(order) {
        const statusEmoji = {
            'PAID': '✅',
            'PENDING': '⏳',
            'FAILED': '❌',
            'REFUNDED': '💰'
        };

        const statusColor = {
            'PAID': '#28a745',
            'PENDING': '#ffc107',
            'FAILED': '#dc3545',
            'REFUNDED': '#17a2b8'
        };

        const emoji = statusEmoji[order.paymentStatus] || '💳';
        const color = statusColor[order.paymentStatus] || '#6c757d';

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: ${color}; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .header h1 { color: white; margin: 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .status-box { background: white; padding: 20px; border-left: 4px solid ${color}; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${emoji} Payment ${order.paymentStatus}</h1>
                    </div>
                    <div class="content">
                        <h2>Payment Update for Order #${order.id}</h2>
                        <p>Hi ${order.customerName},</p>
                        
                        <div class="status-box">
                            <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
                            <p><strong>Amount:</strong> $${parseFloat(order.total).toFixed(2)}</p>
                            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                            ${order.transactionId ? `<p><strong>Transaction ID:</strong> ${order.transactionId}</p>` : ''}
                            ${order.paidAt ? `<p><strong>Paid At:</strong> ${new Date(order.paidAt).toLocaleString()}</p>` : ''}
                        </div>

                        ${order.paymentStatus === 'PAID' ?
                '<p>✅ Your payment has been successfully processed! Your order is being prepared for delivery.</p>' :
                order.paymentStatus === 'FAILED' ?
                    '<p>❌ We couldn\'t process your payment. Please contact support or try again.</p>' :
                    '<p>⏳ Your payment is being processed. We\'ll notify you once it\'s confirmed.</p>'
            }
                    </div>
                    <div class="footer">
                        <p>&copy; 2025 Fruitify. Fresh Fruits Delivered!</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        return await this.sendEmail({
            to: order.customerEmail,
            subject: `${emoji} Payment ${order.paymentStatus} - Order #${order.id}`,
            html,
            text: `Payment status for order #${order.id}: ${order.paymentStatus}`,
        });
    }

    async sendDeliveryUpdate(order) {
        const statusEmoji = {
            'PENDING': '⏳',
            'PROCESSING': '⚙️',
            'OUT_FOR_DELIVERY': '🚚',
            'DELIVERED': '✅',
            'CANCELLED': '❌'
        };

        const statusText = {
            'PENDING': 'Order Received',
            'PROCESSING': 'Being Prepared',
            'OUT_FOR_DELIVERY': 'Out for Delivery',
            'DELIVERED': 'Delivered',
            'CANCELLED': 'Cancelled'
        };

        const emoji = statusEmoji[order.deliveryStatus] || '📦';

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .header h1 { color: white; margin: 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .status-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .timeline { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .timeline-item { padding: 10px 0; border-left: 3px solid #ddd; padding-left: 20px; margin-left: 10px; }
                    .timeline-item.active { border-left-color: #f5576c; font-weight: bold; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${emoji} Order Update</h1>
                    </div>
                    <div class="content">
                        <h2>${statusText[order.deliveryStatus]}</h2>
                        <p>Hi ${order.customerName},</p>
                        <p>Your order #${order.id} status has been updated!</p>
                        
                        <div class="status-box">
                            <p style="font-size: 20px; font-weight: bold; color: #f5576c;">
                                ${emoji} ${statusText[order.deliveryStatus]}
                            </p>
                        </div>

                        <div class="timeline">
                            <h3>Order Timeline:</h3>
                            <div class="timeline-item ${order.deliveryStatus === 'PENDING' ? 'active' : ''}">
                                ⏳ Order Placed - ${new Date(order.createdAt).toLocaleString()}
                            </div>
                            <div class="timeline-item ${order.deliveryStatus === 'PROCESSING' ? 'active' : ''}">
                                ⚙️ Processing ${order.processedAt ? `- ${new Date(order.processedAt).toLocaleString()}` : ''}
                            </div>
                            <div class="timeline-item ${order.deliveryStatus === 'OUT_FOR_DELIVERY' ? 'active' : ''}">
                                🚚 Out for Delivery ${order.shippedAt ? `- ${new Date(order.shippedAt).toLocaleString()}` : ''}
                            </div>
                            <div class="timeline-item ${order.deliveryStatus === 'DELIVERED' ? 'active' : ''}">
                                ✅ Delivered ${order.deliveredAt ? `- ${new Date(order.deliveredAt).toLocaleString()}` : ''}
                            </div>
                        </div>

                        ${order.deliveryStatus === 'DELIVERED' ?
                '<p style="background: #d4edda; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745;">✅ Your order has been delivered! Thank you for shopping with Fruitify!</p>' :
                order.deliveryStatus === 'OUT_FOR_DELIVERY' ?
                    '<p style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">🚚 Your order is on the way! It should arrive soon.</p>' :
                    '<p>We\'ll keep you updated as your order progresses!</p>'
            }
                    </div>
                    <div class="footer">
                        <p>&copy; 2025 Fruitify. Fresh Fruits Delivered!</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        return await this.sendEmail({
            to: order.customerEmail,
            subject: `${emoji} Order #${order.id} - ${statusText[order.deliveryStatus]}`,
            html,
            text: `Order #${order.id} status: ${statusText[order.deliveryStatus]}`,
        });
    }

    // Legacy methods for backward compatibility
    async notifyNewOrder(order) {
        return await this.sendOrderConfirmation(order);
    }

    async notifyPaymentUpdate(order) {
        return await this.sendPaymentUpdate(order);
    }

    async notifyStatusUpdate(order) {
        return await this.sendDeliveryUpdate(order);
    }
}

export default new EmailService();

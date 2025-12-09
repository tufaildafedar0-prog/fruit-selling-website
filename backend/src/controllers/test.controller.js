import emailService from '../services/email.service.js';
import telegramService from '../services/telegram.service.js';

/**
 * Test controller for diagnosing email and telegram services
 * SECURITY: Only accessible in development mode or with admin token
 */

export const testEmail = async (req, res, next) => {
    try {
        const testEmail = req.body.email || req.user?.email || 'test@example.com';

        console.log('🧪 Testing email service...');
        console.log(`📧 Sending to: ${testEmail}`);

        const result = await emailService.sendEmail({
            to: testEmail,
            subject: '🧪 Fruitify Email Test',
            html: `
                <h1>Email Service Test</h1>
                <p>If you received this, email service is working! ✅</p>
                <p>Sent at: ${new Date().toISOString()}</p>
            `,
            text: 'Email service test - If you received this, it works!'
        });

        console.log('📊 Email result:', result);

        res.json({
            success: true,
            message: 'Email test complete',
            emailSent: result.success,
            details: result
        });
    } catch (error) {
        console.error('❌ Email test failed:', error);
        res.status(500).json({
            success: false,
            message: 'Email test failed',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const testTelegram = async (req, res, next) => {
    try {
        console.log('🧪 Testing Telegram service...');

        const result = await telegramService.sendMessage(`
🧪 <b>Fruitify Telegram Test</b>

If you received this, Telegram notifications are working! ✅

Sent at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        `.trim());

        console.log('📊 Telegram result:', result);

        res.json({
            success: true,
            message: 'Telegram test complete',
            notificationSent: !!result,
            details: result
        });
    } catch (error) {
        console.error('❌ Telegram test failed:', error);
        res.status(500).json({
            success: false,
            message: 'Telegram test failed',
            error: error.message
        });
    }
};

export const getServiceStatus = async (req, res, next) => {
    try {
        const status = {
            email: {
                enabled: process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true',
                configured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: process.env.SMTP_PORT || 587,
                user: process.env.EMAIL_USER || 'NOT_SET',
            },
            telegram: {
                enabled: process.env.ENABLE_TELEGRAM_NOTIFICATIONS === 'true',
                configured: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
                hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
                hasChatId: !!process.env.TELEGRAM_CHAT_ID,
            },
            environment: process.env.NODE_ENV || 'production',
            timestamp: new Date().toISOString()
        };

        res.json({
            success: true,
            data: status
        });
    } catch (error) {
        next(error);
    }
};

import telegramService from '../services/telegram.service.js';

/**
 * Test Telegram notification
 * @route GET /api/admin/test-telegram
 * @access Admin only
 */
export const testTelegram = async (req, res, next) => {
    try {
        console.log('\n📱 === TELEGRAM TEST ENDPOINT CALLED ===');
        console.log(`   Requested by: ${req.user?.email || 'Unknown'}`);
        console.log(`   Time: ${new Date().toISOString()}`);

        const result = await telegramService.sendTestMessage();

        res.json({
            success: result.success,
            detail: result.success
                ? `Telegram test message sent successfully after ${result.attempt} attempt(s)`
                : `Telegram test failed after ${result.attempts} attempts: ${result.error}`,
            telegramResponse: result.success ? result.response : null,
            error: result.success ? null : result.error,
            attempts: result.success ? result.attempt : result.attempts,
            duration: result.duration
        });
    } catch (error) {
        console.error('Test telegram endpoint error:', error);
        next(error);
    }
};

/**
 * Get telegram logs
 * @route GET /api/admin/telegram-logs
 * @access Admin only
 */
export const getTelegramLogs = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const logs = await telegramService.getRecentLogs(limit);

        res.json({
            success: true,
            data: {
                logs,
                count: logs.length
            }
        });
    } catch (error) {
        console.error('Get telegram logs error:', error);
        next(error);
    }
};

/**
 * Check Telegram configuration
 * @route GET /api/admin/telegram-status
 * @access Admin only
 */
export const getTelegramStatus = async (req, res, next) => {
    try {
        const hasBotToken = !!process.env.TELEGRAM_BOT_TOKEN;
        const hasChatId = !!process.env.TELEGRAM_CHAT_ID;
        const isEnabled = process.env.ENABLE_TELEGRAM_NOTIFICATIONS === 'true';

        res.json({
            success: true,
            data: {
                configured: hasBotToken && hasChatId,
                enabled: isEnabled,
                botToken: hasBotToken ? '***present***' : 'missing',
                chatId: hasChatId ? '***present***' : 'missing',
                enableFlag: isEnabled ? 'true' : process.env.ENABLE_TELEGRAM_NOTIFICATIONS || 'not set'
            }
        });
    } catch (error) {
        next(error);
    }
};

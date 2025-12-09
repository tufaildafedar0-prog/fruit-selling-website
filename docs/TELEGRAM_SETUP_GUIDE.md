# Telegram Notifications Setup Guide

## Overview

Fruitify can send instant notifications to admins via Telegram when new orders are placed or updated. This is **100% FREE** and provides real-time alerts.

---

## Setup Steps

### Step 1: Create Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Start a conversation and send: `/newbot`
3. Follow the prompts:
   - **Bot name:** `Your Business Order Bot` (can be anything)
   - **Bot username:** Must end in `bot`, e.g., `yourbusiness_orders_bot`
4. **Copy the bot token** (format: `1234567890:ABCdefGHIjklMNOpqrstUVwxyz...`)
5. **Save this token securely**

### Step 2: Get Your Chat ID

1. In Telegram, **search for your bot** (the username you just created)
2. Click **Start** or send any message to activate it
3. Now search for **@userinfobot** in Telegram
4. Start a conversation with @userinfobot
5. Send: `/start`
6. Bot will reply with your user information
7. **Copy your ID** (a number like `123456789`)

### Step 3: Configure Environment Variables

In your backend hosting platform, set these variables:

```bash
# Telegram Notifications
ENABLE_TELEGRAM_NOTIFICATIONS=true
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrstUVwxyz...
TELEGRAM_CHAT_ID=123456789
```

### Step 4: Redeploy Backend

After setting variables, redeploy. Check logs for:

```
✅ Telegram notifications enabled
```

---

## Testing

### Option 1: Place Test Order
1. Place an order on the website
2. Check your Telegram for notification
3. Should receive message with order details

### Option 2: Use Diagnostic Endpoint
```bash
GET https://your-backend-url/api/test/status
```

Should show:
```json
{
  "telegram": {
    "enabled": true,
    "configured": true,
    "hasToken": true,
    "hasChatId": true
  }
}
```

---

## Notification Types

### New Order Alert
```
🆕 NEW ORDER #12345

👤 Customer: John Doe
📧 Email: john@example.com
📱 Phone: +91-1234567890

🛒 Items:
  • 2x Fresh Apples - ₹80
  • 1x Green Grapes - ₹95

💰 Total: ₹175
💳 Payment: COD - PENDING
🚚 Type: RETAIL

📍 Address:
123 Main Street, Mumbai, 400001

🕐 Dec 9, 2025 6:30 PM IST
```

### Payment Update
```
✅ PAYMENT PAID

📦 Order #12345
👤 John Doe

💰 Amount: ₹175
💳 Method: RAZORPAY
🆔 Transaction ID: pay_xxxxx

✅ Paid at: Dec 9, 2025 6:35 PM IST
```

### Status Update
```
🚚 ORDER STATUS UPDATE

📦 Order #12345
👤 John Doe

🚀 Status: OUT FOR DELIVERY
💰 Total: ₹175

🕐 Dec 9, 2025 7:00 PM IST
```

---

## Troubleshooting

### Not Receiving Notifications

**Check 1:** Bot is started
- You must send at least one message to your bot
- Click "Start" button in bot chat

**Check 2:** Correct Chat ID
- Make sure you copied YOUR chat ID, not someone else's
- Chat ID should be a number (can be negative for groups)

**Check 3:** Environment Variables
- Check backend logs for "Telegram notifications enabled"
- If disabled, check ENABLE_TELEGRAM_NOTIFICATIONS=true

**Check 4:** Bot Token Valid
- Tokens don't expire but can be revoked
- If revoked, create new bot and update token

### Wrong Chat Receiving Notifications

**Cause:** Using group chat ID instead of personal ID

**Solution:**
- For personal notifications: Use your personal chat ID
- For group notifications: Add bot to group, send message, use group chat ID

---

## Advanced: Group Notifications

To send notifications to a Telegram group:

1. Create a Telegram group
2. Add your bot to the group
3. Make bot admin (optional but recommended)
4. Get group chat ID:
   - Add **@userinfobot** to the group
   - Send `/start` in the group
   - Bot will show group ID (usually negative number like `-123456789`)
5. Use this group ID as TELEGRAM_CHAT_ID

**Benefit:** Multiple admins can receive notifications!

---

## Best Practices

1. **Use Dedicated Bot**
   - Create separate bot for each client/business
   - Easier to manage

2. **Mute if Needed**
   - Telegram allows muting specific chats
   - Useful during high-volume periods

3. **Keep Token Secure**
   - Never commit to Git
   - Store in environment variables only
   - Revoke if compromised

4. **Test Regularly**
   - Monthly test to ensure working
   - Check after any deployment changes

---

## Support

If notifications stop working:
1. Check backend is running
2. Verify environment variables set
3. Test bot responds to messages
4. Check backend logs for errors
5. Regenerate bot if needed (update token)

---

## Quick Reference

| Variable | Example | Where to Get |
|----------|---------|--------------|
| TELEGRAM_BOT_TOKEN | `123...:ABC...` | @BotFather |
| TELEGRAM_CHAT_ID | `123456789` | @userinfobot |
| ENABLE_TELEGRAM_NOTIFICATIONS | `true` | Set manually |

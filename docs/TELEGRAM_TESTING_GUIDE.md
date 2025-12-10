# TELEGRAM NOTIFICATION HARDENING - DEPLOYMENT & TESTING GUIDE

## ⚠️ CRITICAL STEPS BEFORE TESTING

### Step 1: Apply Database Migration (REQUIRED)

**On Railway (Production):**
```bash
# Railway will auto-run on next deployment
# Or manually via Railway CLI:
railway run npx prisma generate
railway run npx prisma db push
```

**Locally (for testing):**
```powershell
# Enable script execution if needed:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run:
cd backend
npm install
npx prisma generate
npx prisma db push
```

**Verify Migration:**
- Check `telegram_logs` table exists in database
- Should have columns: id, orderId, type, payload, attempts, lastError, status, createdAt, updatedAt

---

## Step 2: VERIFY ENVIRONMENT VARIABLES

### A) Local Environment (backend/.env)
Check these variables are present:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
ENABLE_TELEGRAM_NOTIFICATIONS=true
```

### B) Railway Environment
1. Go to Railway dashboard → Your backend service
2. Variables tab → Check:
   - `TELEGRAM_BOT_TOKEN` = ***present***
   - `TELEGRAM_CHAT_ID` = ***present***
   - `ENABLE_TELEGRAM_NOTIFICATIONS` = `true`

**If any missing → ADD THEM NOW before testing!**

---

## Step 3: TEST ENDPOINTS

### Test A: Check Telegram Status
```bash
# Get admin token first (login as admin)
GET https://fruit-selling-website-production.up.railway.app/api/admin/telegram-status
Headers: Authorization: Bearer <your_admin_token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "configured": true,
    "enabled": true,
    "botToken": "***present***",
    "chatId": "***present***",
    "enableFlag": "true"
  }
}
```

**If configured=false or enabled=false → FIX ENV VARS FIRST!**

---

### Test B: Send Test Message
```bash
GET https://fruit-selling-website-production.up.railway.app/api/admin/test-telegram
Headers: Authorization: Bearer <your_admin_token>
```

**Expected Response (Success):**
```json
{
  "success": true,
  "detail": "Telegram test message sent successfully after 1 attempt(s)",
  "telegramResponse": {
    "ok": true,
    "result": { ... }
  },
  "error": null,
  "attempts": 1,
  "duration": 523
}
```

**Expected Response (Failure):**
```json
{
  "success": false,
  "detail": "Telegram test failed after 3 attempts: Unauthorized",
  "telegramResponse": null,
  "error": "Unauthorized",
  "attempts": 3,
  "duration": 6500
}
```

**Check Telegram:** You should receive test message!

---

### Test C: Place Real Order
1. **Login as customer**
2. **Add product to cart**
3. **Proceed to checkout**
4. **Place order** (COD/without Razorpay)

**Expected:**
- Order created successfully
- **Check Telegram** - Should get order notification!
- Check server logs for:
  ```
  TELEGRAM ATTEMPT | type: order | orderId: X | attempt: 1/3
  TELEGRAM SUCCESS | type: order | orderId: X | attempt: 1 | duration: XXXms
  ```

---

### Test D: View Telegram Logs
```bash
GET https://fruit-selling-website-production.up.railway.app/api/admin/telegram-logs?limit=5
Headers: Authorization: Bearer <your_admin_token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 1,
        "orderId": 123,
        "type": "order",
        "payload": "{\"message\":\"...\"",
        "attempts": 1,
        "lastError": null,
        "status": "success",
        "createdAt": "2025-12-10T...",
        "order": {
          "id": 123,
          "customerName": "John Doe",
          "total": "500.00",
          "status": "PENDING"
        }
      }
    ],
    "count": 1
  }
}
```

---

## Step 4: SERVER LOG EXAMPLES

### Successful Send:
```
✅ Telegram notifications enabled
   Bot Token: ***present***
   Chat ID: ***present***

TELEGRAM ATTEMPT | type: order | orderId: 45 | attempt: 1/3
TELEGRAM SUCCESS | type: order | orderId: 45 | attempt: 1 | duration: 456ms | code: 200
```

### Failed Send with Retries:
```
TELEGRAM ATTEMPT | type: order | orderId: 46 | attempt: 1/3
TELEGRAM ATTEMPT FAILED | type: order | orderId: 46 | attempt: 1/3 | code: 401 | error: Unauthorized
   Retrying in 500ms...
TELEGRAM ATTEMPT | type: order | orderId: 46 | attempt: 2/3
TELEGRAM ATTEMPT FAILED | type: order | orderId: 46 | attempt: 2/3 | code: 401 | error: Unauthorized
   Retrying in 1500ms...
TELEGRAM ATTEMPT | type: order | orderId: 46 | attempt: 3/3
TELEGRAM ATTEMPT FAILED | type: order | orderId: 46 | attempt: 3/3 | code: 401 | error: Unauthorized
TELEGRAM FAILED (persisted) | type: order | orderId: 46 | attempts: 3 | duration: 6234ms | error: Unauthorized
```

---

## Step 5: VERIFICATION CHECKLIST

- [ ] Database migration applied (`telegram_logs` table exists)
- [ ] Env vars present on Railway
- [ ] `/api/admin/telegram-status` returns `configured: true`
- [ ] `/api/admin/test-telegram` sends message successfully
- [ ] Telegram app receives test message
- [ ] Place real order → Telegram receives order notification
- [ ] `/api/admin/telegram-logs` shows log entries
- [ ] Server logs show TELEGRAM ATTEMPT/SUCCESS messages

---

## Step 6: TROUBLESHOOTING

### "Unauthorized" Error:
- Check `TELEGRAM_BOT_TOKEN` is correct
- Create new bot via @BotFather if needed

### "Bad Request: chat not found":
- Check `TELEGRAM_CHAT_ID` is correct
- Send `/start` to your bot first
- Use @userinfobot to get your Chat ID

### No Message Received:
- Check bot is not blocked
- Check `ENABLE_TELEGRAM_NOTIFICATIONS=true`
- Check logs for actual error

### Database Errors:
- Ensure migration was applied
- Run `npx prisma db push` manually
- Check Prisma client is generated

---

## Step 7: REPORT FORMAT

**Please provide:**

1. **Env Status:**
   ```
   TELEGRAM_BOT_TOKEN: present/missing
   TELEGRAM_CHAT_ID: present/missing  
   ENABLE_TELEGRAM_NOTIFICATIONS: true/false/missing
   ```

2. **Test Endpoint Result:**
   ```json
   Paste JSON response from /api/admin/test-telegram
   ```

3. **Server Logs:**
   ```
   Paste log lines for test and real order (with timestamps)
   ```

4. **Telegram Logs DB:**
   ```json
   Paste response from /api/admin/telegram-logs?limit=5
   ```

5. **Screenshot:**
   - Telegram app showing received messages

6. **Status:**
   - [ ] All tests passed
   - [ ] Some failures (list which ones)
   - [ ] Migration issues
   - [ ] Env var issues

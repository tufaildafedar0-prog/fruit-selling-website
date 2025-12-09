# Email Service Setup Guide for Clients

## Overview

Fruitify uses email notifications to keep customers informed about their orders. Each client deployment needs to configure their own email service using Gmail SMTP (100% FREE).

---

## Gmail SMTP Setup (Recommended - FREE)

### Prerequisites
- Gmail account (or Google Workspace account)
- 2-Factor Authentication enabled

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** if not already enabled
3. Follow the setup wizard

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)** → Type: `Fruitify Backend`
4. Click **Generate**
5. **Copy the 16-character password** (format: `xxxx xxxx xxxx xxxx`)
6. **Remove all spaces**: `xxxxxxxxxxxxxxxx`
7. **Save this password securely** - you'll need it once for deployment

### Step 3: Configure Environment Variables

In your backend hosting platform (Render/Railway/etc.), set these environment variables:

```bash
# Email Service Configuration
ENABLE_EMAIL_NOTIFICATIONS=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
EMAIL_USER=your-business-email@gmail.com
EMAIL_PASS=xxxxxxxxxxxxxxxx  # 16-char app password from Step 2
EMAIL_FROM="Your Business Name <your-business-email@gmail.com>"
```

**Important Notes:**
- `EMAIL_PASS` is the **app password**, NOT your regular Gmail password
- Use port `465` with `SMTP_SECURE=true` for best compatibility
- `EMAIL_FROM` format: `"Display Name <email@domain.com>"`

### Step 4: Redeploy Backend

After setting environment variables, redeploy your backend service. The logs should show:

```
✅ Email service initialized
📧 SMTP Host: smtp.gmail.com
📧 SMTP Port: 465
📧 From: Your Business Name <your-business-email@gmail.com>
```

---

## Alternative: SendGrid (If Gmail Blocked)

Some hosting platforms block SMTP connections. If Gmail doesn't work, use SendGrid (100 emails/day FREE).

### Step 1: Sign Up for SendGrid
1. Visit: https://signup.sendgrid.com/
2. Sign up for free account
3. Verify your email

### Step 2: Create API Key
1. Go to: https://app.sendgrid.com/settings/api_keys
2. Click **Create API Key**
3. Name: `Fruitify Backend`
4. Permissions: **Full Access**
5. Copy the API key (starts with `SG.`)

### Step 3: Verify Sender Email
1. Go to: https://app.sendgrid.com/settings/sender_auth
2. Add and verify your sender email

### Step 4: Configure Environment Variables

```bash
ENABLE_EMAIL_NOTIFICATIONS=true
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=apikey  # Literally the word "apikey"
EMAIL_PASS=SG.xxxxxxxxxxxxxxxxxxxxx  # Your SendGrid API key
EMAIL_FROM="Your Business <verified-email@yourdomain.com>"
```

---

## Testing Email Service

### Option 1: Test Registration
1. Register a new customer account
2. Check if welcome email arrives
3. Verify email content looks professional

### Option 2: Test Order Flow
1. Place a test order
2. Check order confirmation email
3. Update order status in admin panel
4. Check status update email

### Option 3: Use Diagnostic Endpoint
```bash
GET https://your-backend-url/api/test/status
```
Should show:
```json
{
  "email": {
    "enabled": true,
    "configured": true
  }
}
```

---

## Email Types Sent

### Customer Emails
1. **Welcome Email** - After registration (if verification enabled)
2. **Order Confirmation** - After placing order
3. **Payment Confirmation** - After successful payment
4. **Order Status Updates** - When admin updates status
5. **Delivery Notification** - When order is delivered

### Admin Notifications
- Currently sent via Telegram (see TELEGRAM_SETUP_GUIDE.md)

---

## Troubleshooting

### "Connection timeout" Error
**Cause:** Hosting platform blocks SMTP connections

**Solutions:**
1. Try port 465 instead of 587
2. Use SendGrid instead of Gmail
3. Upgrade to paid hosting tier (usually removes SMTP restrictions)

### "Invalid login" Error
**Cause:** Wrong app password or 2FA not enabled

**Solutions:**
1. Regenerate app password
2. Ensure 2-Factor Authentication is ON
3. Use exact 16-character password (no spaces)

### Emails Not Received
**Check:**
1. Spam/Junk folder
2. Backend logs for email send confirmation
3. Gmail "Sent" folder (if using Gmail)
4. Email address is correct in order

### "535 Authentication failed" Error
**Cause:** Using regular password instead of app password

**Solution:** Generate and use app password (Step 2 above)

---

## Gmail Sending Limits

**Free Gmail:**
- 500 emails per day
- 100 emails per hour
- Sufficient for most small-to-medium businesses

**Google Workspace:**
- 2,000 emails per day
- Better for high-volume businesses

---

## Best Practices

1. **Use Professional Email**
   - Use `orders@yourbusiness.com` instead of personal Gmail
   - Better customer trust

2. **Monitor Email Delivery**
   - Check backend logs regularly
   - Test email flow monthly

3. **Keep App Password Secure**
   - Never commit to Git
   - Store in environment variables only
   - Regenerate if compromised

4. **Professional Email Content**
   - Emails use branded templates
   - Include business logo (future enhancement)
   - Clear call-to-actions

---

## Support

If you encounter issues:
1. Check backend logs for error messages
2. Refer to troubleshooting section above
3. Test with diagnostic endpoint
4. Contact support with error details

---

## Quick Reference

| Setting | Gmail | SendGrid |
|---------|-------|----------|
| SMTP_HOST | smtp.gmail.com | smtp.sendgrid.net |
| SMTP_PORT | 465 | 587 |
| SMTP_SECURE | true | false |
| EMAIL_USER | your@gmail.com | apikey |
| EMAIL_PASS | App password (16 chars) | API key (SG.*) |

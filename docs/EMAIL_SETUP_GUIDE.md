# Email Service Setup Guide for Clients

## Overview

Fruitify uses email notifications to keep customers informed about their orders. This guide covers setup for **SendGrid HTTP API** (recommended for free hosting) and Gmail SMTP (for self-hosted deployments).

---

## ⭐ SendGrid HTTP API (RECOMMENDED - Works Everywhere!)

**Why SendGrid HTTP API?**
- ✅ Works on ALL free hosting platforms (Railway, Render, Vercel serverless, etc.)
- ✅ No SMTP port restrictions
- ✅ 100 emails/day FREE forever
- ✅ More reliable than SMTP
- ✅ Modern, professional approach
- ✅ **This is what the demo uses!**

### Step 1: Create SendGrid Account

1. Visit: https://signup.sendgrid.com/
2. Sign up for **free account**
3. Verify your email address

### Step 2: Verify Sender Email

**CRITICAL:** SendGrid requires sender verification before sending emails.

1. Go to: https://app.sendgrid.com/settings/sender_auth/senders
2. Click **"Create New Sender"**
3. Fill in your details:
   - **From Email Address:** `your-business@yourdomain.com`
   - **From Name:** `Your Business Name`
   - **Reply To:** Same as From Email
   - **Address, City, Country:** Your business location
4. Click **"Create"**
5. **Check your email inbox** for verification email from SendGrid
6. **Click the verification link** in the email
7. Return to SendGrid dashboard
8. **Verify the sender shows a green checkmark** ✅

**Important:** You CANNOT send emails until sender is verified!

### Step 3: Create API Key

1. Go to: https://app.sendgrid.com/settings/api_keys
2. Click **"Create API Key"**
3. **Name:** `Fruitify Backend`
4. **Permissions:** Select **"Full Access"** (or at minimum "Mail Send - Full Access")
5. Click **"Create & View"**
6. **COPY THE API KEY** (starts with `SG.`) - You won't see it again!
7. Save it securely (you'll add it to environment variables)

### Step 4: Configure Environment Variables

In your backend hosting platform (Railway/Render/Vercel/etc.), set these environment variables:

```bash
# Email Service - SendGrid HTTP API
ENABLE_EMAIL_NOTIFICATIONS=true
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Your API key from Step 3
EMAIL_FROM=your-verified-sender@yourdomain.com      # Must match verified sender from Step 2
```

**CRITICAL:**
- `EMAIL_FROM` must be EXACTLY the email you verified in Step 2
- Just the email address, no quotes, no display name
- Example: `orders@yourbusiness.com` NOT `"Business Name <orders@yourbusiness.com>"`

### Step 5: Deploy and Test

1. Deploy/redeploy your backend
2. Check logs for: `✅ Email service initialized (SendGrid HTTP API)`
3. Test by registering a new user
4. **Check email inbox (and spam folder!)**

**First email from SendGrid often goes to spam** - click "Not spam" to train filters.

---

## Alternative: Gmail SMTP (For Self-Hosted Servers Only)

**⚠️ WARNING:** Gmail SMTP does NOT work on most free hosting platforms (Railway, Render, Vercel) because they block SMTP ports. Only use this if you're deploying on a VPS or paid hosting that allows SMTP.

**Why Gmail SMTP doesn't work on free hosting:**
- Free hosting blocks port 587 (SMTP)
- Free hosting blocks port 465 (SMTPS)  
- Railway, Render, Heroku all block SMTP on free tiers
- Use SendGrid HTTP API instead!

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

| Setting | SendGrid HTTP API ⭐ | Gmail SMTP | SendGrid SMTP |
|---------|---------------------|------------|---------------|
| Works on free hosting? | ✅ YES | ❌ NO | ❌ NO |
| Environment Variable | `SENDGRID_API_KEY` | - | - |
| SMTP_HOST | - | smtp.gmail.com | smtp.sendgrid.net |
| SMTP_PORT | - | 465 | 587 |
| SMTP_SECURE | - | true | false |
| EMAIL_USER | - | your@gmail.com | apikey |
| EMAIL_PASS | - | App password | API key |
| EMAIL_FROM | verified@domain.com | "Name <email>" | "Name <email>" |
| Free tier limits | 100 emails/day | 500/day | 100/day |
| **Recommended** | ✅ **YES** | Only for VPS | No |

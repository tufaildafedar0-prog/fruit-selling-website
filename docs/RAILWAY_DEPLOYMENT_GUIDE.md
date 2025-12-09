# Railway Deployment Guide

## Overview

This guide covers deploying the Fruitify backend to Railway.app - a modern platform that supports SMTP alternatives and provides free PostgreSQL hosting.

**Why Railway?**
- ✅ FREE tier with generous limits
- ✅ Supports SendGrid HTTP API (email works!)
- ✅ Free PostgreSQL database included
- ✅ Auto-deploys from GitHub
- ✅ Singapore region available (fast for India!)
- ✅ Simple environment variable management

---

## Prerequisites

- GitHub account with Fruitify repository
- Railway account (free): https://railway.app
- SendGrid account with API key (see EMAIL_SETUP_GUIDE.md)
- Telegram bot token (optional, see TELEGRAM_SETUP_GUIDE.md)

---

## Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign in with GitHub
4. Authorize Railway to access your repositories

---

## Step 2: Create New Project

1. Click **"+ New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your **fruit-selling-website** repository
4. Railway will detect the backend folder

---

## Step 3: Configure Backend Service

1. After selecting the repo, Railway creates a service
2. Click on the service to configure it

### Set Root Directory

1. Go to **"Settings"** tab
2. Find **"Root Directory"** or **"Source"**
3. Set to: `backend`
4. Save

This tells Railway to deploy only the backend folder.

---

## Step 4: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway provisions the database (1-2 minutes)

**Important:** Railway automatically creates a `DATABASE_URL` environment variable that connects your backend to the database!

---

## Step 5: Configure Environment Variables

Click on your **backend service** → **"Variables"** tab

### Required Variables

```bash
# Database (Auto-created by Railway, verify it exists)
DATABASE_URL=postgresql://...  # Should already exist

# Server
PORT=5000
NODE_ENV=production

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-different-from-jwt-secret

# CORS
FRONTEND_URL=https://your-vercel-app.vercel.app

# Email - SendGrid HTTP API (RECOMMENDED)
ENABLE_EMAIL_NOTIFICATIONS=true
SENDGRID_API_KEY=SG.your-sendgrid-api-key-here
EMAIL_FROM=your-verified-sender@yourdomain.com

# Telegram Notifications (Optional)
ENABLE_TELEGRAM_NOTIFICATIONS=true
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### How to Add Variables

**Option 1: One by One**
1. Click **"+ New Variable"**
2. Enter name and value
3. Repeat for each variable

**Option 2: Raw Editor (Faster)**
1. Click **"RAW Editor"**
2. Paste all variables in `KEY=value` format
3. Click **"Update Variables"**

---

## Step 6: Deploy to Singapore Region (Fast for India!)

1. Click on backend service
2. Go to **"Settings"** tab  
3. Find **"Region"** setting
4. Change to **"Southeast Asia (Singapore)"**
5. Service will redeploy automatically

This significantly improves performance for Indian users!

---

## Step 7: Generate Public Domain

1. Click on backend service
2. Go to **"Settings"** tab
3. Scroll to **"Networking"** section
4. Click **"Generate Domain"**
5. Railway creates a public URL: `your-app.up.railway.app`
6. **Copy this URL** - you'll need it for Vercel frontend!

---

## Step 8: Wait for Deployment

1. Go to **"Deployments"** tab
2. Watch the build process
3. Wait for **green checkmark** (Success!)
4. Review logs for any errors

**Expected logs:**
```
✅ Email service initialized (SendGrid HTTP API)
📧 From: your-email@domain.com
✅ Telegram notifications enabled
🚀 Server running on port 5000
```

---

## Step 9: Verify Deployment

### Test Health Endpoint

Visit: `https://your-app.up.railway.app/api/health`

**Should return:**
```json
{
  "status": "OK",
  "message": "Fruitify API is running"
}
```

### Test Service Status

Visit: `https://your-app.up.railway.app/api/test/status`

**Should show:**
```json
{
  "success": true,
  "data": {
    "email": {
      "enabled": true,
      "configured": true
    },
    "telegram": {
      "enabled": true,
      "configured": true
    }
  }
}
```

---

## Step 10: Update Frontend (Vercel)

Now connect your Vercel frontend to Railway backend:

1. Go to Vercel Dashboard
2. Select your frontend project
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_API_URL` to:
   ```
   https://your-app.up.railway.app/api
   ```
5. **Save**
6. Redeploy frontend

---

## Troubleshooting

### Build Failed - "npm install failed"

**Solution:** Make sure `package-lock.json` is committed to Git
```bash
cd backend
npm install
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

### Database Connection Error

**Check:**
1. DATABASE_URL variable exists
2. PostgreSQL service is running (green in Railway)
3. Backend and database are in same project

**Fix:** In backend Variables, ensure DATABASE_URL is set (Railway auto-creates it)

### "Invalid from email address" Error

**Cause:** SendGrid sender not verified

**Solution:**
1. Go to SendGrid dashboard
2. Verify sender email (see EMAIL_SETUP_GUIDE.md)
3. Update `EMAIL_FROM` to match verified sender
4. Redeploy

### Deployment Keeps Failing

**Check deployment logs:**
1. Deployments tab
2. Click failed deployment  
3. View logs
4. Look for specific error messages

Common issues:
- Missing environment variables
- Wrong Prisma provider (should be "postgresql")
- Port conflicts (use PORT=5000)

---

## Auto-Deploy from GitHub

Railway automatically redeploys when you push to GitHub!

**How it works:**
1. Make changes to backend code
2. Commit and push to GitHub main branch
3. Railway detects changes
4. Automatically builds and deploys
5. Zero downtime deployment

**To disable auto-deploy:**
1. Settings → **"Source"**
2. Uncheck **"Auto-deploy"**

---

## Environment Management

### Development vs Production

**Local Development:**
- Use `.env` file
- Connect to local database or Railway database

**Production (Railway):**
- Uses Railway environment variables
- Separate database instance

### Updating Variables

1. Change variables in Railway dashboard
2. Service auto-redeploys
3. Changes take effect in 2-3 minutes

---

## Cost & Limits

### Free Tier Includes:
- ✅ 500 hours/month execution time
- ✅ 100 GB bandwidth
- ✅ PostgreSQL database (1 GB storage)
- ✅ Unlimited deployments
- ✅ Auto-deploy from GitHub

**Sufficient for:**
- Demo/portfolio sites
- Small to medium client deployments
- Testing and staging

### Upgrade to Hobby Plan ($5/month):
- More execution hours
- More database storage
- Priority support

---

## Best Practices

1. **Use Meaningful Variable Names**
   - Clear, descriptive names
   - Group related variables with comments

2. **Keep Secrets Secret**
   - Never commit secrets to Git
   - Use Railway environment variables
   - Rotate keys periodically

3. **Monitor Deployments**
   - Check deployment logs regularly
   - Set up error notifications (Railway Settings)
   - Review Railway metrics

4. **Database Backups**
   - Railway auto-backs up PostgreSQL
   - Can export database manually if needed
   - Test restoration process

5. **Use Railway CLI for Advanced Tasks**
   ```bash
   npm install -g @railway/cli
   railway login
   railway link
   railway run npx prisma migrate deploy
   ```

---

## Migrating from Render/Other Platforms

### Export Data from Old Platform

1. Export database (PostgreSQL dump)
2. Note all environment variables
3. Download any uploaded files

### Import to Railway

1. Create Railway database
2. Import database dump
3. Set environment variables
4. Deploy code
5. Test thoroughly

---

## Support Resources

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Railway Status:** https://status.railway.app

---

## Quick Checklist

- [ ] Railway account created
- [ ] Project created from GitHub repo
- [ ] Root directory set to `backend`
- [ ] PostgreSQL database added
- [ ] All environment variables configured
- [ ] Region set to Singapore (for India)
- [ ] Public domain generated
- [ ] Deployment successful (green checkmark)
- [ ] Health endpoint tested
- [ ] Email service tested
- [ ] Frontend updated with Railway URL
- [ ] End-to-end flow tested

---

## Summary

Railway deployment is:
- ✅ **Simple** - Deploy from GitHub in minutes
- ✅ **Free** - Generous free tier
- ✅ **Fast** - Singapore region for India
- ✅ **Reliable** - Auto-deploy, zero downtime
- ✅ **Modern** - Supports SendGrid HTTP API

**Perfect for demo and client deployments!** 🚀

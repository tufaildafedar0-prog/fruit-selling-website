# Vercel Deployment Guide - Fruitify Frontend

## Prerequisites

- Vercel account (free tier works)
- GitHub repository pushed with latest code
- Render backend URL: `https://fruitify-backend-2sbr.onrender.com`

---

## Step-by-Step Deployment

### 1. Connect to Vercel

1. Go to https://vercel.com/
2. Click **"Add New Project"**
3. **Import** your GitHub repository: `fruit-selling-website`
4. Vercel will auto-detect it's a Vite project ✅

### 2. Configure Build Settings

Vercel should auto-detect these, but verify:

- **Framework Preset:** `Vite`
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 3. Set Environment Variable

**CRITICAL:** Add this environment variable in Vercel:

1. Go to **Settings** → **Environment Variables**
2. Add variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://fruitify-backend-2sbr.onrender.com/api`
   - **Environment:** Production (and Preview if you want)

### 4. Deploy!

1. Click **"Deploy"**
2. Wait 1-2 minutes for build
3. You'll get a URL like: `https://your-project.vercel.app`

### 5. Update Backend CORS

Add your Vercel URL to the backend's allowed origins:

**Backend file:** `backend/src/services/socket.service.js`

```javascript
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'https://tufaildafedar0-prog.github.io',
    'https://your-project.vercel.app',  // ← Add this
].filter(Boolean);
```

Then push to GitHub (backend auto-deploys to Render).

---

## Advantages Over GitHub Pages

✅ **No 404 refresh issues** - Vercel handles SPA routing natively
✅ **Custom domains** - Easy to add
✅ **Automatic HTTPS**
✅ **Preview deployments** - For every pull request
✅ **Edge functions** - If needed later
✅ **Better performance** - Global CDN

---

## Testing Your Deployment

1. Visit your Vercel URL
2. Navigate to `/admin`, `/products`, etc.
3. **Press F5 (refresh)** anywhere - should work perfectly!
4. Check console - no 404 errors
5. Login works
6. Products load
7. Socket.IO connects

---

## Troubleshooting

### Products don't load
- Check environment variable is set correctly in Vercel
- Redeploy after adding environment variable

### Socket.IO errors
- Add Vercel URL to backend CORS (step 5 above)
- Push backend changes to trigger Render deployment

### Build fails
- Check build logs in Vercel dashboard
- Ensure `frontend` is set as root directory

---

## Custom Domain (Optional)

1. Vercel Dashboard → **Settings** → **Domains**
2. Add your domain (e.g., `fruitify.com`)
3. Update DNS records as instructed
4. Automatic HTTPS certificate ✅

---

## Automatic Deployments

✅ **Every push to `main`** = Production deployment
✅ **Every PR** = Preview deployment (test before merging)

No manual work needed after initial setup! 🎉

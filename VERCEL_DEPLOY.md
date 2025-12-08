# AI RFP Manager - Vercel Deployment Guide

## 📦 Deployment Steps

### Step 1: Prepare Your Repository
Ensure your code is pushed to GitHub:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy on Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New Project"
   - Select your repository: `RajeshKumarYadav12/Request-For-Proposal`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install` (or leave default)

4. **Add Environment Variables**
   
   Click "Environment Variables" and add these:

   ```
   MONGODB_URI=mongodb+srv://yrajeshkumar799:3S2JRJQPog4EGsOA@cluster0.rp5sr.mongodb.net/TaskK
   PORT=4000
   NODE_ENV=production
   SMTP_HOST=sandbox.smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=5f71ca57792376
   SMTP_PASS=3a00bd9be5f953
   EMAIL_FROM=yrajeshkumar799@iiitmanipur.ac.in
   OPENAI_API_KEY=your_openai_key_here
   OPENAI_MODEL=gpt-4o-mini
   ```

   **Important**: Copy actual values from your `backend/.env` file

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts, then deploy to production
vercel --prod
```

### Step 3: Configure Frontend API URL

After deployment, Vercel will give you a URL like: `https://your-app.vercel.app`

1. **Add Environment Variable in Vercel**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-app.vercel.app/api`

2. **Redeploy**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger auto-deployment

### Step 4: Verify Deployment

1. **Test Backend API**
   ```
   https://your-app.vercel.app/api/health
   ```
   Should return: `{"success":true,"message":"AI RFP Manager API is running"}`

2. **Test Frontend**
   ```
   https://your-app.vercel.app/
   ```
   Should load the React app

3. **Test Full Flow**
   - Create an RFP
   - Add vendors
   - Send RFP to vendors
   - Simulate replies
   - Compare proposals

## 🔧 Troubleshooting

### Issue: Backend returns 404
**Solution**: Ensure `vercel.json` routes are correct and environment variables are set

### Issue: MongoDB connection fails
**Solution**: 
- Check `MONGODB_URI` in Vercel environment variables
- In MongoDB Atlas, whitelist all IPs: `0.0.0.0/0` (Network Access settings)

### Issue: Frontend can't reach backend
**Solution**: 
- Verify `VITE_API_URL` is set in Vercel
- Check browser console for CORS errors
- Ensure backend CORS is configured for all origins in production

### Issue: OpenAI API errors
**Solution**: 
- Verify `OPENAI_API_KEY` is correct
- Check your OpenAI account has credits
- Fallback regex parsers will work if quota is exceeded

### Issue: Email sending fails
**Solution**: 
- Verify all SMTP credentials are set
- For production, consider upgrading from Mailtrap sandbox to real SMTP service

## 📝 Important Notes

1. **MongoDB Atlas**: Whitelist Vercel's IP range or use `0.0.0.0/0` for all IPs
2. **Environment Variables**: Never commit `.env` files - use Vercel dashboard
3. **Build Time**: First deployment may take 3-5 minutes
4. **Auto-Deploy**: Every push to `main` branch triggers new deployment
5. **Logs**: Check Vercel dashboard → Project → Functions tab for backend logs

## 🚀 Post-Deployment

Your app is now live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-app.vercel.app/api`

Share the URL and start managing RFPs! 🎉

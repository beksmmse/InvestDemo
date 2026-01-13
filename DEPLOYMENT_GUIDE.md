# Deployment Guide: Render + GitHub Pages

## Overview
- **Backend**: Deployed on Render (https://render.com)
- **Frontend**: Deployed on GitHub Pages
- **Repository**: Single GitHub repo with separate backend/frontend folders

---

## STEP 1: Setup GitHub Repository

### 1.1 Enable GitHub Pages

1. Go to your GitHub repo → **Settings**
2. Navigate to **Pages** (left sidebar)
3. Under "Build and deployment":
   - **Source**: GitHub Actions
   - **Branch**: main
4. Click Save

### 1.2 Update Repository Settings

Ensure your repo has:
- Branch protection on `main` (optional but recommended)
- Secrets configured (see Step 3)

---

## STEP 2: Deploy Backend on Render

### 2.1 Prepare Backend

Make sure your `Back/package.json` has:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  }
}
```

### 2.2 Create Render Service

1. Go to [render.com](https://render.com) and sign up
2. Click **+ New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `investdemo-backend`
   - **Environment**: Node
   - **Build Command**: `cd Back && npm install`
   - **Start Command**: `cd Back && npm start`
   - **Region**: Choose closest to you

### 2.3 Add Environment Variables in Render

1. In Render dashboard, go to your service
2. Click **Environment** tab
3. Add these variables:
   ```
   PORT=3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   NODE_ENV=production
   ```
4. Click **Deploy**

### 2.4 Get Your Backend URL

After deployment, you'll see URL like:
```
https://investdemo-backend.onrender.com
```

Copy this URL for Step 3.

---

## STEP 3: Deploy Frontend on GitHub Pages

### 3.1 Update Frontend Configuration

Already done! Your `vite.config.js` now has:
```javascript
base: '/InvestDemo/',
define: {
  __API_URL__: JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3000')
}
```

### 3.2 Configure GitHub Actions Secret

1. Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add:
   - **Name**: `RENDER_BACKEND_URL`
   - **Value**: `https://investdemo-backend.onrender.com`
4. Click **Add secret**

### 3.3 GitHub Actions Auto-Deploy

The workflow file `.github/workflows/deploy-frontend.yml` is ready!

**How it works:**
- When you push to `main` branch in `Front/` folder
- GitHub Actions automatically builds and deploys to GitHub Pages
- Frontend will be available at: `https://yourusername.github.io/InvestDemo/`

---

## STEP 4: Update Frontend API Calls

Your frontend now uses the API URL from environment:

```javascript
// In your Vue components, use:
import API_BASE_URL from '@/config.js'

// Example API call:
axios.post(`${API_BASE_URL}/api/save-game`, gameData)
```

Or update all axios calls to use the config:

```javascript
// Create axios instance in a new file: src/api.js
import axios from 'axios'
import API_BASE_URL from '@/config.js'

const apiClient = axios.create({
  baseURL: API_BASE_URL
})

export default apiClient
```

Then in your components:
```javascript
import apiClient from '@/api.js'

// Use it
apiClient.post('/api/save-game', gameData)
```

---

## STEP 5: Production URLs

After everything is deployed:

| Component | URL |
|-----------|-----|
| **Frontend** | `https://yourusername.github.io/InvestDemo/` |
| **Backend API** | `https://investdemo-backend.onrender.com` |

---

## STEP 6: Local Development

### Development (.env.local is auto-used):
```bash
cd Front
npm run dev
# Automatically uses: VITE_API_URL=http://localhost:3000

cd Back
npm start
# Runs on port 3000
```

### Production Build:
```bash
cd Front
npm run build
# Automatically uses: VITE_API_URL=https://investdemo-backend.onrender.com
```

---

## STEP 7: Git Workflow

### Initial Setup (One time):
```bash
# From project root
git add .
git commit -m "Setup deployment configuration"
git push origin main
```

### Regular Development:
```bash
# Make changes
git add .
git commit -m "Your commit message"
git push origin main

# GitHub Actions automatically deploys frontend
# Render automatically deploys backend (if configured with GitHub)
```

---

## STEP 8: Important Notes

### .env File
- **Never** commit `.env` to GitHub
- Already added to `.gitignore`
- Set variables directly in Render dashboard

### Frontend Base Path
- Frontend is deployed at `/InvestDemo/` (GitHub Pages subfolder)
- All routes work correctly with `base: '/InvestDemo/'`
- Your domain: `https://yourusername.github.io/InvestDemo/`

### CORS Issues
If you get CORS errors, update your backend `server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://yourusername.github.io',
  credentials: true
}));
```

### Render Free Tier
- Services spin down after 15 minutes of inactivity
- First request will be slow (cold start)
- Upgrade to paid if needed for always-on

---

## STEP 9: Troubleshooting

### Frontend not loading?
1. Check browser console for errors
2. Verify `VITE_API_URL` is set correctly in `.env.production`
3. Rebuild: `cd Front && npm run build`

### API calls failing?
1. Verify backend URL in Frontend `.env.production`
2. Check Render dashboard - is backend running?
3. Check CORS headers in backend

### GitHub Actions failing?
1. Check workflow logs: **Actions** tab in GitHub
2. Verify Node version (should be 18)
3. Check build command: `cd Front && npm run build`

---

## Deployment Checklist

- [ ] Backend `.gitignore` configured
- [ ] Frontend `.gitignore` configured
- [ ] Render service created and deployed
- [ ] Backend environment variables set in Render
- [ ] GitHub Pages enabled
- [ ] GitHub Actions workflow file created
- [ ] Frontend built and deployed
- [ ] Test API calls work
- [ ] Check production URLs are accessible

---

## Next Steps

1. **Test locally first**:
   ```bash
   cd Back && npm start
   cd Front && npm run dev
   ```

2. **Push to GitHub**:
   ```bash
   git push origin main
   ```

3. **Monitor deployments**:
   - Check GitHub Actions: repo → Actions tab
   - Check Render: dashboard

4. **Access your app**:
   - Frontend: `https://yourusername.github.io/InvestDemo/`
   - Backend: `https://investdemo-backend.onrender.com`

Good luck! 🚀

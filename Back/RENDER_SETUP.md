# Render Deployment for Backend

## Quick Setup (5 minutes)

1. **Go to Render.com**
   - Sign up if needed
   - Click "+ New" → "Web Service"

2. **Connect GitHub**
   - Select your repository
   - Connect and authorize

3. **Configure Service**
   - Name: `investdemo-backend`
   - Environment: Node
   - Build Command: `cd Back && npm install`
   - Start Command: `cd Back && npm start`
   - Region: Choose closest to you

4. **Add Environment Variables**
   ```
   PORT=3000
   NODE_ENV=production
   SUPABASE_URL=https://qdopvuoyawlnkwsqjgss.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkb3B2dW95YXdsbmt3c3FqZ3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNzQyOTgsImV4cCI6MjA4MzY1MDI5OH0.lMcF_j6nxck5vN3_9h-utQCJg2Vz1Rh5f8bZinUr-kk
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for it to finish (~2-3 minutes)
   - Copy the service URL

## Result

Your backend will be live at:
```
https://investdemo-backend.onrender.com
```

Use this URL in your frontend `.env.production` file!

## Tips

- **Free Tier**: Services spin down after 15 min of inactivity (first request slow)
- **Auto-Deploy**: Renders automatically redeploys when you push to GitHub
- **Logs**: Check "Logs" tab to debug issues
- **Restart**: Click "Manual Deploy" to force restart

That's it! Your backend is now in production! 🎉

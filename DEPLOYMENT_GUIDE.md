# Live Cloud Deployment Guide (Render + Vercel)

## 1. Push Code to GitHub
```powershell
git add .
git commit -m "Add deployment config, Dockerfile, and 1-click demo accounts"
git push
```

## 2. Deploy PostgreSQL + Spring Boot Backend on Render
1. Go to [render.com](https://render.com) and create a **New PostgreSQL** database (Free tier). Copy its **Internal Database URL**, **Username**, and **Password**.
2. Click **New + -> Web Service**, connect your GitHub repository, and configure:
   - **Root Directory:** `backend`
   - **Runtime:** `Docker`
   - **Instance Type:** `Free`
3. Add these **Environment Variables** in Render:
   - `SPRING_DATASOURCE_URL` = `jdbc:postgresql://<HOST>:5432/<DATABASE>`
   - `SPRING_DATASOURCE_USERNAME` = `<USERNAME>`
   - `DB_PASSWORD` = `<PASSWORD>`
   - `GEMINI_API_KEY` = `<YOUR_GEMINI_API_KEY>`
   - `JWT_SECRET` = `CareerNavigatorProductionJwtSecretKey2026!`
   - `APP_FRONTEND_URL` = `https://your-app.vercel.app,http://localhost:5173`
4. Copy your deployed Render backend URL (e.g., `https://career-navigator-api.onrender.com`).

## 3. Deploy React Frontend on Vercel
1. Go to [vercel.com](https://vercel.com), click **Add New -> Project**, and import your GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Add **Environment Variable**:
   - `VITE_API_URL` = `https://career-navigator-api.onrender.com/api`
4. Click **Deploy**! Copy your live Vercel URL and paste it back into Render's `APP_FRONTEND_URL` variable.

## 4. Recruiter Demo Credentials (Pre-seeded Automatically)
- **Demo Student:** `student@demo.com` / `demo123`
- **Demo Admin:** `admin@demo.com` / `admin123`

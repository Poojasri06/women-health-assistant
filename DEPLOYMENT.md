# Deployment Guide

This app has two independently deployable pieces: a Flask API and a React static site. Below are straightforward options for getting both online — useful if you want a live link for your resume, portfolio, or final-year project demo.

## Overview

```
Browser  →  React static build (e.g. Netlify / Vercel / GitHub Pages)
                │
                ▼ (API calls over HTTPS)
         Flask backend (e.g. Railway / Render / PythonAnywhere)
                │
                ▼
         SQLite or MySQL database
```

## 1. Backend deployment (example: Render)

1. Push the `backend/` folder to a GitHub repository.
2. Create a new **Web Service** on Render (or a similar host like Railway/PythonAnywhere) and point it at the repo.
3. Set the build command: `pip install -r requirements.txt`
4. Set the start command: `gunicorn app:app` (install `gunicorn` and add it to `requirements.txt` first — Flask's built-in dev server should never be used in production).
5. Set these environment variables in the host's dashboard:
   - `SECRET_KEY` — a long random string (never reuse the development default)
   - `CORS_ORIGINS` — your deployed frontend's URL, e.g. `https://your-app.netlify.app`
   - `DATABASE_URL` — only needed if you're upgrading to MySQL/PostgreSQL; otherwise SQLite is used automatically (note: most free hosting tiers wipe the local filesystem on redeploy, so SQLite is fine for a demo but not for long-term real user data — see the note below)
6. Deploy. Confirm it's live by visiting `https://your-backend-url/api/health`.

### A note on SQLite in production

SQLite writes to a single file on disk. Most free-tier hosting platforms use ephemeral storage, meaning that file (and all your data) can be wiped on every redeploy or restart. For a class demo this is usually fine. For anything meant to persist real user data, upgrade to a managed MySQL or PostgreSQL database (most hosts offer a free tier) and point `DATABASE_URL` at it — no code changes needed, as covered in SETUP.md.

## 2. Frontend deployment (example: Netlify)

1. In `frontend/src/api/api.js`, the `baseURL` is currently `/api`, which relies on the `"proxy"` field in `package.json` — that proxy **only works in local development** (`npm start`). For a production build, set the full backend URL instead via an environment variable:

   Create a file `frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://your-backend-url/api
   ```

   And update `src/api/api.js`:
   ```javascript
   const api = axios.create({
     baseURL: process.env.REACT_APP_API_URL || "/api",
     withCredentials: true,
     headers: { "Content-Type": "application/json" },
   });
   ```

2. Build the production bundle:
   ```bash
   cd frontend
   npm run build
   ```
   This creates a `build/` folder of static files.

3. On Netlify (or Vercel): connect your GitHub repo, set the build command to `npm run build` and the publish directory to `build`, then deploy.

4. Back on the backend host, update `CORS_ORIGINS` to match your live Netlify URL exactly (including `https://`, no trailing slash).

## 3. HTTPS and cookies

Browsers block cross-site cookies sent over plain HTTP from being treated as "secure," and most hosts give you HTTPS by default — keep both frontend and backend on HTTPS in production, and set `SESSION_COOKIE_SECURE = True` (already set in `config.py`'s `ProductionConfig`) so cookies behave correctly.

To actually use the production config, change the bottom of `backend/app.py`:
```python
app.config.from_object(ProductionConfig)  # instead of DevelopmentConfig
```
or better, choose it based on an environment variable so the same codebase works in both places.

## 4. Quick checklist before sharing your live link

- [ ] `SECRET_KEY` is a real random value, not the development default
- [ ] `CORS_ORIGINS` exactly matches your deployed frontend URL
- [ ] Frontend is calling the deployed backend URL, not `localhost`
- [ ] Both frontend and backend are served over HTTPS
- [ ] You've registered a test account and clicked through every page once on the live version
- [ ] If using SQLite, you understand it may not persist across redeploys (see note above)

# Setup Instructions

These steps take you from a freshly downloaded project folder to a running app on `http://localhost:3000`.

## Prerequisites

- **Python 3.10+** — check with `python --version`
- **Node.js 18+ and npm** — check with `node --version` and `npm --version`
- No paid accounts, API keys, or external services are needed anywhere in this project.

## 1. Backend setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv

# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Run the server:

```bash
python app.py
```

You should see Flask start on `http://localhost:5000`. On the very first run, it automatically creates `instance/health_assistant.db` (a SQLite file) and all six tables — there is no separate migration step to run.

Quick check that it's alive:

```bash
curl http://localhost:5000/api/health
# {"service": "women-health-assistant-backend", "status": "ok"}
```

## 2. Frontend setup

Open a **second terminal** (keep the backend running in the first one):

```bash
cd frontend
npm install
npm start
```

This opens `http://localhost:3000` in your browser automatically. The `"proxy": "http://localhost:5000"` line in `package.json` forwards every `/api/...` request from the React dev server to your Flask backend, so you don't need to configure anything else for them to talk to each other locally.

## 3. First use

1. Go to `http://localhost:3000/register` and create an account.
2. Log a period or two on the **Period Tracker** page (use real or test dates).
3. Visit the **Dashboard** — predictions, insights, and recommendations will appear automatically once you have at least one period logged. Predictions get more accurate (and switch from "average-based" to "ML-based") once you've logged 4 or more cycles.
4. Try the **Smart Assistant** page and ask something like "Why is my period late?"
5. Generate a PDF from the **Reports** page to see the full report output.

## 4. Switching the database from SQLite to MySQL (optional)

The app reads its database connection string from the `DATABASE_URL` environment variable, falling back to local SQLite if it isn't set.

```bash
# Install a MySQL driver first
pip install pymysql

# Then set the environment variable before running app.py
export DATABASE_URL="mysql+pymysql://username:password@localhost/health_assistant"
python app.py
```

No code changes are required — SQLAlchemy handles the difference.

## 5. Common first-run issues

| Symptom | Likely cause |
|---|---|
| Frontend shows a CORS error in the console | Backend isn't running, or is running on a different port than 5000 |
| Login seems to succeed but every page redirects back to `/login` | `withCredentials` cookie isn't being sent — make sure you're using `npm start` (with the proxy), not opening `index.html` directly |
| `ModuleNotFoundError` when running `python app.py` | Virtual environment isn't activated, or `pip install -r requirements.txt` didn't finish |
| Dashboard shows "No periods logged yet" forever | You haven't added a period yet on the Period Tracker page — this is expected for a new account |

See **PROBLEMS.md** for a longer list of things that commonly go wrong while building (not just running) a project like this.

# Aura — Women's Health Assistant

An AI-powered period tracking and health monitoring web application built as a final-year B.Sc. AI & ML project. No paid or external AI APIs are used anywhere — predictions, recommendations, and the smart assistant are all powered by local rule-based logic and scikit-learn models running on your own data.

## What it does

- **Period tracking** — log periods on a calendar, see cycle history in a table, edit or delete past records.
- **Cycle prediction engine** — predicts your next period, ovulation date, and fertility window. Uses a simple average-based calculation until you've logged enough cycles, then switches to a scikit-learn regression model.
- **Symptom logging** — track physical symptoms (cramps, headache, bloating, fatigue, acne, back pain) and emotional symptoms (mood swings, anxiety, stress, irritability) with severity levels.
- **Mood tracker** — log your daily mood and see a weekly trend chart.
- **Health insights** — rule-based, personalized observations about your cycle regularity, common symptoms, and trends — plus non-diagnostic risk warnings for patterns worth discussing with a doctor.
- **AI recommendation engine** — suggests foods and exercises based on your current cycle phase, recent symptoms, and mood, using a scikit-learn clustering layer on top of rule-based logic.
- **Smart Assistant** — a rule-based chatbot that answers common questions ("Why is my period late?", "What causes cramps?") from a local JSON knowledge base. No internet connection or AI API required.
- **Local notifications** — in-app reminders for upcoming periods, ovulation, medication, water intake, and weekly check-ins. Stored in the database and refreshed by a background scheduler — no push/SMS/email service involved.
- **PDF health reports** — generate a downloadable report with your details, cycle history, predictions, symptoms, mood analysis, and insights, built with ReportLab.
- **Analytics dashboard** — charts for cycle length trends, symptom frequency, mood breakdown, and prediction accuracy.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, Chart.js, react-calendar |
| Backend | Python, Flask, Flask-Login, Flask-CORS |
| Database | SQLite (upgradeable to MySQL) |
| Machine learning | scikit-learn, pandas, NumPy |
| PDF generation | ReportLab |
| Scheduling | APScheduler |

## Project structure

```
women-health-assistant/
├── backend/
│   ├── app.py                  # Flask entry point
│   ├── config.py                # Settings (DB URL, secrets, defaults)
│   ├── extensions.py            # SQLAlchemy + Flask-Login instances
│   ├── models.py                 # User, Period, Symptom, Mood, Notification, Prediction
│   ├── routes/                   # One blueprint per feature area
│   ├── ml/                       # cycle_predictor.py, recommender.py
│   ├── utils/                    # insights_engine.py, notification_engine.py, pdf_generator.py
│   ├── data/assistant_knowledge.json
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/                # One file per screen
│   │   ├── components/           # Sidebar, Navbar, charts, shared UI
│   │   ├── context/               # Auth + dark mode state
│   │   └── api/api.js             # Axios client
│   └── package.json
├── SETUP.md
├── DEPLOYMENT.md
└── PROBLEMS.md                   # Issues you'd likely hit building this manually
```

## Quick start

See **SETUP.md** for full instructions. In short:

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate          # venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py                      # runs on http://localhost:5000

# Frontend (separate terminal)
cd frontend
npm install
npm start                          # runs on http://localhost:3000
```

Register an account in the browser, log a period or two, and the dashboard, predictions, and insights will populate automatically.

## Notes for your viva / report

- The prediction engine is intentionally a transparent, explainable model (Linear Regression over a few engineered features) rather than a deep model, because each user only has a handful of data points — a simple model generalizes far better here and is easy to explain to an examiner.
- The recommendation engine layers a KMeans clustering pass (the explicit ML component) on top of an interpretable rule base, since the inputs are categorical (phase, symptom tags, mood) and there's very little per-user training data to learn from directly.
- All risk-detection and insight wording is deliberately non-diagnostic — it describes patterns in the user's own data and suggests discussing them with a doctor, rather than naming any condition.
- See **PROBLEMS.md** for an honest list of the things that commonly go wrong when building a project like this from scratch — useful if you're asked "what challenges did you face?"

"""
config.py
Central configuration for the Women's Health Assistant backend.
Reads sensitive values from environment variables where possible, with
safe local-development defaults so the app runs out of the box with
`python app.py`.
"""

import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    # --- Core Flask settings ---
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production-3f8a9c")

    # --- Database ---
    # Default: SQLite file stored in /backend/instance/health_assistant.db
    # To upgrade to MySQL, set the DATABASE_URL environment variable, e.g.:
    #   mysql+pymysql://user:password@localhost/health_assistant
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "sqlite:///" + os.path.join(BASE_DIR, "instance", "health_assistant.db"),
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # --- Session / cookies ---
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    PERMANENT_SESSION_LIFETIME = 60 * 60 * 24 * 7  # 7 days

    # --- CORS ---
    # The React dev server runs on 3000 by default.
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")

    # --- App-specific defaults ---
    DEFAULT_CYCLE_LENGTH = 28      # used until a user has logged enough data
    DEFAULT_PERIOD_LENGTH = 5
    MIN_CYCLES_FOR_ML = 4          # below this, fall back to average-based maths
    LUTEAL_PHASE_LENGTH = 14       # days between ovulation and next period (fairly constant)

    # --- PDF report output folder ---
    REPORTS_FOLDER = os.path.join(BASE_DIR, "generated_reports")


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False
    SESSION_COOKIE_SECURE = True

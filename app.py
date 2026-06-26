"""
app.py
Main Flask application entry point.

Run with:  python app.py
This will:
  1. Create the SQLite database + tables on first run (no manual migration needed).
  2. Start the local background scheduler that refreshes notifications daily.
  3. Serve the REST API at http://localhost:5000
"""

import os
import atexit

from flask import Flask, jsonify
from flask_cors import CORS
from flask_login import LoginManager
from apscheduler.schedulers.background import BackgroundScheduler

from config import DevelopmentConfig
from extensions import db, login_manager
from models import User

# --- Blueprints ---
from routes.auth import auth_bp
from routes.periods import periods_bp
from routes.symptoms import symptoms_bp
from routes.moods import moods_bp
from routes.predictions import predictions_bp
from routes.notifications import notifications_bp
from routes.dashboard import dashboard_bp
from routes.insights import insights_bp
from routes.reports import reports_bp
from routes.assistant import assistant_bp
from routes.analytics import analytics_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)

    # --- Extensions ---
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = None  # API-only; we return 401 JSON instead of redirecting

    CORS(app, supports_credentials=True, origins=app.config["CORS_ORIGINS"])

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({"success": False, "errors": ["Please log in to continue."]}), 401

    # --- Register blueprints ---
    app.register_blueprint(auth_bp)
    app.register_blueprint(periods_bp)
    app.register_blueprint(symptoms_bp)
    app.register_blueprint(moods_bp)
    app.register_blueprint(predictions_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(insights_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(assistant_bp)
    app.register_blueprint(analytics_bp)

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "ok", "service": "women-health-assistant-backend"}), 200

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "errors": ["Resource not found."]}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"success": False, "errors": ["An unexpected server error occurred."]}), 500

    with app.app_context():
        os.makedirs(os.path.join(os.path.dirname(__file__), "instance"), exist_ok=True)
        db.create_all()

    return app


def _start_scheduler(app):
    """
    Local daily job that refreshes notifications for every existing user,
    so reminders appear even if a user doesn't open the app that day until
    later. Entirely local (APScheduler) — no external services involved.
    """
    from models import Prediction
    from utils.notification_engine import refresh_notifications_for_user

    def daily_job():
        with app.app_context():
            users = User.query.all()
            for user in users:
                latest_prediction = (
                    Prediction.query.filter_by(user_id=user.id)
                    .order_by(Prediction.generated_at.desc())
                    .first()
                )
                refresh_notifications_for_user(user, latest_prediction)

    scheduler = BackgroundScheduler()
    scheduler.add_job(daily_job, "interval", hours=24, next_run_time=None)
    scheduler.start()
    atexit.register(lambda: scheduler.shutdown(wait=False))


app = create_app()
_start_scheduler(app)

if __name__ == "__main__":
    app.run(debug=True, port=5000)

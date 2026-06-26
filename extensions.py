"""
extensions.py
Holds Flask extension instances so they can be imported by both app.py
and the route modules without causing circular imports.
"""

from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.session_protection = "strong"

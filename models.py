"""
models.py
SQLAlchemy ORM models for the Women's Health Assistant.

Tables: User, Period, Symptom, Mood, Notification, Prediction
Every table that stores personal data includes a user_id foreign key so
that queries can always be scoped to the logged-in user (data isolation).
"""

from datetime import datetime, date
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db


class User(db.Model, UserMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String(180), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    dark_mode = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    periods = db.relationship("Period", backref="user", lazy=True, cascade="all, delete-orphan")
    symptoms = db.relationship("Symptom", backref="user", lazy=True, cascade="all, delete-orphan")
    moods = db.relationship("Mood", backref="user", lazy=True, cascade="all, delete-orphan")
    notifications = db.relationship("Notification", backref="user", lazy=True, cascade="all, delete-orphan")
    predictions = db.relationship("Prediction", backref="user", lazy=True, cascade="all, delete-orphan")

    def set_password(self, raw_password):
        # Werkzeug's default method (pbkdf2:sha256) — strong, salted, no plaintext ever stored.
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        return check_password_hash(self.password_hash, raw_password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "email": self.email,
            "dark_mode": self.dark_mode,
            "created_at": self.created_at.isoformat(),
        }


class Period(db.Model):
    __tablename__ = "periods"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    cycle_length = db.Column(db.Integer, nullable=True)  # days since previous period's start
    flow_intensity = db.Column(db.String(20), nullable=True)  # light / medium / heavy
    notes = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "cycle_length": self.cycle_length,
            "flow_intensity": self.flow_intensity,
            "notes": self.notes,
            "period_length": (
                (self.end_date - self.start_date).days + 1 if self.end_date else None
            ),
        }


class Symptom(db.Model):
    __tablename__ = "symptoms"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    symptom = db.Column(db.String(60), nullable=False)
    category = db.Column(db.String(20), nullable=False)  # physical / emotional
    severity = db.Column(db.String(20), nullable=False)  # mild / moderate / severe
    date = db.Column(db.Date, nullable=False, default=date.today)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "symptom": self.symptom,
            "category": self.category,
            "severity": self.severity,
            "date": self.date.isoformat(),
        }


class Mood(db.Model):
    __tablename__ = "moods"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    mood = db.Column(db.String(20), nullable=False)  # happy / neutral / sad / stressed / angry
    note = db.Column(db.String(300), nullable=True)
    date = db.Column(db.Date, nullable=False, default=date.today)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "mood": self.mood,
            "note": self.note,
            "date": self.date.isoformat(),
        }


class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    title = db.Column(db.String(120), nullable=False)
    message = db.Column(db.String(500), nullable=False)
    category = db.Column(db.String(30), nullable=False, default="general")
    date = db.Column(db.Date, nullable=False, default=date.today)
    status = db.Column(db.String(20), nullable=False, default="unread")  # unread / read
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "message": self.message,
            "category": self.category,
            "date": self.date.isoformat(),
            "status": self.status,
        }


class Prediction(db.Model):
    __tablename__ = "predictions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    next_period = db.Column(db.Date, nullable=False)
    ovulation_date = db.Column(db.Date, nullable=False)
    fertility_window_start = db.Column(db.Date, nullable=False)
    fertility_window_end = db.Column(db.Date, nullable=False)
    predicted_cycle_length = db.Column(db.Integer, nullable=False)
    method = db.Column(db.String(20), nullable=False)  # "average" or "ml"
    generated_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "next_period": self.next_period.isoformat(),
            "ovulation_date": self.ovulation_date.isoformat(),
            "fertility_window_start": self.fertility_window_start.isoformat(),
            "fertility_window_end": self.fertility_window_end.isoformat(),
            "predicted_cycle_length": self.predicted_cycle_length,
            "method": self.method,
            "generated_at": self.generated_at.isoformat(),
        }

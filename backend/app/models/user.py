from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON, Text
from sqlalchemy.sql import func
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)  # Nullable para usuarios de Google
    country = Column(String, nullable=True)
    experience_level = Column(String, nullable=True)
    investment_goal = Column(Text, nullable=True)
    risk_profile_answers = Column(JSON, nullable=True)
    preferences = Column(JSON, nullable=True)
    role = Column(String, default="user")  # 'user' o 'admin'
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    # Campos para Google Auth
    google_id = Column(String, unique=True, nullable=True)
    picture = Column(String, nullable=True)
    email_verified = Column(Boolean, default=False)
    verification_token = Column(String, nullable=True)
    verification_exp = Column(DateTime(timezone=True), nullable=True)
    reset_token = Column(String, nullable=True)
    reset_token_exp = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Campos para sistema de pagos
    is_premium = Column(Boolean, default=False)
    subscription_id = Column(String, nullable=True)

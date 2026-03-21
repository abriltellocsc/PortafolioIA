from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from datetime import datetime

class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    generated_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    metrics = Column(JSON, nullable=False)
    simulation_history = Column(JSON, nullable=True)

    # Relación con assets
    assets = relationship("Asset", back_populates="portfolio")

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=False)
    ticker = Column(String, nullable=False)
    name = Column(String, nullable=False)
    allocation_pct = Column(Float, nullable=False)
    reason = Column(Text, nullable=True)

    # Relación inversa
    portfolio = relationship("Portfolio", back_populates="assets")

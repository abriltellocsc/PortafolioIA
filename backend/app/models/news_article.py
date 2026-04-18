from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(150), nullable=False)
    title = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    url = Column(String(500), nullable=False)
    category = Column(String(100), nullable=True)
    author = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

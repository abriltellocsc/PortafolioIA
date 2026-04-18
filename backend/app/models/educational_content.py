from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class EducationalContent(Base):
    __tablename__ = "educational_content"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), nullable=False)  # Básico, Intermedio, Avanzado, Estrategias, Economía
    title = Column(String(200), nullable=False)
    summary = Column(Text, nullable=False)
    tags = Column(Text, nullable=False)  # JSON string array
    full_content = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
from datetime import datetime

class SupportMessage(Base):
    __tablename__ = "support_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    user_name = Column(String, nullable=False)
    user_email = Column(String, nullable=False, index=True)
    message = Column(Text, nullable=False)
    reply = Column(Text, nullable=True)
    status = Column(String, default="pendiente")  # pendiente, respondido, resuelto
    assigned_to_admin_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"<SupportMessage id={self.id} email={self.user_email} status={self.status}>"

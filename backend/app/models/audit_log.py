from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.database import Base
from datetime import datetime

class AuditLog(Base):
    """
    Modelo para registrar todas las acciones importantes de usuarios.
    Auditoría: quién hizo qué y cuándo.
    """
    __tablename__ = "audit_logs"

    # ID único del registro de auditoría
    id = Column(Integer, primary_key=True, index=True)
    
    # ID del usuario que realizó la acción
    usuario_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Tipo de acción (ej: 'UPGRADE_PREMIUM', 'CAMBIO_PLAN', 'RESET_CONTADOR_IA')
    accion = Column(String, nullable=False, index=True)
    
    # Detalles adicionales de la acción (ej: 'El usuario pasó a plan Premium')
    detalle = Column(Text, nullable=True)
    
    # Fecha y hora exacta de la acción
    fecha = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    
    def __repr__(self):
        return f"<AuditLog(usuario_id={self.usuario_id}, accion={self.accion}, fecha={self.fecha})>"

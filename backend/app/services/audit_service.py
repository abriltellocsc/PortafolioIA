"""
Servicio para grabar auditorías de acciones de usuario.
"""
from app.models.audit_log import AuditLog
from sqlalchemy.orm import Session
from datetime import datetime

def grabar_auditoria(
    db: Session, 
    usuario_id: int, 
    accion: str, 
    detalle: str = None
) -> AuditLog:
    """
    Función para registrar una acción de usuario en la tabla de auditoría.
    
    Args:
        db: sesión de base de datos
        usuario_id: ID del usuario que realiza la acción
        accion: tipo de acción (ej: 'UPGRADE_PREMIUM')
        detalle: descripción más detallada de la acción
        
    Returns:
        El registro de auditoría creado
    """
    try:
        # Crear nuevo registro de auditoría
        nuevo_registro = AuditLog(
            usuario_id=usuario_id,
            accion=accion,
            detalle=detalle,
            fecha=datetime.utcnow()
        )
        
        # Guardar en base de datos
        db.add(nuevo_registro)
        db.commit()
        db.refresh(nuevo_registro)
        
        print(f"✅ Auditoría registrada: usuario={usuario_id}, accion={accion}")
        return nuevo_registro
        
    except Exception as e:
        print(f"❌ Error registrando auditoría: {e}")
        db.rollback()
        return None

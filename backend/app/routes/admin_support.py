
from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Dict, Any
from datetime import datetime
from app.models.user import User
from app.models.support_message import SupportMessage
from app.routes.auth import require_admin
from app.database import get_db
from app.services.audit_service import grabar_auditoria
from sqlalchemy.orm import Session

router = APIRouter(prefix="/admin/support", tags=["admin-support"])


@router.get("/messages", response_description="List all support messages")
async def list_support_messages(current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    """Obtiene todos los mensajes de soporte, ordenados por fecha descendente y status."""
    messages = db.query(SupportMessage).order_by(SupportMessage.created_at.desc()).all()
    return messages


@router.get("/messages/{message_id}", response_description="Get support message by ID")
async def get_support_message(message_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    """Obtiene un mensaje de soporte específico por ID."""
    message = db.query(SupportMessage).filter(SupportMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Mensaje de soporte no encontrado")
    return message


@router.patch("/messages/{message_id}/reply", response_description="Reply to support message")
async def reply_support_message(
    message_id: int, 
    reply_data: Dict[str, Any] = Body(...),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Añade una respuesta a un mensaje de soporte."""
    message = db.query(SupportMessage).filter(SupportMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Mensaje de soporte no encontrado")
    
    reply_text = reply_data.get("reply", "").strip()
    if not reply_text:
        raise HTTPException(status_code=400, detail="Respuesta vacía")
    
    message.reply = reply_text
    message.status = "respondido"
    message.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(message)
    
    grabar_auditoria(db, current_user.id, "ADMIN_REPLY_SUPPORT", f"Replied to support message id={message_id} from {message.user_email}")
    return message


@router.patch("/messages/{message_id}/resolve", response_description="Mark support message as resolved")
async def resolve_support_message(
    message_id: int, 
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Marca un mensaje de soporte como resuelto."""
    message = db.query(SupportMessage).filter(SupportMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Mensaje de soporte no encontrado")
    
    message.status = "resuelto"
    message.resolved_at = datetime.utcnow()
    message.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(message)
    
    grabar_auditoria(db, current_user.id, "ADMIN_RESOLVE_SUPPORT", f"Resolved support message id={message_id} from {message.user_email}")
    return message


@router.patch("/messages/{message_id}/assign", response_description="Assign support message to admin")
async def assign_support_message(
    message_id: int, 
    assign_data: Dict[str, Any] = Body(...),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Asigna un mensaje de soporte a un administrador específico."""
    message = db.query(SupportMessage).filter(SupportMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Mensaje de soporte no encontrado")
    
    admin_id = assign_data.get("admin_id")
    if not admin_id:
        raise HTTPException(status_code=400, detail="admin_id requerido")
    
    # Verificar que el admin existe
    admin = db.query(User).filter(User.id == admin_id, User.role == "admin").first()
    if not admin:
        raise HTTPException(status_code=404, detail="Administrador no encontrado")
    
    message.assigned_to_admin_id = admin_id
    message.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(message)
    
    grabar_auditoria(db, current_user.id, "ADMIN_ASSIGN_SUPPORT", f"Assigned support message id={message_id} to admin {admin.email}")
    return message


@router.delete("/messages/{message_id}", response_description="Delete support message")
async def delete_support_message(
    message_id: int, 
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Elimina un mensaje de soporte."""
    message = db.query(SupportMessage).filter(SupportMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Mensaje de soporte no encontrado")
    
    user_email = message.user_email
    db.delete(message)
    db.commit()
    
    grabar_auditoria(db, current_user.id, "ADMIN_DELETE_SUPPORT", f"Deleted support message id={message_id} from {user_email}")
    return {"message": "Mensaje de soporte eliminado correctamente"}


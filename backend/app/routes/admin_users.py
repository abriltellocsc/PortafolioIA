from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.audit_log import AuditLog
from app.routes.auth import get_current_user, require_admin
from app.services.audit_service import grabar_auditoria
from sqlalchemy.orm import Session

router = APIRouter()


def serialize_user(user: User):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "country": user.country,
        "experience_level": user.experience_level,
        "investment_goal": user.investment_goal,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "email_verified": user.email_verified,
        "is_premium": user.is_premium,
        "subscription_id": user.subscription_id,
        "contador_ia": user.contador_ia,
    }


@router.get("/admin/users")
async def list_users(current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [serialize_user(user) for user in users]


@router.get("/admin/users/{user_id}")
async def get_user(user_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/admin/users/{user_id}/activity")
async def get_user_activity(user_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    activity_logs = db.query(AuditLog).filter(AuditLog.usuario_id == user_id).order_by(AuditLog.fecha.desc()).all()
    return {
        "activity": [
            {
                "id": log.id,
                "usuario_id": log.usuario_id,
                "accion": log.accion,
                "detalle": log.detalle,
                "fecha": log.fecha.isoformat() if log.fecha else None,
            }
            for log in activity_logs
        ]
    }


@router.patch("/admin/users/{user_id}")
async def update_user(user_id: int, data: dict = Body(...), current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_fields = []
    for key, value in data.items():
        if hasattr(user, key):
            setattr(user, key, value)
            updated_fields.append(key)
    db.commit()
    detalle = f"Updated user {user_id}. Campos: {', '.join(updated_fields)}" if updated_fields else f"Updated user {user_id}."
    grabar_auditoria(db, current_user.id, "ADMIN_UPDATE_USER", detalle)
    return {"message": "User updated"}


@router.delete("/admin/users/{user_id}")
async def delete_user(user_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    grabar_auditoria(db, current_user.id, "ADMIN_DELETE_USER", f"Deleted user {user.email} (id={user_id})")
    return {"message": "User deleted"}


@router.post("/admin/users/{user_id}/reset-password")
async def reset_password(user_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    grabar_auditoria(db, current_user.id, "ADMIN_RESET_USER_PASSWORD", f"Requested password reset for user id={user_id}")
    return {"message": "Password reset (mock)"}


@router.post("/admin/users/{user_id}/block")
async def block_user(user_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Este proyecto actualmente no dispone de un campo persistente de bloqueo,
    # por eso la función emula la acción y la registra en la auditoría.
    grabar_auditoria(db, current_user.id, "ADMIN_BLOCK_USER", f"Blocked user {user.email} (id={user_id})")
    return {"message": "User blocked"}


@router.post("/admin/users/{user_id}/unblock")
async def unblock_user(user_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    grabar_auditoria(db, current_user.id, "ADMIN_UNBLOCK_USER", f"Unblocked user {user.email} (id={user_id})")
    return {"message": "User unblocked"}

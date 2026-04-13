from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Optional
from datetime import datetime, timedelta
from app.database import get_db
from app.models.user import User
from app.models.audit_log import AuditLog
from app.routes.auth import get_current_user, require_admin
from app.services.audit_service import grabar_auditoria
from sqlalchemy.orm import Session
from sqlalchemy import or_
from math import ceil

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
        "updated_at": user.updated_at.isoformat() if user.updated_at else None,
        "email_verified": user.email_verified,
        "is_premium": user.is_premium,
        "subscription_id": user.subscription_id,
        "is_active": user.is_active,
        "contador_ia": user.contador_ia,
    }


@router.get("/admin/users")
async def list_users(
    page: int = 1,
    page_size: int = 10,
    status: str = "active",
    role: Optional[str] = None,
    search: Optional[str] = None,
    desde: Optional[str] = None,
    hasta: Optional[str] = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    query = db.query(User)
    now = datetime.utcnow()

    cutoff = now - timedelta(days=30)
    if status == "active":
        query = query.filter(User.is_active == True, User.updated_at != None, User.updated_at >= cutoff)
    elif status == "inactive":
        query = query.filter(or_(User.is_active == False, User.updated_at == None, User.updated_at < cutoff))

    if role:
        query = query.filter(User.role == role)

    if search:
        search_term = f"%{search}%"
        query = query.filter(or_(User.name.ilike(search_term), User.email.ilike(search_term)))

    if desde:
        try:
            desde_dt = datetime.fromisoformat(desde)
            query = query.filter(User.updated_at != None, User.updated_at >= desde_dt)
        except ValueError:
            raise HTTPException(status_code=400, detail="Fecha desde inválida")

    if hasta:
        try:
            hasta_dt = datetime.fromisoformat(hasta)
            query = query.filter(User.updated_at != None, User.updated_at <= hasta_dt)
        except ValueError:
            raise HTTPException(status_code=400, detail="Fecha hasta inválida")

    total = query.count()
    total_pages = ceil(total / page_size) if page_size > 0 else 1
    users = query.order_by(User.updated_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": total_pages,
        "users": [serialize_user(user) for user in users],
    }


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
            if key == "is_active":
                value = bool(value)
            setattr(user, key, value)
            updated_fields.append(key)
    db.commit()
    detalle = f"Updated user {user_id}. Campos: {', '.join(updated_fields)}" if updated_fields else f"Updated user {user_id}."
    if "is_active" in updated_fields:
        status_label = "activo" if user.is_active else "inactivo"
        grabar_auditoria(db, current_user.id, "ADMIN_UPDATE_USER_STATUS", f"Changed status of user {user.email} (id={user_id}) to {status_label}")
    else:
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

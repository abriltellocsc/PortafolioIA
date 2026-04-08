from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db
from app.models.audit_log import AuditLog
from app.models.user import User
from app.routes.auth import require_admin
from sqlalchemy.orm import Session
from sqlalchemy import join

router = APIRouter(prefix="/admin/logs", tags=["admin-logs"])


def serialize_log(log_tuple):
    log, user_name = log_tuple
    return {
        "id": log.id,
        "usuario_id": log.usuario_id,
        "usuario_nombre": user_name or "Unknown",
        "accion": log.accion,
        "detalle": log.detalle,
        "fecha": log.fecha.isoformat() if log.fecha else None,
    }


@router.get("/")
async def list_logs(current_user=Depends(require_admin), db: Session = Depends(get_db)):
    logs = db.query(AuditLog, User.name).join(User, AuditLog.usuario_id == User.id, isouter=True).order_by(AuditLog.fecha.desc()).all()
    return [serialize_log(log_tuple) for log_tuple in logs]


@router.get("/{log_id}")
async def get_log(log_id: int, current_user=Depends(require_admin), db: Session = Depends(get_db)):
    log_tuple = db.query(AuditLog, User.name).join(User, AuditLog.usuario_id == User.id, isouter=True).filter(AuditLog.id == log_id).first()
    if not log_tuple:
        raise HTTPException(status_code=404, detail="Log not found")
    return serialize_log(log_tuple)


@router.delete("/{log_id}")
async def delete_log(log_id: int, current_user=Depends(require_admin), db: Session = Depends(get_db)):
    log = db.query(AuditLog).filter(AuditLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    db.delete(log)
    db.commit()
    return {"message": "Log deleted"}

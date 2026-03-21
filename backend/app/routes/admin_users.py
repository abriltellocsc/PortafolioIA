from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.routes.auth import get_current_user, require_admin
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/admin/users")
async def list_users(current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users


@router.get("/admin/users/{user_id}")
async def get_user(user_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/admin/users/{user_id}")
async def update_user(user_id: int, data: dict = Body(...), current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    for key, value in data.items():
        if hasattr(user, key):
            setattr(user, key, value)
    db.commit()
    return {"message": "User updated"}


@router.delete("/admin/users/{user_id}")
async def delete_user(user_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}


@router.post("/admin/users/{user_id}/reset-password")
async def reset_password(user_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Password reset (mock)"}


@router.post("/admin/users/{user_id}/block")
async def block_user(user_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.status = "bloqueado"
    db.commit()
    return {"message": "User blocked"}

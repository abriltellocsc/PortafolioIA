
from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Dict, Any
from app.models.user import User
from app.routes.auth import require_admin

router = APIRouter(prefix="/admin/support", tags=["admin-support"])

# Note: Support message endpoints are stubs pending SupportMessage model
# Once a SupportMessage SQLAlchemy model is created, implement these endpoints

@router.patch("/messages/{message_id}/reply", response_description="Reply to support message")
async def reply_support_message(message_id: int, reply: str = Body(...), current_user: User = Depends(require_admin)):
    # TODO: Implement once SupportMessage model exists
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.patch("/messages/{message_id}/assign", response_description="Assign support message to admin")
async def assign_support_message(message_id: int, admin_id: int = Body(...), current_user: User = Depends(require_admin)):
    # TODO: Implement once SupportMessage model exists
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.get("/messages", response_description="List all support messages")
async def list_support_messages(current_user: User = Depends(require_admin)):
    # TODO: Implement once SupportMessage model exists
    return []


@router.delete("/messages/{message_id}", response_description="Delete support message")
async def delete_support_message(message_id: int, current_user: User = Depends(require_admin)):
    # TODO: Implement once SupportMessage model exists
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.patch("/messages/{message_id}/resolve", response_description="Mark support message as resolved")
async def resolve_support_message(message_id: int, current_user: User = Depends(require_admin)):
    # TODO: Implement once SupportMessage model exists
    raise HTTPException(status_code=501, detail="Not implemented yet")


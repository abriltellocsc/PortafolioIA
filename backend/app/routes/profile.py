from fastapi import APIRouter, Body, Depends, HTTPException, status
from typing import Dict, Any
try:
    from typing import Annotated
except ImportError:
    from typing_extensions import Annotated
from app.database import get_db
from app.models.user import User
from app.routes.auth import get_current_user
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/risk-profile", response_description="Save or update user risk profile answers")
async def save_risk_profile(
    current_user: User = Depends(get_current_user),
    risk_profile_data: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    current_user.risk_profile_answers = risk_profile_data.get("risk_profile_answers")
    current_user.country = risk_profile_data.get("country")
    current_user.experience_level = risk_profile_data.get("experience_level")
    current_user.investment_goal = risk_profile_data.get("investment_goal")
    current_user.preferences = risk_profile_data.get("preferences")
    # Nota: risk_level no está en el modelo, agregar si es necesario
    db.commit()
    return {"message": "Risk profile updated successfully"}

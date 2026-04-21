from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from app.database import get_db
from app.models.educational_content import EducationalContent
from sqlalchemy.orm import Session
from sqlalchemy import or_
import json

router = APIRouter()


def serialize_educational_content(content: EducationalContent):
    return {
        "id": content.id,
        "category": content.category,
        "title": content.title,
        "summary": content.summary,
        "tags": json.loads(content.tags) if content.tags else [],
        "full_content": content.full_content,
        "is_active": content.is_active,
        "created_at": content.created_at.isoformat() if content.created_at else None,
        "updated_at": content.updated_at.isoformat() if content.updated_at else None,
    }


@router.get("/education")
async def list_public_education(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Endpoint público: devuelve solo contenido educativo activo."""
    query = db.query(EducationalContent).filter(EducationalContent.is_active == True)

    if category:
        query = query.filter(EducationalContent.category == category)

    if search:
        search_term = f"%{search}%"
        query = query.filter(or_(
            EducationalContent.title.ilike(search_term),
            EducationalContent.summary.ilike(search_term),
        ))

    contents = query.order_by(EducationalContent.created_at.desc()).all()

    return {
        "contents": [serialize_educational_content(c) for c in contents],
        "total": len(contents),
    }

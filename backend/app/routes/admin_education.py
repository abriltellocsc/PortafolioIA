from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models.educational_content import EducationalContent
from app.routes.auth import require_admin
from sqlalchemy.orm import Session
from sqlalchemy import or_
from math import ceil
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


@router.get("/admin/education")
async def list_educational_content(
    page: int = 1,
    page_size: int = 10,
    category: Optional[str] = None,
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    current_user = Depends(require_admin),
    db: Session = Depends(get_db)
):
    query = db.query(EducationalContent)

    if category:
        query = query.filter(EducationalContent.category == category)

    if search:
        search_term = f"%{search}%"
        query = query.filter(or_(
            EducationalContent.title.ilike(search_term),
            EducationalContent.summary.ilike(search_term),
            EducationalContent.category.ilike(search_term)
        ))

    if is_active is not None:
        query = query.filter(EducationalContent.is_active == is_active)

    total = query.count()
    total_pages = ceil(total / page_size) if page_size > 0 else 1
    contents = query.order_by(EducationalContent.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": total_pages,
        "contents": [serialize_educational_content(content) for content in contents],
    }


@router.post("/admin/education")
async def create_educational_content(
    category: str = Body(...),
    title: str = Body(...),
    summary: str = Body(...),
    tags: List[str] = Body(...),
    full_content: str = Body(...),
    is_active: bool = Body(True),
    current_user = Depends(require_admin),
    db: Session = Depends(get_db)
):
    try:
        new_content = EducationalContent(
            category=category,
            title=title,
            summary=summary,
            tags=json.dumps(tags),
            full_content=full_content,
            is_active=is_active
        )
        db.add(new_content)
        db.commit()
        db.refresh(new_content)
        return {"message": "Contenido educativo creado exitosamente", "content": serialize_educational_content(new_content)}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al crear contenido: {str(e)}")


@router.get("/admin/education/{content_id}")
async def get_educational_content(content_id: int, current_user = Depends(require_admin), db: Session = Depends(get_db)):
    content = db.query(EducationalContent).filter(EducationalContent.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Contenido educativo no encontrado")
    return serialize_educational_content(content)


@router.put("/admin/education/{content_id}")
async def update_educational_content(
    content_id: int,
    category: Optional[str] = Body(None),
    title: Optional[str] = Body(None),
    summary: Optional[str] = Body(None),
    tags: Optional[List[str]] = Body(None),
    full_content: Optional[str] = Body(None),
    is_active: Optional[bool] = Body(None),
    current_user = Depends(require_admin),
    db: Session = Depends(get_db)
):
    content = db.query(EducationalContent).filter(EducationalContent.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Contenido educativo no encontrado")

    try:
        if category is not None:
            content.category = category
        if title is not None:
            content.title = title
        if summary is not None:
            content.summary = summary
        if tags is not None:
            content.tags = json.dumps(tags)
        if full_content is not None:
            content.full_content = full_content
        if is_active is not None:
            content.is_active = is_active

        db.commit()
        db.refresh(content)
        return {"message": "Contenido educativo actualizado exitosamente", "content": serialize_educational_content(content)}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al actualizar contenido: {str(e)}")


@router.delete("/admin/education/{content_id}")
async def delete_educational_content(content_id: int, current_user = Depends(require_admin), db: Session = Depends(get_db)):
    content = db.query(EducationalContent).filter(EducationalContent.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Contenido educativo no encontrado")

    try:
        db.delete(content)
        db.commit()
        return {"message": "Contenido educativo eliminado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al eliminar contenido: {str(e)}")
from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Dict, Any
from app.database import get_db
from app.models.user import User
from app.models.portfolio import Portfolio
from app.routes.auth import get_current_user, require_admin
from sqlalchemy.orm import Session

router = APIRouter(prefix="/admin/portfolios", tags=["admin-portfolios"])


@router.get("/", response_description="List all portfolios")
async def list_portfolios(current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    portfolios = db.query(Portfolio).all()
    return portfolios


@router.get("/{portfolio_id}", response_description="Get portfolio by ID")
async def get_portfolio(portfolio_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio


@router.delete("/{portfolio_id}", response_description="Delete portfolio")
async def delete_portfolio(portfolio_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    db.delete(portfolio)
    db.commit()
    return {"message": "Portfolio deleted"}


@router.put("/{portfolio_id}", response_description="Update portfolio")
async def update_portfolio(portfolio_id: int, update_data: Dict[str, Any] = Body(...), current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    for key, value in update_data.items():
        if hasattr(portfolio, key):
            setattr(portfolio, key, value)
    db.commit()
    db.refresh(portfolio)
    return portfolio


@router.get("/user/{user_id}", response_description="Get all portfolios for a user")
async def get_user_portfolios(user_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    portfolios = db.query(Portfolio).filter(Portfolio.user_id == user_id).all()
    return portfolios

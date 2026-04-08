from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Dict, Any
from app.database import get_db
from app.models.user import User
from app.models.portfolio import Portfolio, Asset
from app.models.audit_log import AuditLog
from app.routes.auth import get_current_user, require_admin
from app.services.audit_service import grabar_auditoria
from app.services.optimizer_service import generate_portfolio
from sqlalchemy.orm import Session
from sqlalchemy import desc

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
    grabar_auditoria(db, current_user.id, "ADMIN_DELETE_PORTFOLIO", f"Deleted portfolio id={portfolio_id} for user_id={portfolio.user_id}")
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
    grabar_auditoria(db, current_user.id, "ADMIN_UPDATE_PORTFOLIO", f"Updated portfolio id={portfolio_id} for user_id={portfolio.user_id}")
    return portfolio


@router.post("/user/{user_id}/regenerate", response_description="Regenerate the latest portfolio for a user")
async def regenerate_user_portfolio(user_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    latest_portfolio = db.query(Portfolio).filter(Portfolio.user_id == user_id).order_by(desc(Portfolio.generated_at)).first()
    risk_level = latest_portfolio.metrics.get("risk_level") if latest_portfolio and latest_portfolio.metrics else "medio"
    investment_goal = latest_portfolio.metrics.get("investment_goal") if latest_portfolio and latest_portfolio.metrics else "crecimiento"
    experience_level = latest_portfolio.metrics.get("experience_level") if latest_portfolio and latest_portfolio.metrics else "intermedio"
    country = latest_portfolio.metrics.get("country") if latest_portfolio and latest_portfolio.metrics else "global"
    preferences = latest_portfolio.metrics.get("preferences", {}) if latest_portfolio and latest_portfolio.metrics else {}

    generated_portfolio = generate_portfolio(
        {
            "risk_level": risk_level,
            "investment_goal": investment_goal,
            "experience_level": experience_level,
            "country": country,
        },
        preferences,
    )

    new_portfolio = Portfolio(
        user_id=user_id,
        assets=[],
        metrics=generated_portfolio["metrics"],
    )
    db.add(new_portfolio)
    db.commit()
    db.refresh(new_portfolio)

    for asset_data in generated_portfolio["assets"]:
        asset = Asset(
            portfolio_id=new_portfolio.id,
            ticker=asset_data["ticker"],
            name=asset_data["name"],
            allocation_pct=asset_data["allocation_pct"],
            reason=asset_data.get("reason"),
        )
        db.add(asset)
    db.commit()
    db.refresh(new_portfolio)

    grabar_auditoria(db, current_user.id, "ADMIN_REGENERATE_PORTFOLIO", f"Regenerated latest portfolio for user_id={user_id}")

    return {
        "id": new_portfolio.id,
        "user_id": new_portfolio.user_id,
        "generated_at": new_portfolio.generated_at,
        "assets": [{"ticker": a.ticker, "name": a.name, "allocation_pct": a.allocation_pct, "reason": a.reason} for a in new_portfolio.assets],
        "metrics": new_portfolio.metrics,
    }


@router.get("/user/{user_id}", response_description="Get all portfolios for a user")
async def get_user_portfolios(user_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    portfolios = db.query(Portfolio).filter(Portfolio.user_id == user_id).all()
    return portfolios

from fastapi import APIRouter, Body, Depends, HTTPException, status
from typing import Dict, Any, List
try:
    from typing import Annotated
except ImportError:
    from typing_extensions import Annotated
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.models.portfolio import Portfolio, Asset
from app.routes.auth import get_current_user
from app.services.optimizer_service import generate_portfolio
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/optimize", response_description="Generate and save user portfolio")
async def optimize_portfolio(
    current_user: User = Depends(get_current_user),
    portfolio_data: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    user_profile = {
        "risk_level": portfolio_data.get("risk_level"),
        "investment_goal": portfolio_data.get("investment_goal"),
        "experience_level": portfolio_data.get("experience_level"),
        "country": portfolio_data.get("country"),
    }
    preferences = portfolio_data.get("preferences", {})

    # Generar portafolio usando el servicio de optimización
    optimized_portfolio = generate_portfolio(user_profile, preferences)

    # Crear Portfolio
    new_portfolio = Portfolio(
        user_id=current_user.id,
        assets=[],  # Se agregarán después
        metrics=optimized_portfolio["metrics"]
    )
    db.add(new_portfolio)
    db.commit()
    db.refresh(new_portfolio)

    # Crear Assets
    for asset_data in optimized_portfolio["assets"]:
        asset = Asset(
            portfolio_id=new_portfolio.id,
            ticker=asset_data["ticker"],
            name=asset_data["name"],
            allocation_pct=asset_data["allocation_pct"],
            reason=asset_data.get("reason")
        )
        db.add(asset)
    db.commit()

    # Recargar con assets
    db.refresh(new_portfolio)
    
    return {
        "id": new_portfolio.id,
        "user_id": new_portfolio.user_id,
        "generated_at": new_portfolio.generated_at,
        "assets": [{"ticker": a.ticker, "name": a.name, "allocation_pct": a.allocation_pct, "reason": a.reason} for a in new_portfolio.assets],
        "metrics": new_portfolio.metrics
    }

@router.get("/portfolio/{user_id}", response_description="Get user portfolio and simulations")
async def get_user_portfolio(user_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if str(current_user.id) != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this portfolio")
    
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == int(user_id)).first()
    if portfolio:
        return {
            "id": portfolio.id,
            "user_id": portfolio.user_id,
            "generated_at": portfolio.generated_at,
            "assets": [{"ticker": a.ticker, "name": a.name, "allocation_pct": a.allocation_pct, "reason": a.reason} for a in portfolio.assets],
            "metrics": portfolio.metrics,
            "simulation_history": portfolio.simulation_history
        }
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")

@router.post("/simulate", response_description="Execute or save a simulation")
async def simulate_portfolio(
    current_user: User = Depends(get_current_user),
    simulation_data: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    portfolio_id = simulation_data.get("portfolio_id")
    if not portfolio_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Portfolio ID is required for simulation")

    portfolio = db.query(Portfolio).filter(Portfolio.id == int(portfolio_id), Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found or not authorized")

    # Aquí iría la lógica de simulación. Por ahora, solo guardamos los datos.
    simulation_result = {
        "timestamp": datetime.utcnow().isoformat(),
        "params": simulation_data.get("params"),
        "result": {"mock_performance": [10000, 10100, 10250, 10400, 10500]}
    }

    # Actualizar simulation_history
    if portfolio.simulation_history is None:
        portfolio.simulation_history = []
    portfolio.simulation_history.append(simulation_result)
    db.commit()

    return {"message": "Simulation saved successfully"}
    
    return {"message": "Simulation saved successfully", "simulation": simulation_result}

@router.post("/support/contact", response_description="Submit a contact message")
async def submit_contact_message(
    contact_data: Dict[str, Any] = Body(...)
):
    from app.database import db
    from datetime import datetime
    # Construir el documento con los campos necesarios
    message_doc = {
        "user": contact_data.get("name", ""),
        "email": contact_data.get("email", ""),
        "message": contact_data.get("message", ""),
        "created_at": datetime.utcnow(),
        "status": "pendiente"
    }
    db.contact_messages.insert_one(message_doc)
    return {"message": "Mensaje de contacto recibido con éxito."}

@router.get("/news", response_description="Get financial news")
async def get_news():
    # Mock de noticias. En una implementación real, se integraría con una API de noticias.
    mock_news = [
        {
            "id": "1",
            "source": "Bloomberg",
            "title": "Mercados Globales Reaccionan a Nuevas Políticas Económicas",
            "summary": "Analistas observan con cautela los movimientos en las principales bolsas tras los anuncios de la Reserva Federal.",
            "date": "2023-10-26T10:00:00Z"
        },
        {
            "id": "2",
            "source": "Reuters",
            "title": "Innovación en IA Impulsa Acciones Tecnológicas",
            "summary": "El sector tecnológico muestra un fuerte crecimiento impulsado por avances en inteligencia artificial y semiconductores.",
            "date": "2023-10-26T09:30:00Z"
        },
        {
            "id": "3",
            "source": "Financial Times",
            "title": "El Futuro de las Inversiones Sostenibles",
            "summary": "Cada vez más inversores buscan oportunidades en empresas con sólidos criterios ESG (Ambientales, Sociales y de Gobernanza).",
            "date": "2023-10-25T15:00:00Z"
        }
    ]
    return mock_news

## Endpoint y lógica de chatbot eliminados

@router.post("/stock-data", response_description="Get real-time stock data from Yahoo Finance")
async def get_stock_data(
    current_user: Annotated[User, Depends(get_current_user)],
    stock_data: Dict[str, Any] = Body(...)
):
    """
    Obtiene datos en tiempo real de acciones desde Yahoo Finance.
    Recibe una lista de tickers y retorna precios, nombres y métricas.
    """
    tickers = stock_data.get("tickers", [])
    if not tickers:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tickers list is required")
    
    try:
        import yfinance as yf
        
        stock_info = []
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                info = stock.info
                
                # Obtener precio actual
                current_price = info.get('currentPrice') or info.get('regularMarketPrice') or info.get('previousClose', 0)
                
                # Obtener cambio del día
                previous_close = info.get('previousClose', current_price)
                price_change = current_price - previous_close
                price_change_percent = (price_change / previous_close * 100) if previous_close else 0
                
                stock_info.append({
                    "ticker": ticker,
                    "name": info.get('longName') or info.get('shortName') or ticker,
                    "current_price": round(current_price, 2),
                    "previous_close": round(previous_close, 2),
                    "price_change": round(price_change, 2),
                    "price_change_percent": round(price_change_percent, 2),
                    "currency": info.get('currency', 'USD'),
                    "market_cap": info.get('marketCap'),
                    "volume": info.get('volume'),
                    "pe_ratio": info.get('trailingPE'),
                    "dividend_yield": info.get('dividendYield')
                })
            except Exception as e:
                # Si falla un ticker específico, agregar datos de error
                stock_info.append({
                    "ticker": ticker,
                    "name": ticker,
                    "current_price": 0,
                    "error": str(e)
                })
        
        return {"stocks": stock_info}
    
    except ImportError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="yfinance library is not installed. Please install it with: pip install yfinance"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching stock data: {str(e)}"
        )

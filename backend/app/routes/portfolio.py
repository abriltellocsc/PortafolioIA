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
from app.models.support_message import SupportMessage
from app.routes.auth import get_current_user
from app.services.optimizer_service import generate_portfolio, get_market_data, calculate_metrics, normalize_metrics
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/optimize", response_description="Generate and save user portfolio")
async def optimize_portfolio(
    current_user: User = Depends(get_current_user),
    portfolio_data: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    # Validar límite de portafolios para usuarios gratuitos
    if not current_user.is_premium:
        portfolio_count = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).count()
        if portfolio_count >= 3:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Plan Gratuito: máximo 3 portafolios. Mejora a Premium para crear portafolios ilimitados."
            )
    
    user_profile = {
        "risk_level": portfolio_data.get("risk_level"),
        "investment_goal": portfolio_data.get("investment_goal"),
        "experience_level": portfolio_data.get("experience_level"),
        "country": portfolio_data.get("country"),
    }
    preferences = portfolio_data.get("preferences", {})

    # Generar portafolio usando el servicio de optimización
    optimized_portfolio = generate_portfolio(user_profile, preferences)

    # MEJORA: Recalcular métricas basadas en datos históricos reales de los activos
    metrics_recalculated = False
    try:
        print(f"[portfolio] Intentando recalcular métricas basadas en datos históricos...")
        tickers = [asset["ticker"] for asset in optimized_portfolio["assets"]]
        allocation_pct = [asset["allocation_pct"] for asset in optimized_portfolio["assets"]]
        
        print(f"[portfolio] Tickers: {tickers}, Asignaciones: {allocation_pct}")
        
        # Obtener datos históricos
        prices = get_market_data(tickers)
        
        if prices is None or prices.empty:
            raise ValueError("No se obtuvieron precios")
        
        print(f"[portfolio] Precios obtenidos: {prices.shape}")
        
        # Crear diccionario de pesos para calculate_metrics
        weights = {ticker: (alloc / 100.0) for ticker, alloc in zip(tickers, allocation_pct)}
        
        print(f"[portfolio] Pesos calculados: {weights}")
        
        # Calcular métricas reales basadas en datos históricos
        real_metrics = calculate_metrics(prices, weights)
        
        print(f"[portfolio] Métricas reales antes de normalizar: {real_metrics}")
        
        # Normalizar para consistencia (convierte volatility a risk)
        normalized_metrics = normalize_metrics(real_metrics)
        
        print(f"[portfolio] Métricas normalizadas: {normalized_metrics}")
        
        # Reemplazar las métricas generadas por Gemini/random con métricas reales normalizadas
        optimized_portfolio["metrics"] = normalized_metrics
        print(f"✅ Métricas recalculadas exitosamente: {optimized_portfolio['metrics']}")
        metrics_recalculated = True
        
    except Exception as e:
        print(f"⚠️ Error recalculando métricas reales: {e}")
        # Si falla, usar las métricas generadas por Gemini/random
        # pero asegurar que sean normalizadas también
        if optimized_portfolio.get("metrics"):
            optimized_portfolio["metrics"] = normalize_metrics(optimized_portfolio.get("metrics", {}))
            print(f"[portfolio] Usando métricas normalizadas generadas: {optimized_portfolio['metrics']}")
        else:
            print(f"❌ ADVERTENCIA: metrics está vacío, usando valores por defecto")
            optimized_portfolio["metrics"] = normalize_metrics({})
    
    # Validación final: asegurar que não hay NaN
    print(f"[portfolio] Métricas finales antes de guardar: {optimized_portfolio.get('metrics')}")

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
    
    # Obtener el portafolio MÁS RECIENTE (order by generated_at DESC)
    from sqlalchemy import desc
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == int(user_id)).order_by(desc(Portfolio.generated_at)).first()
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
    contact_data: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    """
    Recibe un mensaje de contacto del usuario y lo guarda en la base de datos.
    """
    try:
        name = contact_data.get("name", "").strip()
        email = contact_data.get("email", "").strip()
        message = contact_data.get("message", "").strip()
        
        # Validación básica
        if not name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nombre requerido"
            )
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email requerido"
            )
        if not message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mensaje requerido"
            )
        
        # Crear mensaje de soporte
        support_msg = SupportMessage(
            user_name=name,
            user_email=email,
            message=message,
            status="pendiente"
        )
        
        db.add(support_msg)
        db.commit()
        db.refresh(support_msg)
        
        print(f"[SUPPORT] Nuevo mensaje guardado - ID: {support_msg.id}, Email: {email}")
        
        return {
            "success": True,
            "message": "Mensaje de contacto recibido con éxito. Te contactaremos pronto.",
            "support_message_id": support_msg.id
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"[SUPPORT] Error al procesar mensaje: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al procesar el mensaje de contacto"
        )

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
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"yfinance no disponible: {e}")

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

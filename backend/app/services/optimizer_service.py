import os
import json
from typing import Dict, Any, List

# Nota: google-generativeai 0.1.0rc1 no es compatible con modelos modernos de Google.
# Si necesitas usar Gemini, actualiza a Python 3.10+ e instala la versión más nueva de google-generativeai.
# Por ahora, usamos el generador estático que funciona perfectamente.


def generate_portfolio(user_profile: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
    """
    Genera un portafolio de inversión diversificado e inteligente basado en el perfil del usuario.
    (Usa el generador estático - compatible con todas las versiones)
    """
    return generate_portfolio_static(user_profile, preferences)


def generate_portfolio_static(user_profile: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
    """
    Versión estática original (Respaldo)
    """
    risk_level = user_profile.get("risk_level", "medium")
    
    EXTENDED_ASSETS = [
        {"ticker": "TLT", "name": "iShares 20+ Year Treasury Bond ETF", "reason": "Bonos del tesoro estadounidense a largo plazo."},
        {"ticker": "JNJ", "name": "Johnson & Johnson", "reason": "Empresa farmacéutica estable con dividendos."},
        {"ticker": "MSFT", "name": "Microsoft Corporation", "reason": "Líder tecnológico global."},
        {"ticker": "EMB", "name": "iShares Emerging Markets Bond ETF", "reason": "Bonos de mercados emergentes."},
        {"ticker": "VT", "name": "Vanguard Total World Stock ETF", "reason": "Cobertura global diversificada."},
        {"ticker": "NVDA", "name": "NVIDIA Corporation", "reason": "Tecnología y semiconductores."},
        {"ticker": "BTC-USD", "name": "Bitcoin USD", "reason": "Criptomoneda líder, alta volatilidad."},
        {"ticker": "GLD", "name": "SPDR Gold Trust", "reason": "Oro físico, protección contra inflación."}
    ]

    if risk_level == "low":
        selected = EXTENDED_ASSETS[:5]
        allocations = [35, 25, 15, 15, 10]
        expected_return = 0.05
        risk = 0.03
    elif risk_level == "medium":
        selected = EXTENDED_ASSETS[:7]
        allocations = [25, 15, 15, 15, 10, 10, 10]
        expected_return = 0.10
        risk = 0.08
    else: 
        selected = EXTENDED_ASSETS[:8]
        allocations = [20, 15, 15, 15, 10, 10, 10, 5]
        expected_return = 0.18
        risk = 0.15

    portfolio_assets = []
    for i, asset in enumerate(selected):
        portfolio_assets.append({
            "ticker": asset["ticker"],
            "name": asset["name"],
            "allocation_pct": allocations[i],
            "reason": asset["reason"]
        })

    return {
        "assets": portfolio_assets,
        "metrics": {"expected_return": expected_return, "risk": risk}
    }
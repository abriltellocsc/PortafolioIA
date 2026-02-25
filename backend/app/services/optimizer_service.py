import os
import json
import google.generativeai as genai
from typing import Dict, Any, List

# Configurar la API Key
api_key = os.getenv("API_KEY_GEMINI")
if api_key:
    try:
        genai.configure(api_key=api_key)
    except Exception as e:
        print(f"[genai] Error configurando API: {e}")


def generate_portfolio(user_profile: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
    """
    Genera un portafolio de inversión usando Google Gemini AI.
    Si falla, usa el generador estático como respaldo.
    """
    if not api_key:
        print("API_KEY_GEMINI no configurada, usando generador estático.")
        return generate_portfolio_static(user_profile, preferences)

    prompt = f"""
    Eres un asesor financiero experto. Crea un portafolio de inversión diversificado e inteligente para un cliente con el siguiente perfil:
    - Nivel de riesgo tolerado: {user_profile.get('risk_level', 'medio')}
    - Objetivo de inversión: {user_profile.get('investment_goal', 'crecimiento')}
    - Nivel de experiencia: {user_profile.get('experience_level', 'intermedio')}
    - País de residencia: {user_profile.get('country', 'desconocido')}
    - Monto inicial a invertir: {preferences.get('amount', 10000)} USD

    Reglas:
    1. Selecciona entre 5 y 8 activos (tickers reales de Yahoo Finance, ej. AAPL, SPY, TLT, BTC-USD).
    2. La suma de 'allocation_pct' debe ser exactamente 100.
    3. Adapta los activos a la situación macroeconómica del país del usuario pero mantén diversificación global.

    Devuelve ÚNICAMENTE un objeto JSON válido con la siguiente estructura exacta, sin texto adicional ni formato markdown:
    {{
        "assets": [
            {{
                "ticker": "Símbolo",
                "name": "Nombre completo de la empresa o fondo",
                "allocation_pct": 20.5,
                "reason": "Justificación breve y profesional de por qué este activo es ideal para este perfil."
            }}
        ],
        "metrics": {{
            "expected_return": 0.12,
            "risk": 0.08
        }}
    }}
    """

    try:
        # Usar generative-ai moderno con GenerativeModel
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(prompt)
        
        # Extraer texto de la respuesta
        response_text = response.text.strip() if hasattr(response, 'text') else str(response).strip()
        
        # Limpiar markdown si está envuelto
        if response_text.startswith("```json"):
            response_text = response_text[7:-3].strip()
        elif response_text.startswith("```"):
            response_text = response_text[3:-3].strip()
        
        # Parsear JSON
        portfolio_data = json.loads(response_text)
        
        # Validar estructura
        if "assets" in portfolio_data and "metrics" in portfolio_data:
            print("[genai] Portafolio generado exitosamente con Gemini AI")
            return portfolio_data
        else:
            raise ValueError("JSON inválido: falta 'assets' o 'metrics'")
        
    except Exception as e:
        print(f"[genai] Error generando portafolio: {type(e).__name__}: {e}")
        print("[genai] Usando generador estático como respaldo")
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
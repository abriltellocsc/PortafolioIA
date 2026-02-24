import os
import json
import google.generativeai as genai
from typing import Dict, Any, List

# Configurar la API Key leyendo del archivo .env
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def generate_portfolio(user_profile: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
    """
    Intenta generar el portafolio usando IA (Gemini).
    Si falla o no hay API key, usa la versión estática de respaldo.
    """
    if not api_key:
        print("No se encontró GEMINI_API_KEY, usando versión estática de respaldo.")
        return generate_portfolio_static(user_profile, preferences)

    try:
        # Usamos el modelo Gemini Pro (varias versiones de la librería exponen APIs distintas)
        # Intentamos crear el objeto modelo si la librería lo soporta
        try:
            model = genai.GenerativeModel('gemini-pro')
        except Exception:
            model = None

        # Construimos las instrucciones para la IA
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
        3. Adapta los activos a la situación macroeconómica de su país si es relevante, pero mantén diversificación global.

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
        
        # Llamar a la API - varios paths para ser resiliente a diferencias de versión
        response = None
        response_text = None
        # Intento 1: si disponemos de un objeto model con método generate_content
        if model is not None:
            try:
                response = model.generate_content(prompt)
            except Exception:
                response = None

        # Intento 2: usar la función genai.generate si existe
        if response is None:
            try:
                response = genai.generate(model="gemini-pro", prompt=prompt)
            except Exception:
                response = None

        # Intento 3: usar la función generate_text (expuesta en algunas versiones)
        if response is None:
            try:
                response = genai.generate_text(model="gemini-pro", input=prompt)
            except Exception:
                response = None

        # Intento 4: usar get_model().generate
        if response is None:
            try:
                m = genai.get_model("gemini-pro")
                response = m.generate(prompt=prompt)
            except Exception:
                response = None

        if response is None:
            raise RuntimeError("No se pudo generar respuesta desde la librería google.generativeai con las APIs disponibles")

        # Extraer el texto desde la respuesta en sus distintas formas posibles
        def _extract_text(resp: Any) -> str:
            # objetos con atributo 'text'
            if hasattr(resp, 'text') and isinstance(resp.text, str):
                return resp.text
            # objetos con 'candidates' (cliente nuevo)
            if hasattr(resp, 'candidates') and len(getattr(resp, 'candidates') or []) > 0:
                cand = getattr(resp, 'candidates')[0]
                if hasattr(cand, 'content'):
                    return cand.content
                if isinstance(cand, dict) and 'content' in cand:
                    return cand['content']
            # respuesta tipo dict
            if isinstance(resp, dict):
                # posible estructura: {'candidates':[{'content': '...'}]}
                cand = resp.get('candidates')
                if isinstance(cand, list) and len(cand) > 0:
                    first = cand[0]
                    if isinstance(first, dict) and 'content' in first:
                        return first['content']
                # texto plano en 'output' o 'text' o 'content'
                for key in ('output', 'text', 'content'):
                    if key in resp and isinstance(resp[key], str):
                        return resp[key]
                # último recurso: serializar
                return json.dumps(resp)
            # objetos con atributo 'output'
            if hasattr(resp, 'output') and isinstance(getattr(resp, 'output'), str):
                return getattr(resp, 'output')
            # fallback a str()
            return str(resp)

        response_text = _extract_text(response).strip()
        
        # Limpiar el formato markdown si Gemini lo incluye (```json ... ```)
        if response_text.startswith("```json"):
            response_text = response_text[7:-3]
        elif response_text.startswith("```"):
            response_text = response_text[3:-3]
            
        # Convertir la respuesta de texto a un diccionario de Python
        portfolio_data = json.loads(response_text)
        
        # Pequeña validación de seguridad
        if "assets" in portfolio_data and "metrics" in portfolio_data:
            print("Portafolio generado exitosamente con Gemini AI.")
            return portfolio_data
        else:
            raise ValueError("El JSON no tiene la estructura correcta.")
            
    except Exception as e:
        print(f"Error al usar Gemini API: {e}. Usando versión estática como respaldo.")
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
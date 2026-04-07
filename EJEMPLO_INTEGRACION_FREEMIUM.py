"""
EJEMPLO: Cómo usar la validación de restricciones en un endpoint.

Este archivo muestra un ejemplo de cómo integrar la lógica de restricción
en un endpoint existente de la API.
"""

# ============================================================================
# EJEMPLO 1: Validar límite de IA en una llamada a la API
# ============================================================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.routes.auth import get_current_user
from app.models.user import User
from app.database import get_db
from app.services.restrictions_service import validar_limite_ia, incrementar_contador_ia

router = APIRouter()

@router.post("/api/recomendaciones/generar")
async def generar_recomendacion_ia(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    🤖 Endpoint que genera recomendaciones usando IA.
    IMPORTANTE: Valida si el usuario gratuito no excedió límite.
    """
    
    # PASO 1: Validar si el usuario puede usar esta función
    try:
        limite_resultado = validar_limite_ia(current_user)
        print(f"✅ Validación OK: {limite_resultado}")
    except HTTPException as e:
        # Si no puede usar, lanzar error 403
        raise e
    
    # PASO 2: Si pasó validación, incrementar contador
    incrementar_contador_ia(current_user)
    db.add(current_user)
    db.commit()
    
    # PASO 3: Generar recomendación (simulado)
    recomendacion = {
        "simbolo": "AAPL",
        "accion": "COMPRAR",
        "precio_objetivo": 150.00,
        "razon": "Crecimiento esperado en sector tech"
    }
    
    return {
        "success": True,
        "recomendacion": recomendacion,
        "contador_usado": current_user.contador_ia
    }


# ============================================================================
# EJEMPLO 2: Cómo registrar auditorías en una acción importante
# ============================================================================

from app.services.audit_service import grabar_auditoria

@router.post("/api/portafolio/crear")
async def crear_portafolio(
    nombre: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    💼 Endpoint que crea un nuevo portafolio.
    Registra la acción en auditoría.
    """
    
    try:
        # Crear portafolio (pseudocódigo)
        # nuevo_portafolio = Portfolio(usuario_id=current_user.id, nombre=nombre)
        # db.add(nuevo_portafolio)
        # db.commit()
        
        # Registrar la acción en auditoría
        grabar_auditoria(
            db=db,
            usuario_id=current_user.id,
            accion="CREAR_PORTAFOLIO",
            detalle=f"Creó portafolio '{nombre}'"
        )
        
        return {
            "success": True,
            "mensaje": "Portafolio creado exitosamente"
        }
        
    except Exception as e:
        print(f"❌ Error creando portafolio: {e}")
        raise HTTPException(status_code=500, detail="Error creando portafolio")


# ============================================================================
# EJEMPLO 3: Usar ambas cosas en un endpoint complejo
# ============================================================================

@router.post("/api/optimizar-portafolio")
async def optimizar_portafolio(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    🎯 Endpoint que optimiza el portafolio usando IA avanzada.
    - Valida restricción de usuario gratuito
    - Registra en auditoría
    - Incrementa contador
    """
    
    # Paso 1: Validar restricción
    validar_limite_ia(current_user)
    
    # Paso 2: Hacer operación
    resultado_optimizado = {
        "rendimiento_esperado": 12.5,
        "riesgo": "medio",
        "composicion": {"acciones": 60, "bonos": 30, "efectivo": 10}
    }
    
    # Paso 3: Incrementar contador
    incrementar_contador_ia(current_user)
    db.add(current_user)
    db.commit()
    
    # Paso 4: Registrar auditoría
    grabar_auditoria(
        db=db,
        usuario_id=current_user.id,
        accion="OPTIMIZAR_PORTAFOLIO",
        detalle=f"Optimizó portafolio usando IA (contador: {current_user.contador_ia})"
    )
    
    return {
        "success": True,
        "portafolio_optimizado": resultado_optimizado,
        "llamadas_usadas": current_user.contador_ia
    }

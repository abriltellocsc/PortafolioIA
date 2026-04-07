"""
Rutas para el sistema de usuarios y pagos (Freemium).
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.models.user import User
from app.database import get_db
from app.routes.auth import get_current_user
from app.services.audit_service import grabar_auditoria
from app.services.email_service import send_upgrade_email, send_cancel_email
from pydantic import BaseModel

router = APIRouter()

class MejorarPlanRequest(BaseModel):
    """Modelo para la solicitud de mejora a plan Premium"""
    metodo_pago: str = "tarjeta"  # Simulado; podría ser "tarjeta", "paypal", etc.


@router.post("/mejorar-plan", response_description="Usuario se mejora a plan Premium")
async def mejorar_plan(
    request: MejorarPlanRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    🎯 Endpoint para simular el pago y upgrade a plan Premium.
    
    - Cambia is_premium a True
    - Resetea el contador_ia a 0 (acceso ilimitado)
    - Registra la acción en auditoría
    - Retorna los datos actualizados del usuario
    """
    try:
        # Si ya es premium, retornar mensaje
        if current_user.is_premium:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya eres usuario Premium"
            )
        
        # CAMBIO 1: Actualizar a Premium
        current_user.is_premium = True
        current_user.subscription_id = f"SUB_{current_user.id}_{datetime.utcnow().timestamp()}"
        current_user.contador_ia = 0  # Resetear contador en caso de que tenga
        
        # Guardar cambios
        db.add(current_user)
        db.commit()
        db.refresh(current_user)
        
        # CAMBIO 2: Registrar en auditoría
        detalle = f"El usuario '{current_user.name}' ({current_user.email}) se mejoró a Premium usando {request.metodo_pago}"
        grabar_auditoria(
            db=db,
            usuario_id=current_user.id,
            accion="UPGRADE_PREMIUM",
            detalle=detalle
        )
        
        # CAMBIO 3: Enviar email de notificación
        send_upgrade_email(current_user.name, current_user.email)
        
        # Retornar datos actualizados
        return {
            "success": True,
            "mensaje": "¡Felicitaciones! Ya eres usuario Premium",
            "usuario": {
                "id": current_user.id,
                "nombre": current_user.name,
                "email": current_user.email,
                "es_premium": current_user.is_premium,
                "subscription_id": current_user.subscription_id,
                "contador_ia": current_user.contador_ia
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error mejorando plan: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al procesar el upgrade a Premium"
        )


@router.get("/mi-plan", response_description="Obtener información del plan actual")
async def obtener_mi_plan(
    current_user: User = Depends(get_current_user)
):
    """
    📋 Endpoint para obtener información del plan actual del usuario.
    
    Retorna:
    - si es Premium o Gratuito
    - contador de llamadas a IA usadas
    - límite de llamadas (si es gratuito)
    """
    limite_ia = 3
    restantes = limite_ia - current_user.contador_ia if not current_user.is_premium else "Ilimitado"
    
    return {
        "usuario_id": current_user.id,
        "nombre": current_user.name,
        "email": current_user.email,
        "plan": "Premium" if current_user.is_premium else "Gratuito",
        "es_premium": current_user.is_premium,
        "contador_ia_usado": current_user.contador_ia,
        "limite_ia": limite_ia if not current_user.is_premium else "Ilimitado",
        "consultas_restantes": restantes,
        "subscription_id": current_user.subscription_id
    }


@router.post("/cancelar-plan", response_description="Cancelar plan Premium y volver a Gratuito")
async def cancelar_plan(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    ❌ Endpoint para cancelar el plan Premium y volver a plan Gratuito
    
    - Cambia is_premium a False
    - Resetea el contador_ia a 0
    - Limpia la subscription_id
    - Registra la acción en auditoría
    """
    try:
        # Si no es premium, retornar mensaje
        if not current_user.is_premium:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya eres usuario Gratuito"
            )
        
        # Cambiar a Gratuito
        current_user.is_premium = False
        current_user.subscription_id = None
        current_user.contador_ia = 0  # Resetear contador
        
        # Guardar cambios
        db.add(current_user)
        db.commit()
        db.refresh(current_user)
        
        # Registrar en auditoría
        detalle = f"El usuario '{current_user.name}' ({current_user.email}) canceló su plan Premium"
        grabar_auditoria(
            db=db,
            usuario_id=current_user.id,
            accion="CANCEL_PREMIUM",
            detalle=detalle
        )
        
        # Enviar email de notificación
        send_cancel_email(current_user.name, current_user.email)
        
        # Retornar datos actualizados
        return {
            "success": True,
            "mensaje": "Tu plan Premium ha sido cancelado. Volviste a plan Gratuito",
            "usuario": {
                "id": current_user.id,
                "nombre": current_user.name,
                "email": current_user.email,
                "es_premium": current_user.is_premium,
                "subscription_id": current_user.subscription_id,
                "contador_ia": current_user.contador_ia
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error cancelando plan: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al cancelar el plan Premium"
        )

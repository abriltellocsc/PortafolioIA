"""
Funciones para validar restricciones de plan gratuito vs premium.
"""
from fastapi import HTTPException, status
from app.models.user import User

# Límite de llamadas a IA para usuarios gratuitos
LIMITE_IA_GRATUITO = 3

def validar_limite_ia(usuario: User) -> dict:
    """
    Valida si un usuario gratuito ha excedido su límite de llamadas a IA.
    
    Args:
        usuario: objeto User de la base de datos
        
    Returns:
        dict con 'permitido' (bool) y 'mensaje' (str)
        
    Lanza:
        HTTPException 403 si el usuario es gratuito y excedió el límite
    """
    # Si el usuario es premium, sin restricciones
    if usuario.is_premium:
        return {
            "permitido": True,
            "mensaje": "Usuario Premium - Sin límites",
            "contador": usuario.contador_ia
        }
    
    # Si es gratuito, revisar el contador
    if usuario.contador_ia > LIMITE_IA_GRATUITO:
        print(f"⛔ Usuario {usuario.id} ({usuario.email}) excedió límite de IA")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Límite de consultas gratuitas alcanzado ({LIMITE_IA_GRATUITO}). Pasa a Premium para funciones ilimitadas."
        )
    
    # Aún le quedan consultas
    consultas_restantes = LIMITE_IA_GRATUITO - usuario.contador_ia
    return {
        "permitido": True,
        "mensaje": f"Usuario Gratuito - {consultas_restantes} consultas restantes",
        "contador": usuario.contador_ia,
        "restantes": consultas_restantes
    }


def incrementar_contador_ia(usuario: User) -> None:
    """
    Incrementa el contador de llamadas a IA del usuario.
    (Importante: la sesión debe hacer commit después de llamar esto)
    """
    usuario.contador_ia += 1
    print(f"📊 Contador IA incrementado para usuario {usuario.id}: {usuario.contador_ia}/{LIMITE_IA_GRATUITO}")

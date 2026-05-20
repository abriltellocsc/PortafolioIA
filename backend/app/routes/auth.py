
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Body
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr
from typing import Dict, Optional
try:
    from typing import Annotated
except ImportError:
    from typing_extensions import Annotated
from datetime import datetime, timedelta
import os
import secrets
import smtplib
import requests
import bcrypt
from email.message import EmailMessage
from urllib.parse import urlencode

from app.models.user import User
from app.models.portfolio import Portfolio
from app.database import get_db
from sqlalchemy.orm import Session
from app.utils.jwt_handler import signJWT, decodeJWT

try:
    from google.oauth2 import id_token as google_id_token
    from google.auth.transport import requests as google_requests
    GOOGLE_AUTH_AVAILABLE = True
except Exception:
    google_id_token = None
    google_requests = None
    GOOGLE_AUTH_AVAILABLE = False

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# ============================================================================
# Pydantic Models
# ============================================================================

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    token: str
    new_password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


# ============================================================================
# Utility Functions
# ============================================================================

def get_password_hash(password: str) -> str:
    from passlib.hash import pbkdf2_sha256
    return pbkdf2_sha256.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False
    try:
        from passlib.hash import pbkdf2_sha256
        return pbkdf2_sha256.verify(plain_password, hashed_password)
    except Exception:
        return False


def send_reset_email(to_email: str, token: str):
    print(f"\n🔄 Intentando enviar email de recuperación a {to_email}")
    
    msg = EmailMessage()
    msg["Subject"] = "Recuperación de contraseña - PortafolioIA"
    msg["From"] = "no-reply@portafolioai.com"
    msg["To"] = to_email
    reset_link = os.getenv("FRONTEND_URL", "http://localhost:5173") + f"/reset-password?token={token}&email={to_email}"
    
    body = f"""
Hola,

Recibimos una solicitud para restablecer tu contraseña de PortafolioIA.

Haz clic en el siguiente enlace para crear una nueva contraseña:
{reset_link}

O copia y pega este enlace en tu navegador si el anterior no funciona.

Este enlace expirará en 1 hora por razones de seguridad.

Si no solicitaste un restablecimiento de contraseña, ignora este mensaje.

Saludos,
Equipo PortafolioIA
"""
    msg.set_content(body)
    
    try:
        smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_pass = os.getenv("SMTP_PASS")
        
        print(f"📧 SMTP configuración: HOST={smtp_host}, PORT={smtp_port}, USER={smtp_user}")
        
        if not smtp_user or not smtp_pass:
            print(f"⚠️ SMTP no configurado: USER={smtp_user}, PASS={'***' if smtp_pass else 'NONE'}")
            return False
        
        print(f"🔐 Conectando a SMTP...")
        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
            server.starttls()
            print(f"🔓 TLS iniciado, autenticando...")
            server.login(smtp_user, smtp_pass)
            print(f"✅ Autenticado")
            server.send_message(msg)
            print(f"✅ Email de recuperación enviado a {to_email}")
            return True
    except smtplib.SMTPAuthenticationError as e:
        print(f"❌ Error de autenticación SMTP: {e}")
        return False
    except smtplib.SMTPException as e:
        print(f"❌ Error SMTP: {e}")
        return False
    except Exception as e:
        print(f"❌ Error enviando email de recuperación: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return False


def send_verification_email(to_email: str, token: str):
    print(f"\n🔄 Intentando enviar email de verificación a {to_email}")
    
    msg = EmailMessage()
    msg["Subject"] = "Verifica tu cuenta en PortafolioIA"
    msg["From"] = "no-reply@portafolioai.com"
    msg["To"] = to_email
    verify_link = os.getenv("FRONTEND_URL", "http://localhost:5173") + f"/verify-email?token={token}&email={to_email}"
    
    body = f"""
Hola,

Gracias por registrarte en PortafolioIA. Para completar tu registro y acceder a tu cuenta, debe verificar tu dirección de correo electrónico.

Haz clic en el siguiente enlace para verificar tu email:
{verify_link}

O copia y pega este enlace en tu navegador si el anterior no funciona.

Este enlace expirará en 24 horas por razones de seguridad.

Si no creaste esta cuenta, ignora este mensaje.

Saludos,
Equipo PortafolioIA
"""
    msg.set_content(body)
    
    try:
        smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_pass = os.getenv("SMTP_PASS")
        
        print(f"📧 SMTP configuración: HOST={smtp_host}, PORT={smtp_port}, USER={smtp_user}")
        
        if not smtp_user or not smtp_pass:
            print(f"⚠️ SMTP no configurado: USER={smtp_user}, PASS={'***' if smtp_pass else 'NONE'}")
            print(f"ℹ️ Enlace de verificación (solo para dev): {verify_link}")
            return False
        
        print(f"🔐 Conectando a SMTP...")
        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
            server.starttls()
            print(f"🔓 TLS iniciado, autenticando...")
            server.login(smtp_user, smtp_pass)
            print(f"✅ Autenticado")
            server.send_message(msg)
            print(f"✅ Email de verificación enviado a {to_email}")
            return True
    except smtplib.SMTPAuthenticationError as e:
        print(f"❌ Error de autenticación SMTP: {e}")
        return False
    except smtplib.SMTPException as e:
        print(f"❌ Error SMTP: {e}")
        return False
    except Exception as e:
        print(f"❌ Error enviando email de verificación: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return False


# ============================================================================
# Dependencies
# ============================================================================

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decodeJWT(token)
    if payload is None:
        raise credentials_exception
    user_id = payload.get("user_id")
    if user_id is None:
        raise credentials_exception
    
    try:
        user_id_int = int(user_id)
    except ValueError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id_int).first()
    if user is None:
        raise credentials_exception
    return user


def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user


# ============================================================================
# Routes - Authentication
# ============================================================================

@router.post("/register", response_description="Register new user")
async def register_user(user_data: UserRegister = Body(...), background_tasks: BackgroundTasks = None, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        role="user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    verification_token = None
    try:
        verification_token = secrets.token_urlsafe(24)
        verification_exp = datetime.utcnow() + timedelta(hours=24)
        new_user.verification_token = verification_token
        new_user.verification_exp = verification_exp
        db.commit()
    except Exception:
        verification_token = None

    if verification_token and background_tasks is not None:
        try:
            background_tasks.add_task(send_verification_email, new_user.email, verification_token)
        except Exception:
            pass

    return {"message": "User registered successfully. Verification email sent if SMTP configured.", "user_id": new_user.id}


@router.post("/login", response_description="Login user")
async def user_login(user_credentials: Dict[str, str] = Body(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials["email"]).first()
    
    # Verificar que el usuario existe y la contraseña es correcta
    if not user or not verify_password(user_credentials["password"], user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verificar que el email ha sido verificado
    if not user.email_verified:
        raise HTTPException(
            status_code=403,
            detail="Email no verificado. Por favor, verifica tu email antes de ingresar."
        )
    
    return signJWT(str(user.id), user.role)


@router.get("/me", response_description="Get current user")
async def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()
    user_dict = {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "is_premium": current_user.is_premium,
        "subscription_id": current_user.subscription_id,
        "contador_ia": current_user.contador_ia,
        "portfolio": portfolio
    }
    return user_dict


@router.get("/verify-email", response_description="Verifica el email de un usuario")
async def verify_email(token: Optional[str] = None, email: Optional[str] = None, db: Session = Depends(get_db)):
    if not token or not email:
        raise HTTPException(status_code=400, detail="Token y email requeridos")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if user.email_verified:
        return {"message": "Email ya verificado"}
    if user.verification_token != token:
        raise HTTPException(status_code=400, detail="Token inválido")
    if user.verification_exp and datetime.utcnow() > user.verification_exp:
        raise HTTPException(status_code=400, detail="Token expirado")
    user.email_verified = True
    user.verification_token = None
    user.verification_exp = None
    db.commit()
    return {"message": "Email verificado correctamente"}


@router.post("/forgot-password", response_description="Enviar email de recuperación")
async def forgot_password(data: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    print(f"\n📧 Solicitud de recuperación de contraseña para: {data.email}")
    
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        print(f"⚠️ Usuario no encontrado: {data.email}")
        return {"message": "Si el correo existe, recibirás instrucciones."}
    
    print(f"✅ Usuario encontrado: {user.name} ({data.email})")
    reset_token = secrets.token_urlsafe(8)
    reset_exp = datetime.utcnow() + timedelta(hours=1)
    user.reset_token = reset_token
    user.reset_token_exp = reset_exp
    db.commit()
    
    print(f"🔑 Token generado y guardado en DB")
    print(f"📨 Agregando tarea de email a background_tasks...")
    background_tasks.add_task(send_reset_email, data.email, reset_token)
    
    return {"message": "Si el correo existe, recibirás instrucciones."}


@router.post("/reset-password", response_description="Restablecer contraseña")
async def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or user.reset_token != data.token:
        raise HTTPException(status_code=400, detail="Token inválido o usuario no encontrado")
    if user.reset_token_exp and datetime.utcnow() > user.reset_token_exp:
        raise HTTPException(status_code=400, detail="Token expirado")
    hashed_password = get_password_hash(data.new_password)
    user.password_hash = hashed_password
    user.reset_token = None
    user.reset_token_exp = None
    db.commit()
    return {"message": "Contraseña actualizada correctamente"}


@router.post("/logout", response_description="Cerrar sesión del usuario")
async def logout(current_user: User = Depends(get_current_user)):
    """
    Endpoint de logout. Valida el token JWT y confirma el cierre de sesión.
    El cliente es responsable de eliminar el token del localStorage.
    """
    return {
        "message": "Sesión cerrada correctamente",
        "user_id": current_user.id,
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/debug/google-config", response_description="Verificar configuración de Google")
async def debug_google_config():
    """Debug: Verificar qué está configurado para Google Auth"""
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    google_available = GOOGLE_AUTH_AVAILABLE
    
    return {
        "google_auth_available": google_available,
        "has_client_id": bool(client_id),
        "client_id_first_chars": client_id[:20] + "..." if client_id else None,
        "redirect_uri": redirect_uri,
        "google_libraries": {
            "google_id_token": google_id_token is not None,
            "google_requests": google_requests is not None
        }
    }


# ============================================================================
# Routes - Google OAuth2
# ============================================================================

@router.post("/google/verify", response_description="Verify Google id_token and create/update user")
async def google_verify(payload: dict = Body(...), db: Session = Depends(get_db)):
    if not GOOGLE_AUTH_AVAILABLE:
        raise HTTPException(status_code=500, detail="google-auth no está instalado en el entorno. Ejecuta 'pip install -r requirements.txt' en el backend.")
    idtoken = payload.get("id_token")
    if not idtoken:
        raise HTTPException(status_code=400, detail="Missing id_token")
    try:
        request_adapter = google_requests.Request()
        info = google_id_token.verify_oauth2_token(idtoken, request_adapter, os.getenv("GOOGLE_CLIENT_ID"))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid id_token: {e}")

    google_id = info.get("sub")
    email = info.get("email")
    name = info.get("name") or email
    picture = info.get("picture")

    user = db.query(User).filter(User.google_id == google_id).first() or db.query(User).filter(User.email == email).first()
    now = datetime.utcnow()
    
    if user:
        user.email = email
        user.name = name
        user.picture = picture
        user.google_id = google_id
        user.updated_at = now
        db.commit()
        user_id = user.id
        role = user.role
    else:
        new_user = User(
            email=email,
            name=name,
            picture=picture,
            google_id=google_id,
            role="user",
            created_at=now
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        user_id = new_user.id
        role = "user"

    app_token = signJWT(str(user_id), role)
    return app_token


@router.get("/google/login", response_description="Redirect to Google OAuth2")
async def google_login():
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    if not client_id or not redirect_uri:
        raise HTTPException(status_code=500, detail="Google OAuth not configured")
    state = secrets.token_urlsafe(16)
    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
        "prompt": "consent"
    }
    auth_url = "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)
    return RedirectResponse(auth_url)


@router.get("/google/callback", response_description="Google OAuth2 callback")
async def google_callback(code: Optional[str] = None, state: Optional[str] = None, db: Session = Depends(get_db)):
    if not GOOGLE_AUTH_AVAILABLE:
        raise HTTPException(status_code=500, detail="google-auth no está instalado en el entorno. Ejecuta 'pip install -r requirements.txt' en el backend.")
    if not code or not state:
        raise HTTPException(status_code=400, detail="Missing code or state")
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
        "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI"),
        "grant_type": "authorization_code"
    }
    token_resp = requests.post(token_url, data=data)
    if token_resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Token exchange failed")
    token_json = token_resp.json()
    id_token = token_json.get("id_token")
    if not id_token:
        raise HTTPException(status_code=400, detail="No id_token in response")
    
    request_adapter = google_requests.Request()
    info = google_id_token.verify_oauth2_token(id_token, request_adapter, os.getenv("GOOGLE_CLIENT_ID"))
    
    google_id = info.get("sub")
    email = info.get("email")
    name = info.get("name") or email
    picture = info.get("picture")

    user = db.query(User).filter(User.google_id == google_id).first() or db.query(User).filter(User.email == email).first()
    now = datetime.utcnow()
    
    if user:
        user.email = email
        user.name = name
        user.picture = picture
        user.google_id = google_id
        user.updated_at = now
        db.commit()
        user_id = user.id
        role = user.role
    else:
        new_user = User(
            email=email,
            name=name,
            picture=picture,
            google_id=google_id,
            role="user",
            created_at=now
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        user_id = new_user.id
        role = "user"

    app_token = signJWT(str(user_id), role)
    frontend = os.getenv("FRONTEND_URL", "http://localhost:5173")
    access = app_token["access_token"] if isinstance(app_token, dict) and app_token.get("access_token") else app_token
    redirect_to = f"{frontend}/auth/callback?token={access}"
    return RedirectResponse(redirect_to)

    return RedirectResponse(redirect_to)


@router.post("/logout", response_description="Cerrar sesión del usuario")
async def logout(current_user: User = Depends(get_current_user)):
    """
    Endpoint de logout. Valida el token JWT y confirma el cierre de sesión.
    El cliente es responsable de eliminar el token del localStorage.
    """
    return {
        "message": "Sesión cerrada correctamente",
        "user_id": current_user.id,
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/debug/google-config", response_description="Verificar configuración de Google")
async def debug_google_config():
    """Debug: Verificar qué está configurado para Google Auth"""
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    google_available = GOOGLE_AUTH_AVAILABLE
    
    return {
        "google_auth_available": google_available,
        "has_client_id": bool(client_id),
        "client_id_first_chars": client_id[:20] + "..." if client_id else None,
        "redirect_uri": redirect_uri,
        "google_libraries": {
            "google_id_token": google_id_token is not None,
            "google_requests": google_requests is not None
        }
    }
    return RedirectResponse(redirect_to)
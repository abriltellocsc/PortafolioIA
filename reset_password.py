import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app.database import engine
from app.models.user import User
from sqlalchemy.orm import sessionmaker
from passlib.hash import pbkdf2_sha256

# Crear sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

try:
    # Buscar usuario por email
    user = db.query(User).filter(User.email == "yazzahumada1@gmail.com").first()
    if user:
        # Actualizar contraseña
        user.password_hash = pbkdf2_sha256.hash("123456")
        db.commit()
        print(f"Contraseña actualizada para {user.email}")
    else:
        print("Usuario no encontrado.")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
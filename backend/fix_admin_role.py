#!/usr/bin/env python3
"""Script para asegurar que el usuario admin32@example.com tiene rol de admin."""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal
from app.models.user import User

def main():
    db = SessionLocal()
    try:
        # Buscar el usuario admin32
        user = db.query(User).filter(User.email == "admin32@example.com").first()
        
        if not user:
            print("❌ Usuario admin32@example.com no encontrado")
            return
        
        # Actualizar su role a admin
        user.role = "admin"
        db.commit()
        db.refresh(user)
        
        print(f"✅ Usuario {user.email} ahora tiene rol: {user.role}")
        print(f"   ID: {user.id}")
        print(f"   Name: {user.name}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()

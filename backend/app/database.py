from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    # Fallback for development (replace with your actual connection string)
    DATABASE_URL = "postgresql://postgres:Bobyapolo29%40@db.xkzedzyzfnpzlgoqoamy.supabase.co:5432/postgres"

engine = create_engine(DATABASE_URL, echo=True)  # echo=True para debugging, quitar en producción
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

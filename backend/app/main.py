from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, portfolio, profile, stocks, usuarios
from app.routes import admin_users, admin_portfolios, admin_support, admin_logs, admin_education
from app.routes import education
from app.database import Base, engine  # Importar para referencias

# Las tablas se crean con Alembic, no aquí
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PortafolioAI API",
    description="API para la gestión de portafolios de inversión impulsada por IA.",
    version="0.1.0"
)

# Configuración de CORS - DEBE estar antes de incluir routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] ,  # Permitir peticiones desde cualquier origen para desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

# Inclusión de rutas
app.include_router(auth.router, prefix="/api/auth", tags=["Autenticación"])
app.include_router(usuarios.router, prefix="/api/usuarios", tags=["Usuarios - Freemium"])
app.include_router(profile.router, prefix="/api", tags=["Perfil de Riesgo"])
app.include_router(portfolio.router, prefix="/api", tags=["Portafolio"])
app.include_router(stocks.router, prefix="/api", tags=["Datos de Acciones"])
app.include_router(admin_users.router, prefix="/api", tags=["Admin Usuarios"])
app.include_router(admin_portfolios.router, prefix="/api", tags=["Admin Portafolios"])
app.include_router(admin_support.router, prefix="/api", tags=["Admin Soporte"])
app.include_router(admin_logs.router, prefix="/api", tags=["Admin Logs"])
app.include_router(admin_education.router, prefix="/api", tags=["Admin Educación"])
app.include_router(education.router, prefix="/api", tags=["Educación"])

## app.include_router(admin_config.router, prefix="/api", tags=["Admin Configuración"])

@app.get("/test", tags=["Test"])
async def test_endpoint():
    return {"message": "Test endpoint works!"}

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Bienvenido a la API de PortafolioAI"}

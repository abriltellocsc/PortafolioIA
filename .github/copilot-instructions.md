# Copilot instructions for PortafolioAI

Resumen rápido
- Backend: FastAPI en `backend/app` (entry: `backend/app/main.py`).
- Frontend: React + Vite en `frontend/` (entry: `frontend/src`), usa `VITE_API_URL`.
- DB: MongoDB, la conexión se construye en `backend/app/database.py` usando `MONGODB_URI`.
- Autenticación: JWT con secret `ACCESS_TOKEN_SECRET` (ver `backend/app/utils/jwt_handler.py`).

Arquitectura y flujo de datos (por qué importa)
- El frontend hace peticiones HTTP a `VITE_API_URL` (por defecto `http://localhost:8000/api`) usando `frontend/src/services/api.ts`.
- FastAPI expone rutas con prefijos en `backend/app/main.py` (`/api`, `/api/auth`, `/api/admin/*`).
- Las rutas delegan lógica a módulos en `backend/app/services/` (optimizer, yahoo/gemini) y persisten en MongoDB via `backend/app/database.py`.
- Estado crítico: tokens JWT se guardan en `localStorage` bajo `token`; axios añade `Authorization: Bearer <token>` automáticamente.

Requisitos para desarrollar/levantar localmente
- Python 3.11+, Node.js, npm/yarn, MongoDB (Atlas o local).
- Dependencias backend: `pip install -r backend/requirements.txt`.
- Dependencias frontend: `npm install` en `frontend/`.

Comandos prácticos (Windows PowerShell)
- Abrir en VS Code: `code .` desde la raíz del repo.
- Backend (recomendado: virtualenv):
  ```powershell
  cd backend
  python -m venv venv
  .\venv\Scripts\Activate
  pip install -r requirements.txt
  uvicorn app.main:app --reload --port 8000
  ```
- Frontend:
  ```powershell
  cd frontend
  npm install
  npm run dev
  ```

Variables de entorno importantes (arch. ejemplar en `backend/.env.example`)
- `MONGODB_URI` -> cadena de conexión a MongoDB.
- `ACCESS_TOKEN_SECRET` -> clave larga para firmar JWT (ver `jwt_handler.py`).
- `API_KEY_GEMINI` -> opcional, usado por servicios de IA; si falta, algunos servicios pueden mockear respuestas.
- Frontend: `VITE_API_URL` (prefijo API, ej. `http://localhost:8000/api`).

Patrones y convenciones del código
- Rutas: `backend/app/routes/*.py` agrupan endpoints; `main.py` las incluye con prefijos.
- Persistencia: `database.py` exporta `db` (pymongo) usado desde modelos/servicios.
- Servicios: lógica pesada (optimizador, integraciones externas) vive en `backend/app/services/`.
- JWT: `signJWT` y `decodeJWT` retornan/leen payload con clave en `ACCESS_TOKEN_SECRET`.
- Frontend: `frontend/src/services/api.ts` contiene la instancia axios compartida y los helpers de API.

Puntos de atención para un agente IA
- No supongas variables de entorno; verifica `backend/.env.example` y `frontend` envs antes de correr cambios.
- El backend asume `MONGODB_URI` válido al iniciar (`MongoClient` se construye en import time). Si falta, iniciar el proceso fallará.
- Los endpoints de administración y soporte existen bajo `/api/admin/*` — revisar `backend/app/routes/admin_*.py` antes de editar.
- Evita eliminar el interceptor de axios: maneja tokens y 401s automáticamente (ver `frontend/src/services/api.ts`).
- Hay dependencias de terceros en Python (PyPortfolioOpt, yfinance) que pueden necesitar tiempo/compilación en la instalación.

Ejemplos rápidos para referencias en cambios
- Añadir ruta: editar `backend/app/routes/<archivo>.py` y registrarla en `backend/app/main.py`.
- Usar DB: importar `from app.database import db` y operar sobre `db.<collection>`.
- Probar localmente: backend `http://localhost:8000/docs` (Swagger) y frontend en Vite (por defecto `http://localhost:5173`).

Si necesitas más contexto
- Pide que liste archivos concretos (`routes`, `services`) o que abra `jwt_handler.py`, `database.py` o `frontend/src/services/api.ts`.

Feedback
- ¿Algo está incompleto o prefieres que incluya guías para tests/commits/CI? Responde y lo ajusto.

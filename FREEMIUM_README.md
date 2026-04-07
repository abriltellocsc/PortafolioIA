# 💎 Sistema Freemium con Auditoría - Documentación

## 📋 Índice
1. [Resumen](#resumen)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Cómo Funciona](#cómo-funciona)
4. [Pasos de Implementación](#pasos-de-implementación)
5. [Endpoints Disponibles](#endpoints-disponibles)
6. [Componentes Frontend](#componentes-frontend)
7. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 📍 Resumen

Se implementó un **sistema Freemium completo** con las siguientes características:

- ✅ **Plan Gratuito**: 3 llamadas a IA por mes
- ✅ **Plan Premium**: Acceso ilimitado a todas las funciones
- ✅ **Sistema de Auditoría**: Registro de todas las acciones importantes
- ✅ **Restricciones Automáticas**: Bloqueo de funciones si se excede límite
- ✅ **Interfaz Amigable**: Componentes React para gestionar plan

---

## 📁 Estructura de Archivos

### Backend

```
backend/app/
├── models/
│   ├── user.py                 ✅ ACTUALIZADO (agregó contador_ia)
│   ├── audit_log.py           ✅ NUEVO
│   └── __init__.py            ✅ ACTUALIZADO
│
├── routes/
│   ├── usuarios.py            ✅ NUEVO (endpoints de plan)
│   └── auth.py                (sin cambios)
│
├── services/
│   ├── audit_service.py       ✅ NUEVO (grabar auditorías)
│   ├── restrictions_service.py ✅ NUEVO (validar restricciones)
│   └── (otros servicios)
│
└── main.py                     ✅ ACTUALIZADO (registró rutas)
```

### Frontend

```
frontend/src/
├── components/
│   ├── PremiumAlert.tsx        ✅ NUEVO (alerta de plan gratuito)
│   ├── UpgradePremiumButton.tsx ✅ NUEVO (botón para upgrade)
│   └── PlanStatus.tsx          ✅ NUEVO (estado del plan)
│
└── pages/
    └── PlanPage.tsx           ✅ NUEVO (página completa de plan)
```

---

## 🔧 Cómo Funciona

### 1️⃣ Base de Datos

**Tabla `users`** - Cambios:
```sql
ALTER TABLE users ADD COLUMN contador_ia INT DEFAULT 0;
-- ya existe: is_premium BOOLEAN DEFAULT FALSE
```

**Tabla `audit_logs`** - Nueva:
```sql
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    accion VARCHAR NOT NULL,
    detalle TEXT,
    fecha DATETIME DEFAULT NOW(),
    FOREIGN KEY (usuario_id) REFERENCES users(id)
);
```

### 2️⃣ Flujo de Upgrade

```
Usuario Free
    ↓
Click "Simular Pago"
    ↓
POST /api/usuarios/mejorar-plan
    ├── Valida que no sea Premium
    ├── Actualiza is_premium = True
    ├── Resetea contador_ia = 0
    ├── Registra en audit_logs
    └── Retorna datos actualizados
    ↓
Frontend actualiza estado sin recargar
    ↓
Usuario ahora Premium ⭐
```

### 3️⃣ Flujo de Restricción

```
Usuario Free llama a /api/optimizar-portafolio
    ↓
validar_limite_ia(usuario)
    ├── ¿Es Premium? → Permitir
    └── ¿Es Free & contador > 3? → ERROR 403
    ↓
Si Permitido:
    ├── Incrementa contador_ia
    ├── Ejecuta función
    ├── Registra en auditoría
    └── Retorna resultado
```

---

## 🚀 Pasos de Implementación

### Paso 1: Base de Datos
```bash
# Necesitas hacer migraciones con Alembic
cd backend

# Crear migración
alembic revision --autogenerate -m "Agregar contador_ia y AuditLog"

# Aplicar cambios
alembic upgrade head
```

### Paso 2: Verificar Backend
```bash
# Backend debe estar corriendo
cd backend
uvicorn app.main:app --reload --port 8001

# Verificar que los endpoints existen:
# http://localhost:8001/docs
# Buscar: "Usuarios - Freemium"
```

### Paso 3: Integrar en Frontend
```bash
# En tu componente principal (App.tsx o Dashboard.tsx)
# Importar:
import PremiumAlert from './components/PremiumAlert';
import UpgradePremiumButton from './components/UpgradePremiumButton';
import PlanStatus from './components/PlanStatus';

# Usar:
const [isPremium, setIsPremium] = useState(false);

<PremiumAlert isUserPremium={isPremium} />
<PlanStatus refreshTrigger={refreshCounter} />
```

### Paso 4: Agregar Ruta en Routing
```typescript
// En tu archivo de rutas (Router.tsx o similar)
import PlanPage from './pages/PlanPage';

{
  path: '/plan',
  element: <PlanPage />
}
```

---

## 📡 Endpoints Disponibles

### ✅ POST `/api/usuarios/mejorar-plan`
**Upgrade a Premium**

Request:
```json
{
  "metodo_pago": "tarjeta"
}
```

Response:
```json
{
  "success": true,
  "mensaje": "¡Felicitaciones! Ya eres usuario Premium",
  "usuario": {
    "id": 1,
    "nombre": "Juan",
    "email": "juan@example.com",
    "es_premium": true,
    "subscription_id": "SUB_1_1712420400.0",
    "contador_ia": 0
  }
}
```

---

### ✅ GET `/api/usuarios/mi-plan`
**Ver información del plan actual**

Response:
```json
{
  "usuario_id": 1,
  "nombre": "Juan",
  "email": "juan@example.com",
  "plan": "Premium",
  "es_premium": true,
  "contador_ia_usado": 0,
  "limite_ia": "Ilimitado",
  "consultas_restantes": "Ilimitado",
  "subscription_id": "SUB_1_..."
}
```

---

## 🎨 Componentes Frontend

### 1. `<PremiumAlert />`
Muestra alerta si el usuario es gratuito
```tsx
<PremiumAlert
  isUserPremium={false}
  onUpgradeClick={() => console.log('upgrade')}
/>
```

### 2. `<UpgradePremiumButton />`
Botón para simular pago
```tsx
<UpgradePremiumButton
  isUserPremium={false}
  onUpgradeSuccess={(userData) => {
    setIsPremium(true);
  }}
/>
```

### 3. `<PlanStatus />`
Muestra estado del plan con barra de progreso
```tsx
<PlanStatus refreshTrigger={contador} />
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Validar en un Endpoint
```python
from app.services.restrictions_service import validar_limite_ia

@router.post("/recomendaciones")
async def generar_recomendacion(
    current_user: User = Depends(get_current_user)
):
    # Valida automáticamente
    validar_limite_ia(current_user)
    
    # Si llegó aquí, está permitido
    # ... generar recomendación
```

### Ejemplo 2: Registrar Auditoría
```python
from app.services.audit_service import grabar_auditoria

# En cualquier endpoint
grabar_auditoria(
    db=db,
    usuario_id=current_user.id,
    accion="CAMBIO_PLAN",
    detalle="Usuario cambió a Premium"
)
```

### Ejemplo 3: Consultar Auditoría
```python
# En la base de datos
SELECT * FROM audit_logs WHERE usuario_id = 1;

# Resultado:
# id | usuario_id | accion          | detalle                    | fecha
# 1  | 1          | UPGRADE_PREMIUM | El usuario... se mejoró... | 2024-04-06...
```

---

## 🧪 Testing

### Test 1: Crear usuario gratuito
```bash
POST http://localhost:8001/api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### Test 2: Ver plan inicial
```bash
GET http://localhost:8001/api/usuarios/mi-plan
# Headers: Authorization: Bearer <token>

# Resultado esperado:
# {
#   "plan": "Gratuito",
#   "contador_ia_usado": 0,
#   "limite_ia": 3,
#   "consultas_restantes": 3
# }
```

### Test 3: Upgrade a Premium
```bash
POST http://localhost:8001/api/usuarios/mejorar-plan
{
  "metodo_pago": "tarjeta"
}
# Headers: Authorization: Bearer <token>

# Resultado: Usuario ahora es Premium
```

### Test 4: Ver auditoría
```bash
# En base de datos
SELECT * FROM audit_logs WHERE usuario_id = 1;
```

---

## ⚠️ Notas Importantes

1. **Migraciones**: Necesitas ejecutar Alembic para crear las nuevas tablas
2. **Token JWT**: Los endpoints requieren autenticación válida
3. **Base de Datos**: Se usa SQLAlchemy con PostgreSQL (o SQLite para desarrollo)
4. **Frontend**: Necesita axios configurado en `api.ts`
5. **CORS**: Ya está habilitado en `main.py`

---

## 🔐 Seguridad

- ✅ Todos los endpoints validan usuario autenticado
- ✅ Auditoría registra todas las acciones
- ✅ Restricciones se aplican en backend (no confiar en frontend)
- ✅ Errores se loguean apropiadamente

---

## 📞 Soporte

Si tienes dudas, referirse a:
- `EJEMPLO_INTEGRACION_FREEMIUM.py` - Ejemplos completos
- Backend: `backend/app/routes/usuarios.py`
- Frontend: `frontend/src/components/`

---

**Implementado por:** Sistema Freemium v1.0
**Fecha:** 2024-04-06
**Status:** ✅ Listo para usar

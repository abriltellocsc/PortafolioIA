# 📊 DIAGNÓSTICO PEDAGÓGICO - PortafolioIA
## Trabajo Final de Carrera - Defensa de Programadores

**Proyecto:** PortafolioIA  
**Equipo:** 2 programadores  
**Duración de defensa:** 30 minutos  
**Fecha:** 2026

---

## 🎯 INTRODUCCIÓN: ¿QUÉ ES PORTALIOAIA?

Imagina que eres una persona que quiere **invertir su dinero para hacerlo crecer**, pero **no sabes cómo hacerlo**. La Bolsa de Valores te parece complicada, no entiendes dónde invertir, tienes miedo de perder todo...

**PortafolioIA** es como tener un **asesor financiero en tu bolsillo**. Es una aplicación web que:

✅ **Te hace preguntas** para conocer tu perfil (¿cuánto riesgo toleras? ¿cuántos años tienes? ¿qué objetivos tienes?)

✅ **Analiza tus respuestas** usando matemática avanzada e Inteligencia Artificial

✅ **Te recomienda** qué invertir y en qué cantidades

✅ **Te educa** con cursos sobre cómo funciona la inversión

✅ **Te muestra noticias** relevantes al mundo financiero

✅ **Te deja simular** antes de invertir ("¿Qué pasaría si invierto $1000?")

---

## 🏗️ LA ARQUITECTURA: CÓMO ESTÁ CONSTRUIDO

Piensa en PortafolioIA como un **edificio con dos pisos**:

### **Piso 1: El Frente del Edificio (FRONTEND - Lo que ves)**

Es la **interfaz visual** que ves en tu navegador. Es como la:
- 🖥️ Recepción de un banco
- 💻 Pantalla de un cajero automático
- 📱 App en tu teléfono

**Tecnologías usadas:**
- **React** - Una librería JavaScript que hace que la interfaz sea rápida e interactiva
- **TypeScript** - JavaScript con "reglas de escritura" para evitar errores
- **Vite** - Una herramienta que empaqueta todo rápidamente

**Lo que el usuario ve:**
```
┌─────────────────────────────────────────┐
│       🏠 HOME (Bienvenida)              │
│  - Botón "Registrarse"                  │
│  - Botón "Iniciar Sesión"               │
└─────────────────────────────────────────┘
         ↓ (Usuario se registra)
┌─────────────────────────────────────────┐
│    📊 DASHBOARD (Panel Principal)       │
│  - Ver portafolio actual                │
│  - Opciones de acciones                 │
└─────────────────────────────────────────┘
         ↓ (Usuario crea portafolio)
┌─────────────────────────────────────────┐
│  ❓ RISK PROFILE (Test de Riesgo)       │
│  - "¿Cuál es tu edad?"                  │
│  - "¿Cuánto dinero tienes?"             │
│  - "¿Tienes experiencia invirtiendo?"   │
└─────────────────────────────────────────┘
         ↓ (Backend responde)
┌─────────────────────────────────────────┐
│  ✅ PORTAFOLIO RECOMENDADO              │
│  - 40% en Acciones Tech (QQQ)           │
│  - 30% en Bonos (BND)                   │
│  - 20% en Materias Primas (GLD)         │
│  - 10% en Inmuebles (VNQ)               │
└─────────────────────────────────────────┘
```

### **Piso 2: El Detrás del Mostrador (BACKEND - La Lógica)**

Es el **cerebro** de la aplicación. Es lo que NO ves pero hace todo el trabajo. Como:
- 🧠 El cerebro de un hospital (procesa datos, toma decisiones)
- ⚙️ El motor de un auto (está bajo el capó, pero hace que funcione)
- 💾 La bóveda de un banco (guarda la información)

**Tecnologías usadas:**
- **FastAPI** - Un servidor Python muy rápido que recibe peticiones del frontend
- **Python** - Lenguaje de programación que hace los cálculos
- **Base de Datos (SQLite/PostgreSQL)** - Guarda toda la información de usuarios, portafolios, etc.

**Lo que el backend hace:**

1. **Recibe información del frontend**
   ```
   Frontend → "¿Crea un portafolio para un usuario conservador?"
   Backend ← (Recibe esta pregunta vía HTTP)
   ```

2. **Procesa la información**
   ```
   Backend:
   - Valida quién es el usuario (¿Es alguien autorizado?)
   - Extrae sus preferencias
   - Ejecuta cálculos matemáticos complejos
   - Consulta IA (Google Gemini)
   ```

3. **Guarda en la Base de Datos**
   ```
   BD guardada:
   - Usuario: "Juan"
   - Portafolio: [QQQ: 40%, BND: 30%, ...]
   - Fecha: 19/05/2026
   - Razón: "Perfil Conservador"
   ```

4. **Responde al frontend**
   ```
   Backend → "Aquí está el portafolio recomendado"
   Frontend ← (Recibe respuesta vía HTTP + JSON)
   ```

---

## 🔄 FLUJO DE DATOS: LA CONVERSACIÓN ENTRE FRONTEND Y BACKEND

Piensa como un **diálogo entre un mesero (Frontend) y la cocina (Backend)**:

### **Escena 1: Usuario se Registra**

```
FRONTEND (Mesero):                          BACKEND (Cocina):
"Tengo un nuevo cliente:
 Email: juan@example.com
 Password: MiPassword123"
                                            → Valida email único
                                            → Hash password (cifra)
                                            → Crea usuario en BD
                                            ← "Usuario creado ✅"
```

### **Escena 2: Usuario Inicia Sesión**

```
FRONTEND:                                   BACKEND:
"Cliente intenta login:
 Email: juan@example.com
 Password: MiPassword123"
                                            → Busca usuario
                                            → Verifica password
                                            → Crea JWT (token seguro)
                                            ← "Token: eyJhbGciOi..."
                    
Frontend guarda token en localStorage
(memoria del navegador)
```

### **Escena 3: Usuario Abre Dashboard**

```
FRONTEND:                                   BACKEND:
Con cada petición añade:
"Bearer eyJhbGciOi..." 
(Token en el encabezado)
                                            → Valida token
                                            → Verifica usuario autorizado
                                            → Busca portafolio en BD
                                            ← "Aquí está su portafolio"

Frontend muestra la información
```

### **Escena 4: Usuario Crea Portafolio**

```
FRONTEND:                                   BACKEND:
Envía respuestas del cuestionario:
"Edad: 35
 País: Argentina
 Experiencia: Principiante
 Riesgo: Conservador
 Token: eyJhbGciOi..."
                                            → Valida token
                                            → Extrae respuestas
                                            → Corre algoritmo (Efficient Frontier)
                                            → Selecciona activos óptimos
                                            → Llama IA (Gemini) para explicar
                                            → Guarda en BD
                                            ← "Portafolio: {
                                                 assets: [QQQ: 40%, ...],
                                                 metrics: {sharpe: 0.85, ...}
                                               }"

Frontend muestra gráficos y datos
```

---

## 🔐 SEGURIDAD: ¿CÓMO SABE EL SISTEMA QUE ERES TÚ?

### **El Token JWT: Tu Pasaporte Digital**

Cuando te logueas, recibes un **JWT (JSON Web Token)**, que es como un **pasaporte digital**:

```
Pasaporte = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

Contiene (cifrado):
{
  "user_id": 123,
  "role": "user",
  "email": "juan@example.com",
  "expires_at": "2026-05-20T10:30:00Z"
}
```

**Características:**
- ✅ **Imposible falsificar** (está cifrado con una clave secreta del servidor)
- ✅ **Expira** (después de 24 horas hay que loguearse de nuevo)
- ✅ **Guarda tu rol** (admin o usuario normal)
- ✅ **Se valida en cada petición** (no puede usar portafolio de otro usuario)

**Sistema de Roles:**

| Rol | Permisos |
|-----|----------|
| **user** | Ver su portafolio, crear portafolios, editar perfil |
| **admin** | Ver todos los usuarios, gestionar contenido, ver logs |

---

## 🧠 LA LÓGICA INTELIGENTE: EL ALGORITMO DE OPTIMIZACIÓN

### **¿Cómo PortafolioIA decide qué invertir?**

Usa **Efficient Frontier**, que es un método matemático que responde:

**"¿Cuál es la MEJOR combinación de activos para maximizar rentabilidad MINIMIZANDO riesgo?"**

### **Paso 1: Entender el Perfil de Riesgo**

```
El usuario responde:
┌──────────────────────────────────────┐
│ ❓ ¿Cuántos años tienes?            │ → 35 años
├──────────────────────────────────────┤
│ ❓ ¿Cuánto dinero puedes invertir?  │ → $10,000
├──────────────────────────────────────┤
│ ❓ ¿Cuándo necesitarás ese dinero?  │ → En 10 años
├──────────────────────────────────────┤
│ ❓ ¿Tuviste pérdidas antes?         │ → No, soy principiante
├──────────────────────────────────────┤
│ ❓ ¿Cómo duermes si pierde 30%?     │ → Mal, prefiero seguridad
└──────────────────────────────────────┘

Resultado: PERFIL CONSERVADOR ⚠️
```

### **Paso 2: Seleccionar Universo de Activos**

PortafolioIA tiene 16+ activos disponibles:

```
ACCIONES (Empresas)
├─ VOO: Acciones USA (500 grandes empresas)
├─ QQQ: Acciones Tech (Apple, Microsoft, Google)
├─ VTI: Todas las acciones USA
├─ VWO: Mercados emergentes (India, Brasil, China)

BONOS (Préstamos al gobierno)
├─ BND: Bonos diversificados
├─ TLT: Bonos de largo plazo

MATERIAS PRIMAS (Oro, petróleo, etc.)
├─ GLD: Oro

REAL ESTATE (Inmuebles)
├─ VNQ: Fondo de inversión inmobiliaria

CRIPTOMONEDAS (Monedas digitales)
├─ BTC: Bitcoin
├─ ETH: Ethereum
```

### **Paso 3: Cálculos Matemáticos**

El algoritmo calcula para **cada activo**:

```
RENTABILIDAD = ¿Cuánto creció el activo en el pasado?
               Ejemplo: 12% anual promedio

VOLATILIDAD = ¿Cuánto sube y baja el precio?
              Ejemplo: 15% variación (±15% en mal/buen año)

CORRELACIÓN = ¿Se mueven juntos o en direcciones opuestas?
              Ejemplo: Oro y Acciones tienen correlación negativa
                       (cuando bajan acciones, sube oro)
```

### **Paso 4: Efficient Frontier**

El algoritmo encuentra la **frontera eficiente**: la mejor combinación.

```
Si el usuario es CONSERVADOR:
✅ 40% BND (Bonos - seguros, poco riesgo)
✅ 30% GLD (Oro - de riesgo bajo)
✅ 20% VOO (Acciones USA - de riesgo medio)
✅ 10% VNQ (Inmuebles - estable)

Si el usuario es AGRESIVO:
✅ 50% QQQ (Tech - alto riesgo, alto retorno)
✅ 30% VTI (Acciones USA)
✅ 15% VWO (Emergentes)
✅ 5% BTC (Crypto)
```

### **Paso 5: Explicación con IA**

Si está disponible **Google Gemini**, genera explicaciones:

```
"Te recomendamos 40% en QQQ porque:
- Tu perfil es agresivo
- Buscas crecimiento a largo plazo
- Las acciones tech históricamente suben 15% anual
- Tu horizonte es de 10 años, suficiente para recuperarse
  de posibles caídas
- El riesgo calculado (16% volatilidad) es aceptable
  para tu perfil"
```

---

## 💾 BASE DE DATOS: DÓNDE GUARDAMOS TODO

### **Estructura de Datos Simplificada**

```
┌─────────────────────────────────┐
│        TABLA: USUARIOS          │
├─────────────────────────────────┤
│ ID        │ 123                 │
│ Nombre    │ Juan García         │
│ Email     │ juan@example.com    │
│ Password  │ $2b$12$... (hash)   │
│ País      │ Argentina           │
│ Edad      │ 35                  │
│ Experiencia│ Principiante        │
│ Plan      │ Gratuito (o Premium)│
│ CreatedAt │ 2026-01-15 10:30:00 │
└─────────────────────────────────┘
              ↓ (Relación 1 a Muchos)
┌─────────────────────────────────┐
│      TABLA: PORTAFOLIOS         │
├─────────────────────────────────┤
│ ID       │ 456                  │
│ UserID   │ 123 (referencia)     │
│ Nombre   │ "Mi primer portafolio"
│ Sharpe   │ 0.85 (métrica)       │
│ Return   │ 12.5% anual          │
│ Risk     │ 15% volatilidad      │
│ CreatedAt│ 2026-05-01           │
└─────────────────────────────────┘
              ↓ (Relación 1 a Muchos)
┌─────────────────────────────────┐
│        TABLA: ACTIVOS           │
├─────────────────────────────────┤
│ ID          │ 789               │
│ PortfolioID │ 456               │
│ Ticker      │ QQQ               │
│ Nombre      │ Nasdaq 100 Index  │
│ Porcentaje  │ 40%               │
│ Razón       │ "Tech growth"     │
└─────────────────────────────────┘

OTRAS TABLAS:
├─ educational_content (Cursos)
├─ news_articles (Noticias)
├─ support_messages (Tickets soporte)
└─ audit_logs (Registro de actividades)
```

---

## 📚 EDUCACIÓN Y CONTENIDO

### **Estructura de Cursos**

```
EDUCACIÓN (en varios niveles)
├─ NIVEL PRINCIPIANTE
│  ├─ Lección 1: "¿Qué es invertir?"
│  ├─ Lección 2: "Acciones vs Bonos"
│  ├─ Lección 3: "¿Qué es la Bolsa?"
│  └─ Quiz: "Valida tu aprendizaje"
│
├─ NIVEL INTERMEDIO
│  ├─ Lección 1: "Diversificación"
│  ├─ Lección 2: "Análisis Técnico"
│  └─ Quiz
│
└─ NIVEL AVANZADO
   ├─ Lección 1: "Black-Scholes (opciones)"
   ├─ Lección 2: "Derivados"
   └─ Quiz
```

---

## 🏷️ SISTEMA DE SUSCRIPCIÓN: FREEMIUM

### **Plan Gratuito vs Premium**

| Característica | Gratuito | Premium |
|---|---|---|
| **Crear portafolios** | Máx 3 | Ilimitados |
| **Acceso a educación** | Sí | Sí (más contenido) |
| **Simular escenarios** | Limitado (1 por día) | Ilimitado |
| **Noticias financieras** | Sí (últimas 7 días) | Sí (todo el histórico) |
| **Soporte técnico** | Email (48h respuesta) | Chat vivo 24/7 |
| **Costo** | $0 | $9.99 / mes |

### **Flujo de Upgrade a Premium**

```
Usuario Gratuito
    ↓
Click "Mejorar a Premium"
    ↓
Muestra planes de precio
    ↓
Usuario ingresa datos de pago (integración Stripe)
    ↓
Pago procesado ✅
    ↓
Base de datos actualiza: is_premium = true
    ↓
Frontend detecta cambio y desbloquea funciones Premium
```

---

## 📰 NOTICIAS Y DATOS MERCADO

### **Integración Yahoo Finance**

PortafolioIA se integra con **Yahoo Finance** para:

1. **Descargar precios históricos** de activos
2. **Calcular métricas actuales** (retorno, volatilidad)
3. **Mantener datos frescos** (actualización diaria)

```
Cada día:
┌─────────────────────────────────┐
│ Task automática (job)           │
├─────────────────────────────────┤
│ 1. Conecta a Yahoo Finance      │
│ 2. Descarga: VOO, QQQ, BND, etc.│
│ 3. Calcula: rentabilidad, riesgo│
│ 4. Actualiza BD                 │
│ 5. Si hay cambios > 5%, notifica│
└─────────────────────────────────┘
```

---

## 🔧 MANTENIMIENTO: ADMIN PANEL

### **Lo que los Administradores Pueden Hacer**

```
ADMIN PANEL
├─ 👥 GESTIÓN DE USUARIOS
│  ├─ Ver todos los usuarios registrados
│  ├─ Cambiar su estado (activo/inactivo)
│  ├─ Asignar rol (user/admin)
│  └─ Ver historial de actividad
│
├─ 📚 GESTIÓN DE EDUCACIÓN
│  ├─ Crear/editar cursos
│  ├─ Organizar por nivel
│  ├─ Publicar contenido
│  └─ Ver quién completó qué
│
├─ 🛟 SOPORTE AL USUARIO
│  ├─ Ver tickets de soporte
│  ├─ Responder consultas
│  └─ Asignar prioridades
│
├─ 📊 AUDITORÍA
│  ├─ Ver logs de actividad
│  ├─ "Quién hizo qué, cuándo"
│  ├─ Detectar anomalías
│  └─ Generar reportes
│
└─ 💼 PORTAFOLIOS
   ├─ Monitorear todos los portafolios
   ├─ Ver métricas agregadas
   ├─ Detectar problemas
   └─ Estadísticas de uso
```

---

## 🚀 FUNCIONALIDADES PRINCIPALES: LO QUE EL USUARIO VE

### **1. HOME - Bienvenida**
```
┌─────────────────────────────────────┐
│   PortafolioIA - Tu Asesor Financiero
│   
│   [REGISTRARSE]  [INICIAR SESIÓN]
│   
│   ✓ Portafolios personalizados
│   ✓ Educación financiera
│   ✓ Noticias del mercado
│   ✓ Simulaciones sin riesgo
└─────────────────────────────────────┘
```

### **2. DASHBOARD - Panel Principal**
```
┌─────────────────────────────────────┐
│ 👤 Juan García | Premium | Logout   │
├─────────────────────────────────────┤
│ ESTADÍSTICAS RÁPIDAS                │
│ Portafolios: 2                      │
│ Retorno promedio: +12.5%            │
│ Riesgo promedio: 14%                │
├─────────────────────────────────────┤
│ ACCIONES RÁPIDAS                    │
│ [+ Crear Portafolio] [Ver Details] │
│ [Educación] [Noticias] [Soporte]   │
└─────────────────────────────────────┘
```

### **3. MY PORTFOLIO - Ver Cartera**
```
┌─────────────────────────────────────┐
│ "Mi primer portafolio" - Creado el 1/5
├─────────────────────────────────────┤
│ COMPOSICIÓN (Gráfico pie)           │
│   QQQ    ████████░░ 40%             │
│   BND    ██████░░░░ 30%             │
│   GLD    ████░░░░░░ 20%             │
│   VNQ    ██░░░░░░░░ 10%             │
├─────────────────────────────────────┤
│ MÉTRICAS                            │
│ Sharpe Ratio: 0.85 (Bueno)          │
│ Retorno esperado: 12.5% anual       │
│ Riesgo (volatilidad): 15%           │
│                                     │
│ [SIMULAR] [EDITAR] [DUPLICAR]       │
└─────────────────────────────────────┘
```

### **4. SIMULATOR - Simular Escenarios**
```
┌─────────────────────────────────────┐
│ SIMULADOR DE PORTAFOLIO             │
├─────────────────────────────────────┤
│ Portafolio: "Mi primer portafolio"  │
│ Inversión inicial: [$10,000]        │
│ Período: [10 años] ▼                │
│ Escenario: [Normal] ▼               │
│                                     │
│ [SIMULAR]                           │
├─────────────────────────────────────┤
│ RESULTADOS                          │
│ Inversión inicial: $10,000          │
│ Valor final esperado: $25,844       │
│ Ganancia: $15,844 (+158%)           │
│                                     │
│ (Gráfico mostrando crecimiento)     │
│                                     │
│ Nota: Basado en datos históricos,   │
│ el futuro puede ser diferente       │
└─────────────────────────────────────┘
```

### **5. EDUCATION - Aprende**
```
┌─────────────────────────────────────┐
│ CURSOS EDUCATIVOS                   │
├─────────────────────────────────────┤
│ 🟢 PRINCIPIANTE                     │
│   ├─ ¿Qué es invertir? ✅ Completado
│   ├─ Acciones vs Bonos  ⏳ En progreso
│   └─ La Bolsa de Valores ⭕ Bloqueado
│                                     │
│ 🟡 INTERMEDIO                       │
│   └─ Diversificación (necesita prev)
│                                     │
│ 🔴 AVANZADO                         │
│   └─ Black-Scholes (necesita prev)  │
└─────────────────────────────────────┘
```

### **6. PROFILE - Configuración**
```
┌─────────────────────────────────────┐
│ MI PERFIL                           │
├─────────────────────────────────────┤
│ Nombre: Juan García                 │
│ Email: juan@example.com             │
│ País: Argentina                     │
│ Edad: 35                            │
│ Experiencia: Principiante           │
│                                     │
│ SEGURIDAD                           │
│ [Cambiar contraseña]                │
│ [Recuperación 2FA]                  │
│                                     │
│ CUENTA                              │
│ Plan actual: Premium ($9.99/mes)    │
│ [Cambiar plan] [Cancelar suscripción]
│                                     │
│ [Guardar cambios]                   │
└─────────────────────────────────────┘
```

---

## 🔑 CONCEPTOS CLAVE (SIN TECNICISMO)

### **¿Qué es una API?**
Una **API** es un "intermediario" entre el frontend y backend. Como un mesero en un restaurante:
- Frontend (cliente): "Quiero ver mis portafolios"
- API (mesero): Lleva el pedido a la cocina (backend)
- Backend (cocina): Busca en la BD y responde
- API (mesero): Trae la respuesta al cliente
- Frontend: Muestra al usuario

### **¿Qué es JWT?**
Un **JWT** es tu "pasaporte digital". Cuando te logueas, el servidor te da un token que debes usar en cada petición para probar quién eres. Es como:
- Pasaporte en un viaje: prueba tu identidad
- Tarjeta de cliente en un bar: acceso al club
- Ticket de entrada a un cine: validación de acceso

### **¿Qué es SHA/Hash?**
Es una **función matemática de una sola dirección**. Como pulverizar un papel:
- Puedes pulverizar papel (password → hash)
- NO puedes recuperar el papel del polvo (hash → password es imposible)
- Esto protege contraseñas en la BD

### **¿Qué es IA/Gemini?**
Es un **modelo de lenguaje** entrenado con billones de palabras. Puede:
- Generar explicaciones personalizadas
- Justificar por qué un activo fue seleccionado
- Responder preguntas sobre finanzas (si está disponible)

---

## 📈 IMPACTO DEL PROYECTO

### **Problemas que Resuelve:**

1. **Democratización de asesoría financiera**
   - Un asesor tradicional cuesta $500/mes
   - PortafolioIA cuesta $9.99/mes (50x más barato)

2. **Educación financiera accesible**
   - La mayoría de personas no sabe invertir
   - Cursos estructurados enseñan desde cero

3. **Reducción de ansiedad**
   - Miedo a invertir sin saber → Simulador prueba seguro
   - Miedo a perder → Perfiles de riesgo personalizados

4. **Decisiones basadas en datos**
   - Antes: "Escuché que Apple es buena inversión"
   - Ahora: Análisis matemático con Efficient Frontier

### **Casos de Uso Reales:**

```
PERSONA 1: María, 28 años, estudiante
- Tiene $5,000 ahorrados
- No sabe nada de inversión
- Miedo a arriesgar

SOLUCIÓN CON PortafolioIA:
1. Se registra y hace cuestionario (5 min)
2. Recibe portafolio conservador de cuatro activos
3. Ve simulación: $5,000 → $7,500 en 10 años
4. Lee cursos de principiante (10 horas totales)
5. Comienza a invertir con confianza

RESULTADO: María ya está invirtiendo, educada y sin miedo
───────────────────────────────────────────────────────

PERSONA 2: Roberto, 45 años, empresario
- Ganó $100,000 en su negocio
- Invirtió mal antes, perdió $20,000
- Quiere diversificar

SOLUCIÓN:
1. Se suscribe a Premium
2. Crea 5 portafolios diferentes (activo, conservador, etc.)
3. Simula cada uno durante 15 años
4. Usa educación avanzada para entender opciones
5. Toma decisión informada

RESULTADO: Roberto diversifica y recupera confianza
```

---

## 🎓 LOGROS DEL EQUIPO (2 Programadores)

### **Qué Hicieron:**

✅ **Backend completo**
- Servidor FastAPI con rutas para todo
- Autenticación segura con JWT + Google OAuth
- Integración con Google Gemini (IA)
- Integración con Yahoo Finance (datos de mercado)
- Algoritmo Efficient Frontier (optimización portafolios)
- Admin panel con auditoría

✅ **Frontend moderno**
- Interfaz intuitiva con React + TypeScript
- 12+ páginas diferentes
- Gráficos interactivos
- Sistema de autenticación completo
- Integración con Google Sign-In

✅ **Infraestructura profesional**
- Base de datos con relaciones correctas
- Migraciones automáticas (Alembic)
- API RESTful siguiendo estándares
- Documentación automática (Swagger)
- Código limpio, modular, escalable

✅ **Características avanzadas**
- Cálculos matemáticos complejos
- Simulaciones de portafolio
- Sistema de suscripción (Freemium)
- Sistema de roles (admin/user)
- Recuperación de contraseña vía email
- Logs de auditoría completos

---

## 🛠️ TECNOLOGÍAS UTILIZADAS

```
BACKEND (Python)
├─ FastAPI → Servidor HTTP
├─ SQLAlchemy → ORM (Mapea BD a Python)
├─ PyPortfolioOpt → Algoritmo Efficient Frontier
├─ yfinance → Datos de mercado
├─ google.generativeai → IA Gemini
├─ PyJWT → Autenticación
└─ SQLite/PostgreSQL → Base de datos

FRONTEND (JavaScript)
├─ React → Librería para UI
├─ TypeScript → JavaScript con tipos
├─ Vite → Empaquetador rápido
├─ Axios → Cliente HTTP
├─ Recharts → Gráficos
├─ Google Auth → OAuth Google
└─ CSS/TailwindCSS → Estilos

INFRAESTRUCTURA
├─ Windows PowerShell → Scripts
├─ Git → Control de versiones
├─ npm/pip → Gestión de dependencias
└─ SQLite (desarrollo) / PostgreSQL (producción) → BD
```

---

## ⚙️ REQUISITOS PARA USAR

### **Para Desarrolladores (Setup Local)**

```powershell
# Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev

# Base de datos (variables de entorno en .env)
DATABASE_URL=sqlite:///./app.db
ACCESS_TOKEN_SECRET=tu_clave_segura
API_KEY_GEMINI=sk-...
```

### **Variables de Entorno Necesarias**

| Variable | Qué es | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Conexión base de datos | `sqlite:///./app.db` |
| `ACCESS_TOKEN_SECRET` | Clave para firmar JWT | Una clave larga |
| `API_KEY_GEMINI` | Clave API de Google | `sk-proj-...` |
| `FRONTEND_URL` | URL del frontend | `http://localhost:5173` |
| `VITE_API_URL` | URL backend para frontend | `http://localhost:8000/api` |

---

## 🎯 CONCLUSIÓN: POR QUÉ ESTO IMPORTA

PortafolioIA es un **ejemplo real de desarrollo web moderno**:

✅ **Combina teoría y práctica:**
- Inversión financiera (matemática)
- Ingeniería de software (full-stack)
- UX/UI (interfaz amigable)
- IA generativa (explicaciones inteligentes)

✅ **Resuelve un problema real:**
- Millones de personas quieren invertir pero no saben cómo
- Asesores financieros son caros
- La educación financiera es escasa

✅ **Usa tecnologías de producción:**
- FastAPI, React, Postgres, Docker (en producción)
- Seguridad real (JWT, CORS, password hash)
- Escalabilidad desde el diseño

✅ **Es código profesional:**
- Modular, testeable, mantenible
- Sigue estándares (RESTful, Clean Code)
- Documentado y versionado

---

## 📝 PRÓXIMOS PASOS PARA MEJORAS

Si el proyecto continúa:

1. **Mobile App** → React Native para iOS/Android
2. **Trading en vivo** → Integración con brokers (Interactive Brokers, Alpaca)
3. **Análisis técnico avanzado** → TradingView API
4. **Machine Learning** → Predicción de precios
5. **Comunidad** → Foro de usuarios, consejos compartidos
6. **Mobile push notifications** → Alertas de mercado
7. **Export a PDF** → Reportes descargables

---

**✨ Este proyecto demuestra que puedes construir productos REALES que resuelven PROBLEMAS REALES con tecnología moderna.**


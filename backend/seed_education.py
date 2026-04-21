"""
Script para poblar la tabla educational_content con los artículos originales del frontend.
Ejecutar desde backend/: python seed_education.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, engine
from app.models.educational_content import EducationalContent
import json

ARTICLES = [
    {
        "category": "Básico",
        "title": "¿Qué son las Acciones y Cómo Funcionan?",
        "summary": "Una guía para principiantes sobre el mundo de las acciones, su compra, venta y el potencial de ganancias.",
        "tags": ["acciones", "básico", "mercado"],
        "full_content": """
        <h2>Introducción a las Acciones</h2>
        <p>Las acciones representan una parte de propiedad en una empresa. Cuando compras acciones, te conviertes en accionista y adquieres ciertos derechos sobre la compañía.</p>
        
        <h3>¿Cómo Funcionan?</h3>
        <p>Las empresas emiten acciones para recaudar capital. Los inversionistas compran estas acciones esperando que la empresa crezca y el valor de sus acciones aumente. Existen dos formas principales de ganar dinero:</p>
        <ul>
          <li><strong>Apreciación del capital:</strong> Cuando el precio de la acción sube y la vendes a un precio mayor.</li>
          <li><strong>Dividendos:</strong> Algunas empresas reparten parte de sus ganancias a los accionistas.</li>
        </ul>

        <h3>Tipos de Acciones</h3>
        <ul>
          <li><strong>Acciones Comunes:</strong> Dan derecho a voto en las juntas de accionistas.</li>
          <li><strong>Acciones Preferentes:</strong> Tienen prioridad en el pago de dividendos pero generalmente no dan derecho a voto.</li>
        </ul>

        <h3>Riesgos</h3>
        <p>El valor de las acciones puede fluctuar significativamente. Es importante diversificar y no invertir más de lo que puedes permitirte perder.</p>
        """,
        "is_active": True,
    },
    {
        "category": "Básico",
        "title": "Tipos de Cuentas de Inversión: ¿Cuál es la Mejor para Ti?",
        "summary": "Descubre las diferencias entre cuentas de ahorro, cuentas corrientes y cuentas de inversión para elegir la opción adecuada.",
        "tags": ["cuentas", "básico", "ahorro"],
        "full_content": """
        <h2>Introducción a las Cuentas de Inversión</h2>
        <p>Antes de comenzar a invertir, es crucial entender los diferentes tipos de cuentas disponibles. Cada una tiene características específicas que afectan cómo crece tu dinero.</p>
        
        <h3>Cuentas de Ahorro Tradicionales</h3>
        <ul>
          <li><strong>Seguridad:</strong> Garantizadas por el gobierno hasta ciertos límites</li>
          <li><strong>Liquidez:</strong> Acceso inmediato a tu dinero</li>
          <li><strong>Rendimiento:</strong> Bajo, generalmente por debajo de la inflación</li>
          <li><strong>Impuestos:</strong> Intereses gravados como ingreso ordinario</li>
        </ul>

        <h3>Cuentas de Mercado Monetario</h3>
        <ul>
          <li><strong>Rendimiento:</strong> Ligeramente superior al de las cuentas de ahorro</li>
          <li><strong>Liquidez:</strong> Alta, con cheques limitados</li>
          <li><strong>Riesgo:</strong> Muy bajo, pero no garantizado al 100%</li>
          <li><strong>Uso:</strong> Ideal para estacionar dinero temporalmente</li>
        </ul>

        <h3>Cuentas de Retiro Individual (IRA)</h3>
        <ul>
          <li><strong>Impuestos:</strong> Diferido o deducible</li>
          <li><strong>Límites de contribución:</strong> Anuales establecidos por el IRS</li>
          <li><strong>Tipos:</strong> Tradicional (deducción fiscal) vs Roth (crecimiento libre de impuestos)</li>
          <li><strong>Penalizaciones:</strong> Por retiros anticipados antes de los 59½ años</li>
        </ul>

        <h3>Cuentas de Inversión Gravables</h3>
        <ul>
          <li><strong>Flexibilidad:</strong> Sin límites de contribución ni restricciones de retiro</li>
          <li><strong>Impuestos:</strong> Capital gains a corto/largo plazo</li>
          <li><strong>Opciones:</strong> Acciones, bonos, ETFs, fondos mutuos</li>
          <li><strong>Control:</strong> Tú decides qué y cuándo comprar/vender</li>
        </ul>

        <h3>¿Cuál Elegir?</h3>
        <p>Depende de tus objetivos:</p>
        <ul>
          <li><strong>Corto plazo/seguridad:</strong> Cuentas de ahorro o mercado monetario</li>
          <li><strong>Largo plazo/retiro:</strong> IRA tradicional o Roth</li>
          <li><strong>Flexibilidad máxima:</strong> Cuenta gravable</li>
        </ul>
        """,
        "is_active": True,
    },
    {
        "category": "Básico",
        "title": "Riesgo vs. Recompensa: Los Fundamentos de la Inversión",
        "summary": "Entiende el concepto básico de que mayor riesgo potencialmente significa mayores retornos, pero también mayores pérdidas posibles.",
        "tags": ["riesgo", "básico", "recompensa"],
        "full_content": """
        <h2>El Equilibrio Riesgo-Recompensa</h2>
        <p>En el mundo de las inversiones, existe una relación directa entre el riesgo que asumes y las recompensas potenciales que puedes obtener. Esta es una de las reglas fundamentales de la inversión.</p>
        
        <h3>¿Qué es el Riesgo en las Inversiones?</h3>
        <p>El riesgo se refiere a la posibilidad de perder parte o todo tu capital invertido. No todas las inversiones tienen el mismo nivel de riesgo.</p>
        
        <h3>Tipos de Riesgo</h3>
        <ul>
          <li><strong>Riesgo de Mercado:</strong> Fluctuaciones generales del mercado</li>
          <li><strong>Riesgo Específico:</strong> Problemas particulares de una empresa o sector</li>
          <li><strong>Riesgo de Inflación:</strong> Pérdida de poder adquisitivo</li>
          <li><strong>Riesgo de Liquidez:</strong> Dificultad para vender rápidamente</li>
          <li><strong>Riesgo de Crédito:</strong> Posibilidad de que el emisor no pague</li>
        </ul>

        <h3>La Pirámide de Riesgo</h3>
        <p>Las inversiones se pueden organizar en una pirámide según su nivel de riesgo:</p>
        <ul>
          <li><strong>Base (Bajo Riesgo):</strong> Cuentas de ahorro, CDs, bonos gubernamentales</li>
          <li><strong>Medio:</strong> Bonos corporativos, REITs, fondos balanceados</li>
          <li><strong>Alto:</strong> Acciones individuales, opciones, criptomonedas</li>
        </ul>

        <h3>Retornos Esperados</h3>
        <p>Históricamente, las inversiones con mayor riesgo han ofrecido mayores retornos promedio:</p>
        <ul>
          <li><strong>Bonos del Tesoro (bajo riesgo):</strong> ~3-4% anual</li>
          <li><strong>Acciones (alto riesgo):</strong> ~7-10% anual</li>
          <li><strong>Bienes Raíces:</strong> ~6-8% anual</li>
        </ul>

        <h3>Tu Tolerancia al Riesgo</h3>
        <p>Antes de invertir, evalúa cuánto riesgo puedes tolerar:</p>
        <ul>
          <li><strong>Conservador:</strong> Prefieres preservar capital, aceptas retornos modestos</li>
          <li><strong>Moderado:</strong> Balance entre crecimiento y seguridad</li>
          <li><strong>Agresivo:</strong> Buscas máximo crecimiento, toleras volatilidad</li>
        </ul>

        <h3>Estrategias para Gestionar el Riesgo</h3>
        <ul>
          <li><strong>Diversificación:</strong> No pongas todos los huevos en una canasta</li>
          <li><strong>Horizonte de tiempo:</strong> Más tiempo = más capacidad para asumir riesgo</li>
          <li><strong>Asset allocation:</strong> Distribuye entre diferentes clases de activo</li>
          <li><strong>Dollar cost averaging:</strong> Invierte cantidades fijas regularmente</li>
        </ul>

        <h3>Recuerda</h3>
        <p>Más riesgo no garantiza más retornos, pero históricamente ha sido necesario para superar la inflación y hacer crecer tu riqueza a largo plazo.</p>
        """,
        "is_active": True,
    },
    {
        "category": "Intermedio",
        "title": "Entendiendo los Bonos: Renta Fija para tu Portafolio",
        "summary": "Explora los diferentes tipos de bonos, sus riesgos y cómo pueden estabilizar tus inversiones.",
        "tags": ["bonos", "renta fija", "intermedio"],
        "full_content": """
        <h2>¿Qué son los Bonos?</h2>
        <p>Los bonos son instrumentos de deuda que emiten gobiernos y empresas para financiarse. Al comprar un bono, estás prestando dinero a cambio de pagos de intereses periódicos.</p>
        
        <h3>Características Principales</h3>
        <ul>
          <li><strong>Valor nominal:</strong> El monto que recibirás al vencimiento.</li>
          <li><strong>Cupón:</strong> La tasa de interés que pagará el bono.</li>
          <li><strong>Vencimiento:</strong> La fecha en que se devolverá el capital.</li>
        </ul>

        <h3>Tipos de Bonos</h3>
        <ul>
          <li><strong>Bonos Gubernamentales:</strong> Emitidos por gobiernos, considerados de bajo riesgo.</li>
          <li><strong>Bonos Corporativos:</strong> Emitidos por empresas, ofrecen mayor rendimiento pero con más riesgo.</li>
          <li><strong>Bonos Municipales:</strong> Emitidos por gobiernos locales, a menudo tienen beneficios fiscales.</li>
        </ul>

        <h3>Ventajas de los Bonos</h3>
        <p>Proporcionan ingresos predecibles y ayudan a reducir la volatilidad del portafolio. Son especialmente útiles para inversionistas conservadores.</p>
        """,
        "is_active": True,
    },
    {
        "category": "Intermedio",
        "title": "Fondos Mutuos: Inversión Colectiva Simplificada",
        "summary": "Aprende cómo los fondos mutuos permiten invertir en una cartera diversificada administrada por profesionales con montos accesibles.",
        "tags": ["fondos mutuos", "intermedio", "diversificación"],
        "full_content": """
        <h2>¿Qué son los Fondos Mutuos?</h2>
        <p>Los fondos mutuos son vehículos de inversión colectiva que reúnen dinero de múltiples inversionistas para comprar una cartera diversificada de acciones, bonos u otros activos.</p>
        
        <h3>¿Cómo Funcionan?</h3>
        <ul>
          <li><strong>Pool de dinero:</strong> Miles de inversionistas contribuyen con su capital</li>
          <li><strong>Gestión profesional:</strong> Administrado por expertos en inversión</li>
          <li><strong>Compra de activos:</strong> El fondo compra acciones, bonos, etc.</li>
          <li><strong>Unidades de participación:</strong> Cada inversionista recibe "acciones" del fondo</li>
        </ul>

        <h3>Tipos de Fondos Mutuos</h3>
        <ul>
          <li><strong>Por objetivo:</strong> Acciones, bonos, dinero, balanceados</li>
          <li><strong>Por estilo:</strong> Valor, crecimiento, blend</li>
          <li><strong>Por capitalización:</strong> Large-cap, mid-cap, small-cap</li>
          <li><strong>Por región:</strong> Nacional, internacional, emergentes</li>
        </ul>

        <h3>Ventajas</h3>
        <ul>
          <li><strong>Diversificación instantánea:</strong> Exposición a cientos de compañías</li>
          <li><strong>Gestión profesional:</strong> Expertos toman las decisiones</li>
          <li><strong>Accesibilidad:</strong> Mínimos de inversión bajos ($500-$1,000)</li>
          <li><strong>Liquidez:</strong> Puedes vender tus unidades en cualquier día hábil</li>
          <li><strong>Transparencia:</strong> Reportes regulares del portafolio</li>
        </ul>

        <h3>Desventajas</h3>
        <ul>
          <li><strong>Comisiones:</strong> Ratios de gastos (0.5%-2% anual)</li>
          <li><strong>Menos control:</strong> No eliges las inversiones individuales</li>
          <li><strong>Impuestos:</strong> Capital gains distribuidos anualmente</li>
          <li><strong>Riesgo de gestión:</strong> Dependes del administrador del fondo</li>
        </ul>

        <h3>Cómo Comprar Fondos Mutuos</h3>
        <ul>
          <li><strong>A través de corredores:</strong> Fidelity, Vanguard, Schwab</li>
          <li><strong>Plataformas robo-advisor:</strong> Betterment, Wealthfront</li>
          <li><strong>Planes 401(k):</strong> A través de tu empleador</li>
          <li><strong>IRAs:</strong> Cuentas de retiro individuales</li>
        </ul>

        <h3>Factores a Considerar</h3>
        <ul>
          <li><strong>Rendimiento histórico:</strong> Pero pasado no garantiza futuro</li>
          <li><strong>Ratio de gastos:</strong> Menor es mejor</li>
          <li><strong>Tamaño del fondo:</strong> Activos bajo gestión</li>
          <li><strong>Estrella Morningstar:</strong> Rating de calidad</li>
          <li><strong>Volatilidad:</strong> Desviación estándar de retornos</li>
        </ul>

        <h3>Estrategia de Inversión</h3>
        <p>Los fondos mutuos son ideales para:</p>
        <ul>
          <li>Inversionistas principiantes que quieren diversificación automática</li>
          <li>Quienes no tienen tiempo para investigar acciones individuales</li>
          <li>Planes de ahorro a largo plazo (retiro, educación)</li>
        </ul>
        """,
        "is_active": True,
    },
    {
        "category": "Intermedio",
        "title": "Análisis de Estados Financieros: Leyendo los Números",
        "summary": "Descubre cómo interpretar balances generales, estados de resultados y flujos de efectivo para evaluar la salud financiera de una empresa.",
        "tags": ["análisis financiero", "intermedio", "estados financieros"],
        "full_content": """
        <h2>Los Tres Estados Financieros Principales</h2>
        <p>Los estados financieros son el lenguaje de los negocios. Aprender a leerlos te da una ventaja significativa como inversionista.</p>
        
        <h3>1. Balance General (Balance Sheet)</h3>
        <p>Muestra la posición financiera en un momento específico: Activos = Pasivos + Patrimonio.</p>
        
        <h4>Activos</h4>
        <ul>
          <li><strong>Corrientes:</strong> Efectivo, cuentas por cobrar, inventario (convertibles en efectivo en &lt;1 año)</li>
          <li><strong>No corrientes:</strong> Propiedad, planta y equipo, patentes (usados a largo plazo)</li>
        </ul>

        <h4>Pasivos</h4>
        <ul>
          <li><strong>Corrientes:</strong> Cuentas por pagar, deudas a corto plazo</li>
          <li><strong>No corrientes:</strong> Bonos, préstamos a largo plazo</li>
        </ul>

        <h4>Patrimonio</h4>
        <ul>
          <li>Capital social, utilidades retenidas, acciones en tesorería</li>
        </ul>

        <h3>2. Estado de Resultados (Income Statement)</h3>
        <p>Muestra los ingresos, gastos y utilidades durante un período.</p>
        
        <h4>Componentes Principales</h4>
        <ul>
          <li><strong>Ingresos:</strong> Ventas totales de bienes/servicios</li>
          <li><strong>Costos:</strong> Costo de ventas, gastos operativos</li>
          <li><strong>Utilidad bruta:</strong> Ingresos - costo de ventas</li>
          <li><strong>Utilidad operativa:</strong> Después de gastos operativos</li>
          <li><strong>Utilidad neta:</strong> Después de impuestos e intereses</li>
        </ul>

        <h3>3. Estado de Flujos de Efectivo (Cash Flow Statement)</h3>
        <p>Muestra cómo el efectivo entra y sale del negocio, dividido en tres categorías.</p>
        
        <h4>Flujo de Operaciones</h4>
        <ul>
          <li>Efectivo generado por las actividades principales del negocio</li>
          <li>Importante: Utilidad neta vs flujo de operaciones</li>
        </ul>

        <h4>Flujo de Inversión</h4>
        <ul>
          <li>Compra/venta de activos fijos, inversiones en otras compañías</li>
        </ul>

        <h4>Flujo de Financiamiento</h4>
        <ul>
          <li>Emisión de acciones/deuda, dividendos pagado, recompra de acciones</li>
        </ul>

        <h3>Ratios Financieros Clave</h3>
        
        <h4>Rentabilidad</h4>
        <ul>
          <li><strong>ROA (Return on Assets):</strong> Utilidad neta / Activos totales</li>
          <li><strong>ROE (Return on Equity):</strong> Utilidad neta / Patrimonio</li>
          <li><strong>Margen neto:</strong> Utilidad neta / Ingresos</li>
        </ul>

        <h4>Liquidez</h4>
        <ul>
          <li><strong>Razón corriente:</strong> Activos corrientes / Pasivos corrientes</li>
          <li><strong>Prueba ácida:</strong> (Activos corrientes - Inventario) / Pasivos corrientes</li>
        </ul>

        <h4>Apalancamiento</h4>
        <ul>
          <li><strong>Ratio de deuda:</strong> Deuda total / Activos totales</li>
          <li><strong>Cobertura de intereses:</strong> EBIT / Gastos por intereses</li>
        </ul>

        <h3>Advertencias</h3>
        <ul>
          <li>Los números pueden ser manipulados (ej: reconocimiento de ingresos)</li>
          <li>Compara con competidores y promedios de la industria</li>
          <li>Analiza tendencias a lo largo del tiempo</li>
          <li>Considera factores cualitativos además de cuantitativos</li>
        </ul>

        <h3>Herramientas para Principiantes</h3>
        <ul>
          <li><strong>Morningstar:</strong> Ratings y análisis detallados</li>
          <li><strong>Yahoo Finance:</strong> Estados financieros gratuitos</li>
          <li><strong>SEC EDGAR:</strong> Reportes oficiales de la SEC</li>
          <li><strong>Seeking Alpha:</strong> Análisis de comunidad</li>
        </ul>
        """,
        "is_active": True,
    },
    {
        "category": "Avanzado",
        "title": "ETFs vs. Fondos Mutuos: ¿Cuál es Mejor para Ti?",
        "summary": "Compara las características, ventajas y desventajas de los ETFs y los fondos mutuos para tomar decisiones informadas.",
        "tags": ["etf", "fondos mutuos", "avanzado"],
        "full_content": """
        <h2>Diferencias Clave</h2>
        <p>Tanto los ETFs como los fondos mutuos permiten diversificar, pero tienen diferencias importantes en estructura y funcionamiento.</p>
        
        <h3>ETFs (Exchange-Traded Funds)</h3>
        <ul>
          <li>Se negocian en bolsa como acciones</li>
          <li>Comisiones generalmente más bajas</li>
          <li>Mayor flexibilidad en la compra/venta</li>
          <li>Transparencia diaria de holdings</li>
        </ul>

        <h3>Fondos Mutuos</h3>
        <ul>
          <li>Se compran/venden al valor del activo neto (NAV) al cierre del mercado</li>
          <li>Pueden tener gestión activa o pasiva</li>
          <li>Mínimos de inversión iniciales</li>
          <li>Algunas opciones de reinversión automática de dividendos</li>
        </ul>

        <h3>¿Cuál Elegir?</h3>
        <p>Los ETFs son ideales para traders activos y quienes buscan costos bajos. Los fondos mutuos pueden ser mejores para inversiones automáticas periódicas y quienes prefieren gestión activa.</p>
        """,
        "is_active": True,
    },
    {
        "category": "Estrategias",
        "title": "La Importancia de la Diversificación en tu Inversión",
        "summary": "Descubre por qué no debes poner todos tus huevos en la misma canasta y cómo diversificar eficazmente.",
        "tags": ["diversificación", "estrategia"],
        "full_content": """
        <h2>El Principio de la Diversificación</h2>
        <p>"No pongas todos los huevos en la misma canasta" es el principio fundamental de la diversificación. Distribuir tus inversiones reduce el riesgo total del portafolio.</p>
        
        <h3>¿Por Qué Diversificar?</h3>
        <ul>
          <li>Reduce el impacto de la volatilidad de un solo activo</li>
          <li>Protege contra pérdidas significativas</li>
          <li>Permite participar en diferentes sectores y mercados</li>
          <li>Mejora la relación riesgo-retorno</li>
        </ul>

        <h3>Formas de Diversificar</h3>
        <ul>
          <li><strong>Por clase de activo:</strong> Acciones, bonos, bienes raíces, materias primas</li>
          <li><strong>Por geografía:</strong> Mercados nacionales e internacionales</li>
          <li><strong>Por sector:</strong> Tecnología, salud, finanzas, consumo, etc.</li>
          <li><strong>Por tamaño de empresa:</strong> Large-cap, mid-cap, small-cap</li>
        </ul>

        <h3>Evita la Sobre-Diversificación</h3>
        <p>Demasiada diversificación puede diluir los retornos y hacer difícil el seguimiento. Encuentra el balance adecuado para tu perfil.</p>
        """,
        "is_active": True,
    },
    {
        "category": "Estrategias",
        "title": "Dollar Cost Averaging: Invierte de Forma Constante",
        "summary": "Aprende cómo invertir montos fijos regularmente puede reducir el impacto de la volatilidad del mercado.",
        "tags": ["estrategia", "intermedio"],
        "full_content": """
        <h2>¿Qué es Dollar Cost Averaging?</h2>
        <p>El Dollar Cost Averaging (DCA) o Promedio de Costo en Dólares es una estrategia que consiste en invertir una cantidad fija de dinero a intervalos regulares, independientemente del precio del activo.</p>
        
        <h3>¿Cómo Funciona?</h3>
        <p>En lugar de invertir todo tu capital de una vez, divides la inversión en partes iguales a lo largo del tiempo. Por ejemplo, invertir $500 mensuales durante 12 meses en lugar de $6,000 de una sola vez.</p>

        <h3>Ventajas del DCA</h3>
        <ul>
          <li><strong>Reduce el riesgo de timing:</strong> No necesitas predecir el mejor momento para comprar</li>
          <li><strong>Suaviza la volatilidad:</strong> Compras más acciones cuando los precios bajan y menos cuando suben</li>
          <li><strong>Disciplina de inversión:</strong> Crea un hábito constante de ahorro e inversión</li>
          <li><strong>Reduce el estrés emocional:</strong> Evita tomar decisiones impulsivas basadas en el miedo o la codicia</li>
        </ul>

        <h3>Ejemplo Práctico</h3>
        <p>Si inviertes $100 mensuales en un fondo:</p>
        <ul>
          <li>Mes 1: Precio $10 → compras 10 acciones</li>
          <li>Mes 2: Precio $8 → compras 12.5 acciones</li>
          <li>Mes 3: Precio $12 → compras 8.33 acciones</li>
        </ul>
        <p>Tu costo promedio por acción será menor que si hubieras comprado todo en el mes 3.</p>

        <h3>¿Cuándo Usar DCA?</h3>
        <p>Es especialmente útil para inversores principiantes, en mercados volátiles, o cuando recibes ingresos periódicos que deseas invertir.</p>
        """,
        "is_active": True,
    },
    {
        "category": "Estrategias",
        "title": "Análisis Técnico vs Fundamental: Dos Enfoques Diferentes",
        "summary": "Comprende las diferencias entre el análisis técnico y fundamental para elegir tu estrategia de inversión.",
        "tags": ["estrategia", "avanzado", "análisis"],
        "full_content": """
        <h2>Dos Filosofías de Inversión</h2>
        <p>Los inversores utilizan principalmente dos tipos de análisis para tomar decisiones: técnico y fundamental. Cada uno tiene sus propias herramientas y enfoques.</p>
        
        <h3>Análisis Fundamental</h3>
        <p>Se enfoca en el valor intrínseco de una empresa evaluando factores económicos y financieros:</p>
        <ul>
          <li><strong>Estados financieros:</strong> Ingresos, ganancias, deudas, flujo de caja</li>
          <li><strong>Ratios financieros:</strong> P/E, ROE, deuda/capital</li>
          <li><strong>Gestión de la empresa:</strong> Calidad del equipo directivo</li>
          <li><strong>Ventajas competitivas:</strong> Posición en el mercado, marca, tecnología</li>
          <li><strong>Industria y economía:</strong> Tendencias del sector, ciclos económicos</li>
        </ul>

        <h3>Análisis Técnico</h3>
        <p>Se basa en el estudio de patrones de precios y volúmenes históricos:</p>
        <ul>
          <li><strong>Gráficos de precios:</strong> Velas japonesas, líneas, barras</li>
          <li><strong>Indicadores:</strong> Medias móviles, RSI, MACD, Bandas de Bollinger</li>
          <li><strong>Patrones:</strong> Soportes, resistencias, triángulos, cabeza y hombros</li>
          <li><strong>Volumen:</strong> Confirmación de tendencias</li>
        </ul>

        <h3>¿Cuál Usar?</h3>
        <table>
          <tr>
            <th>Análisis Fundamental</th>
            <th>Análisis Técnico</th>
          </tr>
          <tr>
            <td>Inversiones a largo plazo</td>
            <td>Trading a corto/medio plazo</td>
          </tr>
          <tr>
            <td>Evalúa el "por qué"</td>
            <td>Evalúa el "cuándo"</td>
          </tr>
          <tr>
            <td>Basado en valor</td>
            <td>Basado en momentum</td>
          </tr>
        </table>

        <h3>Combinando Ambos Enfoques</h3>
        <p>Muchos inversores exitosos combinan ambos: usan el análisis fundamental para identificar buenas empresas y el técnico para encontrar puntos óptimos de entrada y salida.</p>
        """,
        "is_active": True,
    },
    {
        "category": "Estrategias",
        "title": "Asset Allocation: Distribuyendo tu Portafolio",
        "summary": "Descubre cómo distribuir tus inversiones entre diferentes clases de activos para optimizar riesgo y retorno según tu perfil.",
        "tags": ["asset allocation", "estrategia", "diversificación"],
        "full_content": """
        <h2>¿Qué es Asset Allocation?</h2>
        <p>La asset allocation es la distribución estratégica de tu capital entre diferentes clases de activos para lograr un balance óptimo entre riesgo y retorno.</p>
        
        <h3>Clases de Activos Principales</h3>
        
        <h4>Acciones (Stocks)</h4>
        <ul>
          <li><strong>Rendimiento esperado:</strong> 7-10% anual histórico</li>
          <li><strong>Riesgo:</strong> Alto, volatilidad significativa</li>
          <li><strong>Función:</strong> Crecimiento del capital, protección contra inflación</li>
          <li><strong>Horizonte:</strong> Largo plazo (5+ años)</li>
        </ul>

        <h4>Bonos (Bonds)</h4>
        <ul>
          <li><strong>Rendimiento esperado:</strong> 3-5% anual</li>
          <li><strong>Riesgo:</strong> Moderado, riesgo de crédito e interés</li>
          <li><strong>Función:</strong> Ingresos estables, reducción de volatilidad</li>
          <li><strong>Horizonte:</strong> Cualquier plazo</li>
        </ul>

        <h4>Efectivo/Equivalentes (Cash)</h4>
        <ul>
          <li><strong>Rendimiento esperado:</strong> 1-2% anual</li>
          <li><strong>Riesgo:</strong> Muy bajo, riesgo de inflación</li>
          <li><strong>Función:</strong> Preservación de capital, liquidez</li>
          <li><strong>Horizonte:</strong> Corto plazo</li>
        </ul>

        <h4>Bienes Raíces (Real Estate)</h4>
        <ul>
          <li><strong>Rendimiento esperado:</strong> 6-8% anual</li>
          <li><strong>Riesgo:</strong> Moderado-alto, iliquidez</li>
          <li><strong>Función:</strong> Ingresos por alquiler, apreciación, diversificación</li>
          <li><strong>Horizonte:</strong> Largo plazo</li>
        </ul>

        <h4>Alternativos (Alternatives)</h4>
        <ul>
          <li><strong>Ejemplos:</strong> Commodities, hedge funds, cripto, private equity</li>
          <li><strong>Rendimiento esperado:</strong> Variable</li>
          <li><strong>Riesgo:</strong> Muy alto, baja liquidez</li>
          <li><strong>Función:</strong> Diversificación adicional, protección contra riesgos específicos</li>
        </ul>

        <h3>Factores que Influyen en la Asset Allocation</h3>
        
        <h4>Edad y Horizonte de Inversión</h4>
        <ul>
          <li><strong>Joven (20-35 años):</strong> 80-90% acciones, 10-20% bonos</li>
          <li><strong>Mediana edad (35-55 años):</strong> 60-70% acciones, 20-30% bonos</li>
          <li><strong>Pre-jubilación (55-65 años):</strong> 40-60% acciones, 30-40% bonos</li>
          <li><strong>Jubilación:</strong> 20-40% acciones, 50-70% bonos, 10-20% efectivo</li>
        </ul>

        <h4>Tolerancia al Riesgo</h4>
        <ul>
          <li><strong>Conservador:</strong> Más bonos y efectivo, menos acciones</li>
          <li><strong>Moderado:</strong> Balance equilibrado</li>
          <li><strong>Agresivo:</strong> Mayor peso en acciones y alternativos</li>
        </ul>

        <h4>Objetivos Financieros</h4>
        <ul>
          <li><strong>Capital preservation:</strong> Más bonos y efectivo</li>
          <li><strong>Income generation:</strong> Bonos, REITs, dividend stocks</li>
          <li><strong>Growth:</strong> Acciones de crecimiento, emergentes</li>
        </ul>

        <h3>Estrategias de Asset Allocation</h3>
        
        <h4>Strategic Asset Allocation</h4>
        <ul>
          <li>Establece porcentajes objetivo basados en perfil</li>
          <li>Rebalancea periódicamente (anual/semi-anual)</li>
          <li>Enfoque disciplinado, ignora ruido del mercado</li>
        </ul>

        <h4>Tactical Asset Allocation</h4>
        <ul>
          <li>Ajustes temporales basados en condiciones de mercado</li>
          <li>Over/underweight ciertos activos según outlook</li>
          <li>Requiere habilidad para timing del mercado</li>
        </ul>

        <h4>Dynamic Asset Allocation</h4>
        <ul>
          <li>Ajustes continuos basados en indicadores</li>
          <li>Puede ser rules-based o discretionary</li>
          <li>Más complejo de implementar</li>
        </ul>

        <h3>Rebalancing: Manteniendo la Disciplina</h3>
        <p>El rebalancing es crucial para mantener tu asset allocation objetivo:</p>
        <ul>
          <li><strong>Calendar rebalancing:</strong> Revisa y ajusta en fechas fijas</li>
          <li><strong>Percentage rebalancing:</strong> Ajusta cuando desviaciones exceden umbral (ej. 5%)</li>
          <li><strong>Tax-loss harvesting:</strong> Usa pérdidas para compensar ganancias fiscales</li>
        </ul>

        <h3>Errores Comunes a Evitar</h3>
        <ul>
          <li><strong>Home country bias:</strong> Sobre-inversión en mercado local</li>
          <li><strong>Recency bias:</strong> Basar decisiones en performance reciente</li>
          <li><strong>Emotional decisions:</strong> Comprar alto, vender bajo</li>
          <li><strong>Over-diversification:</strong> Demasiados activos diluyen retornos</li>
          <li><strong>Under-diversification:</strong> Concentración excesiva en pocos activos</li>
        </ul>

        <h3>Herramientas para Implementar</h3>
        <ul>
          <li><strong>Robo-advisors:</strong> Betterment, Wealthfront (automatizado)</li>
          <li><strong>Target-date funds:</strong> Ajustan automáticamente con la edad</li>
          <li><strong>Model portfolios:</strong> Plantillas de brokers reconocidos</li>
          <li><strong>Financial advisors:</strong> Asesoría personalizada</li>
        </ul>
        """,
        "is_active": True,
    },
    {
        "category": "Economía",
        "title": "Inflación: El Enemigo Silencioso de tus Inversiones",
        "summary": "Comprende cómo la inflación erosiona el poder adquisitivo y qué estrategias puedes usar para protegerte.",
        "tags": ["inflación", "economía", "protección"],
        "full_content": """
        <h2>¿Qué es la Inflación?</h2>
        <p>La inflación es el aumento sostenido en el nivel general de precios, lo que significa que cada unidad de moneda compra menos bienes y servicios.</p>
        
        <h3>Tipos de Inflación</h3>
        <ul>
          <li><strong>Demanda pull:</strong> Demanda excede oferta</li>
          <li><strong>Cost push:</strong> Aumento en costos de producción</li>
          <li><strong>Incorporada:</strong> Expectativas de inflación se auto-refuerzan</li>
        </ul>

        <h3>Medición de la Inflación</h3>
        <ul>
          <li><strong>CPI (Consumer Price Index):</strong> Canasta básica de bienes</li>
          <li><strong>PCE (Personal Consumption Expenditures):</strong> Preferido por la Fed</li>
          <li><strong>PPI (Producer Price Index):</strong> Precios al por mayor</li>
        </ul>

        <h3>Impacto en Inversiones</h3>
        <ul>
          <li><strong>Efectivo:</strong> Pierde poder adquisitivo directamente</li>
          <li><strong>Bonos fijos:</strong> Cupones valen menos en términos reales</li>
          <li><strong>Acciones:</strong> Empresas pueden trasladar costos, pero no siempre</li>
          <li><strong>Bienes raíces:</strong> Tienden a apreciarse con inflación</li>
          <li><strong>Materias primas:</strong> Históricamente buena cobertura</li>
        </ul>

        <h3>Estrategias de Protección</h3>
        <ul>
          <li><strong>TIPS:</strong> Bonos del Tesoro ajustados por inflación</li>
          <li><strong>I-Bonds:</strong> Bonos de ahorro con componente inflacionario</li>
          <li><strong>Acciones de valor:</strong> Empresas establecidas con poder de fijación de precios</li>
          <li><strong>REITs:</strong> Inmuebles con rentas ajustables</li>
          <li><strong>Commodities:</strong> Oro, petróleo, agricultura</li>
        </ul>

        <h3>La Regla del 72</h3>
        <p>Para estimar cuántos años tarda en reducirse a la mitad tu poder adquisitivo:</p>
        <p>72 / tasa de inflación = años para perder la mitad</p>
        <p>Ejemplo: Al 4% de inflación → 72/4 = 18 años</p>
        """,
        "is_active": True,
    },
    {
        "category": "Economía",
        "title": "Tasas de Interés: Cómo Afectan tus Inversiones",
        "summary": "Entiende la relación entre las tasas de interés del banco central y el rendimiento de tus inversiones.",
        "tags": ["tasas de interés", "economía", "banco central"],
        "full_content": """
        <h2>¿Qué son las Tasas de Interés?</h2>
        <p>Las tasas de interés son el costo del dinero. Cuando los bancos centrales suben las tasas, pedir prestado se encarece y ahorrar se vuelve más atractivo.</p>
        
        <h3>Tipos de Tasas</h3>
        <ul>
          <li><strong>Tasa de política:</strong> Fijada por el banco central (Fed Funds Rate en EE.UU.)</li>
          <li><strong>Tasa interbancaria:</strong> A la que los bancos se prestan entre sí</li>
          <li><strong>Tasa hipotecaria:</strong> Para préstamos inmobiliarios</li>
          <li><strong>Tasa de depósito:</strong> Que pagan los bancos por ahorros</li>
        </ul>

        <h3>Efecto en Diferentes Activos</h3>
        <ul>
          <li><strong>Bonos:</strong> Suben tasas → bajan precios de bonos existentes</li>
          <li><strong>Acciones:</strong> Suben tasas → mayor costo de capital, menor valoración</li>
          <li><strong>Bienes raíces:</strong> Suben tasas → hipotecas más caras, presiona precios bajos</li>
          <li><strong>Efectivo:</strong> Suben tasas → mejor rendimiento en ahorros</li>
        </ul>

        <h3>La Curva de Rendimiento</h3>
        <p>Grafica las tasas de bonos por vencimiento:</p>
        <ul>
          <li><strong>Normal:</strong> Largo plazo > corto plazo (economía sana)</li>
          <li><strong>Invertida:</strong> Corto plazo > largo plazo (posible recesión)</li>
          <li><strong>Plana:</strong> Tasas similares (transición)</li>
        </ul>

        <h3>Estrategias según Ciclo de Tasas</h3>
        <ul>
          <li><strong>Tasas subiendo:</strong> Bonos cortos, acciones financieras, evitar bonos largos</li>
          <li><strong>Tasas bajando:</strong> Bonos largos, acciones growth, REITs</li>
          <li><strong>Tasas estables:</strong> Diversificación normal</li>
        </ul>
        """,
        "is_active": True,
    },
    {
        "category": "Economía",
        "title": "Comercio Internacional y Mercados Financieros",
        "summary": "Analiza cómo los acuerdos comerciales, aranceles y guerras comerciales impactan las inversiones globales.",
        "tags": ["comercio", "economía", "globalización"],
        "full_content": """
        <h2>Comercio Internacional e Inversiones</h2>
        <p>El comercio internacional es fundamental para la economía global. Las políticas comerciales afectan directamente los mercados financieros y tus inversiones.</p>
        
        <h3>Acuerdos Comerciales Principales</h3>
        
        <h4>USMCA (NAFTA 2.0)</h4>
        <ul>
          <li>Reemplazó al NAFTA en 2020</li>
          <li>EE.UU., Canadá, México</li>
          <li>Reglas más estrictas para autos</li>
        </ul>

        <h4>Unión Europea</h4>
        <ul>
          <li>Mercado único de 27 países</li>
          <li>Libre movimiento de bienes, servicios, capital y personas</li>
          <li>Moneda común (Euro) para 19 países</li>
        </ul>

        <h4>RCEP (Regional Comprehensive Economic Partnership)</h4>
        <ul>
          <li>Acuerdo entre 15 países asiáticos</li>
          <li>Incluye China, Japón, Corea del Sur</li>
          <li>30% de la población y PIB mundial</li>
        </ul>

        <h3>Impacto en los Mercados Financieros</h3>
        
        <h4>Acciones</h4>
        <ul>
          <li><strong>Comercio creciente:</strong> Beneficia compañías multinacionales</li>
          <li><strong>Guerra comercial:</strong> Aumenta volatilidad, perjudica exportadores</li>
          <li><strong>Cadenas de suministro:</strong> Interrupciones afectan ganancias corporativas</li>
        </ul>

        <h4>Monedas</h4>
        <ul>
          <li><strong>Superávit comercial:</strong> Fortalece la moneda</li>
          <li><strong>Déficit comercial:</strong> Debilita la moneda</li>
          <li><strong>Manipulación monetaria:</strong> Acusaciones afectan confianza</li>
        </ul>

        <h4>Bonos</h4>
        <ul>
          <li><strong>Tensiones comerciales:</strong> Inversionistas buscan activos seguros</li>
          <li><strong>Resolución positiva:</strong> Reduce riesgo, baja yields</li>
        </ul>

        <h3>Riesgos del Proteccionismo</h3>
        <ul>
          <li><strong>Aranceles:</strong> Aumentan precios para consumidores</li>
          <li><strong>Represalias:</strong> Provocan guerras comerciales</li>
          <li><strong>Cadenas de valor:</strong> Interrupciones en producción global</li>
          <li><strong>Crecimiento económico:</strong> Reduce eficiencia global</li>
          <li><strong>Inflación:</strong> Costos más altos se trasladan a precios</li>
        </ul>

        <h3>Ejemplos Históricos</h3>
        
        <h4>Gran Depresión (1930s)</h4>
        <ul>
          <li>Aranceles Smoot-Hawley provocaron reducción del comercio global 66%</li>
          <li>Contribuyó a prolongar la depresión</li>
          <li>Lección: proteccionismo empeora crisis económicas</li>
        </ul>

        <h4>Guerra Comercial EE.UU.-China (2018-2020)</h4>
        <ul>
          <li>Aranceles mutuos afectaron $360B en comercio</li>
          <li>Volatilidad en mercados globales</li>
          <li>Resuelta parcialmente con "Fase 1" agreement</li>
        </ul>

        <h3>Tendencias Actuales</h3>
        
        <h4>Desacoplamiento Tecnológico</h4>
        <ul>
          <li>EE.UU. y China separan cadenas de suministro tech</li>
          <li>Aumenta costos, reduce innovación</li>
          <li>Oportunidades en mercados emergentes</li>
        </ul>

        <h4>Comercio Digital</h4>
        <ul>
          <li>Regulaciones para datos transfronterizos</li>
          <li>Impuestos digitales para compañías tech</li>
          <li>Nuevos acuerdos para e-commerce</li>
        </ul>

        <h4>Sostenibilidad</h4>
        <ul>
          <li>Acuerdos verdes en comercio</li>
          <li>Carbon border adjustments</li>
          <li>Comercio en tecnologías limpias</li>
        </ul>

        <h3>Estrategias de Inversión</h3>
        <ul>
          <li><strong>Diversificación global:</strong> Reduce riesgo de conflictos regionales</li>
          <li><strong>Monitoreo de política:</strong> Anticipa cambios en tratados comerciales</li>
          <li><strong>Exposición a emergentes:</strong> Benefician de integración comercial</li>
          <li><strong>Hedging:</strong> Usa opciones para proteger contra volatilidad</li>
        </ul>

        <h3>Conclusión</h3>
        <p>El comercio internacional es fundamental para la prosperidad económica global. Mientras que los conflictos comerciales crean incertidumbre a corto plazo, el comercio libre históricamente ha impulsado crecimiento y innovación.</p>
        """,
        "is_active": True,
    },
    {
        "category": "Economía",
        "title": "Cambio Climático y Finanzas Sostenibles",
        "summary": "Analiza cómo el cambio climático impacta los mercados financieros y la creciente importancia de las inversiones ESG y sostenibles.",
        "tags": ["cambio climático", "economía", "sostenible", "ESG"],
        "full_content": """
        <h2>El Cambio Climático como Riesgo Sistémico</h2>
        <p>El cambio climático representa uno de los mayores riesgos para la estabilidad financiera global, con impactos potenciales de trillones de dólares en activos y economías.</p>
        
        <h3>Impactos Físicos del Cambio Climático</h3>
        
        <h4>Riesgos Agudos</h4>
        <ul>
          <li><strong>Desastres naturales:</strong> Huracanes, inundaciones, incendios forestales</li>
          <li><strong>Pérdidas económicas:</strong> Daños a infraestructura, interrupciones productivas</li>
          <li><strong>Pérdidas aseguradoras:</strong> Eventos más frecuentes y severos</li>
        </ul>

        <h4>Riesgos Crónicos</h4>
        <ul>
          <li><strong>Elevación del nivel del mar:</strong> Amenaza propiedades costeras</li>
          <li><strong>Cambio en patrones climáticos:</strong> Afecta agricultura y recursos hídricos</li>
          <li><strong>Escasez de recursos:</strong> Agua, alimentos, energía</li>
          <li><strong>Migraciones masivas:</strong> Desplazamientos poblacionales</li>
        </ul>

        <h3>Impacto en Sectores Económicos</h3>
        
        <h4>Energía</h4>
        <ul>
          <li><strong>Transición energética:</strong> Declive de combustibles fósiles</li>
          <li><strong>Demanda de renovables:</strong> Crecimiento de solar, eólica, baterías</li>
          <li><strong>Stranded assets:</strong> Reservas de petróleo/gas sin valor</li>
        </ul>

        <h4>Real Estate</h4>
        <ul>
          <li><strong>Propiedades costeras:</strong> Riesgo de inundación</li>
          <li><strong>Eficiencia energética:</strong> Reglamentos más estrictos</li>
          <li><strong>Revalorización:</strong> Propiedades sostenibles ganan valor</li>
        </ul>

        <h4>Agricultura</h4>
        <ul>
          <li><strong>Cambios en rendimientos:</strong> Sequías, inundaciones</li>
          <li><strong>Adaptación:</strong> Nuevas variedades, técnicas de cultivo</li>
          <li><strong>Cadenas de suministro:</strong> Interrupciones en alimentos</li>
        </ul>

        <h4>Finanzas</h4>
        <ul>
          <li><strong>Revaluación de activos:</strong> Pérdidas en compañías expuestas</li>
          <li><strong>Riesgo de crédito:</strong> Deudas de países vulnerables</li>
          <li><strong>Volatilidad de mercados:</strong> Eventos climáticos extremos</li>
        </ul>

        <h3>Inversiones Sostenibles (ESG)</h3>
        
        <h4>Environmental, Social, Governance</h4>
        <ul>
          <li><strong>Environmental:</strong> Impacto ambiental, cambio climático, recursos</li>
          <li><strong>Social:</strong> Derechos humanos, diversidad, comunidad</li>
          <li><strong>Governance:</strong> Ética corporativa, estructura directiva</li>
        </ul>

        <h4>Crecimiento del Mercado ESG</h4>
        <ul>
          <li>$35.3T en activos bajo gestión (2022)</li>
          <li>Crecimiento anual de 15-20%</li>
          <li>Demanda institucional y retail</li>
        </ul>

        <h3>Estrategias de Inversión Sostenible</h3>
        
        <h4>Inversión Temática</h4>
        <ul>
          <li><strong>Energía limpia:</strong> Solar, eólica, hidrógeno</li>
          <li><strong>Eficiencia energética:</strong> LED, aislamiento, smart grids</li>
          <li><strong>Transporte sostenible:</strong> Vehículos eléctricos, infraestructura</li>
          <li><strong>Agua y alimentos:</strong> Gestión sostenible de recursos</li>
        </ul>

        <h4>Screening y Exclusión</h4>
        <ul>
          <li><strong>Negative screening:</strong> Evitar compañías contaminantes</li>
          <li><strong>Positive screening:</strong> Invertir en líderes sostenibles</li>
          <li><strong>Best-in-class:</strong> Mejores compañías dentro de sectores</li>
        </ul>

        <h4>Impact Investing</h4>
        <ul>
          <li>Enfoque en soluciones ambientales/sociales</li>
          <li>Medición de impacto además de retorno financiero</li>
          <li>Bonds verdes, social bonds, sustainability bonds</li>
        </ul>

        <h3>Regulaciones y Marcos</h3>
        
        <h4>Acuerdos Internacionales</h4>
        <ul>
          <li><strong>Acuerdo de París:</strong> Límite de calentamiento global a 1.5°C</li>
          <li><strong>Objetivos de Desarrollo Sostenible (ODS):</strong> Agenda 2030</li>
          <li><strong>Taxonomía EU:</strong> Clasificación de actividades sostenibles</li>
        </ul>

        <h4>Reportes y Divulgación</h4>
        <ul>
          <li><strong>TCFD:</strong> Task Force on Climate-related Financial Disclosures</li>
          <li><strong>SASB:</strong> Standards for Sustainability Accounting</li>
          <li><strong>GRI:</strong> Global Reporting Initiative</li>
        </ul>

        <h3>Riesgos de Greenwashing</h3>
        <ul>
          <li>Declaraciones engañosas sobre sostenibilidad</li>
          <li>Falta de estándares uniformes</li>
          <li>Dificultad para verificar claims</li>
          <li>Importancia de due diligence</li>
        </ul>

        <h3>Oportunidades de Inversión</h3>
        
        <h4>ETFs Sostenibles</h4>
        <ul>
          <li><strong>iShares ESG:</strong> Filtro ESG en índices tradicionales</li>
          <li><strong>Vanguard ESG:</strong> Enfoque en exclusión y engagement</li>
          <li><strong>BlackRock Sustainable:</strong> Inversión activa sostenible</li>
        </ul>

        <h4>Bonds Verdes</h4>
        <ul>
          <li>Financian proyectos ambientales específicos</li>
          <li>Rendimientos competitivos</li>
          <li>Creciente demanda institucional</li>
        </ul>

        <h4>Commodities Sostenibles</h4>
        <ul>
          <li>Oro certificado, cacao sostenible</li>
          <li>Evitan deforestación y trabajo infantil</li>
          <li>Premium de precio por sostenibilidad</li>
        </ul>

        <h3>Consideraciones para Inversionistas</h3>
        <ul>
          <li><strong>Horizonte largo:</strong> Transición climática toma décadas</li>
          <li><strong>Diversificación:</strong> No concentrar solo en "temas verdes"</li>
          <li><strong>Due diligence:</strong> Verificar credenciales ESG</li>
          <li><strong>Costos:</strong> Fondos ESG pueden tener fees más altos</li>
        </ul>

        <h3>El Futuro de las Finanzas Sostenibles</h3>
        <ul>
          <li>Integración mainstream de criterios ESG</li>
          <li>Mayor regulación y estándares</li>
          <li>Tecnología para mejor medición de impacto</li>
          <li>Creciente demanda de inversionistas millennials/Gen Z</li>
        </ul>

        <h3>Conclusión</h3>
        <p>El cambio climático está redefiniendo los mercados financieros. Las inversiones sostenibles no solo mitigan riesgos sino que capturan oportunidades en la transición hacia una economía baja en carbono.</p>
        """,
        "is_active": True,
    },
]


def seed():
    db = SessionLocal()
    try:
        existing = db.query(EducationalContent).count()
        if existing > 0:
            print(f"Ya existen {existing} artículos en la tabla. Saltando seed.")
            print("Si querés re-poblar, eliminá los registros existentes primero.")
            return

        for article_data in ARTICLES:
            content = EducationalContent(
                category=article_data["category"],
                title=article_data["title"],
                summary=article_data["summary"],
                tags=json.dumps(article_data["tags"]),
                full_content=article_data["full_content"],
                is_active=article_data["is_active"],
            )
            db.add(content)

        db.commit()
        print(f"Se insertaron {len(ARTICLES)} artículos educativos exitosamente.")
    except Exception as e:
        db.rollback()
        print(f"Error al insertar artículos: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()

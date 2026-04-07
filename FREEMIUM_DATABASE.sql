-- ============================================================================
-- Script SQL para implementar Sistema Freemium
-- ============================================================================
-- 
-- IMPORTANTE: Ejecutar este script en tu base de datos
-- (PostgreSQL, MySQL, SQLite, etc.)
--
-- ============================================================================

-- PASO 1: Agregar columna contador_ia a tabla users
-- ============================================================================
-- Si usas PostgreSQL:
ALTER TABLE users ADD COLUMN contador_ia INTEGER DEFAULT 0;

-- Si usas MySQL:
-- ALTER TABLE users ADD COLUMN contador_ia INT DEFAULT 0;

-- Si usas SQLite:
-- ALTER TABLE users ADD COLUMN contador_ia INTEGER DEFAULT 0;


-- PASO 2: Crear tabla audit_logs
-- ============================================================================
-- Si usas PostgreSQL:
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    accion VARCHAR(255) NOT NULL,
    detalle TEXT,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_audit_logs_usuario_id ON audit_logs(usuario_id);
CREATE INDEX idx_audit_logs_accion ON audit_logs(accion);
CREATE INDEX idx_audit_logs_fecha ON audit_logs(fecha);

-- Si usas MySQL:
/*
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    accion VARCHAR(255) NOT NULL,
    detalle LONGTEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_accion (accion),
    INDEX idx_fecha (fecha)
);
*/

-- Si usas SQLite:
/*
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    accion TEXT NOT NULL,
    detalle TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_usuario_id ON audit_logs(usuario_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_accion ON audit_logs(accion);
CREATE INDEX IF NOT EXISTS idx_audit_logs_fecha ON audit_logs(fecha);
*/


-- PASO 3: Verificar que todo se creó correctamente
-- ============================================================================

-- Ver estructura de tabla users
-- PostgreSQL/MySQL:
-- DESCRIBE users;
-- SQLite:
-- PRAGMA table_info(users);

-- Ver tabla audit_logs
-- SELECT * FROM audit_logs LIMIT 5;

-- Contar registros
SELECT COUNT(*) as total_usuarios FROM users;
SELECT COUNT(*) as total_auditorías FROM audit_logs;


-- ============================================================================
-- EJEMPLOS DE CONSULTAS ÚTILES
-- ============================================================================

-- 1. Ver usuarios Premium
SELECT id, name, email, is_premium, contador_ia FROM users WHERE is_premium = TRUE;

-- 2. Ver usuarios Gratuitos que se acercan al límite
SELECT id, name, email, contador_ia FROM users 
WHERE is_premium = FALSE AND contador_ia > 2;

-- 3. Ver todas las auditorías de un usuario
SELECT * FROM audit_logs WHERE usuario_id = 1 ORDER BY fecha DESC;

-- 4. Ver auditorías de tipo UPGRADE_PREMIUM
SELECT * FROM audit_logs WHERE accion = 'UPGRADE_PREMIUM' ORDER BY fecha DESC;

-- 5. Resetear contador de IA para todos los usuarios (útil mensualmente)
UPDATE users SET contador_ia = 0 WHERE is_premium = FALSE;

-- 6. Ver últimas 10 auditorías del sistema
SELECT 
    a.id,
    u.name as usuario,
    a.accion,
    a.detalle,
    a.fecha
FROM audit_logs a
JOIN users u ON a.usuario_id = u.id
ORDER BY a.fecha DESC
LIMIT 10;

-- 7. Estadísticas de planes
SELECT 
    COUNT(*) as total_usuarios,
    SUM(CASE WHEN is_premium = TRUE THEN 1 ELSE 0 END) as usuarios_premium,
    SUM(CASE WHEN is_premium = FALSE THEN 1 ELSE 0 END) as usuarios_gratuitos,
    ROUND(
        100.0 * SUM(CASE WHEN is_premium = TRUE THEN 1 ELSE 0 END) / COUNT(*), 
        2
    ) as porcentaje_premium
FROM users;

-- ============================================================================
-- IMPORTANTE: Alembic Migrations
-- ============================================================================
-- 
-- Si usas Alembic (recomendado), también ejecutar:
--
-- cd backend
-- alembic revision --autogenerate -m "Agregar contador_ia y AuditLog"
-- alembic upgrade head
--
-- ============================================================================

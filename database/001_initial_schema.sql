BEGIN;

-- =========================================================
-- ESQUEMA DE LA APLICACION
-- =========================================================

CREATE SCHEMA IF NOT EXISTS app;

-- =========================================================
-- TABLA: USUARIOS
-- =========================================================

CREATE TABLE IF NOT EXISTS app.usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- TABLA: INTENTOS DE AUTENTICACION
-- =========================================================

CREATE TABLE IF NOT EXISTS app.login_attempts (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NULL,
    username_attempted VARCHAR(150),
    ip_address INET NOT NULL,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_login_usuario FOREIGN KEY (usuario_id) REFERENCES app.usuarios(id) ON DELETE SET NULL
);

-- =========================================================
-- TABLA: AUDITORIA
-- =========================================================

CREATE TABLE IF NOT EXISTS app.audit_events (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(150),
    http_method VARCHAR(10),
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'FAILED', 'DENIED')),
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_usuario FOREIGN KEY (usuario_id) REFERENCES app.usuarios(id) ON DELETE SET NULL
);

-- =========================================================
-- INDICES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_login_attempts_ip
ON app.login_attempts(ip_address);

CREATE INDEX IF NOT EXISTS idx_login_attempts_created_at
ON app.login_attempts(created_at);

CREATE INDEX IF NOT EXISTS idx_login_attempts_username
ON app.login_attempts(username_attempted);

CREATE INDEX IF NOT EXISTS idx_audit_usuario
ON app.audit_events(usuario_id);

CREATE INDEX IF NOT EXISTS idx_audit_created_at
ON app.audit_events(created_at);

CREATE INDEX IF NOT EXISTS idx_audit_action
ON app.audit_events(action);


-- =========================================================
-- ACTUALIZACION AUTOMATICA DE updated_at
-- =========================================================

CREATE OR REPLACE FUNCTION app.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS trg_usuarios_updated_at
ON app.usuarios;

CREATE TRIGGER trg_usuarios_updated_at
BEFORE UPDATE ON app.usuarios
FOR EACH ROW
EXECUTE FUNCTION app.set_updated_at();

-- =========================================================
-- PERMISOS DE MINIMO PRIVILEGIO
-- =========================================================

REVOKE ALL ON SCHEMA app FROM PUBLIC;

GRANT USAGE ON SCHEMA app TO useraws;

REVOKE ALL ON app.usuarios FROM useraws;
REVOKE ALL ON app.login_attempts FROM useraws;
REVOKE ALL ON app.audit_events FROM useraws;

GRANT SELECT, INSERT, UPDATE
ON app.usuarios
TO useraws;

GRANT SELECT, INSERT
ON app.login_attempts
TO useraws;

GRANT SELECT, INSERT
ON app.audit_events
TO useraws;

REVOKE ALL ON ALL SEQUENCES IN SCHEMA app FROM useraws;

GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA app
TO useraws;

COMMIT;

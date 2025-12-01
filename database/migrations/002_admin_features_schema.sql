-- ============================================================================
-- Boa Bola TV - Admin Features Schema
-- ============================================================================
-- Database: Azure Database for PostgreSQL
-- Description: Schema for usuarios, videos, and server_parameters tables
--              as specified in the new requirements.
--
-- Usage: psql -f 002_admin_features_schema.sql
-- ============================================================================

-- ============================================================================
-- TABLE: usuarios
-- ============================================================================
-- Stores user account information for the admin panel.
-- Fields: id, login, email, senha (hashed password)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on login for fast lookups
CREATE INDEX IF NOT EXISTS idx_usuarios_login ON usuarios(login);

-- Index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

COMMENT ON TABLE usuarios IS 'User accounts for admin panel authentication';
COMMENT ON COLUMN usuarios.id IS 'Auto-incrementing primary key';
COMMENT ON COLUMN usuarios.login IS 'Unique login username';
COMMENT ON COLUMN usuarios.email IS 'Unique email address';
COMMENT ON COLUMN usuarios.senha IS 'Securely hashed password';
COMMENT ON COLUMN usuarios.created_at IS 'Timestamp when the user was created';
COMMENT ON COLUMN usuarios.updated_at IS 'Timestamp when the user was last updated';

-- ============================================================================
-- TABLE: videos
-- ============================================================================
-- Stores video information including YouTube links and uploaded videos.
-- Fields: id, titulo, descricao, youtube_url, storage_path, data_upload
CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    youtube_url VARCHAR(500),
    storage_path VARCHAR(500),
    data_upload TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on titulo for search functionality
CREATE INDEX IF NOT EXISTS idx_videos_titulo ON videos(titulo);

-- Index on data_upload for ordering
CREATE INDEX IF NOT EXISTS idx_videos_data_upload ON videos(data_upload);

COMMENT ON TABLE videos IS 'Videos from YouTube links or uploaded to storage';
COMMENT ON COLUMN videos.id IS 'Auto-incrementing primary key';
COMMENT ON COLUMN videos.titulo IS 'Video title (required)';
COMMENT ON COLUMN videos.descricao IS 'Video description (optional)';
COMMENT ON COLUMN videos.youtube_url IS 'YouTube video URL (optional)';
COMMENT ON COLUMN videos.storage_path IS 'Path to video in storage account (optional)';
COMMENT ON COLUMN videos.data_upload IS 'Upload timestamp (default: now)';
COMMENT ON COLUMN videos.created_at IS 'Timestamp when the video was created';
COMMENT ON COLUMN videos.updated_at IS 'Timestamp when the video was last updated';

-- ============================================================================
-- TABLE: server_parameters
-- ============================================================================
-- Stores server configuration parameters for database and storage connections.
-- These parameters are persisted to survive restarts.
CREATE TABLE IF NOT EXISTS server_parameters (
    id SERIAL PRIMARY KEY,
    param_key VARCHAR(100) NOT NULL UNIQUE,
    param_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on param_key for fast lookups
CREATE INDEX IF NOT EXISTS idx_server_parameters_key ON server_parameters(param_key);

COMMENT ON TABLE server_parameters IS 'Server configuration parameters for DB and storage';
COMMENT ON COLUMN server_parameters.id IS 'Auto-incrementing primary key';
COMMENT ON COLUMN server_parameters.param_key IS 'Configuration parameter key';
COMMENT ON COLUMN server_parameters.param_value IS 'Configuration parameter value';
COMMENT ON COLUMN server_parameters.created_at IS 'Timestamp when the parameter was created';
COMMENT ON COLUMN server_parameters.updated_at IS 'Timestamp when the parameter was last updated';

-- ============================================================================
-- TRIGGERS FOR updated_at
-- ============================================================================
-- Apply trigger to new tables with updated_at column
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
        AND table_name IN ('usuarios', 'videos', 'server_parameters')
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%s_updated_at ON %s;
            CREATE TRIGGER update_%s_updated_at
            BEFORE UPDATE ON %s
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END$$;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
-- Grant permissions to readwrite role for new tables (if role exists)
-- These roles are created in 001_initial_schema.sql
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'boabolatv_readwrite') THEN
        GRANT SELECT, INSERT, UPDATE, DELETE ON usuarios TO boabolatv_readwrite;
        GRANT SELECT, INSERT, UPDATE, DELETE ON videos TO boabolatv_readwrite;
        GRANT SELECT, INSERT, UPDATE, DELETE ON server_parameters TO boabolatv_readwrite;
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO boabolatv_readwrite;
    END IF;
END$$;

-- Grant permissions to readonly role for new tables (if role exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'boabolatv_readonly') THEN
        GRANT SELECT ON usuarios TO boabolatv_readonly;
        GRANT SELECT ON videos TO boabolatv_readonly;
        GRANT SELECT ON server_parameters TO boabolatv_readonly;
    END IF;
END$$;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

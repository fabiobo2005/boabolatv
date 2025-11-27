-- ============================================================================
-- Boa Bola TV - Initial PostgreSQL Schema
-- ============================================================================
-- Database: Azure Database for PostgreSQL
-- Description: Initial schema for storing athletes, matches, scores, stats,
--              and user authentication/authorization data.
-- 
-- Connection variables:
--   PGHOST=boabolatv-db.postgres.database.azure.com
--   PGUSER=admin@MngEnvMCAP198698.onmicrosoft.com
--   PGPORT=5432
--   PGDATABASE=postgres
--   PGPASSWORD="$(az account get-access-token --resource https://ossrdbms-aad.database.windows.net --query accessToken --output tsv)"
--
-- Usage: psql -f 001_initial_schema.sql
-- ============================================================================

-- Enable UUID generation extension (required for gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- User roles for authentication and authorization
-- VISITOR: Anonymous/public access
-- USER: Registered user with basic access
-- PRESENTER: Can access and manage match statistics
-- SUBSCRIBER: Premium user with subscriber-only content access
-- ADMIN: Full administrative access
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('VISITOR', 'USER', 'PRESENTER', 'SUBSCRIBER', 'ADMIN');
    END IF;
END$$;

-- Supported sports in the platform
-- Tennis, Padel, Badminton, Squash are racket sports featured on Boa Bola TV
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sport_type') THEN
        CREATE TYPE sport_type AS ENUM ('TENNIS', 'PADEL', 'BADMINTON', 'SQUASH');
    END IF;
END$$;

-- Player handedness (dominant hand)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'handedness_type') THEN
        CREATE TYPE handedness_type AS ENUM ('LEFT', 'RIGHT');
    END IF;
END$$;

-- ============================================================================
-- TABLE: users
-- ============================================================================
-- Stores user account information for authentication and authorization.
-- Supports role-based access control with different permission levels.
-- Used for login, session management, and API authorization.
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'USER',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on email for fast login lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index on role for filtering users by permission level
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

COMMENT ON TABLE users IS 'User accounts for authentication and role-based authorization';
COMMENT ON COLUMN users.id IS 'Unique identifier (UUID) for the user';
COMMENT ON COLUMN users.name IS 'Display name of the user';
COMMENT ON COLUMN users.email IS 'Unique email address used for login';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt or Argon2 hashed password';
COMMENT ON COLUMN users.role IS 'User role: VISITOR, USER, PRESENTER, SUBSCRIBER, ADMIN';
COMMENT ON COLUMN users.avatar_url IS 'Optional URL to user profile picture';
COMMENT ON COLUMN users.created_at IS 'Timestamp when the user was created';
COMMENT ON COLUMN users.updated_at IS 'Timestamp when the user was last updated';

-- ============================================================================
-- TABLE: athletes
-- ============================================================================
-- Stores athlete/player information for match tracking.
-- Athletes can participate in multiple matches across different sports.
-- Normalized to 3NF: no transitive dependencies, atomic values.
CREATE TABLE IF NOT EXISTS athletes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    birthdate DATE,
    handedness handedness_type,
    ranking INTEGER,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on name for search functionality
CREATE INDEX IF NOT EXISTS idx_athletes_name ON athletes(name);

-- Index on country for filtering
CREATE INDEX IF NOT EXISTS idx_athletes_country ON athletes(country);

COMMENT ON TABLE athletes IS 'Athletes/players who participate in matches';
COMMENT ON COLUMN athletes.id IS 'Unique identifier (UUID) for the athlete';
COMMENT ON COLUMN athletes.name IS 'Full name of the athlete';
COMMENT ON COLUMN athletes.country IS 'Country the athlete represents';
COMMENT ON COLUMN athletes.birthdate IS 'Date of birth';
COMMENT ON COLUMN athletes.handedness IS 'Dominant hand: LEFT or RIGHT';
COMMENT ON COLUMN athletes.ranking IS 'Current world/regional ranking';
COMMENT ON COLUMN athletes.image_url IS 'URL to athlete profile picture';
COMMENT ON COLUMN athletes.created_at IS 'Timestamp when the athlete was created';
COMMENT ON COLUMN athletes.updated_at IS 'Timestamp when the athlete was last updated';

-- ============================================================================
-- TABLE: matches
-- ============================================================================
-- Stores match information including sport type, tournament, and participants.
-- References athletes table for player_a and player_b (foreign keys).
-- Designed to support singles matches; doubles would require a separate design.
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sport sport_type NOT NULL,
    tournament VARCHAR(255) NOT NULL,
    match_date DATE NOT NULL,
    round VARCHAR(100),
    player_a_id UUID NOT NULL REFERENCES athletes(id) ON DELETE RESTRICT,
    player_b_id UUID NOT NULL REFERENCES athletes(id) ON DELETE RESTRICT,
    winner_id UUID REFERENCES athletes(id) ON DELETE SET NULL,
    is_live BOOLEAN DEFAULT FALSE,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensure player_a and player_b are different
    CONSTRAINT chk_different_players CHECK (player_a_id != player_b_id)
);

-- Index on tournament for filtering matches
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament);

-- Index on match_date for date range queries
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);

-- Index on sport for filtering by sport type
CREATE INDEX IF NOT EXISTS idx_matches_sport ON matches(sport);

-- Index on player IDs for finding matches by athlete
CREATE INDEX IF NOT EXISTS idx_matches_player_a ON matches(player_a_id);
CREATE INDEX IF NOT EXISTS idx_matches_player_b ON matches(player_b_id);

-- Index on is_live for finding live matches quickly
CREATE INDEX IF NOT EXISTS idx_matches_is_live ON matches(is_live) WHERE is_live = TRUE;

COMMENT ON TABLE matches IS 'Matches between two athletes in various racket sports';
COMMENT ON COLUMN matches.id IS 'Unique identifier (UUID) for the match';
COMMENT ON COLUMN matches.sport IS 'Sport type: TENNIS, PADEL, BADMINTON, SQUASH';
COMMENT ON COLUMN matches.tournament IS 'Tournament or event name';
COMMENT ON COLUMN matches.match_date IS 'Date the match is/was played';
COMMENT ON COLUMN matches.round IS 'Tournament round (e.g., Final, Semi-Final, Quarter-Final)';
COMMENT ON COLUMN matches.player_a_id IS 'FK to athletes table for first player';
COMMENT ON COLUMN matches.player_b_id IS 'FK to athletes table for second player';
COMMENT ON COLUMN matches.winner_id IS 'FK to athletes table for the winner (NULL if not finished)';
COMMENT ON COLUMN matches.is_live IS 'Whether the match is currently being played live';
COMMENT ON COLUMN matches.start_time IS 'Actual start time of the match';
COMMENT ON COLUMN matches.end_time IS 'Actual end time of the match';
COMMENT ON COLUMN matches.created_at IS 'Timestamp when the match record was created';
COMMENT ON COLUMN matches.updated_at IS 'Timestamp when the match record was last updated';

-- ============================================================================
-- TABLE: scores
-- ============================================================================
-- Stores set-by-set scores for each match.
-- One row per set, allowing flexible scoring for different sports.
-- Normalized: no redundant data, each score belongs to exactly one match/set.
CREATE TABLE IF NOT EXISTS scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL CHECK (set_number > 0),
    games_player_a INTEGER NOT NULL DEFAULT 0 CHECK (games_player_a >= 0),
    games_player_b INTEGER NOT NULL DEFAULT 0 CHECK (games_player_b >= 0),
    tiebreak_points_a INTEGER CHECK (tiebreak_points_a >= 0),
    tiebreak_points_b INTEGER CHECK (tiebreak_points_b >= 0),
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensure unique set number per match
    CONSTRAINT uq_match_set UNIQUE (match_id, set_number)
);

-- Index on match_id for retrieving all sets of a match
CREATE INDEX IF NOT EXISTS idx_scores_match ON scores(match_id);

COMMENT ON TABLE scores IS 'Set-by-set scores for each match';
COMMENT ON COLUMN scores.id IS 'Unique identifier (UUID) for the score record';
COMMENT ON COLUMN scores.match_id IS 'FK to matches table';
COMMENT ON COLUMN scores.set_number IS 'Set number (1, 2, 3, etc.)';
COMMENT ON COLUMN scores.games_player_a IS 'Games won by player A in this set';
COMMENT ON COLUMN scores.games_player_b IS 'Games won by player B in this set';
COMMENT ON COLUMN scores.tiebreak_points_a IS 'Tiebreak points for player A (if tiebreak was played)';
COMMENT ON COLUMN scores.tiebreak_points_b IS 'Tiebreak points for player B (if tiebreak was played)';
COMMENT ON COLUMN scores.is_completed IS 'Whether this set has been completed';
COMMENT ON COLUMN scores.created_at IS 'Timestamp when the score record was created';
COMMENT ON COLUMN scores.updated_at IS 'Timestamp when the score record was last updated';

-- ============================================================================
-- TABLE: stats
-- ============================================================================
-- Stores detailed match statistics for analytics and subscriber features.
-- One row per match with comprehensive performance metrics.
-- Designed to support the statistics dashboard in the React application.
CREATE TABLE IF NOT EXISTS stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL UNIQUE REFERENCES matches(id) ON DELETE CASCADE,
    -- Serve statistics
    aces_player_a INTEGER DEFAULT 0 CHECK (aces_player_a >= 0),
    aces_player_b INTEGER DEFAULT 0 CHECK (aces_player_b >= 0),
    double_faults_a INTEGER DEFAULT 0 CHECK (double_faults_a >= 0),
    double_faults_b INTEGER DEFAULT 0 CHECK (double_faults_b >= 0),
    first_serve_pct_a NUMERIC(5,2) CHECK (first_serve_pct_a >= 0 AND first_serve_pct_a <= 100),
    first_serve_pct_b NUMERIC(5,2) CHECK (first_serve_pct_b >= 0 AND first_serve_pct_b <= 100),
    first_serve_pts_won_a NUMERIC(5,2) CHECK (first_serve_pts_won_a >= 0 AND first_serve_pts_won_a <= 100),
    first_serve_pts_won_b NUMERIC(5,2) CHECK (first_serve_pts_won_b >= 0 AND first_serve_pts_won_b <= 100),
    second_serve_pts_won_a NUMERIC(5,2) CHECK (second_serve_pts_won_a >= 0 AND second_serve_pts_won_a <= 100),
    second_serve_pts_won_b NUMERIC(5,2) CHECK (second_serve_pts_won_b >= 0 AND second_serve_pts_won_b <= 100),
    avg_serve_speed_a NUMERIC(6,2) CHECK (avg_serve_speed_a >= 0),
    avg_serve_speed_b NUMERIC(6,2) CHECK (avg_serve_speed_b >= 0),
    max_serve_speed_a NUMERIC(6,2) CHECK (max_serve_speed_a >= 0),
    max_serve_speed_b NUMERIC(6,2) CHECK (max_serve_speed_b >= 0),
    -- Unforced errors and winners
    unforced_errors_a INTEGER DEFAULT 0 CHECK (unforced_errors_a >= 0),
    unforced_errors_b INTEGER DEFAULT 0 CHECK (unforced_errors_b >= 0),
    winners_a INTEGER DEFAULT 0 CHECK (winners_a >= 0),
    winners_b INTEGER DEFAULT 0 CHECK (winners_b >= 0),
    forehand_winners_a INTEGER DEFAULT 0 CHECK (forehand_winners_a >= 0),
    forehand_winners_b INTEGER DEFAULT 0 CHECK (forehand_winners_b >= 0),
    backhand_winners_a INTEGER DEFAULT 0 CHECK (backhand_winners_a >= 0),
    backhand_winners_b INTEGER DEFAULT 0 CHECK (backhand_winners_b >= 0),
    forehand_errors_a INTEGER DEFAULT 0 CHECK (forehand_errors_a >= 0),
    forehand_errors_b INTEGER DEFAULT 0 CHECK (forehand_errors_b >= 0),
    backhand_errors_a INTEGER DEFAULT 0 CHECK (backhand_errors_a >= 0),
    backhand_errors_b INTEGER DEFAULT 0 CHECK (backhand_errors_b >= 0),
    -- Break points
    break_points_converted_a INTEGER DEFAULT 0 CHECK (break_points_converted_a >= 0),
    break_points_converted_b INTEGER DEFAULT 0 CHECK (break_points_converted_b >= 0),
    break_points_saved_a INTEGER DEFAULT 0 CHECK (break_points_saved_a >= 0),
    break_points_saved_b INTEGER DEFAULT 0 CHECK (break_points_saved_b >= 0),
    -- Net play
    net_points_a INTEGER DEFAULT 0 CHECK (net_points_a >= 0),
    net_points_b INTEGER DEFAULT 0 CHECK (net_points_b >= 0),
    net_points_won_a INTEGER DEFAULT 0 CHECK (net_points_won_a >= 0),
    net_points_won_b INTEGER DEFAULT 0 CHECK (net_points_won_b >= 0),
    -- Total points
    total_points_won_a INTEGER DEFAULT 0 CHECK (total_points_won_a >= 0),
    total_points_won_b INTEGER DEFAULT 0 CHECK (total_points_won_b >= 0),
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on match_id for retrieving stats by match
CREATE INDEX IF NOT EXISTS idx_stats_match ON stats(match_id);

COMMENT ON TABLE stats IS 'Detailed match statistics for analytics and subscriber dashboard';
COMMENT ON COLUMN stats.id IS 'Unique identifier (UUID) for the stats record';
COMMENT ON COLUMN stats.match_id IS 'FK to matches table (one-to-one relationship)';
COMMENT ON COLUMN stats.aces_player_a IS 'Number of aces by player A';
COMMENT ON COLUMN stats.aces_player_b IS 'Number of aces by player B';
COMMENT ON COLUMN stats.double_faults_a IS 'Number of double faults by player A';
COMMENT ON COLUMN stats.double_faults_b IS 'Number of double faults by player B';
COMMENT ON COLUMN stats.first_serve_pct_a IS 'First serve percentage for player A';
COMMENT ON COLUMN stats.first_serve_pct_b IS 'First serve percentage for player B';
COMMENT ON COLUMN stats.first_serve_pts_won_a IS 'Percentage of first serve points won by player A';
COMMENT ON COLUMN stats.first_serve_pts_won_b IS 'Percentage of first serve points won by player B';
COMMENT ON COLUMN stats.second_serve_pts_won_a IS 'Percentage of second serve points won by player A';
COMMENT ON COLUMN stats.second_serve_pts_won_b IS 'Percentage of second serve points won by player B';
COMMENT ON COLUMN stats.avg_serve_speed_a IS 'Average serve speed (km/h) for player A';
COMMENT ON COLUMN stats.avg_serve_speed_b IS 'Average serve speed (km/h) for player B';
COMMENT ON COLUMN stats.max_serve_speed_a IS 'Maximum serve speed (km/h) for player A';
COMMENT ON COLUMN stats.max_serve_speed_b IS 'Maximum serve speed (km/h) for player B';
COMMENT ON COLUMN stats.unforced_errors_a IS 'Number of unforced errors by player A';
COMMENT ON COLUMN stats.unforced_errors_b IS 'Number of unforced errors by player B';
COMMENT ON COLUMN stats.winners_a IS 'Total winners by player A';
COMMENT ON COLUMN stats.winners_b IS 'Total winners by player B';
COMMENT ON COLUMN stats.forehand_winners_a IS 'Forehand winners by player A';
COMMENT ON COLUMN stats.forehand_winners_b IS 'Forehand winners by player B';
COMMENT ON COLUMN stats.backhand_winners_a IS 'Backhand winners by player A';
COMMENT ON COLUMN stats.backhand_winners_b IS 'Backhand winners by player B';
COMMENT ON COLUMN stats.forehand_errors_a IS 'Forehand unforced errors by player A';
COMMENT ON COLUMN stats.forehand_errors_b IS 'Forehand unforced errors by player B';
COMMENT ON COLUMN stats.backhand_errors_a IS 'Backhand unforced errors by player A';
COMMENT ON COLUMN stats.backhand_errors_b IS 'Backhand unforced errors by player B';
COMMENT ON COLUMN stats.break_points_converted_a IS 'Break points converted by player A';
COMMENT ON COLUMN stats.break_points_converted_b IS 'Break points converted by player B';
COMMENT ON COLUMN stats.break_points_saved_a IS 'Break points saved by player A';
COMMENT ON COLUMN stats.break_points_saved_b IS 'Break points saved by player B';
COMMENT ON COLUMN stats.net_points_a IS 'Total net approaches by player A';
COMMENT ON COLUMN stats.net_points_b IS 'Total net approaches by player B';
COMMENT ON COLUMN stats.net_points_won_a IS 'Net points won by player A';
COMMENT ON COLUMN stats.net_points_won_b IS 'Net points won by player B';
COMMENT ON COLUMN stats.total_points_won_a IS 'Total points won by player A';
COMMENT ON COLUMN stats.total_points_won_b IS 'Total points won by player B';
COMMENT ON COLUMN stats.created_at IS 'Timestamp when the stats record was created';
COMMENT ON COLUMN stats.updated_at IS 'Timestamp when the stats record was last updated';

-- ============================================================================
-- TABLE: refresh_tokens
-- ============================================================================
-- Stores refresh tokens for JWT-based authentication.
-- Allows token rotation and revocation for security.
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE,
    replaced_by UUID REFERENCES refresh_tokens(id)
);

-- Index on user_id for finding tokens by user
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);

-- Index on token_hash for token lookup
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON refresh_tokens(token_hash);

COMMENT ON TABLE refresh_tokens IS 'Refresh tokens for JWT authentication with rotation support';
COMMENT ON COLUMN refresh_tokens.id IS 'Unique identifier (UUID) for the token';
COMMENT ON COLUMN refresh_tokens.user_id IS 'FK to users table';
COMMENT ON COLUMN refresh_tokens.token_hash IS 'Hashed refresh token for secure storage';
COMMENT ON COLUMN refresh_tokens.expires_at IS 'Token expiration timestamp';
COMMENT ON COLUMN refresh_tokens.created_at IS 'Timestamp when the token was created';
COMMENT ON COLUMN refresh_tokens.revoked_at IS 'Timestamp when the token was revoked (NULL if active)';
COMMENT ON COLUMN refresh_tokens.replaced_by IS 'FK to the token that replaced this one (for rotation)';

-- ============================================================================
-- DATABASE ROLES AND PERMISSIONS
-- ============================================================================
-- Create roles for different access levels
-- Note: These commands may fail if roles already exist; wrap in DO block

-- Read-only role for reporting and analytics
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'boabolatv_readonly') THEN
        CREATE ROLE boabolatv_readonly;
    END IF;
END$$;

-- Read-write role for application backend
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'boabolatv_readwrite') THEN
        CREATE ROLE boabolatv_readwrite;
    END IF;
END$$;

-- Grant permissions to readonly role
GRANT USAGE ON SCHEMA public TO boabolatv_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO boabolatv_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO boabolatv_readonly;

-- Grant permissions to readwrite role
GRANT USAGE ON SCHEMA public TO boabolatv_readwrite;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO boabolatv_readwrite;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO boabolatv_readwrite;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO boabolatv_readwrite;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO boabolatv_readwrite;

-- ============================================================================
-- TRIGGERS FOR updated_at
-- ============================================================================
-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at column
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
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
-- END OF MIGRATION
-- ============================================================================

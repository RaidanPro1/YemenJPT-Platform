-- =================================================================
-- YemenJPT Database Schema for PostgreSQL (V10.0 - Empire Edition)
-- =================================================================
-- This schema is based on the comprehensive architecture document and ERD,
-- expanded to support all platform features including automation and management.

-- Drop existing tables in reverse order of dependency to ensure clean slate
DROP INDEX IF EXISTS idx_audit_logs_entity, idx_media_poly, idx_registrations_poly, idx_violations_date, idx_users_email;
DROP TABLE IF EXISTS 
    oauth_providers, ai_feedback, audit_logs, media, reports, registrations, jobs, courses, trainers, 
    fact_checks, cases, violations, violator_parties, governorates, violation_types, 
    automation_workflows, social_media_bots, user_preferences, users, roles CASCADE;

-- === 1. Core: Users & Access Control ===
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- SuperAdmin, Editor, Monitor, Trainer, Analyst etc.
    permissions JSONB, -- For fine-grained control, e.g., {"violations.create": true}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE roles IS 'Defines user roles and their associated permissions within the system.';

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Nullable for social logins
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'active' NOT NULL, -- e.g., active, suspended
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE users IS 'Stores all user accounts for the platform.';

CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ai_provider VARCHAR(50) DEFAULT 'google' NOT NULL, -- 'google' or 'local'
    theme VARCHAR(50) DEFAULT 'system' NOT NULL, -- 'light', 'dark', 'system'
    language VARCHAR(10) DEFAULT 'ar' NOT NULL,
    notifications JSONB, -- {"email": {"daily_summary": true}, "app": {...}}
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE user_preferences IS 'Stores individual user settings like theme, language, and AI provider choice.';

CREATE TABLE IF NOT EXISTS oauth_providers (
    id SERIAL PRIMARY KEY,
    provider_name VARCHAR(50) UNIQUE NOT NULL, -- 'google', 'facebook', 'x'
    client_id VARCHAR(255),
    client_secret VARCHAR(255),
    is_active BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE oauth_providers IS 'Stores configuration for social login providers (OAuth).';

-- === 2. Press House Observatory (المرصد) ===
CREATE TABLE IF NOT EXISTS violation_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS governorates (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(255) UNIQUE NOT NULL,
    name_en VARCHAR(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS violator_parties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS violations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    violation_type_id INTEGER REFERENCES violation_types(id),
    governorate_id INTEGER REFERENCES governorates(id),
    violator_party_id INTEGER REFERENCES violator_parties(id),
    violation_date DATE NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- pending, verified, archived
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE violations IS 'Core table for the observatory, recording all reported violations.';

-- === 3. Case Management System (إدارة القضايا) ===
CREATE TABLE IF NOT EXISTS cases (
    id SERIAL PRIMARY KEY,
    violation_id INTEGER UNIQUE NOT NULL REFERENCES violations(id) ON DELETE CASCADE,
    case_status VARCHAR(50) DEFAULT 'open' NOT NULL, -- open, under_followup, closed
    priority VARCHAR(50) DEFAULT 'medium' NOT NULL, -- low, medium, high
    internal_notes TEXT,
    assigned_to INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE cases IS 'Turns a violation into a manageable case with status and priority.';

-- === 4. Fact-Checking Unit (تحقّق) ===
CREATE TABLE IF NOT EXISTS fact_checks (
    id SERIAL PRIMARY KEY,
    claim_title VARCHAR(512) NOT NULL,
    source_url VARCHAR(2048),
    result VARCHAR(50) NOT NULL, -- true, false, misleading, out_of_context, satirical
    analysis_report TEXT,
    verified_by INTEGER REFERENCES users(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- === 5. The Academy & Jobs (الأكاديمية والوظائف) ===
CREATE TABLE IF NOT EXISTS trainers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    expertise VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    trainer_id INTEGER REFERENCES trainers(id),
    start_date DATE,
    end_date DATE,
    delivery_mode VARCHAR(50) NOT NULL -- online, offline, hybrid
);

CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline DATE
);

-- Polymorphic Registrations Table for Courses, Jobs, etc.
CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    related_type VARCHAR(255) NOT NULL, -- 'App\\Models\\Course', 'App\\Models\\Job'
    related_id BIGINT UNSIGNED NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- === 6. Automation & Management ===
CREATE TABLE IF NOT EXISTS social_media_bots (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) NOT NULL, -- e.g., 'Twitter', 'Facebook'
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT false,
    config JSONB, -- API keys, post frequency, etc.
    managed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE social_media_bots IS 'Configuration for automated social media accounts.';

CREATE TABLE IF NOT EXISTS automation_workflows (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_event VARCHAR(255), -- e.g., 'new_violation_verified'
    n8n_webhook_url VARCHAR(2048),
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE automation_workflows IS 'Stores information about n8n automation workflows linked to platform events.';


-- === 7. General Purpose Tables ===
-- Polymorphic Media Library for all attachments
CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    file_path VARCHAR(2048) NOT NULL,
    file_type VARCHAR(50),
    visibility VARCHAR(50) DEFAULT 'private' NOT NULL,
    related_type VARCHAR(255),
    related_id BIGINT UNSIGNED,
    uploaded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    period VARCHAR(100),
    generated_by INTEGER REFERENCES users(id),
    file_path VARCHAR(2048),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE reports IS 'Stores generated reports for donors or public release.';

-- Audit Logs for Integrity and Traceability
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL, -- 'created', 'updated', 'deleted', 'login_failed'
    entity_type VARCHAR(255),
    entity_id BIGINT,
    old_values JSONB,
    new_values JSONB,
    "timestamp" TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE audit_logs IS 'Immutable log of all significant actions taken within the platform.';

-- AI Feedback Loop Table
CREATE TABLE IF NOT EXISTS ai_feedback (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    rating SMALLINT, -- e.g., 1 for helpful, -1 for not helpful
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE ai_feedback IS 'Stores user feedback on AI interactions for future fine-tuning.';


-- === 8. Indexes for Performance ===
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_violations_date ON violations(violation_date);
CREATE INDEX idx_registrations_poly ON registrations(related_type, related_id);
CREATE INDEX idx_media_poly ON media(related_type, related_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- End of schema
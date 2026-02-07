-- Tax Operations Management SaaS Schema
-- Target: PostgreSQL (Supabase)

-- 1. Custom Types/Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('CEO', 'AO', 'OA');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Helper Functions for Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Tables

-- 3.1 offices table
CREATE TABLE IF NOT EXISTS offices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 ranges table
CREATE TABLE IF NOT EXISTS ranges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(office_id, name)
);

-- 3.4 districts table
CREATE TABLE IF NOT EXISTS districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    range_id UUID NOT NULL REFERENCES ranges(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(office_id, name)
);

-- 3.5 clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    district_id UUID REFERENCES districts(id) ON DELETE SET NULL,
    range_id UUID REFERENCES ranges(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    pan VARCHAR(10) NOT NULL, -- Permanent Account Number
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    annexure_received BOOLEAN DEFAULT false,
    itr_filed BOOLEAN DEFAULT false,
    itr_filed_date DATE,
    everified BOOLEAN DEFAULT false,
    everified_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Constraint: PAN unique per office
    UNIQUE(office_id, pan)
);

-- 3.6 import_jobs table
CREATE TABLE IF NOT EXISTS import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    job_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    total_rows INTEGER DEFAULT 0,
    processed_rows INTEGER DEFAULT 0,
    error_log JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.7 activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    office_id UUID NOT NULL REFERENCES offices(id) ON DELETE RESTRICT, -- No cascade delete per requirement
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity_name VARCHAR(100), -- clients, ranges, etc.
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Triggers for updated_at
CREATE OR REPLACE FUNCTION recreate_triggers() RETURNS void AS $$
BEGIN
    DROP TRIGGER IF EXISTS tr_offices_updated_at ON offices;
    CREATE TRIGGER tr_offices_updated_at BEFORE UPDATE ON offices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS tr_users_updated_at ON users;
    CREATE TRIGGER tr_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS tr_ranges_updated_at ON ranges;
    CREATE TRIGGER tr_ranges_updated_at BEFORE UPDATE ON ranges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS tr_districts_updated_at ON districts;
    CREATE TRIGGER tr_districts_updated_at BEFORE UPDATE ON districts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS tr_clients_updated_at ON clients;
    CREATE TRIGGER tr_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
    DROP TRIGGER IF EXISTS tr_import_jobs_updated_at ON import_jobs;
    CREATE TRIGGER tr_import_jobs_updated_at BEFORE UPDATE ON import_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END;
$$ LANGUAGE plpgsql;

SELECT recreate_triggers();

-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_office_pan ON clients(office_id, pan);
CREATE INDEX IF NOT EXISTS idx_users_office ON users(office_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_office ON activity_logs(office_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_districts_range ON districts(range_id);
CREATE INDEX IF NOT EXISTS idx_clients_district ON clients(district_id);
CREATE INDEX IF NOT EXISTS idx_import_jobs_office ON import_jobs(office_id);
CREATE INDEX IF NOT EXISTS idx_clients_range ON clients(range_id);
CREATE INDEX IF NOT EXISTS idx_clients_assigned_to ON clients(assigned_to);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);

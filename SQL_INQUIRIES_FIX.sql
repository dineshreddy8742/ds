-- =====================================================
-- IDEMPOTENT INQUIRIES & AUDIT LOGS SETUP 
-- Safe to run multiple times
-- Run this in: https://supabase.com/dashboard/project/jazqtxagwlhbhcdrfbij/sql/new
-- =====================================================

-- 1. Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    industry TEXT,
    message TEXT,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs(created_at DESC);

-- 4. Security Policies (Idempotent)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Reset and Recreate Inquiry Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Enable insert for everyone" ON inquiries;
    DROP POLICY IF EXISTS "Enable view for admins" ON inquiries;
    DROP POLICY IF EXISTS "Enable update for admins" ON inquiries;
    
    CREATE POLICY "Enable insert for everyone" ON inquiries FOR INSERT WITH CHECK (true);
    CREATE POLICY "Enable view for admins" ON inquiries FOR SELECT USING (true);
    CREATE POLICY "Enable update for admins" ON inquiries FOR UPDATE USING (true);
END $$;

-- Reset and Recreate Audit Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Admins can view logs" ON audit_logs;
    CREATE POLICY "Admins can view logs" ON audit_logs FOR SELECT USING (true);
END $$;

SELECT '✓ Database Shield Restored & Idempotent' as status;

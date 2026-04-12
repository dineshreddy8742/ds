-- =====================================================
-- DialSmart Database Schema with Supabase Auth & RLS
-- =====================================================
-- Run this in: https://supabase.com/dashboard/project/jazqtxagwlhbhcdrfbij/sql/new
-- =====================================================

-- 1. Enable UUID extension (Supabase best practice)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create colleges table
CREATE TABLE IF NOT EXISTS colleges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  google_sheet_id TEXT,
  google_sheet_sync_enabled BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create admin_profiles table
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  intent TEXT DEFAULT 'Pending',
  duration TEXT DEFAULT '00m 00s',
  conversation TEXT,
  call_start_time TEXT,
  summary TEXT,
  ai_summary TEXT,
  transcript TEXT,
  recording_url TEXT,
  ai_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'New',
  notes TEXT,
  sync_metadata JSONB,
  college_id UUID REFERENCES colleges(id) ON DELETE CASCADE NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create lead_activity_logs
CREATE TABLE IF NOT EXISTS lead_activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  industry TEXT,
  phone TEXT,
  name TEXT,
  message TEXT,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES for Performance (Idempotent)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_leads_college_id ON leads(college_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_intent ON leads(intent);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_colleges_email ON colleges(email);
CREATE INDEX IF NOT EXISTS idx_lead_activity_logs_lead_id ON lead_activity_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);

-- =====================================================
-- FUNCTIONS: Auto-update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers safely
DROP TRIGGER IF EXISTS update_colleges_updated_at ON colleges;
CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON colleges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_profiles_updated_at ON admin_profiles;
CREATE TRIGGER update_admin_profiles_updated_at BEFORE UPDATE ON admin_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) Policies (Idempotent)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activity_logs ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------
-- Colleges Policies
-- -----------------------------------------------------
DROP POLICY IF EXISTS "Admins can view all colleges" ON colleges;
CREATE POLICY "Admins can view all colleges" ON colleges
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ADMIN')
  );

DROP POLICY IF EXISTS "Admins can insert colleges" ON colleges;
CREATE POLICY "Admins can insert colleges" ON colleges
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ADMIN')
  );

DROP POLICY IF EXISTS "Admins can update colleges" ON colleges;
CREATE POLICY "Admins can update colleges" ON colleges
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ADMIN')
  );

DROP POLICY IF EXISTS "Admins can delete colleges" ON colleges;
CREATE POLICY "Admins can delete colleges" ON colleges
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ADMIN')
  );

DROP POLICY IF EXISTS "College users can view own college" ON colleges;
CREATE POLICY "College users can view own college" ON colleges
  FOR SELECT USING (email = auth.email());

-- -----------------------------------------------------
-- Leads Policies
-- -----------------------------------------------------
DROP POLICY IF EXISTS "Admins can view all leads" ON leads;
CREATE POLICY "Admins can view all leads" ON leads
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ADMIN')
  );

DROP POLICY IF EXISTS "Admins can insert leads" ON leads;
CREATE POLICY "Admins can insert leads" ON leads
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ADMIN')
  );

DROP POLICY IF EXISTS "Admins can update leads" ON leads;
CREATE POLICY "Admins can update leads" ON leads
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ADMIN')
  );

DROP POLICY IF EXISTS "Admins can delete leads" ON leads;
CREATE POLICY "Admins can delete leads" ON leads
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ADMIN')
  );

DROP POLICY IF EXISTS "College users can view assigned leads" ON leads;
CREATE POLICY "College users can view assigned leads" ON leads
  FOR SELECT USING (
    college_id IN (SELECT id FROM colleges WHERE email = auth.email())
  );

DROP POLICY IF EXISTS "College users can update assigned leads" ON leads;
CREATE POLICY "College users can update assigned leads" ON leads
  FOR UPDATE USING (
    college_id IN (SELECT id FROM colleges WHERE email = auth.email())
  );

-- -----------------------------------------------------
-- Inquiries Policies
-- -----------------------------------------------------
DROP POLICY IF EXISTS "Public can insert inquiries" ON inquiries;
CREATE POLICY "Public can insert inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage inquiries" ON inquiries;
CREATE POLICY "Admins can manage inquiries" ON inquiries
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ADMIN')
  );

-- -----------------------------------------------------
-- Audit & Logs
-- -----------------------------------------------------
DROP POLICY IF EXISTS "Admins can view all audit logs" ON audit_logs;
CREATE POLICY "Admins can view all audit logs" ON audit_logs
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ADMIN')
  );

DROP POLICY IF EXISTS "System can insert audit logs" ON audit_logs;
CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all activity logs" ON lead_activity_logs;
CREATE POLICY "Admins can view all activity logs" ON lead_activity_logs
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ADMIN')
  );

-- =====================================================
-- NEURAL TRIGGER: Auto-link Auth Users to Organizations
-- =====================================================

-- This function automatically creates a college entry or admin profile 
-- when a new user signs up via Supabase Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF (new.raw_user_meta_data->>'role' = 'COLLEGE') THEN
    INSERT INTO public.colleges (name, email)
    VALUES (
      COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Organization'),
      new.email
    )
    ON CONFLICT (email) DO NOTHING;
  ELSIF (new.raw_user_meta_data->>'role' = 'ADMIN') THEN
    INSERT INTO public.admin_profiles (id, full_name)
    VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'System Admin'))
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SEED DATA & CREDENTIALS
-- =====================================================
-- Admin: admin@dialsmart.ai / Admin123!
-- College: demo@college.edu / Demo123!

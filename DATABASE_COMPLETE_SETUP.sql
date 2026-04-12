-- =====================================================
-- COMPLETE DATABASE SETUP FOR EXCEL UPLOAD
-- Run this in: https://supabase.com/dashboard/project/jazqtxagwlhbhcdrfbij/sql/new
-- =====================================================

-- 1. Ensure all required columns exist in leads table
-- =====================================================

-- conversation column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'conversation'
  ) THEN
    ALTER TABLE leads ADD COLUMN conversation TEXT;
    RAISE NOTICE '✓ Added column: conversation';
  ELSE
    RAISE NOTICE '✓ Column conversation already exists';
  END IF;
END $$;

-- call_start_time column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'call_start_time'
  ) THEN
    ALTER TABLE leads ADD COLUMN call_start_time TEXT;
    RAISE NOTICE '✓ Added column: call_start_time';
  ELSE
    RAISE NOTICE '✓ Column call_start_time already exists';
  END IF;
END $$;

-- ai_score column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'ai_score'
  ) THEN
    ALTER TABLE leads ADD COLUMN ai_score INTEGER DEFAULT 0;
    RAISE NOTICE '✓ Added column: ai_score';
  ELSE
    RAISE NOTICE '✓ Column ai_score already exists';
  END IF;
END $$;

-- student_name column (should exist but verify)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'student_name'
  ) THEN
    ALTER TABLE leads ADD COLUMN student_name TEXT;
    RAISE NOTICE '✓ Added column: student_name';
  ELSE
    RAISE NOTICE '✓ Column student_name already exists';
  END IF;
END $$;

-- phone column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'phone'
  ) THEN
    ALTER TABLE leads ADD COLUMN phone TEXT;
    RAISE NOTICE '✓ Added column: phone';
  ELSE
    RAISE NOTICE '✓ Column phone already exists';
  END IF;
END $$;

-- email column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'email'
  ) THEN
    ALTER TABLE leads ADD COLUMN email TEXT;
    RAISE NOTICE '✓ Added column: email';
  ELSE
    RAISE NOTICE '✓ Column email already exists';
  END IF;
END $$;

-- intent column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'intent'
  ) THEN
    ALTER TABLE leads ADD COLUMN intent TEXT DEFAULT 'Pending';
    RAISE NOTICE '✓ Added column: intent';
  ELSE
    RAISE NOTICE '✓ Column intent already exists';
  END IF;
END $$;

-- duration column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'duration'
  ) THEN
    ALTER TABLE leads ADD COLUMN duration TEXT DEFAULT '00m 00s';
    RAISE NOTICE '✓ Added column: duration';
  ELSE
    RAISE NOTICE '✓ Column duration already exists';
  END IF;
END $$;

-- status column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'status'
  ) THEN
    ALTER TABLE leads ADD COLUMN status TEXT DEFAULT 'New';
    RAISE NOTICE '✓ Added column: status';
  ELSE
    RAISE NOTICE '✓ Column status already exists';
  END IF;
END $$;

-- college_id column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'college_id'
  ) THEN
    ALTER TABLE leads ADD COLUMN college_id UUID REFERENCES colleges(id) ON DELETE CASCADE;
    RAISE NOTICE '✓ Added column: college_id';
  ELSE
    RAISE NOTICE '✓ Column college_id already exists';
  END IF;
END $$;

-- created_by column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE leads ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    RAISE NOTICE '✓ Added column: created_by';
  ELSE
    RAISE NOTICE '✓ Column created_by already exists';
  END IF;
END $$;

-- created_at column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE leads ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE '✓ Added column: created_at';
  ELSE
    RAISE NOTICE '✓ Column created_at already exists';
  END IF;
END $$;

-- updated_at column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE leads ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE '✓ Added column: updated_at';
  ELSE
    RAISE NOTICE '✓ Column updated_at already exists';
  END IF;
END $$;

-- summary column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'summary'
  ) THEN
    ALTER TABLE leads ADD COLUMN summary TEXT;
    RAISE NOTICE '✓ Added column: summary';
  ELSE
    RAISE NOTICE '✓ Column summary already exists';
  END IF;
END $$;

-- ai_summary column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'ai_summary'
  ) THEN
    ALTER TABLE leads ADD COLUMN ai_summary TEXT;
    RAISE NOTICE '✓ Added column: ai_summary';
  ELSE
    RAISE NOTICE '✓ Column ai_summary already exists';
  END IF;
END $$;

-- transcript column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'transcript'
  ) THEN
    ALTER TABLE leads ADD COLUMN transcript TEXT;
    RAISE NOTICE '✓ Added column: transcript';
  ELSE
    RAISE NOTICE '✓ Column transcript already exists';
  END IF;
END $$;

-- recording_url column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'recording_url'
  ) THEN
    ALTER TABLE leads ADD COLUMN recording_url TEXT;
    RAISE NOTICE '✓ Added column: recording_url';
  ELSE
    RAISE NOTICE '✓ Column recording_url already exists';
  END IF;
END $$;

-- notes column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'notes'
  ) THEN
    ALTER TABLE leads ADD COLUMN notes TEXT;
    RAISE NOTICE '✓ Added column: notes';
  ELSE
    RAISE NOTICE '✓ Column notes already exists';
  END IF;
END $$;

-- sync_metadata column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'sync_metadata'
  ) THEN
    ALTER TABLE leads ADD COLUMN sync_metadata JSONB;
    RAISE NOTICE '✓ Added column: sync_metadata';
  ELSE
    RAISE NOTICE '✓ Column sync_metadata already exists';
  END IF;
END $$;

-- 2. Verify ALL columns in leads table
-- =====================================================
SELECT '=== LEADS TABLE COLUMNS ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'leads' 
ORDER BY ordinal_position;

-- 3. Verify colleges table
-- =====================================================
SELECT '=== COLLEGES TABLE COLUMNS ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'colleges' 
ORDER BY ordinal_position;

-- 4. Add indexes if missing (performance)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_leads_college_id ON leads(college_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_intent ON leads(intent);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_ai_score ON leads(ai_score);
CREATE INDEX IF NOT EXISTS idx_colleges_email ON colleges(email);

SELECT '=== INDEXES CREATED ===' as info;
SELECT '✓ All indexes verified' as status;

-- 5. Verify triggers
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_colleges_updated_at ON colleges;
CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON colleges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

SELECT '=== TRIGGERS VERIFIED ===' as info;
SELECT '✓ All triggers verified' as status;

-- 6. Final Summary
-- =====================================================
SELECT '=== SETUP COMPLETE ===' as info;
SELECT 'ALL COLUMNS READY FOR EXCEL UPLOAD' as message;

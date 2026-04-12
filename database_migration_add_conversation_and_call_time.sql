-- Migration: Add missing columns to leads table
-- Date: 2026-04-10
-- Description: Adds conversation, call_start_time columns to support full Excel column mapping
-- IMPORTANT: Run this ONCE to add columns that don't already exist

-- Add conversation column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'conversation'
  ) THEN
    ALTER TABLE leads ADD COLUMN conversation TEXT;
    RAISE NOTICE 'Added column: conversation';
  ELSE
    RAISE NOTICE 'Column conversation already exists';
  END IF;
END $$;

-- Add call_start_time column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leads' AND column_name = 'call_start_time'
  ) THEN
    ALTER TABLE leads ADD COLUMN call_start_time TEXT;
    RAISE NOTICE 'Added column: call_start_time';
  ELSE
    RAISE NOTICE 'Column call_start_time already exists';
  END IF;
END $$;

-- Verify columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'leads' 
  AND column_name IN ('conversation', 'call_start_time', 'ai_score')
ORDER BY column_name;

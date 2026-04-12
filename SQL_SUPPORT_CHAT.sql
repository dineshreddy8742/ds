-- =====================================================
-- NEURAL LINK SUPPORT SYSTEM (REAL-TIME CHAT)
-- Run this in: https://supabase.com/dashboard/project/jazqtxagwlhbhcdrfbij/sql/new
-- =====================================================

CREATE TABLE IF NOT EXISTS support_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    sender_role TEXT CHECK (sender_role IN ('ADMIN', 'COLLEGE')),
    message TEXT NOT NULL,
    is_issue BOOLEAN DEFAULT false,
    issue_status TEXT DEFAULT 'Open' CHECK (issue_status IN ('Open', 'Solved', 'Pending')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast chat history loading
CREATE INDEX IF NOT EXISTS idx_chat_college_id ON support_messages(college_id);
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON support_messages(created_at DESC);

-- Enable Realtime
ALTER TABLE support_messages REPLICA IDENTITY FULL;

-- Add Table to Supabase Realtime Publication
-- Note: This might need to be run manually in some Supabase setups 
-- but we include it for documentation:
-- ALTER PUBLICATION supabase_realtime ADD TABLE support_messages;

-- RLS Policies
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Admins can see and send all support messages
CREATE POLICY "Admins full access to messages" ON support_messages FOR ALL USING (true);

-- Colleges can only see/send messages linked to their college_id
CREATE POLICY "Colleges chat with admin" ON support_messages 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM colleges 
            WHERE colleges.id = support_messages.college_id 
            AND colleges.email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
        )
    );

SELECT '✓ Neural Link Support Table Initialized' as status;

-- =====================================================
-- VINCI-ARENA PRO - MARKETPLACE SYSTEM
-- =====================================================

-- JOB POSTINGS
CREATE TABLE IF NOT EXISTS job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Job Info
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  job_type TEXT NOT NULL,  -- 'player', 'squad', 'content_creator', 'coach', 'analyst'
  
  -- Game & Details
  game TEXT NOT NULL,
  role_needed TEXT,  -- 'IGL', 'Fragger', 'Support', etc.
  experience_level TEXT,  -- 'beginner', 'intermediate', 'pro'
  
  -- Compensation
  budget_type TEXT,  -- 'paid', 'revenue_share', 'volunteer'
  budget_amount TEXT,
  
  -- Requirements
  requirements JSONB,  -- ["Min KD 2.0", "Discord required"]
  
  -- Status
  status TEXT DEFAULT 'open',  -- 'open', 'closed', 'filled'
  applications_count INT DEFAULT 0,
  
  -- Meta
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOB APPLICATIONS
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Application
  message TEXT NOT NULL,
  resume_url TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending',  -- 'pending', 'reviewing', 'accepted', 'rejected'
  
  -- Timestamps
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  
  UNIQUE(job_id, applicant_id)
);

-- DIRECT MESSAGES
CREATE TABLE IF NOT EXISTS direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  message TEXT NOT NULL,
  
  -- Status
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MESSAGE THREADS (for organizing conversations)
CREATE TABLE IF NOT EXISTS message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user1_id, user2_id)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON job_postings(posted_by);
CREATE INDEX IF NOT EXISTS idx_jobs_game ON job_postings(game);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON direct_messages(receiver_id);

-- Disable RLS
ALTER TABLE job_postings DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads DISABLE ROW LEVEL SECURITY;

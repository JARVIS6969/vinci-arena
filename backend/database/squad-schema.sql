-- =====================================================
-- VINCI-ARENA PRO - SQUAD SYSTEM DATABASE SCHEMA
-- =====================================================

-- SQUADS TABLE
CREATE TABLE IF NOT EXISTS squads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  tag TEXT UNIQUE,
  logo_url TEXT,
  banner_url TEXT,
  bio TEXT,
  game TEXT NOT NULL,
  region TEXT NOT NULL,
  
  elo_rating INT DEFAULT 1000,
  total_tournaments INT DEFAULT 0,
  total_wins INT DEFAULT 0,
  total_prize_money DECIMAL DEFAULT 0,
  
  verified BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SQUAD MEMBERS TABLE
CREATE TABLE IF NOT EXISTS squad_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_id UUID REFERENCES squads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  role TEXT DEFAULT 'player',
  in_game_name TEXT,
  
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  
  UNIQUE(squad_id, user_id)
);

-- SQUAD TOURNAMENTS
CREATE TABLE IF NOT EXISTS squad_tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_id UUID REFERENCES squads(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  
  position INT,
  total_points INT DEFAULT 0,
  total_kills INT DEFAULT 0,
  prize_money DECIMAL DEFAULT 0,
  
  tournament_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(squad_id, tournament_id)
);

-- SQUAD INVITATIONS
CREATE TABLE IF NOT EXISTS squad_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_id UUID REFERENCES squads(id) ON DELETE CASCADE,
  invited_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  status TEXT DEFAULT 'pending',
  message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_squads_game ON squads(game);
CREATE INDEX IF NOT EXISTS idx_squads_region ON squads(region);
CREATE INDEX IF NOT EXISTS idx_squads_elo ON squads(elo_rating DESC);
CREATE INDEX IF NOT EXISTS idx_squad_members_squad ON squad_members(squad_id);
CREATE INDEX IF NOT EXISTS idx_squad_members_user ON squad_members(user_id);

-- Disable RLS
ALTER TABLE squads DISABLE ROW LEVEL SECURITY;
ALTER TABLE squad_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE squad_tournaments DISABLE ROW LEVEL SECURITY;
ALTER TABLE squad_invitations DISABLE ROW LEVEL SECURITY;

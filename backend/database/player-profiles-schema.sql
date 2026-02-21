-- =====================================================
-- VINCI-ARENA PRO - PLAYER PROFILES SYSTEM
-- =====================================================

-- PLAYER PROFILES
CREATE TABLE IF NOT EXISTS player_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  
  -- Basic Info
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  
  -- Gaming Info
  primary_game TEXT,
  in_game_names JSONB,
  preferred_role TEXT,
  
  -- Social Links
  youtube_url TEXT,
  twitch_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  discord_tag TEXT,
  
  -- Stats
  total_tournaments INT DEFAULT 0,
  total_wins INT DEFAULT 0,
  total_kills INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  achievement_type TEXT,
  
  tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  squad_id UUID REFERENCES squads(id) ON DELETE SET NULL,
  
  image_url TEXT,
  certificate_url TEXT,
  
  date_achieved DATE,
  game TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GAMEPLAY CLIPS
CREATE TABLE IF NOT EXISTS gameplay_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INT,
  
  game TEXT,
  clip_type TEXT,
  
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PLAYER STATS
CREATE TABLE IF NOT EXISTS player_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
  game TEXT NOT NULL,
  
  matches_played INT DEFAULT 0,
  wins INT DEFAULT 0,
  kills INT DEFAULT 0,
  deaths INT DEFAULT 0,
  kd_ratio DECIMAL DEFAULT 0,
  avg_placement DECIMAL DEFAULT 0,
  
  elo_rating INT DEFAULT 1000,
  
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(profile_id, game)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_user ON player_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_game ON player_profiles(primary_game);
CREATE INDEX IF NOT EXISTS idx_achievements_profile ON achievements(profile_id);
CREATE INDEX IF NOT EXISTS idx_clips_profile ON gameplay_clips(profile_id);
CREATE INDEX IF NOT EXISTS idx_stats_profile ON player_stats(profile_id);

-- Disable RLS
ALTER TABLE player_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE gameplay_clips DISABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats DISABLE ROW LEVEL SECURITY;

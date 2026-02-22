-- =====================================================
-- VINCI-ARENA PRO - CHAT SYSTEM (Discord-style)
-- =====================================================

-- GROUP CHATS (like Discord servers)
CREATE TABLE IF NOT EXISTS group_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  
  -- Owner
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Type
  chat_type TEXT DEFAULT 'public',  -- 'public', 'private', 'squad'
  
  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GROUP MEMBERS
CREATE TABLE IF NOT EXISTS group_chat_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES group_chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  role TEXT DEFAULT 'member',  -- 'admin', 'moderator', 'member'
  
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(group_id, user_id)
);

-- MESSAGES (DMs + Group messages)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Message content
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',  -- 'text', 'file', 'link', 'image'
  
  -- Attachments
  attachment_url TEXT,
  attachment_name TEXT,
  
  -- Sender
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Destination (either DM or Group)
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,  -- For DMs
  group_id UUID REFERENCES group_chats(id) ON DELETE CASCADE,  -- For group messages
  
  -- Status
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Reply/Thread
  reply_to UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CHECK (
    (receiver_id IS NOT NULL AND group_id IS NULL) OR 
    (receiver_id IS NULL AND group_id IS NOT NULL)
  )
);

-- DM CONVERSATIONS (for organizing DMs)
CREATE TABLE IF NOT EXISTS dm_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  last_message TEXT,
  
  -- Unread counts
  user1_unread INT DEFAULT 0,
  user2_unread INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id < user2_id)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_messages_sender ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON chat_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_group ON chat_messages(group_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_chat_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_chat_members(user_id);
CREATE INDEX IF NOT EXISTS idx_dm_conversations_users ON dm_conversations(user1_id, user2_id);

-- Disable RLS
ALTER TABLE group_chats DISABLE ROW LEVEL SECURITY;
ALTER TABLE group_chat_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE dm_conversations DISABLE ROW LEVEL SECURITY;

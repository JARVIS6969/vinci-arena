import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

// WebSocket connection
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log('👤 User joined:', userId);
  });

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('disconnect', () => {
    if (socket.userId) onlineUsers.delete(socket.userId);
    console.log('❌ User disconnected:', socket.id);
  });
});
const PORT = process.env.PORT || 3001;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

console.log('✅ Supabase client initialized');

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || 'vinci-arena-secret-2026';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. Please login.' });
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    console.log('✅ Auth user:', req.user);
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

// ============================
// HEALTH CHECK
// ============================
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: '🚀 Vinci-Arena API is running!' });
});

// ============================
// AUTH ROUTES
// ============================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const { data: existing } = await supabase
      .from('users').select('id').eq('email', email.toLowerCase()).maybeSingle();
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert({ name: name.trim(), email: email.toLowerCase().trim(), password: hashedPassword })
      .select('id, name, email').single();
    if (error) throw error;

    const token = jwt.sign({ userId: String(data.id) }, JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, user: { id: data.id, name: data.name, email: data.email } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const { data: user } = await supabase
      .from('users').select('*').eq('email', email.toLowerCase().trim()).maybeSingle();
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: String(user.id) }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ============================
// TOURNAMENT ROUTES
// ============================

app.get('/api/tournaments', authenticateToken, async (req, res) => {
  try {
    const userId = String(req.user.userId);
    const { data, error } = await supabase
      .from('tournaments').select('*').eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Get tournaments error:', error);
    res.status(500).json({ error: 'Failed to get tournaments' });
  }
});

app.get('/api/tournaments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = String(req.user.userId);
    console.log('🔍 Getting tournament:', id, 'for user:', userId);

    const { data, error } = await supabase
      .from('tournaments').select('*').eq('id', id).eq('user_id', userId).maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Tournament not found' });

    console.log('🔍 Tournament found: YES');
    res.json(data);
  } catch (error) {
    console.error('Get tournament error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tournaments', authenticateToken, async (req, res) => {
  try {
    const { name, game } = req.body;
    const userId = String(req.user.userId);
    if (!name || !game) return res.status(400).json({ error: 'Name and game required' });

    const { data, error } = await supabase
      .from('tournaments')
      .insert({ name: name.trim(), game, user_id: userId })
      .select().single();
    if (error) throw error;
    // Emit to room

    res.status(201).json(data);
  } catch (error) {
    console.error('Create tournament error:', error);
    res.status(500).json({ error: 'Failed to create tournament' });
  }
});

app.put('/api/tournaments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, game } = req.body;
    const userId = String(req.user.userId);

    const { data: existing } = await supabase
      .from('tournaments').select('id').eq('id', id).eq('user_id', userId).maybeSingle();
    if (!existing) return res.status(404).json({ error: 'Tournament not found' });

    const { data, error } = await supabase
      .from('tournaments').update({ name: name.trim(), game }).eq('id', id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update' });
  }
});

app.delete('/api/tournaments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = String(req.user.userId);

    const { data: existing } = await supabase
      .from('tournaments').select('id').eq('id', id).eq('user_id', userId).maybeSingle();
    if (!existing) return res.status(404).json({ error: 'Tournament not found' });

    const { error } = await supabase.from('tournaments').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// ============================
// MATCHES ROUTES
// ============================

app.get('/api/tournaments/:id/matches', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = String(req.user.userId);
    console.log('📋 Getting matches for tournament:', id);

    const { data: tournament } = await supabase
      .from('tournaments').select('id').eq('id', id).eq('user_id', userId).maybeSingle();
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    const { data, error } = await supabase
      .from('matches').select('*').eq('tournament_id', id)
      .order('match_number', { ascending: true })
      .order('position', { ascending: true });
    if (error) throw error;

    console.log('📋 Matches found:', data?.length || 0);
    res.json(data || []);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tournaments/:id/matches', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { match_number, team_name, position, kills } = req.body;
    const userId = String(req.user.userId);

    console.log('➕ Adding match:', { match_number, team_name, position, kills });

    if (!match_number || !team_name || !position) {
      return res.status(400).json({ error: 'match_number, team_name and position are required' });
    }

    const { data: tournament } = await supabase
      .from('tournaments').select('id').eq('id', id).eq('user_id', userId).maybeSingle();
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    const { data, error } = await supabase
      .from('matches')
      .insert({
        tournament_id: id,
        match_number: parseInt(match_number),
        team_name: team_name.trim(),
        position: parseInt(position),
        kills: parseInt(kills) || 0
      })
      .select().single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    console.log('✅ Match added successfully:', data.id);
    res.status(201).json(data);
  } catch (error) {
    console.error('Add match error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/matches/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting match:', id);
    const { error } = await supabase.from('matches').delete().eq('id', id);
    if (error) throw error;
    console.log('✅ Match deleted');
    res.json({ message: 'Match deleted' });
  } catch (error) {
    console.error('Delete match error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================
// ERROR HANDLERS
// ============================

// ============================
// PLAYER PROFILES ROUTES
// ============================

// GET my profile
// GET public profile by user ID
app.get('/api/profiles/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('player_profiles')
      .select('*, achievements(*), gameplay_clips(*), player_stats(*)')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    // Also get user name
    const { data: user } = await supabase
      .from('users')
      .select('name')
      .eq('id', userId)
      .single();

    res.json({ ...data, userName: user?.name });
  } catch (err) {
    console.error('Get public profile error:', err);
    res.status(404).json({ error: 'Profile not found' });
  }
});
app.get('/api/profiles/me', authenticateToken, async (req, res) => {
  try {
    const userId = String(req.user.userId);
    const { data, error } = await supabase.from('player_profiles').select('*, achievements(*), gameplay_clips(*), player_stats(*)').eq('user_id', userId).single();
    if (error && error.code !== 'PGRST116') throw error;
    res.json(data || null);
  } catch (err) {
    console.error('Get my profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// POST create/update profile
app.post('/api/profiles', authenticateToken, async (req, res) => {
  try {
    const userId = String(req.user.userId);
    const { display_name, bio, avatar_url, banner_url, primary_game } = req.body;
    const { data: existing } = await supabase.from('player_profiles').select('id').eq('user_id', userId).single();
    if (existing) {
      const { data, error } = await supabase.from('player_profiles').update({ display_name, bio, avatar_url, banner_url, primary_game, updated_at: new Date().toISOString() }).eq('user_id', userId).select().single();
      if (error) throw error;
      res.json(data);
    } else {
      const { data, error } = await supabase.from('player_profiles').insert({ user_id: userId, display_name, bio, avatar_url, banner_url, primary_game }).select().single();
      if (error) throw error;
      res.status(201).json(data);
    }
  } catch (err) {
    console.error('Create/Update profile error:', err);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// ============================
// MARKETPLACE ROUTES
// ============================

// GET all job postings
app.get('/api/marketplace/jobs', async (req, res) => {
  try {
    const { game, job_type, status = 'open' } = req.query;
    let query = supabase
      .from('job_postings')
      .select('*, users(name)')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (game) query = query.eq('game', game);
    if (job_type) query = query.eq('job_type', job_type);
    
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Get jobs error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// GET single job
app.get('/api/marketplace/jobs/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('job_postings')
      .select('*, users(name, email), job_applications(id, status, applied_at, applicant_id, users(name))')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Get job error:', err);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// POST create job
app.post('/api/marketplace/jobs', authenticateToken, async (req, res) => {
  try {
    const userId = String(req.user.userId);
    const { title, description, job_type, game, role_needed, experience_level, budget_type, budget_amount, requirements, expires_at } = req.body;
    
    if (!title || !description || !job_type || !game) {
      return res.status(400).json({ error: 'Title, description, job_type, and game are required' });
    }
    
    const { data, error } = await supabase
      .from('job_postings')
      .insert({
        posted_by: userId,
        title, description, job_type, game, role_needed, experience_level,
        budget_type, budget_amount, requirements, expires_at
      })
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Create job error:', err);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// POST apply to job
app.post('/api/marketplace/jobs/:id/apply', authenticateToken, async (req, res) => {
  try {
    const userId = String(req.user.userId);
    const jobId = req.params.id;
    const { message, resume_url } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Application message is required' });
    }

    // Check if user is job poster
    const { data: job } = await supabase
      .from('job_postings')
      .select('posted_by, applications_count')
      .eq('id', jobId)
      .single();

    if (String(job?.posted_by) === userId) {
      return res.status(400).json({ error: 'You cannot apply to your own job' });
    }
    
    // Check if already applied
    const { data: existing } = await supabase
      .from('job_applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('applicant_id', userId)
      .single();
    
    if (existing) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }
    
    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        job_id: jobId,
        applicant_id: userId,
        message,
        resume_url
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Increment applications count
   const { data: jobData } = await supabase
  .from('job_postings')
  .select('applications_count')
  .eq('id', jobId)
  .single();

await supabase
  .from('job_postings')
  .update({ applications_count: (jobData?.applications_count || 0) + 1 })
  .eq('id', jobId);
    
    res.status(201).json(data);
  } catch (err) {
    console.error('Apply to job error:', err);
    res.status(500).json({ error: 'Failed to apply' });
  }
});

// GET my applications
app.get('/api/marketplace/my-applications', authenticateToken, async (req, res) => {
  try {
    const userId = String(req.user.userId);
    
    const { data, error } = await supabase
      .from('job_applications')
      .select('*, job_postings(*, users(name))')
      .eq('applicant_id', userId)
      .order('applied_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Get my applications error:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// GET my job postings
app.get('/api/marketplace/my-jobs', authenticateToken, async (req, res) => {
  try {
    const userId = String(req.user.userId);
    
    const { data, error } = await supabase
      .from('job_postings')
      .select('*, job_applications(id, status, users(name))')
      .eq('posted_by', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Get my jobs error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// ============================
// CHAT SYSTEM ROUTES
// ============================

// GET all my conversations (DMs + Groups)
app.get('/api/chat/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = String(req.user.userId);
    
    // Get DM conversations
    const { data: dms, error: dmError } = await supabase
      .from('dm_conversations')
      .select('*, user1:user1_id(name), user2:user2_id(name)')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('last_message_at', { ascending: false });
    
    if (dmError) throw dmError;
    
    // Get group chats
    const { data: groups, error: groupError } = await supabase
      .from('group_chat_members')
      .select('group_chats(*, group_code, created_by, group_chat_members(count))')
      .eq('user_id', userId);
    
    if (groupError) throw groupError;
    
    res.json({ dms: dms || [], groups: groups?.map(g => g.group_chats) || [] });
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// GET messages from DM or Group
app.get('/api/chat/messages', authenticateToken, async (req, res) => {
  try {
    const { receiver_id, group_id, limit = 50 } = req.query;
    
    let query = supabase
      .from('chat_messages')
      .select('*, sender:sender_id(name), reply_to_message:reply_to(message, sender:sender_id(name))')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));
    
    if (receiver_id) {
      const userId = String(req.user.userId);
      query = query.or(`and(sender_id.eq.${userId},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${userId})`);
    } else if (group_id) {
      query = query.eq('group_id', group_id);
    } else {
      return res.status(400).json({ error: 'receiver_id or group_id required' });
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    res.json(data || []);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST send message (DM or Group)
app.post('/api/chat/messages', authenticateToken, async (req, res) => {
  try {
    const userId = String(req.user.userId);
    const { message, receiver_id, group_id, message_type = 'text', attachment_url, attachment_name, reply_to } = req.body;
    
    if (!message && !attachment_url) {
      return res.status(400).json({ error: 'Message or attachment required' });
    }
    
    if (!receiver_id && !group_id) {
      return res.status(400).json({ error: 'receiver_id or group_id required' });
    }
    
    // Insert message
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        sender_id: userId,
        receiver_id: receiver_id || null,
        group_id: group_id || null,
        message,
        message_type,
        attachment_url,
        attachment_name,
        reply_to
      })
      .select('*, sender:sender_id(name)')
      .single();
    
    if (error) throw error;
    
    // Update DM conversation
    if (receiver_id) {
      const [smaller, larger] = [userId, receiver_id].sort();
      await supabase
        .from('dm_conversations')
        .upsert({
          user1_id: smaller,
          user2_id: larger,
          last_message: message,
          last_message_at: new Date().toISOString()
        }, { onConflict: 'user1_id,user2_id' });
    }
    
    res.status(201).json(data);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// POST create group chat
app.post('/api/chat/groups', authenticateToken, async (req, res) => {
  try {
    const userId = String(req.user.userId);
    const { name, description, icon_url, chat_type = 'public' } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Group name required' });
    }
    
    // Create group
    const { data: group, error: groupError } = await supabase
      .from('group_chats')
      .insert({
        name,
        description,
        icon_url,
        chat_type,
        created_by: userId,
group_code: Math.random().toString(36).substring(2, 8).toUpperCase()
      })
      .select()
      .single();
    
    if (groupError) throw groupError;
    
    // Add creator as admin
    const { error: memberError } = await supabase
      .from('group_chat_members')
      .insert({
        group_id: group.id,
        user_id: userId,
        role: 'admin'
      });
    
    if (memberError) throw memberError;
    
    res.status(201).json(group);
  } catch (err) {
    console.error('Create group error:', err);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// POST add member to group
app.post('/api/chat/groups/:id/members', authenticateToken, async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = String(req.user.userId);
    const { user_id_to_add } = req.body;
    
    // Check if requester is admin
    const { data: member } = await supabase
      .from('group_chat_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();
    
    if (!member || member.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can add members' });
    }
    
    // Add member
    const { data, error } = await supabase
      .from('group_chat_members')
      .insert({
        group_id: groupId,
        user_id: user_id_to_add
      })
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Add member error:', err);
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// GET group members
app.get('/api/chat/groups/:id/members', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('group_chat_members')
      .select('*, users(id, name, email)')
      .eq('group_id', req.params.id);
    
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Get group members error:', err);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});


// POST add achievement
app.post('/api/profiles/achievements', authenticateToken, async (req, res) => {
  try {
    const userId = String(req.user.userId);
    const { title, description, game, date_achieved, achievement_type, image_url, certificate_url } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required' });

    const { data: profile } = await supabase
      .from('player_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!profile) return res.status(404).json({ error: 'Profile not found. Please set up your profile first.' });

    const { data, error } = await supabase
      .from('achievements')
      .insert({
        profile_id: profile.id,
        title,
        description,
        game,
        achievement_type,
        image_url,
        certificate_url,
        date_achieved: date_achieved || new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Add achievement error:', err);
    res.status(500).json({ error: 'Failed to add achievement' });
  }
});

// DELETE achievement
app.delete('/api/profiles/achievements/:id', authenticateToken, async (req, res) => {
  try {
    const userId = String(req.user.userId);
    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Delete achievement error:', err);
    res.status(500).json({ error: 'Failed to delete achievement' });
  }
});
// PATCH update application status (accept/reject)
app.patch('/api/marketplace/applications/:id/status', authenticateToken, async (req, res) => {
  try {
    const userId = String(req.user.userId);
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if user owns the job
    const { data: application } = await supabase
      .from('job_applications')
      .select('*, job_postings(posted_by)')
      .eq('id', applicationId)
      .single();

    if (!application) return res.status(404).json({ error: 'Application not found' });
    if (String(application.job_postings.posted_by) !== userId) {
      return res.status(403).json({ error: 'Only job poster can update status' });
    }

    const { data, error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Update application status error:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});
// GET search groups by name or code
app.get('/api/chat/groups/search', authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    const { data, error } = await supabase
      .from('group_chats')
      .select('id, name, description, group_code, created_at')
      .or(`name.ilike.%${query}%,group_code.ilike.%${query}%`)
      .limit(10);

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Search groups error:', err);
    res.status(500).json({ error: 'Failed to search groups' });
  }
});

// POST join group by code
app.post('/api/chat/groups/join', authenticateToken, async (req, res) => {
  try {
    const userId = String(req.user.userId);
    const { group_code } = req.body;

    // Find group by code
    const { data: group, error: groupError } = await supabase
      .from('group_chats')
      .select('id, name, group_code')
      .eq('group_code', group_code.toUpperCase())
      .single();

    if (groupError || !group) return res.status(404).json({ error: 'Group not found' });

    // Check if already member
    const { data: existing } = await supabase
      .from('group_chat_members')
      .select('id')
      .eq('group_id', group.id)
      .eq('user_id', userId)
      .single();

    if (existing) return res.status(400).json({ error: 'Already a member' });

    // Add member
    const { error: joinError } = await supabase
      .from('group_chat_members')
      .insert({ group_id: group.id, user_id: userId, role: 'member' });

    if (joinError) throw joinError;
    res.json({ success: true, group });
  } catch (err) {
    console.error('Join group error:', err);
    res.status(500).json({ error: 'Failed to join group' });
  }
});

// GET group info
app.get('/api/chat/groups/:id/info', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('group_chats')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Get group info error:', err);
    res.status(500).json({ error: 'Failed to fetch group info' });
  }
});
app.use((req, res) => {
  console.log('❌ 404 Route not found:', req.method, req.url);
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ============================
// START SERVER
// ============================
httpServer.listen(PORT, () => {
  console.log('');
  console.log('🚀 ========================');
  console.log('  VINCI-ARENA API STARTED');
  console.log('🚀 ========================');
  console.log(`📡 Port    : ${PORT}`);
  console.log(`🌍 URL     : http://localhost:${PORT}`);
  console.log(`✅ CORS    : localhost:3000 allowed`);
  console.log(`🔒 Auth    : JWT + UUID enabled`);
  console.log(`🗄️  DB      : Supabase connected`);
  console.log('🚀 ========================');
  console.log('');
});

export { app, supabase };

// ============================
// SQUAD ROUTES
// ============================

// GET all squads
app.get('/api/squads', async (req, res) => {
  try {
    const { game, region, limit = 50 } = req.query;
    let query = supabase.from('squads').select('*, squad_members(id, role, in_game_name, users(name))').order('elo_rating', { ascending: false }).limit(parseInt(limit));
    if (game) query = query.eq('game', game);
    if (region) query = query.eq('region', region);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Get squads error:', err);
    res.status(500).json({ error: 'Failed to fetch squads' });
  }
});

// GET single squad
app.get('/api/squads/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('squads')
      .select('*, squad_members(*, users(name, email)), squad_tournaments(*, tournaments(name, game))')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Squad not found' });
    res.json(data);
  } catch (err) {
    console.error('Get squad error:', err);
    res.status(500).json({ error: 'Failed to fetch squad' });
  }
});

// POST create squad
app.post('/api/squads', authenticateToken, async (req, res) => {
  try {
    const { name, tag, bio, game, region, logo_url, banner_url } = req.body;
    const userId = String(req.user.userId);
    if (!name || !game || !region) {
      return res.status(400).json({ error: 'Name, game, and region are required' });
    }
    
    const { data: squad, error: squadError } = await supabase
      .from('squads')
      .insert({ name, tag, bio, game, region, logo_url, banner_url, created_by: userId })
      .select()
      .single();
    
    if (squadError) {
      if (squadError.code === '23505') {
        return res.status(400).json({ error: 'Squad name or tag already exists' });
      }
      throw squadError;
    }
    
    const { error: memberError } = await supabase
      .from('squad_members')
      .insert({ squad_id: squad.id, user_id: userId, role: 'leader' });
    
    if (memberError) throw memberError;
    
    res.status(201).json(squad);
  } catch (err) {
    console.error('Create squad error:', err);
    res.status(500).json({ error: 'Failed to create squad' });
  }
});

// PUT update squad
app.put('/api/squads/:id', authenticateToken, async (req, res) => {
  try {
    const squadId = req.params.id;
    const userId = String(req.user.userId);
    const { name, tag, bio, logo_url, banner_url } = req.body;
    
    const { data: member } = await supabase
      .from('squad_members')
      .select('role')
      .eq('squad_id', squadId)
      .eq('user_id', userId)
      .eq('role', 'leader')
      .single();
    
    if (!member) {
      return res.status(403).json({ error: 'Only squad leader can update' });
    }
    
    const { data, error } = await supabase
      .from('squads')
      .update({ name, tag, bio, logo_url, banner_url, updated_at: new Date().toISOString() })
      .eq('id', squadId)
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Update squad error:', err);
    res.status(500).json({ error: 'Failed to update squad' });
  }
});

// DELETE squad
app.delete('/api/squads/:id', authenticateToken, async (req, res) => {
  try {
    const squadId = req.params.id;
    const userId = String(req.user.userId);
    
    const { data: member } = await supabase
      .from('squad_members')
      .select('role')
      .eq('squad_id', squadId)
      .eq('user_id', userId)
      .eq('role', 'leader')
      .single();
    
    if (!member) {
      return res.status(403).json({ error: 'Only squad leader can delete' });
    }
    
    const { error } = await supabase.from('squads').delete().eq('id', squadId);
    if (error) throw error;
    res.json({ message: 'Squad deleted successfully' });
  } catch (err) {
    console.error('Delete squad error:', err);
    res.status(500).json({ error: 'Failed to delete squad' });
  }
});


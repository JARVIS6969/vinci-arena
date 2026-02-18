import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

console.log('✅ Supabase client initialized');

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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

    const token = jwt.sign({ userId: String(data.id) }, JWT_SECRET, { expiresIn: '24h' });
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

    const token = jwt.sign({ userId: String(user.id) }, JWT_SECRET, { expiresIn: '24h' });
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
app.listen(PORT, () => {
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

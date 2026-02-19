import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  import('jsonwebtoken').then(({ default: jwt }) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.user = user;
      next();
    });
  });
};

// GET all squads
router.get('/', async (req, res) => {
  try {
    const { game, region, limit = 50 } = req.query;
    let query = supabase.from('squads').select('*, squad_members(*)').order('elo_rating', { ascending: false }).limit(limit);
    if (game) query = query.eq('game', game);
    if (region) query = query.eq('region', region);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Get squads error:', err);
    res.status(500).json({ error: 'Failed to fetch squads' });
  }
});

// GET single squad
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('squads').select('*, squad_members(*, users(name, email)), squad_tournaments(*, tournaments(name, game))').eq('id', req.params.id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Squad not found' });
    res.json(data);
  } catch (err) {
    console.error('Get squad error:', err);
    res.status(500).json({ error: 'Failed to fetch squad' });
  }
});

// POST create squad
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, tag, bio, game, region, logo_url, banner_url } = req.body;
    const userId = String(req.user.userId);
    if (!name || !game || !region) return res.status(400).json({ error: 'Name, game, region required' });
    
    const { data: squad, error: squadError } = await supabase.from('squads').insert({ name, tag, bio, game, region, logo_url, banner_url, created_by: userId }).select().single();
    if (squadError) {
      if (squadError.code === '23505') return res.status(400).json({ error: 'Squad name/tag exists' });
      throw squadError;
    }
    
    const { error: memberError } = await supabase.from('squad_members').insert({ squad_id: squad.id, user_id: userId, role: 'leader' });
    if (memberError) throw memberError;
    
    res.status(201).json(squad);
  } catch (err) {
    console.error('Create squad error:', err);
    res.status(500).json({ error: 'Failed to create squad' });
  }
});

export default router;

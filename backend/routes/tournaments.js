import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'vinci-arena-secret-2026';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Please login.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

// GET all tournaments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { supabase } = await import('../server.js');

    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);

  } catch (error) {
    console.error('Get tournaments error:', error);
    res.status(500).json({ error: 'Failed to get tournaments' });
  }
});

// CREATE tournament
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, game } = req.body;

    if (!name || !game) {
      return res.status(400).json({ error: 'Name and game are required' });
    }

    const allowedGames = ['Free Fire', 'BGMI', 'Valorant'];
    if (!allowedGames.includes(game)) {
      return res.status(400).json({ error: 'Invalid game type' });
    }

    const { supabase } = await import('../server.js');

    const { data, error } = await supabase
      .from('tournaments')
      .insert({
        name: name.trim(),
        game,
        user_id: req.user.userId
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);

  } catch (error) {
    console.error('Create tournament error:', error);
    res.status(500).json({ error: 'Failed to create tournament' });
  }
});

// DELETE tournament
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { supabase } = await import('../server.js');

    const { data: tournament } = await supabase
      .from('tournaments')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .maybeSingle();

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Tournament deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete tournament' });
  }
});

export default router;

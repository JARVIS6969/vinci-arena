import express from 'express';

const router = express.Router();

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

// Export factory function that takes supabase as parameter
export default (supabase) => {
  
  // GET /api/profiles/:userId
  router.get('/user/:userId', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('player_profiles')
        .select('*, achievements(*), gameplay_clips(*), player_stats(*)')
        .eq('user_id', req.params.userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      res.json(data || null);
    } catch (err) {
      console.error('Get profile error:', err);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  // GET /api/profiles/me/profile
  router.get('/me/profile', authenticateToken, async (req, res) => {
    try {
      const userId = String(req.user.userId);
      const { data, error } = await supabase
        .from('player_profiles')
        .select('*, achievements(*), gameplay_clips(*), player_stats(*)')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      res.json(data || null);
    } catch (err) {
      console.error('Get my profile error:', err);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  // POST /api/profiles
  router.post('/', authenticateToken, async (req, res) => {
    try {
      const userId = String(req.user.userId);
      const { display_name, bio, avatar_url, banner_url, primary_game, in_game_names, preferred_role, youtube_url, twitch_url, instagram_url, twitter_url, discord_tag } = req.body;
      
      const { data: existing } = await supabase
        .from('player_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (existing) {
        const { data, error } = await supabase
          .from('player_profiles')
          .update({
            display_name, bio, avatar_url, banner_url, primary_game, in_game_names, preferred_role,
            youtube_url, twitch_url, instagram_url, twitter_url, discord_tag,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single();
        
        if (error) throw error;
        res.json(data);
      } else {
        const { data, error } = await supabase
          .from('player_profiles')
          .insert({
            user_id: userId,
            display_name, bio, avatar_url, banner_url, primary_game, in_game_names, preferred_role,
            youtube_url, twitch_url, instagram_url, twitter_url, discord_tag
          })
          .select()
          .single();
        
        if (error) throw error;
        res.status(201).json(data);
      }
    } catch (err) {
      console.error('Create/Update profile error:', err);
      res.status(500).json({ error: 'Failed to save profile' });
    }
  });

  // POST /api/profiles/achievements
  router.post('/achievements', authenticateToken, async (req, res) => {
    try {
      const userId = String(req.user.userId);
      
      const { data: profile } = await supabase
        .from('player_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (!profile) return res.status(404).json({ error: 'Profile not found' });
      
      const { title, description, achievement_type, tournament_id, squad_id, image_url, certificate_url, date_achieved, game } = req.body;
      
      const { data, error } = await supabase
        .from('achievements')
        .insert({
          profile_id: profile.id,
          title, description, achievement_type, tournament_id, squad_id,
          image_url, certificate_url, date_achieved, game
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

  // POST /api/profiles/clips
  router.post('/clips', authenticateToken, async (req, res) => {
    try {
      const userId = String(req.user.userId);
      
      const { data: profile } = await supabase
        .from('player_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (!profile) return res.status(404).json({ error: 'Profile not found' });
      
      const { title, description, video_url, thumbnail_url, duration_seconds, game, clip_type } = req.body;
      
      const { data, error } = await supabase
        .from('gameplay_clips')
        .insert({
          profile_id: profile.id,
          title, description, video_url, thumbnail_url, duration_seconds, game, clip_type
        })
        .select()
        .single();
      
      if (error) throw error;
      res.status(201).json(data);
    } catch (err) {
      console.error('Add clip error:', err);
      res.status(500).json({ error: 'Failed to add clip' });
    }
  });
  // GET /api/profiles/me (alias)
  router.get('/me', authenticateToken, async (req, res) => {
    try {
      const userId = String(req.user.userId);
      const { data, error } = await supabase
        .from('player_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      res.json(data || null);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  // GET /api/profiles/:userId/games
  router.get('/user/:userId/games', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('player_games')
        .select('*')
        .eq('user_id', req.params.userId);
      if (error) throw error;
      res.json(data || []);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch games' });
    }
  });

  // POST /api/profiles/games
  router.post('/games', authenticateToken, async (req, res) => {
    try {
      const userId = String(req.user.userId);
      const { game, role, rank } = req.body;
      const { data, error } = await supabase
        .from('player_games')
        .upsert({ user_id: userId, game, role, rank }, { onConflict: 'user_id,game' })
        .select().single();
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to save game' });
    }
  });

  // DELETE /api/profiles/games/:game
  router.delete('/games/:game', authenticateToken, async (req, res) => {
    try {
      const userId = String(req.user.userId);
      const { error } = await supabase
        .from('player_games')
        .delete()
        .eq('user_id', userId)
        .eq('game', req.params.game);
      if (error) throw error;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete game' });
    }
  });

  // GET /api/profiles/:userId/stats
  router.get('/user/:userId/stats', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('game_stats')
        .select('*')
        .eq('user_id', req.params.userId);
      if (error) throw error;
      res.json(data || []);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // POST /api/profiles/stats
  router.post('/stats', authenticateToken, async (req, res) => {
    try {
      const userId = String(req.user.userId);
      const { game, stats, screenshot_url } = req.body;
      const { data, error } = await supabase
        .from('game_stats')
        .upsert({ user_id: userId, game, stats, screenshot_url, updated_at: new Date().toISOString() }, { onConflict: 'user_id,game' })
        .select().single();
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to save stats' });
    }
  });
  return router;
};

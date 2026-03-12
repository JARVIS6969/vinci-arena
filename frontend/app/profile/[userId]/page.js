'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const GAME_CONFIG = {
  'Free Fire': { icon: '🔥', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
  'BGMI':      { icon: '🎯', color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)' },
  'Valorant':  { icon: '⚡', color: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.25)' },
};

const STAT_LABELS = {
  kd_ratio: { label: 'K/D', icon: '⚔️' },
  win_rate: { label: 'WIN%', icon: '🏆' },
  total_matches: { label: 'MATCHES', icon: '🎮' },
  total_kills: { label: 'KILLS', icon: '💀' },
  headshot: { label: 'HS%', icon: '🎯' },
  wins: { label: 'WINS', icon: '🥇' },
  damage: { label: 'DMG', icon: '💥' },
  avg_damage: { label: 'AVG DMG', icon: '📊' },
  rank: { label: 'RANK', icon: '👑' },
  combat_score: { label: 'CS', icon: '⚡' },
};

const LOOKING_FOR_COLOR = { Team: '#ef4444', Players: '#f97316', Scrims: '#6366f1', Tournament: '#eab308', 'Just Showcasing': '#10b981' };

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [allStats, setAllStats] = useState([]);
  const [activeGame, setActiveGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [messaging, setMessaging] = useState(false);

  useEffect(() => {
    setCurrentUserId(localStorage.getItem('userId') || '');
    fetchAll();
  }, [params.userId]);

  const fetchAll = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [profileRes, gamesRes, statsRes] = await Promise.all([
        fetch(`http://localhost:3001/api/profiles/user/${params.userId}`, { headers }),
        fetch(`http://localhost:3001/api/profiles/user/${params.userId}/games`, { headers }),
        fetch(`http://localhost:3001/api/profiles/user/${params.userId}/stats`, { headers }),
      ]);
      if (!profileRes.ok) { setNotFound(true); return; }
      const [p, g, s] = await Promise.all([profileRes.json(), gamesRes.json(), statsRes.json()]);
      setProfile(p);
      setGames(g || []);
      setAllStats(s || []);
      if (g?.length > 0) setActiveGame(g[0].game);
    } catch (err) { setNotFound(true); }
    finally { setLoading(false); }
  };

  const handleSendMessage = async () => {
    setMessaging(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: '👋 Hey!', receiver_id: params.userId }),
      });
      const convRes = await fetch('http://localhost:3001/api/chat/conversations', { headers: { Authorization: `Bearer ${token}` } });
      const data = await convRes.json();
      const userId = localStorage.getItem('userId');
      const dm = data.dms?.find(d => (d.user1_id === userId && d.user2_id === params.userId) || (d.user2_id === userId && d.user1_id === params.userId));
      if (dm) router.push(`/chat/dm/${dm.id}`);
    } catch (err) { console.error(err); }
    finally { setMessaging(false); }
  };

  const activeStats = allStats.find(s => s.game === activeGame)?.stats || {};
  const activeGameConfig = GAME_CONFIG[activeGame] || GAME_CONFIG['Free Fire'];
  const activeGameData = games.find(g => g.game === activeGame);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center" style={{paddingTop: '44px'}}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
        <p className="text-red-500/60 text-xs tracking-widest font-bold" style={{fontFamily: "'Orbitron', sans-serif"}}>LOADING PROFILE...</p>
      </div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white" style={{paddingTop: '44px'}}>
      <div className="text-center">
        <div className="text-6xl mb-4">💀</div>
        <p className="font-black text-red-500 text-xl tracking-widest mb-2" style={{fontFamily: "'Orbitron', sans-serif"}}>PROFILE NOT FOUND</p>
        <p className="text-gray-600 text-xs mb-6">This player hasn't set up their profile yet</p>
        <button onClick={() => router.back()} className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded font-black text-xs tracking-widest transition">← GO BACK</button>
      </div>
    </div>
  );

  const isOwner = currentUserId && String(currentUserId) === String(params.userId);

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif", paddingTop: '44px'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .stat-card:hover { transform: translateY(-3px); }
        .stat-card { transition: all 0.3s; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #ef4444; }
      `}</style>

      {/* BANNER */}
      <div className="relative h-52 overflow-hidden">
        {profile?.banner_url ? (
          <img src={profile.banner_url} alt="banner" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 grid-bg" style={{background: 'linear-gradient(135deg, #0a0000, #050010, #000a05)'}} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1" style={{background: 'linear-gradient(90deg, transparent, #ef4444, transparent)'}} />
        <button onClick={() => router.back()} className="absolute top-4 left-4 text-red-400 hover:text-red-300 font-bold text-sm flex items-center gap-1 bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-sm transition">← BACK</button>
        {isOwner && (
          <button onClick={() => router.push('/profile')} className="absolute top-4 right-4 text-xs font-black px-3 py-1.5 rounded-lg backdrop-blur-sm transition" style={{background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444'}}>✏ EDIT</button>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* PROFILE HEADER */}
        <div className="relative -mt-20 mb-8 flex items-end gap-5">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-2xl border-4 border-black overflow-hidden flex-shrink-0" style={{boxShadow: '0 0 40px rgba(239,68,68,0.4)'}}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-700 to-purple-700 flex items-center justify-center font-black text-5xl">
                {profile?.display_name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="font-black text-3xl tracking-wide" style={{fontFamily: "'Orbitron', sans-serif", textShadow: '0 0 30px rgba(239,68,68,0.4)'}}>
                {profile?.display_name || 'UNKNOWN'}
              </h1>
              {profile?.country && <span className="text-gray-500 text-sm font-bold">🌏 {profile.country}</span>}
            </div>

            {profile?.tagline && (
              <p className="text-gray-400 font-bold text-sm mb-2 italic">"{profile.tagline}"</p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              {/* Games badges */}
              {games.map(g => {
                const gc = GAME_CONFIG[g.game];
                return (
                  <span key={g.game} className="text-xs font-black px-2.5 py-1 rounded-full" style={{background: gc?.bg, border: `1px solid ${gc?.border}`, color: gc?.color, fontFamily: "'Orbitron', sans-serif"}}>
                    {gc?.icon} {g.game}
                  </span>
                );
              })}

              {/* Looking for */}
              {profile?.looking_for && (
                <span className="text-xs font-black px-2.5 py-1 rounded-full" style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: LOOKING_FOR_COLOR[profile.looking_for] || '#6b7280'}}>
                  🔍 LF {profile.looking_for?.toUpperCase()}
                </span>
              )}

              {/* Message button */}
              {!isOwner && currentUserId && (
                <button onClick={handleSendMessage} disabled={messaging}
                  className="flex items-center gap-2 text-white px-4 py-1.5 rounded-lg font-black text-xs tracking-widest transition"
                  style={{background: 'linear-gradient(135deg, #ef4444, #DC143C)', boxShadow: '0 0 15px rgba(239,68,68,0.4)'}}>
                  {messaging ? '⟳' : '💬'} MESSAGE
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-4">

            {/* Bio */}
            {profile?.bio && (
              <div className="rounded-2xl p-5" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// BIO</p>
                <p className="text-gray-400 text-sm leading-relaxed font-semibold">{profile.bio}</p>
              </div>
            )}

            {/* Social Links */}
            {(profile?.youtube_url || profile?.instagram_url || profile?.discord_tag || profile?.twitter_url) && (
              <div className="rounded-2xl p-5" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// SOCIALS</p>
                <div className="space-y-2">
                  {profile.youtube_url && <a href={profile.youtube_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-400 transition"><span className="text-red-500">▶</span> YouTube</a>}
                  {profile.instagram_url && <a href={profile.instagram_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-pink-400 transition"><span className="text-pink-500">📷</span> Instagram</a>}
                  {profile.discord_tag && <div className="flex items-center gap-2 text-sm font-bold text-gray-400"><span className="text-indigo-500">💬</span> {profile.discord_tag}</div>}
                  {profile.twitter_url && <a href={profile.twitter_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-400 transition"><span className="text-blue-500">🐦</span> Twitter/X</a>}
                </div>
              </div>
            )}

            {/* Achievements */}
            {profile?.achievements?.length > 0 && (
              <div className="rounded-2xl p-5" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// ACHIEVEMENTS</p>
                <div className="space-y-3">
                  {profile.achievements.map((ach, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{background: '#0a0a0a', border: '1px solid rgba(234,179,8,0.15)'}}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0" style={{background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.3)'}}>🏆</div>
                      <div>
                        <p className="font-black text-xs text-white tracking-wide">{ach.title}</p>
                        {ach.game && <span className="text-xs font-bold" style={{color: GAME_CONFIG[ach.game]?.color || '#ef4444'}}>{ach.game}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — GAME STATS */}
          <div className="lg:col-span-2 space-y-4">
            {games.length > 0 ? (
              <>
                {/* Game Tabs */}
                <div className="flex gap-2 flex-wrap">
                  {games.map(g => {
                    const gc = GAME_CONFIG[g.game];
                    return (
                      <button key={g.game} onClick={() => setActiveGame(g.game)}
                        className="px-4 py-2 rounded-xl font-black text-xs tracking-widest transition-all duration-300"
                        style={{
                          background: activeGame === g.game ? gc?.bg : '#0a0a0a',
                          border: `1px solid ${activeGame === g.game ? gc?.color : 'rgba(255,255,255,0.05)'}`,
                          color: activeGame === g.game ? gc?.color : '#6b7280',
                          boxShadow: activeGame === g.game ? `0 0 15px ${gc?.color}30` : 'none',
                          fontFamily: "'Orbitron', sans-serif"
                        }}>
                        {gc?.icon} {g.game}
                      </button>
                    );
                  })}
                </div>

                {/* Active Game Card */}
                {activeGame && (
                  <div className="rounded-2xl p-6" style={{background: '#050505', border: `1px solid ${activeGameConfig.border}`}}>
                    {/* Game header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl" style={{filter: `drop-shadow(0 0 10px ${activeGameConfig.color})`}}>{activeGameConfig.icon}</div>
                        <div>
                          <p className="font-black text-lg text-white" style={{fontFamily: "'Orbitron', sans-serif", textShadow: `0 0 20px ${activeGameConfig.color}60`}}>{activeGame}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            {activeGameData?.role && <span className="text-xs font-black" style={{color: activeGameConfig.color}}>{activeGameData.role}</span>}
                            {activeGameData?.rank && (
                              <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{background: activeGameConfig.bg, border: `1px solid ${activeGameConfig.border}`, color: activeGameConfig.color}}>
                                👑 {activeGameData.rank}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    {isOwner && (
                      <div className="flex gap-2 mb-4">
                        <button onClick={() => window.location.href=`/profile/edit`}
                          className="text-xs font-black px-3 py-1.5 rounded-lg transition"
                          style={{background: activeGameConfig.bg, color: activeGameConfig.color, border: `1px solid ${activeGameConfig.border}`, fontFamily: "'Orbitron', sans-serif"}}>
                          ✏ EDIT PROFILE
                        </button>
                        <button onClick={() => window.location.href=`/profile/edit?step=3&game=${activeGame}`}
                          className="text-xs font-black px-3 py-1.5 rounded-lg transition"
                          style={{background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', fontFamily: "'Orbitron', sans-serif"}}>
                          📊 EDIT STATS
                        </button>
                      </div>
                    )}
                    {Object.keys(activeStats).length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(activeStats).map(([key, value]) => {
                          const statInfo = STAT_LABELS[key];
                          if (!value || !statInfo) return null;
                          return (
                            <div key={key} className="stat-card rounded-xl p-4 text-center"
                              style={{background: '#080808', border: `1px solid ${activeGameConfig.color}15`, boxShadow: `0 0 15px ${activeGameConfig.color}05`}}>
                              <div className="text-xl mb-1">{statInfo.icon}</div>
                              <div className="font-black text-xl text-white mb-0.5" style={{textShadow: `0 0 15px ${activeGameConfig.color}60`}}>{value}</div>
                              <div className="text-xs font-black tracking-widest" style={{color: activeGameConfig.color, fontSize: '9px', fontFamily: "'Orbitron', sans-serif"}}>{statInfo.label}</div>
                              <div className="w-full h-0.5 mt-2 rounded" style={{background: `linear-gradient(90deg, transparent, ${activeGameConfig.color}60, transparent)`}} />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600 font-black text-xs tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>NO STATS ADDED YET</p>
                        {isOwner && <button onClick={() => router.push('/profile')} className="mt-3 text-xs font-black px-4 py-2 rounded-lg transition" style={{background: activeGameConfig.bg, color: activeGameConfig.color, border: `1px solid ${activeGameConfig.border}`}}>+ ADD STATS</button>}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl p-10 text-center" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.1)'}}>
                <div className="text-5xl mb-4">🎮</div>
                <p className="font-black text-gray-600 tracking-widest text-sm" style={{fontFamily: "'Orbitron', sans-serif"}}>NO GAMES ADDED</p>
                {isOwner && <button onClick={() => router.push('/profile')} className="mt-4 text-xs font-black px-5 py-2.5 rounded-xl transition" style={{background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)'}}>+ SETUP PROFILE</button>}
              </div>
            )}

            {/* Gameplay Clips */}
            {profile?.gameplay_clips?.length > 0 && (
              <div className="rounded-2xl p-5" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-4" style={{fontFamily: "'Orbitron', sans-serif"}}>// GAMEPLAY CLIPS</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.gameplay_clips.map((clip, i) => (
                    <div key={i} className="rounded-xl overflow-hidden" style={{border: '1px solid rgba(239,68,68,0.15)'}}>
                      {clip.youtube_url && <div className="aspect-video"><iframe src={clip.youtube_url.replace('watch?v=', 'embed/')} className="w-full h-full" allowFullScreen /></div>}
                      <div className="p-3 bg-black/50">
                        <p className="font-black text-sm text-white">{clip.title}</p>
                        {clip.game && <span className="text-xs font-bold" style={{color: GAME_CONFIG[clip.game]?.color || '#ef4444'}}>{clip.game}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-12" />
      </div>
    </div>
  );
}
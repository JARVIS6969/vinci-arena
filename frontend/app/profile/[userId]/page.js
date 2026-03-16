'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import GameStatsDisplay from '../../components/GameStatsDisplay';

const GAME_CONFIG = {
  'Free Fire': { icon: '🔥', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
  'BGMI':      { icon: '🎯', color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)' },
  'Valorant':  { icon: '⚡', color: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.25)' },
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
  const [ffUid, setFfUid] = useState('');
  const [ffStats, setFfStats] = useState(null);
  const [ffLoading, setFfLoading] = useState(false);
  const [ffError, setFfError] = useState('');
  const [ffMode, setFfMode] = useState('br');
  const [ffInputMode, setFfInputMode] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);

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

  const fetchFFStats = async () => {
    if (!ffUid.trim()) return;
    setFfLoading(true); setFfError('');
    try {
      const res = await fetch(`http://localhost:3001/api/freefire/stats/${ffUid.trim()}`);
      const data = await res.json();
      if (data.error) { setFfError('Player not found!'); setFfStats(null); }
      else setFfStats(data);
    } catch { setFfError('Failed to fetch stats'); }
    finally { setFfLoading(false); }
  };

  const handleFFOcr = async (file) => {
    setOcrLoading(true); setFfError('');
    try {
      const Tesseract = (await import('tesseract.js')).default;
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      const uidMatch = text.match(/\b[0-9]{8,12}\b/);
      if (uidMatch) {
        setFfUid(uidMatch[0]);
        setFfInputMode('uid');
        const res = await fetch(`http://localhost:3001/api/freefire/stats/${uidMatch[0]}`);
        const data = await res.json();
        if (data.error) setFfError('UID found but player not found!');
        else setFfStats(data);
      } else {
        setFfError('UID not found in screenshot. Try manual UID entry.');
      }
    } catch { setFfError('OCR failed. Try manual UID entry.'); }
    finally { setOcrLoading(false); }
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

  const StatCard = ({ label, value, icon }) => (
    <div className="rounded-lg p-2 text-center" style={{background: '#080808', border: '1px solid rgba(239,68,68,0.08)'}}>
      <div className="text-base mb-0.5">{icon}</div>
      <div className="font-black text-white" style={{fontFamily: "'Orbitron', sans-serif", fontSize: '13px'}}>{value}</div>
      <div className="font-black tracking-widest" style={{color: '#ef4444', fontSize: '7px', fontFamily: "'Orbitron', sans-serif"}}>{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif", paddingTop: '44px'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
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
          <button onClick={() => router.push('/profile/edit')} className="absolute top-4 right-4 text-xs font-black px-3 py-1.5 rounded-lg backdrop-blur-sm transition" style={{background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444'}}>✏ EDIT</button>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* PROFILE HEADER */}
        <div className="relative -mt-20 mb-8 flex items-end gap-5">
          <div className="w-32 h-32 rounded-2xl border-4 border-black overflow-hidden flex-shrink-0" style={{boxShadow: '0 0 40px rgba(239,68,68,0.4)'}}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-700 to-purple-700 flex items-center justify-center font-black text-5xl">
                {profile?.display_name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="font-black text-3xl tracking-wide" style={{fontFamily: "'Orbitron', sans-serif", textShadow: '0 0 30px rgba(239,68,68,0.4)'}}>
                {profile?.display_name || 'UNKNOWN'}
              </h1>
              {profile?.country && <span className="text-gray-500 text-sm font-bold">🌏 {profile.country}</span>}
            </div>
            {profile?.tagline && <p className="text-gray-400 font-bold text-sm mb-2 italic">"{profile.tagline}"</p>}
            <div className="flex items-center gap-2 flex-wrap">
              {games.map(g => {
                const gc = GAME_CONFIG[g.game];
                return (
                  <span key={g.game} className="text-xs font-black px-2.5 py-1 rounded-full" style={{background: gc?.bg, border: `1px solid ${gc?.border}`, color: gc?.color, fontFamily: "'Orbitron', sans-serif"}}>
                    {gc?.icon} {g.game}
                  </span>
                );
              })}
              {profile?.looking_for && (
                <span className="text-xs font-black px-2.5 py-1 rounded-full" style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: LOOKING_FOR_COLOR[profile.looking_for] || '#6b7280'}}>
                  🔍 LF {profile.looking_for?.toUpperCase()}
                </span>
              )}
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
            {profile?.bio && (
              <div className="rounded-2xl p-5" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// BIO</p>
                <p className="text-gray-400 text-sm leading-relaxed font-semibold">{profile.bio}</p>
              </div>
            )}
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

          {/* RIGHT COLUMN */}
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
                      {isOwner && (
                        <div className="flex gap-2">
                          <button onClick={() => router.push('/profile/edit')}
                            className="text-xs font-black px-3 py-1.5 rounded-lg transition"
                            style={{background: activeGameConfig.bg, color: activeGameConfig.color, border: `1px solid ${activeGameConfig.border}`, fontFamily: "'Orbitron', sans-serif"}}>
                            ✏ EDIT
                          </button>
                          <button onClick={() => router.push(`/profile/edit?step=3&game=${activeGame}`)}
                            className="text-xs font-black px-3 py-1.5 rounded-lg transition"
                            style={{background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', fontFamily: "'Orbitron', sans-serif"}}>
                            📊 STATS
                          </button>
                        </div>
                      )}
                    </div>

                    {Object.keys(activeStats).length > 0 ? (
                      <GameStatsDisplay stats={activeStats} accentColor={activeGameConfig.color} gameName={activeGame} />
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600 font-black text-xs tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>NO STATS ADDED YET</p>
                        {isOwner && <button onClick={() => router.push('/profile/edit?step=3')} className="mt-3 text-xs font-black px-4 py-2 rounded-lg transition" style={{background: activeGameConfig.bg, color: activeGameConfig.color, border: `1px solid ${activeGameConfig.border}`}}>+ ADD STATS</button>}
                      </div>
                    )}
                  </div>
                )}

                {/* FREE FIRE LIVE STATS */}
                {activeGame === 'Free Fire' && (
                  <div className="rounded-2xl p-5" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.2)'}}>
                    <p className="text-xs font-black tracking-widest mb-4 flex items-center gap-2" style={{fontFamily: "'Orbitron', sans-serif", color: '#ef4444', fontSize: '9px'}}>
                      <span className="w-4 h-0.5 rounded bg-red-500" />
                      🔴 LIVE FF STATS
                      <span className="flex-1 h-0.5 rounded" style={{background: 'linear-gradient(90deg, rgba(239,68,68,0.4), transparent)'}} />
                    </p>

                    {/* METHOD SELECTOR */}
                    {!ffInputMode && !ffStats && (
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setFfInputMode('uid')}
                          className="rounded-xl p-5 text-center transition-all duration-300 hover:scale-105"
                          style={{background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)'}}>
                          <div className="text-3xl mb-2">🔢</div>
                          <p className="font-black text-white mb-1" style={{fontFamily: "'Orbitron', sans-serif", fontSize: '11px'}}>ENTER UID</p>
                          <p className="text-gray-600 font-bold" style={{fontSize: '10px'}}>Type your FF UID manually</p>
                          <div className="mt-3 py-1.5 rounded-lg font-black" style={{background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontFamily: "'Orbitron', sans-serif", fontSize: '9px'}}>
                            QUICK → AUTO FETCH
                          </div>
                        </button>
                        <button onClick={() => setFfInputMode('ocr')}
                          className="rounded-xl p-5 text-center transition-all duration-300 hover:scale-105"
                          style={{background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)'}}>
                          <div className="text-3xl mb-2">📸</div>
                          <p className="font-black text-white mb-1" style={{fontFamily: "'Orbitron', sans-serif", fontSize: '11px'}}>SCREENSHOT</p>
                          <p className="text-gray-600 font-bold" style={{fontSize: '10px'}}>Upload FF profile screenshot</p>
                          <div className="mt-3 py-1.5 rounded-lg font-black" style={{background: 'rgba(99,102,241,0.15)', color: '#6366f1', fontFamily: "'Orbitron', sans-serif", fontSize: '9px'}}>
                            OCR → AUTO EXTRACT
                          </div>
                        </button>
                      </div>
                    )}

                    {/* UID INPUT */}
                    {ffInputMode === 'uid' && !ffStats && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <button onClick={() => { setFfInputMode(null); setFfError(''); }} className="text-gray-600 hover:text-red-400 font-black text-xs transition">← BACK</button>
                          <p className="text-xs font-black tracking-widest" style={{color: '#ef4444', fontFamily: "'Orbitron', sans-serif", fontSize: '9px'}}>ENTER YOUR UID</p>
                        </div>
                        <div className="flex gap-2">
                          <input value={ffUid} onChange={e => setFfUid(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && fetchFFStats()}
                            placeholder="e.g. 959963162"
                            className="flex-1 rounded-xl px-4 py-3 font-bold text-white outline-none text-sm"
                            style={{background: '#0a0a0a', border: '1px solid rgba(239,68,68,0.25)', fontFamily: "'Rajdhani', sans-serif"}} />
                          <button onClick={fetchFFStats} disabled={ffLoading}
                            className="px-5 py-3 rounded-xl font-black text-xs tracking-widest text-white transition"
                            style={{background: 'linear-gradient(135deg, #ef4444, #DC143C)', boxShadow: '0 0 15px rgba(239,68,68,0.4)', fontFamily: "'Orbitron', sans-serif", minWidth: '100px'}}>
                            {ffLoading ? '⟳ ...' : '🔍 FETCH'}
                          </button>
                        </div>
                        {ffError && <p className="text-red-500 text-xs font-black mt-2">{ffError}</p>}
                      </div>
                    )}

                    {/* OCR INPUT */}
                    {ffInputMode === 'ocr' && !ffStats && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <button onClick={() => { setFfInputMode(null); setFfError(''); }} className="text-gray-600 hover:text-red-400 font-black text-xs transition">← BACK</button>
                          <p className="text-xs font-black tracking-widest" style={{color: '#6366f1', fontFamily: "'Orbitron', sans-serif", fontSize: '9px'}}>UPLOAD FF SCREENSHOT</p>
                        </div>
                        <label className="flex flex-col items-center justify-center rounded-xl p-8 cursor-pointer transition"
                          style={{background: '#0a0a0a', border: '2px dashed rgba(99,102,241,0.3)'}}>
                          <input type="file" accept="image/*" className="hidden"
                            onChange={e => e.target.files[0] && handleFFOcr(e.target.files[0])} />
                          {ocrLoading ? (
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                              <p className="text-indigo-400 font-black text-xs tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>SCANNING...</p>
                            </div>
                          ) : (
                            <>
                              <div className="text-4xl mb-3">📲</div>
                              <p className="font-black text-white mb-1" style={{fontFamily: "'Orbitron', sans-serif", fontSize: '11px'}}>TAP TO UPLOAD</p>
                              <p className="text-gray-600 font-bold text-center" style={{fontSize: '10px'}}>Upload your Free Fire profile<br/>screenshot — UID auto detected</p>
                            </>
                          )}
                        </label>
                        {ffError && <p className="text-red-500 text-xs font-black mt-2">{ffError}</p>}
                      </div>
                    )}

                    {/* STATS DISPLAY */}
                    {ffStats && (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex gap-2">
                            {['br', 'cs'].map(mode => (
                              <button key={mode} onClick={() => setFfMode(mode)}
                                className="px-4 py-1.5 rounded-lg font-black text-xs tracking-widest transition"
                                style={{
                                  background: ffMode === mode ? 'rgba(239,68,68,0.2)' : '#0a0a0a',
                                  border: `1px solid ${ffMode === mode ? '#ef4444' : 'rgba(255,255,255,0.05)'}`,
                                  color: ffMode === mode ? '#ef4444' : '#6b7280',
                                  fontFamily: "'Orbitron', sans-serif"
                                }}>
                                {mode === 'br' ? '🔥 BR' : '⚔️ CS'}
                              </button>
                            ))}
                          </div>
                          <button onClick={() => { setFfStats(null); setFfInputMode(null); setFfUid(''); setFfError(''); }}
                            className="text-xs font-black text-gray-600 hover:text-red-400 transition px-3 py-1.5 rounded-lg"
                            style={{background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)'}}>
                            ↺ RESET
                          </button>
                        </div>

                        {ffMode === 'br' && ffStats.br && (
                          <div className="space-y-3">
                            {['solostats', 'duostats', 'quadstats'].map(mode => {
                              const s = ffStats.br[mode];
                              if (!s?.gamesplayed) return null;
                              const d = s.detailedstats || {};
                              const kd = s.kills && s.gamesplayed ? (s.kills / s.gamesplayed).toFixed(2) : '0';
                              const wr = s.wins && s.gamesplayed ? ((s.wins / s.gamesplayed) * 100).toFixed(1) : '0';
                              const hs = d.headshotkills && s.kills ? ((d.headshotkills / s.kills) * 100).toFixed(1) : '0';
                              return (
                                <div key={mode} className="rounded-xl p-4" style={{background: '#0a0a0a', border: '1px solid rgba(239,68,68,0.1)'}}>
                                  <p className="text-xs font-black tracking-widest mb-3" style={{color: '#ef4444', fontFamily: "'Orbitron', sans-serif", fontSize: '9px'}}>
                                    {mode === 'solostats' ? '👤 SOLO' : mode === 'duostats' ? '👥 DUO' : '👥👥 SQUAD'}
                                  </p>
                                  <div className="grid grid-cols-3 gap-2">
                                    {[
                                      { label: 'MATCHES', value: s.gamesplayed, icon: '🎮' },
                                      { label: 'KILLS', value: s.kills, icon: '💀' },
                                      { label: 'WINS', value: s.wins, icon: '🏆' },
                                      { label: 'K/D', value: kd, icon: '⚔️' },
                                      { label: 'WIN%', value: `${wr}%`, icon: '🥇' },
                                      { label: 'HS%', value: `${hs}%`, icon: '🎯' },
                                      d.damage ? { label: 'DAMAGE', value: d.damage?.toLocaleString(), icon: '💥' } : null,
                                      d.highestkills ? { label: 'BEST KILL', value: d.highestkills, icon: '⭐' } : null,
                                      d.knockdown ? { label: 'KNOCKDOWNS', value: d.knockdown, icon: '👊' } : null,
                                    ].filter(Boolean).map((stat, i) => (
                                      <StatCard key={i} {...stat} />
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {ffMode === 'cs' && ffStats.cs?.csstats && (() => {
                          const s = ffStats.cs.csstats;
                          const d = s.detailedstats || {};
                          const kd = s.kills && d.deaths ? (s.kills / d.deaths).toFixed(2) : '0';
                          const wr = s.wins && s.gamesplayed ? ((s.wins / s.gamesplayed) * 100).toFixed(1) : '0';
                          const hs = d.headshotkills && s.kills ? ((d.headshotkills / s.kills) * 100).toFixed(1) : '0';
                          return (
                            <div className="rounded-xl p-4" style={{background: '#0a0a0a', border: '1px solid rgba(239,68,68,0.1)'}}>
                              <p className="text-xs font-black tracking-widest mb-3" style={{color: '#ef4444', fontFamily: "'Orbitron', sans-serif", fontSize: '9px'}}>⚔️ CLASH SQUAD RANKED</p>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { label: 'MATCHES', value: s.gamesplayed, icon: '🎮' },
                                  { label: 'KILLS', value: s.kills, icon: '💀' },
                                  { label: 'WINS', value: s.wins, icon: '🏆' },
                                  { label: 'K/D', value: kd, icon: '⚔️' },
                                  { label: 'WIN%', value: `${wr}%`, icon: '🥇' },
                                  { label: 'HS%', value: `${hs}%`, icon: '🎯' },
                                  { label: 'MVP', value: d.mvpcount, icon: '⭐' },
                                  { label: 'DAMAGE', value: d.damage?.toLocaleString(), icon: '💥' },
                                  { label: 'BEST DMG', value: d.onegamemostdamage?.toLocaleString(), icon: '🔥' },
                                  { label: 'ASSISTS', value: d.assists, icon: '🤝' },
                                  { label: 'RATING', value: d.ratingpoints?.toFixed(0), icon: '📊' },
                                  { label: 'STREAK', value: d.streakwins, icon: '🔥' },
                                ].filter(v => v.value).map((stat, i) => (
                                  <StatCard key={i} {...stat} />
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl p-10 text-center" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.1)'}}>
                <div className="text-5xl mb-4">🎮</div>
                <p className="font-black text-gray-600 tracking-widest text-sm" style={{fontFamily: "'Orbitron', sans-serif"}}>NO GAMES ADDED</p>
                {isOwner && <button onClick={() => router.push('/profile/edit')} className="mt-4 text-xs font-black px-5 py-2.5 rounded-xl transition" style={{background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)'}}>+ SETUP PROFILE</button>}
              </div>
            )}

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
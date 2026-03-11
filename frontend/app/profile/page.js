'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const GAMES = [
  { id: 'Free Fire', icon: '🔥', color: '#ef4444', roles: ['IGL', 'Rusher', 'Sniper', 'Support', 'All-rounder'], ranks: ['Heroic', 'Grandmaster', 'Master', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'] },
  { id: 'BGMI', icon: '🎯', color: '#f97316', roles: ['IGL', 'Fragger', 'Sniper', 'Support', 'Scout'], ranks: ['Conqueror', 'Ace Master', 'Ace', 'Crown', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'] },
  { id: 'Valorant', icon: '⚡', color: '#6366f1', roles: ['Duelist', 'Controller', 'Initiator', 'Sentinel', 'IGL'], ranks: ['Radiant', 'Immortal', 'Ascendant', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze', 'Iron'] },
];

const COUNTRIES = ['India', 'Pakistan', 'Bangladesh', 'Nepal', 'Sri Lanka', 'Other'];
const LOOKING_FOR = ['Team', 'Players', 'Scrims', 'Tournament', 'Just Showcasing'];

export default function EditProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1=basic, 2=games, 3=stats
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedGames, setSelectedGames] = useState([]);
  const [activeStatGame, setActiveStatGame] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const fileRef = useRef(null);

  const [basicForm, setBasicForm] = useState({
    display_name: '', bio: '', tagline: '', avatar_url: '',
    country: 'India', looking_for: 'Team',
    youtube_url: '', instagram_url: '', discord_tag: '', twitter_url: '',
  });

  const [gameData, setGameData] = useState({});
  const [statsData, setStatsData] = useState({});

  useEffect(() => { fetchExisting(); }, []);

  const fetchExisting = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token) { router.push('/login'); return; }

      const [profileRes, gamesRes] = await Promise.all([
        fetch('http://localhost:3001/api/profiles/me', { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:3001/api/profiles/${userId}/games`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (profileRes.ok) {
        const p = await profileRes.json();
        if (p) setBasicForm({
          display_name: p.display_name || '', bio: p.bio || '',
          tagline: p.tagline || '', avatar_url: p.avatar_url || '',
          country: p.country || 'India', looking_for: p.looking_for || 'Team',
          youtube_url: p.youtube_url || '', instagram_url: p.instagram_url || '',
          discord_tag: p.discord_tag || '', twitter_url: p.twitter_url || '',
        });
      }

      if (gamesRes.ok) {
        const games = await gamesRes.json();
        setSelectedGames(games.map(g => g.game));
        const gd = {};
        games.forEach(g => { gd[g.game] = { role: g.role || '', rank: g.rank || '' }; });
        setGameData(gd);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleGame = (gameId) => {
    setSelectedGames(prev =>
      prev.includes(gameId) ? prev.filter(g => g !== gameId) : [...prev, gameId]
    );
    if (!gameData[gameId]) setGameData(prev => ({ ...prev, [gameId]: { role: '', rank: '' } }));
  };

  const handleOCR = async (file, game) => {
    setOcrLoading(true);
    setOcrResult(null);
    try {
      const Tesseract = (await import('tesseract.js')).default;
      const { data: { text } } = await Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m)
      });

      // Parse stats from OCR text
      const parsed = parseStats(text, game);
      setOcrResult({ game, parsed, rawText: text });
      setStatsData(prev => ({ ...prev, [game]: { ...prev[game], ...parsed } }));
    } catch (err) {
      console.error('OCR error:', err);
      alert('OCR failed. Please enter stats manually.');
    } finally { setOcrLoading(false); }
  };

  const parseStats = (text, game) => {
    const result = {};
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const fullText = text.toLowerCase();

    // Universal patterns
    const patterns = [
      { key: 'kd_ratio', regex: /k\/d[\s:]*([0-9.]+)/i },
      { key: 'kd_ratio', regex: /ratio[\s:]*([0-9.]+)/i },
      { key: 'win_rate', regex: /win\s*rate[\s:]*([0-9.]+)/i },
      { key: 'win_rate', regex: /win%[\s:]*([0-9.]+)/i },
      { key: 'total_matches', regex: /matches[\s:]*([0-9,]+)/i },
      { key: 'total_matches', regex: /games[\s:]*([0-9,]+)/i },
      { key: 'total_kills', regex: /kills[\s:]*([0-9,]+)/i },
      { key: 'headshot', regex: /headshot[\s%:]*([0-9.]+)/i },
      { key: 'headshot', regex: /hs[\s%:]*([0-9.]+)/i },
      { key: 'wins', regex: /wins[\s:]*([0-9,]+)/i },
      { key: 'wins', regex: /booyah[\s:]*([0-9,]+)/i },
      { key: 'damage', regex: /damage[\s:]*([0-9,]+)/i },
      { key: 'avg_damage', regex: /avg[\s.]*damage[\s:]*([0-9.]+)/i },
      { key: 'survival_time', regex: /survival[\s:]*([0-9:]+)/i },
      { key: 'rank', regex: /rank[\s:]*([a-z\s]+)/i },
    ];

    patterns.forEach(({ key, regex }) => {
      if (!result[key]) {
        const match = text.match(regex);
        if (match) result[key] = match[1].trim();
      }
    });

    // Game specific
    if (game === 'Valorant') {
      const csMatch = text.match(/combat\s*score[\s:]*([0-9.]+)/i);
      if (csMatch) result.combat_score = csMatch[1];
      const acsMatch = text.match(/acs[\s:]*([0-9.]+)/i);
      if (acsMatch) result.avg_combat_score = acsMatch[1];
    }

    return result;
  };

  const saveBasic = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(basicForm),
      });
      setStep(2);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const saveGames = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await Promise.all(selectedGames.map(game =>
        fetch('http://localhost:3001/api/profiles/games', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ game, ...gameData[game] }),
        })
      ));
      setStep(3);
      setActiveStatGame(selectedGames[0]);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const saveStats = async (game) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/api/profiles/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ game, stats: statsData[game] || {} }),
      });
      alert(`${game} stats saved!`);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const STAT_LABELS = {
    kd_ratio: 'K/D Ratio', win_rate: 'Win Rate %', total_matches: 'Total Matches',
    total_kills: 'Total Kills', headshot: 'Headshot %', wins: 'Total Wins',
    damage: 'Total Damage', avg_damage: 'Avg Damage', survival_time: 'Survival Time',
    rank: 'Current Rank', combat_score: 'Combat Score', avg_combat_score: 'Avg Combat Score',
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center" style={{paddingTop: '44px'}}>
      <div className="text-red-500 font-black text-sm animate-pulse" style={{fontFamily: "'Orbitron', sans-serif"}}>LOADING...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif", paddingTop: '44px'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .neon-input { background: #0a0a0a; border: 1px solid rgba(239,68,68,0.25); border-radius: 8px; color: white; font-family: 'Rajdhani'; font-weight: 600; font-size: 14px; padding: 10px 14px; width: 100%; outline: none; transition: all 0.2s; }
        .neon-input:focus { border-color: rgba(239,68,68,0.6); box-shadow: 0 0 12px rgba(239,68,68,0.15); }
        .neon-input::placeholder { color: #2a2a2a; }
        .neon-select { background: #0a0a0a; border: 1px solid rgba(239,68,68,0.25); border-radius: 8px; color: white; font-family: 'Rajdhani'; font-weight: 700; font-size: 14px; padding: 10px 14px; width: 100%; outline: none; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #ef4444; }
      `}</style>

      <div className="grid-bg min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-8">

          {/* HEADER */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background: 'linear-gradient(135deg, #ef4444, #DC143C)', boxShadow: '0 0 20px rgba(239,68,68,0.4)'}}>👤</div>
              <div>
                <h1 className="font-black text-xl text-white" style={{fontFamily: "'Orbitron', sans-serif"}}>EDIT PROFILE</h1>
                <p className="text-xs text-gray-600 font-bold">BUILD YOUR ESPORTS IDENTITY</p>
              </div>
            </div>
          </div>

          {/* STEPS */}
          <div className="flex items-center gap-2 mb-8">
            {[{n:1,label:'BASIC INFO'},{n:2,label:'GAMES'},{n:3,label:'STATS'}].map((s,i) => (
              <div key={s.n} className="flex items-center gap-2">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => step > s.n && setStep(s.n)}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all"
                    style={{
                      background: step === s.n ? 'linear-gradient(135deg, #ef4444, #DC143C)' : step > s.n ? '#10b981' : '#0a0a0a',
                      border: `1px solid ${step >= s.n ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                      boxShadow: step === s.n ? '0 0 15px rgba(239,68,68,0.5)' : 'none',
                      fontFamily: "'Orbitron', sans-serif"
                    }}>
                    {step > s.n ? '✓' : s.n}
                  </div>
                  <span className="text-xs font-black tracking-widest hidden sm:block" style={{color: step >= s.n ? '#ef4444' : '#374151', fontFamily: "'Orbitron', sans-serif"}}>{s.label}</span>
                </div>
                {i < 2 && <div className="w-12 h-0.5 rounded" style={{background: step > s.n ? '#ef4444' : 'rgba(255,255,255,0.05)'}} />}
              </div>
            ))}
          </div>

          {/* STEP 1 — BASIC INFO */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="rounded-2xl p-6" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-4" style={{fontFamily: "'Orbitron', sans-serif"}}>// IDENTITY</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">DISPLAY NAME *</label>
                    <input className="neon-input" placeholder="e.g. JARVIS FF" value={basicForm.display_name} onChange={e => setBasicForm(p => ({...p, display_name: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">TAGLINE</label>
                    <input className="neon-input" placeholder="e.g. Born to Frag 🔥" value={basicForm.tagline} onChange={e => setBasicForm(p => ({...p, tagline: e.target.value}))} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">BIO</label>
                    <textarea className="neon-input" rows={3} placeholder="Tell your story... your playstyle, achievements, goals" value={basicForm.bio} onChange={e => setBasicForm(p => ({...p, bio: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">COUNTRY</label>
                    <select className="neon-select" value={basicForm.country} onChange={e => setBasicForm(p => ({...p, country: e.target.value}))}>
                      {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">LOOKING FOR</label>
                    <select className="neon-select" value={basicForm.looking_for} onChange={e => setBasicForm(p => ({...p, looking_for: e.target.value}))}>
                      {LOOKING_FOR.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">AVATAR URL</label>
                    <input className="neon-input" placeholder="https://..." value={basicForm.avatar_url} onChange={e => setBasicForm(p => ({...p, avatar_url: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">BANNER URL</label>
                    <input className="neon-input" placeholder="https://..." value={basicForm.avatar_url} onChange={e => setBasicForm(p => ({...p, banner_url: e.target.value}))} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-4" style={{fontFamily: "'Orbitron', sans-serif"}}>// SOCIAL LINKS</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {key: 'youtube_url', icon: '▶', label: 'YOUTUBE URL', placeholder: 'youtube.com/@yourchannel'},
                    {key: 'instagram_url', icon: '📷', label: 'INSTAGRAM URL', placeholder: 'instagram.com/yourprofile'},
                    {key: 'discord_tag', icon: '💬', label: 'DISCORD TAG', placeholder: 'username#0000'},
                    {key: 'twitter_url', icon: '🐦', label: 'TWITTER/X URL', placeholder: 'twitter.com/yourhandle'},
                  ].map(s => (
                    <div key={s.key}>
                      <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">{s.icon} {s.label}</label>
                      <input className="neon-input" placeholder={s.placeholder} value={basicForm[s.key]} onChange={e => setBasicForm(p => ({...p, [s.key]: e.target.value}))} />
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={saveBasic} disabled={saving || !basicForm.display_name.trim()}
                className="w-full py-3 rounded-xl font-black text-sm tracking-widest text-white transition"
                style={basicForm.display_name.trim() ? {background: 'linear-gradient(135deg, #ef4444, #DC143C)', boxShadow: '0 0 20px rgba(239,68,68,0.4)'} : {background: '#111', color: '#333', cursor: 'not-allowed'}}>
                {saving ? '⟳ SAVING...' : 'NEXT → SELECT GAMES'}
              </button>
            </div>
          )}

          {/* STEP 2 — GAMES */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="rounded-2xl p-6" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-2" style={{fontFamily: "'Orbitron', sans-serif"}}>// SELECT YOUR GAMES</p>
                <p className="text-xs text-gray-600 font-bold mb-5">Jitne games khelte ho sab select karo</p>
                <div className="grid grid-cols-3 gap-4">
                  {GAMES.map(g => (
                    <div key={g.id} onClick={() => toggleGame(g.id)}
                      className="p-4 rounded-xl cursor-pointer text-center transition-all duration-300 hover:scale-105"
                      style={{
                        background: selectedGames.includes(g.id) ? g.color+'15' : '#0a0a0a',
                        border: `2px solid ${selectedGames.includes(g.id) ? g.color : 'rgba(255,255,255,0.05)'}`,
                        boxShadow: selectedGames.includes(g.id) ? `0 0 20px ${g.color}30` : 'none'
                      }}>
                      <div className="text-3xl mb-2" style={{filter: selectedGames.includes(g.id) ? `drop-shadow(0 0 8px ${g.color})` : 'none'}}>{g.icon}</div>
                      <p className="font-black text-xs text-white" style={{fontFamily: "'Orbitron', sans-serif"}}>{g.id}</p>
                      {selectedGames.includes(g.id) && <p className="text-xs mt-1 font-black" style={{color: g.color}}>✓ SELECTED</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Game details for each selected game */}
              {selectedGames.map(gameId => {
                const g = GAMES.find(x => x.id === gameId);
                return (
                  <div key={gameId} className="rounded-2xl p-6" style={{background: '#050505', border: `1px solid ${g.color}25`}}>
                    <p className="text-xs font-black tracking-widest mb-4" style={{fontFamily: "'Orbitron', sans-serif", color: g.color}}>// {gameId.toUpperCase()} DETAILS</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">ROLE</label>
                        <select className="neon-select" value={gameData[gameId]?.role || ''} onChange={e => setGameData(p => ({...p, [gameId]: {...p[gameId], role: e.target.value}}))}>
                          <option value="">Select Role</option>
                          {g.roles.map(r => <option key={r}>{r}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">HIGHEST RANK</label>
                        <select className="neon-select" value={gameData[gameId]?.rank || ''} onChange={e => setGameData(p => ({...p, [gameId]: {...p[gameId], rank: e.target.value}}))}>
                          <option value="">Select Rank</option>
                          {g.ranks.map(r => <option key={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl font-black text-xs tracking-widest text-red-400 transition" style={{background: '#0a0a0a', border: '1px solid rgba(239,68,68,0.2)'}}>← BACK</button>
                <button onClick={saveGames} disabled={saving || selectedGames.length === 0}
                  className="flex-1 py-3 rounded-xl font-black text-sm tracking-widest text-white transition"
                  style={selectedGames.length > 0 ? {background: 'linear-gradient(135deg, #ef4444, #DC143C)', boxShadow: '0 0 20px rgba(239,68,68,0.4)'} : {background: '#111', color: '#333', cursor: 'not-allowed'}}>
                  {saving ? '⟳ SAVING...' : `NEXT → ADD STATS (${selectedGames.length} games)`}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — STATS */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Game tabs */}
              <div className="flex gap-2 flex-wrap">
                {selectedGames.map(gameId => {
                  const g = GAMES.find(x => x.id === gameId);
                  return (
                    <button key={gameId} onClick={() => setActiveStatGame(gameId)}
                      className="px-4 py-2 rounded-xl font-black text-xs tracking-widest transition"
                      style={{
                        background: activeStatGame === gameId ? g.color+'20' : '#0a0a0a',
                        border: `1px solid ${activeStatGame === gameId ? g.color : 'rgba(255,255,255,0.05)'}`,
                        color: activeStatGame === gameId ? g.color : '#6b7280',
                        boxShadow: activeStatGame === gameId ? `0 0 15px ${g.color}30` : 'none',
                        fontFamily: "'Orbitron', sans-serif"
                      }}>
                      {g.icon} {gameId}
                    </button>
                  );
                })}
              </div>

              {activeStatGame && (() => {
                const g = GAMES.find(x => x.id === activeStatGame);
                return (
                  <div className="rounded-2xl p-6" style={{background: '#050505', border: `1px solid ${g.color}25`}}>
                    <p className="text-xs font-black tracking-widest mb-4" style={{fontFamily: "'Orbitron', sans-serif", color: g.color}}>// {activeStatGame.toUpperCase()} STATS</p>

                    {/* OCR Upload */}
                    <div className="rounded-xl p-4 mb-5" style={{background: '#0a0a0a', border: `1px dashed ${g.color}40`}}>
                      <p className="text-xs font-black text-gray-500 mb-3 tracking-widest">📸 UPLOAD SCREENSHOT → AUTO EXTRACT STATS</p>
                      <div className="flex items-center gap-3">
                        <input ref={fileRef} type="file" accept="image/*" className="hidden"
                          onChange={async e => {
                            if (e.target.files[0]) await handleOCR(e.target.files[0], activeStatGame);
                          }} />
                        <button onClick={() => fileRef.current?.click()} disabled={ocrLoading}
                          className="px-4 py-2 rounded-lg font-black text-xs tracking-widest transition"
                          style={{background: g.color+'20', border: `1px solid ${g.color}40`, color: g.color, fontFamily: "'Orbitron', sans-serif"}}>
                          {ocrLoading ? '⟳ SCANNING...' : '📷 UPLOAD SS'}
                        </button>
                        {ocrResult?.game === activeStatGame && (
                          <span className="text-xs text-green-400 font-black">✓ {Object.keys(ocrResult.parsed).length} STATS EXTRACTED!</span>
                        )}
                      </div>
                    </div>

                    {/* Stats grid — manual entry */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(STAT_LABELS).map(([key, label]) => (
                        <div key={key} className="rounded-lg p-3" style={{background: '#080808', border: `1px solid ${g.color}15`}}>
                          <label className="text-xs font-black tracking-widest mb-1.5 block" style={{color: g.color, fontSize: '9px'}}>{label}</label>
                          <input className="neon-input" style={{padding: '6px 10px', fontSize: '13px'}}
                            placeholder="—"
                            value={statsData[activeStatGame]?.[key] || ''}
                            onChange={e => setStatsData(prev => ({...prev, [activeStatGame]: {...prev[activeStatGame], [key]: e.target.value}}))} />
                        </div>
                      ))}
                    </div>

                    <button onClick={() => saveStats(activeStatGame)} disabled={saving}
                      className="w-full mt-4 py-3 rounded-xl font-black text-xs tracking-widest text-white transition"
                      style={{background: `linear-gradient(135deg, ${g.color}, ${g.color}aa)`, boxShadow: `0 0 20px ${g.color}30`, fontFamily: "'Orbitron', sans-serif"}}>
                      {saving ? '⟳ SAVING...' : `💾 SAVE ${activeStatGame.toUpperCase()} STATS`}
                    </button>
                  </div>
                );
              })()}

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl font-black text-xs tracking-widest text-red-400 transition" style={{background: '#0a0a0a', border: '1px solid rgba(239,68,68,0.2)'}}>← BACK</button>
                <button onClick={() => router.push(`/profile/${localStorage.getItem('userId')}`)}
                  className="flex-1 py-3 rounded-xl font-black text-sm tracking-widest text-white transition"
                  style={{background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 20px rgba(16,185,129,0.3)'}}>
                  ✓ VIEW MY PROFILE →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
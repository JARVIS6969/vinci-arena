'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const GAMES = [
  { id: 'Free Fire', icon: '🔥', color: '#ef4444', roles: ['IGL', 'Rusher', 'Sniper', 'Support', 'All-rounder'], ranks: ['Heroic', 'Grandmaster', 'Master', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'] },
  { id: 'BGMI', icon: '🎯', color: '#f97316', roles: ['IGL', 'Fragger', 'Sniper', 'Support', 'Scout'], ranks: ['Conqueror', 'Ace Master', 'Ace', 'Crown', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'] },
  { id: 'Valorant', icon: '⚡', color: '#6366f1', roles: ['Duelist', 'Controller', 'Initiator', 'Sentinel', 'IGL'], ranks: ['Radiant', 'Immortal', 'Ascendant', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze', 'Iron'] },
];

const STAT_LABELS = {
  kd_ratio: 'K/D Ratio', win_rate: 'Win Rate %', total_matches: 'Total Matches',
  total_kills: 'Total Kills', headshot: 'Headshot %', wins: 'Total Wins',
  damage: 'Total Damage', avg_damage: 'Avg Damage', rank: 'Current Rank',
  combat_score: 'Combat Score',
};

const COUNTRIES = ['India', 'Pakistan', 'Bangladesh', 'Nepal', 'Sri Lanka', 'Other'];
const LOOKING_FOR = ['Team', 'Players', 'Scrims', 'Tournament', 'Just Showcasing'];

export default function EditProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStep = searchParams.get('step') ? parseInt(searchParams.get('step')) : 1;
  const initialGame = searchParams.get('game') || null;

  const [activeTab, setActiveTab] = useState(initialStep === 3 ? 'stats' : 'profile');
  const [saving, setSaving] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [statsInputMode, setStatsInputMode] = useState({});
  const [uidInputs, setUidInputs] = useState({});
  const [activeStatGame, setActiveStatGame] = useState(initialGame);
  const [selectedGames, setSelectedGames] = useState([]);
  const [gameData, setGameData] = useState({});
  const [statsData, setStatsData] = useState({});
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    display_name: '', bio: '', tagline: '', avatar_url: '', banner_url: '',
    country: 'India', looking_for: 'Team',
    youtube_url: '', instagram_url: '', discord_tag: '', twitter_url: '',
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [pRes, gRes, sRes] = await Promise.all([
        fetch('http://localhost:3001/api/profiles/me', { headers }),
        fetch(`http://localhost:3001/api/profiles/user/${userId}/games`, { headers }),
        fetch(`http://localhost:3001/api/profiles/user/${userId}/stats`, { headers }),
      ]);
      if (pRes.ok) {
        const p = await pRes.json();
        if (p) setForm({
          display_name: p.display_name || '', bio: p.bio || '', tagline: p.tagline || '',
          avatar_url: p.avatar_url || '', banner_url: p.banner_url || '',
          country: p.country || 'India', looking_for: p.looking_for || 'Team',
          youtube_url: p.youtube_url || '', instagram_url: p.instagram_url || '',
          discord_tag: p.discord_tag || '', twitter_url: p.twitter_url || '',
        });
      }
      if (gRes.ok) {
        const games = await gRes.json();
        setSelectedGames(games.map(g => g.game));
        const gd = {};
        games.forEach(g => { gd[g.game] = { role: g.role || '', rank: g.rank || '' }; });
        setGameData(gd);
        if (!activeStatGame && games.length > 0) setActiveStatGame(games[0].game);
      }
      if (sRes.ok) {
        const stats = await sRes.json();
        const sd = {};
        stats.forEach(s => { sd[s.game] = s.stats || {}; });
        setStatsData(sd);
      }
    } catch (err) { console.error(err); }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      alert('Profile saved!');
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const toggleGame = (gameId) => {
    setSelectedGames(prev => prev.includes(gameId) ? prev.filter(g => g !== gameId) : [...prev, gameId]);
    if (!gameData[gameId]) setGameData(prev => ({ ...prev, [gameId]: { role: '', rank: '' } }));
  };

  const saveGame = async (gameId) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/api/profiles/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ game: gameId, ...gameData[gameId] }),
      });
      alert(`${gameId} saved!`);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleOCR = async (file, game) => {
    setOcrLoading(true);
    try {
      const Tesseract = (await import('tesseract.js')).default;
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      const parsed = parseStats(text, game);
      setStatsData(prev => ({ ...prev, [game]: { ...prev[game], ...parsed } }));
      alert(`${Object.keys(parsed).length} stats extracted!`);
    } catch (err) { alert('OCR failed. Enter manually.'); }
    finally { setOcrLoading(false); }
  };

  const parseStats = (text, game) => {
    const result = {};
    const patterns = [
      { key: 'kd_ratio', regex: /k\/d[\s:]*([0-9.]+)/i },
      { key: 'kd_ratio', regex: /ratio[\s:]*([0-9.]+)/i },
      { key: 'win_rate', regex: /win\s*rate[\s:]*([0-9.]+)/i },
      { key: 'total_matches', regex: /matches[\s:]*([0-9,]+)/i },
      { key: 'total_kills', regex: /kills[\s:]*([0-9,]+)/i },
      { key: 'headshot', regex: /headshot[\s%:]*([0-9.]+)/i },
      { key: 'wins', regex: /wins[\s:]*([0-9,]+)/i },
      { key: 'damage', regex: /damage[\s:]*([0-9,]+)/i },
      { key: 'avg_damage', regex: /avg[\s.]*damage[\s:]*([0-9.]+)/i },
    ];
    patterns.forEach(({ key, regex }) => {
      if (!result[key]) { const m = text.match(regex); if (m) result[key] = m[1].trim(); }
    });
    return result;
  };

  const fetchStatsByUid = async (game) => {
    const uid = uidInputs[game];
    if (!uid?.trim()) return;
    setOcrLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/freefire/stats/${uid.trim()}`);
      const data = await res.json();
      if (data.br) {
        const quad = data.br.quadstats;
        const d = quad?.detailedstats || {};
        const extracted = {
          kd_ratio: quad?.kills && quad?.gamesplayed ? (quad.kills / quad.gamesplayed).toFixed(2) : '',
          win_rate: quad?.wins && quad?.gamesplayed ? ((quad.wins / quad.gamesplayed) * 100).toFixed(1) : '',
          total_matches: quad?.gamesplayed?.toString() || '',
          total_kills: quad?.kills?.toString() || '',
          wins: quad?.wins?.toString() || '',
          headshot: d.headshotkills && quad?.kills ? ((d.headshotkills / quad.kills) * 100).toFixed(1) : '',
          damage: d.damage?.toString() || '',
        };
        setStatsData(prev => ({ ...prev, [game]: { ...prev[game], ...extracted } }));
        alert('Stats fetched! Review and save.');
      } else {
        alert('Player not found!');
      }
    } catch { alert('Failed to fetch. Check UID.'); }
    finally { setOcrLoading(false); }
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

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif", paddingTop: '104px'}}>
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push(`/profile/${userId}`)} className="text-red-400 hover:text-red-300 font-bold text-sm">← MY PROFILE</button>
              <div>
                <h1 className="font-black text-xl text-white" style={{fontFamily: "'Orbitron', sans-serif"}}>EDIT PROFILE</h1>
                <p className="text-xs text-gray-600 font-bold">UPDATE YOUR ESPORTS IDENTITY</p>
              </div>
            </div>
            <button onClick={() => router.push(`/profile/${userId}`)}
              className="px-4 py-2 rounded-xl font-black text-xs tracking-widest text-white transition"
              style={{background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 15px rgba(16,185,129,0.3)'}}>
              👁 VIEW PROFILE
            </button>
          </div>

          {/* TABS */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'profile', label: '👤 PROFILE', },
              { id: 'games', label: '🎮 GAMES', },
              { id: 'stats', label: '📊 STATS', },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className="px-5 py-2.5 rounded-xl font-black text-xs tracking-widest transition"
                style={{
                  background: activeTab === t.id ? 'linear-gradient(135deg, #ef4444, #DC143C)' : '#0a0a0a',
                  border: `1px solid ${activeTab === t.id ? '#ef4444' : 'rgba(255,255,255,0.05)'}`,
                  color: activeTab === t.id ? 'white' : '#6b7280',
                  boxShadow: activeTab === t.id ? '0 0 15px rgba(239,68,68,0.4)' : 'none',
                  fontFamily: "'Orbitron', sans-serif"
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="rounded-2xl p-6" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-4" style={{fontFamily: "'Orbitron', sans-serif"}}>// IDENTITY</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">DISPLAY NAME *</label>
                    <input className="neon-input" placeholder="e.g. JARVIS FF" value={form.display_name} onChange={e => setForm(p => ({...p, display_name: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">TAGLINE</label>
                    <input className="neon-input" placeholder="e.g. Born to Frag 🔥" value={form.tagline} onChange={e => setForm(p => ({...p, tagline: e.target.value}))} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">BIO</label>
                    <textarea className="neon-input" rows={3} placeholder="Tell your story..." value={form.bio} onChange={e => setForm(p => ({...p, bio: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">AVATAR URL</label>
                    <input className="neon-input" placeholder="https://..." value={form.avatar_url} onChange={e => setForm(p => ({...p, avatar_url: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">BANNER URL</label>
                    <input className="neon-input" placeholder="https://..." value={form.banner_url} onChange={e => setForm(p => ({...p, banner_url: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">COUNTRY</label>
                    <select className="neon-select" value={form.country} onChange={e => setForm(p => ({...p, country: e.target.value}))}>
                      {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">LOOKING FOR</label>
                    <select className="neon-select" value={form.looking_for} onChange={e => setForm(p => ({...p, looking_for: e.target.value}))}>
                      {LOOKING_FOR.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-4" style={{fontFamily: "'Orbitron', sans-serif"}}>// SOCIAL LINKS</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {key: 'youtube_url', icon: '▶', label: 'YOUTUBE URL', placeholder: 'youtube.com/@channel'},
                    {key: 'instagram_url', icon: '📷', label: 'INSTAGRAM URL', placeholder: 'instagram.com/profile'},
                    {key: 'discord_tag', icon: '💬', label: 'DISCORD TAG', placeholder: 'username#0000'},
                    {key: 'twitter_url', icon: '🐦', label: 'TWITTER/X URL', placeholder: 'twitter.com/handle'},
                  ].map(s => (
                    <div key={s.key}>
                      <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">{s.icon} {s.label}</label>
                      <input className="neon-input" placeholder={s.placeholder} value={form[s.key]} onChange={e => setForm(p => ({...p, [s.key]: e.target.value}))} />
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={saveProfile} disabled={saving || !form.display_name.trim()}
                className="w-full py-3 rounded-xl font-black text-sm tracking-widest text-white transition"
                style={{background: 'linear-gradient(135deg, #ef4444, #DC143C)', boxShadow: '0 0 20px rgba(239,68,68,0.4)'}}>
                {saving ? '⟳ SAVING...' : '💾 SAVE PROFILE'}
              </button>
            </div>
          )}

          {/* GAMES TAB */}
          {activeTab === 'games' && (
            <div className="space-y-5">
              <div className="rounded-2xl p-6" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-4" style={{fontFamily: "'Orbitron', sans-serif"}}>// SELECT GAMES</p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {GAMES.map(g => (
                    <div key={g.id} onClick={() => toggleGame(g.id)}
                      className="p-4 rounded-xl cursor-pointer text-center transition-all duration-300 hover:scale-105"
                      style={{
                        background: selectedGames.includes(g.id) ? g.color+'15' : '#0a0a0a',
                        border: `2px solid ${selectedGames.includes(g.id) ? g.color : 'rgba(255,255,255,0.05)'}`,
                        boxShadow: selectedGames.includes(g.id) ? `0 0 20px ${g.color}30` : 'none'
                      }}>
                      <div className="text-3xl mb-2">{g.icon}</div>
                      <p className="font-black text-xs text-white" style={{fontFamily: "'Orbitron', sans-serif"}}>{g.id}</p>
                      {selectedGames.includes(g.id) && <p className="text-xs mt-1 font-black" style={{color: g.color}}>✓ SELECTED</p>}
                    </div>
                  ))}
                </div>

                {selectedGames.map(gameId => {
                  const g = GAMES.find(x => x.id === gameId);
                  return (
                    <div key={gameId} className="rounded-xl p-5 mb-4" style={{background: '#0a0a0a', border: `1px solid ${g.color}25`}}>
                      <p className="text-xs font-black tracking-widest mb-3" style={{fontFamily: "'Orbitron', sans-serif", color: g.color}}>{g.icon} {gameId}</p>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">ROLE</label>
                          <select className="neon-select" value={gameData[gameId]?.role || ''} onChange={e => setGameData(p => ({...p, [gameId]: {...p[gameId], role: e.target.value}}))}>
                            <option value="">Select Role</option>
                            {g.roles.map(r => <option key={r}>{r}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-black text-gray-600 tracking-widest mb-1.5 block">RANK</label>
                          <select className="neon-select" value={gameData[gameId]?.rank || ''} onChange={e => setGameData(p => ({...p, [gameId]: {...p[gameId], rank: e.target.value}}))}>
                            <option value="">Select Rank</option>
                            {g.ranks.map(r => <option key={r}>{r}</option>)}
                          </select>
                        </div>
                      </div>
                      <button onClick={() => saveGame(gameId)} disabled={saving}
                        className="w-full py-2 rounded-lg font-black text-xs tracking-widest transition"
                        style={{background: g.color+'20', border: `1px solid ${g.color}40`, color: g.color, fontFamily: "'Orbitron', sans-serif"}}>
                        {saving ? '⟳' : '💾'} SAVE {gameId.toUpperCase()}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              {/* Game selector */}
              <div className="flex gap-2 flex-wrap">
                {GAMES.map(g => (
                  <button key={g.id} onClick={() => setActiveStatGame(g.id)}
                    className="px-4 py-2 rounded-xl font-black text-xs tracking-widest transition"
                    style={{
                      background: activeStatGame === g.id ? g.color+'20' : '#0a0a0a',
                      border: `1px solid ${activeStatGame === g.id ? g.color : 'rgba(255,255,255,0.05)'}`,
                      color: activeStatGame === g.id ? g.color : '#6b7280',
                      boxShadow: activeStatGame === g.id ? `0 0 15px ${g.color}30` : 'none',
                      fontFamily: "'Orbitron', sans-serif"
                    }}>
                    {g.icon} {g.id}
                  </button>
                ))}
              </div>

              {activeStatGame && (() => {
                const g = GAMES.find(x => x.id === activeStatGame);
                return (
                  <div className="rounded-2xl p-6" style={{background: '#050505', border: `1px solid ${g.color}25`}}>
                    <p className="text-xs font-black tracking-widest mb-4" style={{fontFamily: "'Orbitron', sans-serif", color: g.color}}>// {activeStatGame.toUpperCase()} STATS</p>

                    {/* UID / OCR Selector */}
                    {!statsInputMode[activeStatGame] ? (
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <button onClick={() => setStatsInputMode(p => ({...p, [activeStatGame]: 'uid'}))}
                          className="rounded-xl p-4 text-center transition-all duration-300 hover:scale-105"
                          style={{background: g.color+'08', border: `1px solid ${g.color}30`}}>
                          <div className="text-2xl mb-2">🔢</div>
                          <p className="font-black text-white mb-1" style={{fontFamily: "'Orbitron', sans-serif", fontSize: '10px'}}>ENTER UID</p>
                          <p className="text-gray-600 font-bold" style={{fontSize: '9px'}}>Fetch stats automatically</p>
                          <div className="mt-2 py-1 rounded-lg font-black" style={{background: g.color+'20', color: g.color, fontFamily: "'Orbitron', sans-serif", fontSize: '8px'}}>QUICK → AUTO FETCH</div>
                        </button>
                        <button onClick={() => setStatsInputMode(p => ({...p, [activeStatGame]: 'ocr'}))}
                          className="rounded-xl p-4 text-center transition-all duration-300 hover:scale-105"
                          style={{background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.3)'}}>
                          <div className="text-2xl mb-2">📸</div>
                          <p className="font-black text-white mb-1" style={{fontFamily: "'Orbitron', sans-serif", fontSize: '10px'}}>SCREENSHOT</p>
                          <p className="text-gray-600 font-bold" style={{fontSize: '9px'}}>Upload & auto extract</p>
                          <div className="mt-2 py-1 rounded-lg font-black" style={{background: 'rgba(99,102,241,0.2)', color: '#6366f1', fontFamily: "'Orbitron', sans-serif", fontSize: '8px'}}>OCR → AUTO EXTRACT</div>
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-xl p-4 mb-5" style={{background: '#0a0a0a', border: `1px solid ${g.color}25`}}>
                        <div className="flex items-center gap-2 mb-3">
                          <button onClick={() => setStatsInputMode(p => ({...p, [activeStatGame]: null}))}
                            className="text-gray-600 hover:text-red-400 font-black text-xs transition">← BACK</button>
                          <p className="text-xs font-black tracking-widest" style={{color: g.color, fontFamily: "'Orbitron', sans-serif", fontSize: '9px'}}>
                            {statsInputMode[activeStatGame] === 'uid' ? 'ENTER UID' : 'UPLOAD SCREENSHOT'}
                          </p>
                        </div>

                        {statsInputMode[activeStatGame] === 'uid' && (
                          <div className="flex gap-2">
                            <input value={uidInputs[activeStatGame] || ''} 
                              onChange={e => setUidInputs(p => ({...p, [activeStatGame]: e.target.value}))}
                              onKeyDown={e => e.key === 'Enter' && fetchStatsByUid(activeStatGame)}
                              placeholder="Enter your UID..."
                              className="flex-1 rounded-xl px-4 py-2.5 font-bold text-white outline-none text-sm"
                              style={{background: '#080808', border: `1px solid ${g.color}30`, fontFamily: "'Rajdhani', sans-serif"}} />
                            <button onClick={() => fetchStatsByUid(activeStatGame)} disabled={ocrLoading}
                              className="px-4 py-2.5 rounded-xl font-black text-xs text-white transition"
                              style={{background: g.color, fontFamily: "'Orbitron', sans-serif"}}>
                              {ocrLoading ? '⟳' : '🔍'}
                            </button>
                          </div>
                        )}

                        {statsInputMode[activeStatGame] === 'ocr' && (
                          <label className="flex flex-col items-center justify-center rounded-xl p-6 cursor-pointer"
                            style={{background: '#080808', border: '2px dashed rgba(99,102,241,0.3)'}}>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden"
                              onChange={async e => { if (e.target.files[0]) await handleOCR(e.target.files[0], activeStatGame); }} />
                            {ocrLoading ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                <p className="text-indigo-400 font-black text-xs" style={{fontFamily: "'Orbitron', sans-serif"}}>SCANNING...</p>
                              </div>
                            ) : (
                              <>
                                <div className="text-3xl mb-2">📲</div>
                                <p className="font-black text-white mb-1" style={{fontFamily: "'Orbitron', sans-serif", fontSize: '10px'}}>TAP TO UPLOAD</p>
                                <p className="text-gray-600 font-bold text-center" style={{fontSize: '9px'}}>Upload screenshot — stats auto extracted</p>
                              </>
                            )}
                          </label>
                        )}
                      </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {Object.entries(STAT_LABELS).map(([key, label]) => (
                        <div key={key} className="rounded-lg p-3" style={{background: '#080808', border: `1px solid ${g.color}15`}}>
                          <label className="text-xs font-black tracking-widest mb-1.5 block" style={{color: g.color, fontSize: '9px'}}>{label}</label>
                          <input className="neon-input" style={{padding: '6px 10px', fontSize: '13px'}} placeholder="—"
                            value={statsData[activeStatGame]?.[key] || ''}
                            onChange={e => setStatsData(prev => ({...prev, [activeStatGame]: {...prev[activeStatGame], [key]: e.target.value}}))} />
                        </div>
                      ))}
                    </div>

                    <button onClick={() => saveStats(activeStatGame)} disabled={saving}
                      className="w-full py-3 rounded-xl font-black text-xs tracking-widest text-white transition"
                      style={{background: `linear-gradient(135deg, ${g.color}, ${g.color}aa)`, boxShadow: `0 0 20px ${g.color}30`, fontFamily: "'Orbitron', sans-serif"}}>
                      {saving ? '⟳ SAVING...' : `💾 SAVE ${activeStatGame.toUpperCase()} STATS`}
                    </button>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}      
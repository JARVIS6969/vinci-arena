'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const GAMES = [
  { id: 'Free Fire', icon: '🔥', color: '#ef4444', glow: 'rgba(239,68,68,0.6)', roles: ['IGL', 'Rusher', 'Sniper', 'Support', 'All-rounder'], ranks: ['Heroic', 'Grandmaster', 'Master', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'] },
  { id: 'BGMI', icon: '🎯', color: '#f97316', glow: 'rgba(249,115,22,0.6)', roles: ['IGL', 'Fragger', 'Sniper', 'Support', 'Scout'], ranks: ['Conqueror', 'Ace Master', 'Ace', 'Crown', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'] },
  { id: 'Valorant', icon: '⚡', color: '#6366f1', glow: 'rgba(99,102,241,0.6)', roles: ['Duelist', 'Controller', 'Initiator', 'Sentinel', 'IGL'], ranks: ['Radiant', 'Immortal', 'Ascendant', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze', 'Iron'] },
];

const COUNTRIES = ['India', 'Pakistan', 'Bangladesh', 'Nepal', 'Sri Lanka', 'Other'];
const LOOKING_FOR = ['Team', 'Players', 'Scrims', 'Tournament', 'Just Showcasing'];
const NEON = ['#ef4444','#f97316','#fbbf24','#10b981','#00ffff','#6366f1','#a78bfa','#ec4899'];

// ── Canvas Particles ──
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({length: 80}, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      col: NEON[Math.floor(Math.random() * NEON.length)],
      bp: Math.random() * Math.PI * 2,
      br: 0.02 + Math.random() * 0.03,
    }));

    let frame = 0, id;
    const loop = () => {
      id = requestAnimationFrame(loop);
      frame++;
      ctx.clearRect(0, 0, c.width, c.height);

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = c.width;
        if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height;
        if (p.y > c.height) p.y = 0;

        const op = 0.2 + 0.6 * Math.abs(Math.sin(frame * p.br + p.bp));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, p.col + 'aa');
        g.addColorStop(1, p.col + '00');
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.globalAlpha = op * 0.3; ctx.fill();

        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col; ctx.globalAlpha = op; ctx.fill();
        ctx.globalAlpha = 1;
      });

      // connections
      particles.forEach((a, i) => particles.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 100) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = a.col;
          ctx.globalAlpha = (1 - d / 100) * 0.08;
          ctx.lineWidth = 0.5; ctx.stroke(); ctx.globalAlpha = 1;
        }
      }));
    };
    loop();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0}}/>;
}

// ── 3D Tilt Card ──
function TiltCard({ children, color = '#ef4444', style = {} }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({x: 0, y: 0, gx: 50, gy: 50});
  const [hov, setHov] = useState(false);

  return (
    <div ref={ref}
      onMouseMove={e => {
        const r = ref.current.getBoundingClientRect();
        setTilt({
          x: ((e.clientX - r.left) / r.width - 0.5) * 15,
          y: ((e.clientY - r.top) / r.height - 0.5) * -15,
          gx: ((e.clientX - r.left) / r.width) * 100,
          gy: ((e.clientY - r.top) / r.height) * 100,
        });
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setTilt({x: 0, y: 0, gx: 50, gy: 50}); }}
      style={{
        transform: hov
          ? `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(1.02)`
          : 'perspective(800px) rotateX(0) rotateY(0) scale(1)',
        transition: hov ? 'transform 0.1s' : 'transform 0.5s cubic-bezier(.16,1,.3,1)',
        position: 'relative', borderRadius: '16px',
        background: '#050510',
        border: `1px solid ${hov ? color : color + '30'}`,
        boxShadow: hov ? `0 20px 60px ${color}20, 0 0 30px ${color}10` : 'none',
        overflow: 'hidden',
        ...style
      }}>
      {hov && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.06) 0%, transparent 60%)`
        }}/>
      )}
      {/* Top neon line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: hov ? 1 : 0, transition: 'opacity 0.3s', zIndex: 2
      }}/>
      {/* Corner brackets */}
      <div style={{position: 'absolute', top: '6px', left: '6px', width: '12px', height: '12px', borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}`, zIndex: 2}}/>
      <div style={{position: 'absolute', top: '6px', right: '6px', width: '12px', height: '12px', borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}`, zIndex: 2}}/>
      <div style={{position: 'absolute', bottom: '6px', left: '6px', width: '12px', height: '12px', borderBottom: `2px solid ${color}40`, borderLeft: `2px solid ${color}40`, zIndex: 2}}/>
      <div style={{position: 'absolute', bottom: '6px', right: '6px', width: '12px', height: '12px', borderBottom: `2px solid ${color}40`, borderRight: `2px solid ${color}40`, zIndex: 2}}/>
      <div style={{position: 'relative', zIndex: 1}}>{children}</div>
    </div>
  );
}

// ── Cyber Input ──
function CyberInput({ label, placeholder, value, onChange, type = 'text', multiline = false, color = '#ef4444' }) {
  const [focused, setFocused] = useState(false);
  const style = {
    width: '100%',
    background: focused ? '#080812' : '#050508',
    border: `1px solid ${focused ? color : color + '25'}`,
    borderRadius: '8px',
    color: 'white',
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: '600',
    fontSize: '14px',
    padding: '10px 14px',
    outline: 'none',
    transition: 'all 0.2s',
    boxShadow: focused ? `0 0 15px ${color}20, inset 0 0 10px ${color}05` : 'none',
    boxSizing: 'border-box',
    resize: multiline ? 'vertical' : 'none',
  };

  return (
    <div style={{position: 'relative'}}>
      {label && <label style={{display: 'block', fontSize: '10px', fontWeight: '900', color: 'rgba(255,255,255,0.3)', letterSpacing: '3px', marginBottom: '6px', fontFamily: "'Orbitron', sans-serif"}}>{label}</label>}
      {multiline
        ? <textarea rows={3} placeholder={placeholder} value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{...style, color: 'white'}}/>
        : <input type={type} placeholder={placeholder} value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={style}/>
      }
      {focused && <div style={{position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '1px', background: `linear-gradient(90deg, transparent, ${color}, transparent)`}}/>}
    </div>
  );
}

// ── Cyber Select ──
function CyberSelect({ label, value, onChange, options, color = '#ef4444' }) {
  return (
    <div>
      {label && <label style={{display: 'block', fontSize: '10px', fontWeight: '900', color: 'rgba(255,255,255,0.3)', letterSpacing: '3px', marginBottom: '6px', fontFamily: "'Orbitron', sans-serif"}}>{label}</label>}
      <select value={value} onChange={onChange} style={{
        width: '100%',
        background: '#050508',
        border: `1px solid ${color}25`,
        borderRadius: '8px',
        color: 'white',
        fontFamily: "'Rajdhani', sans-serif",
        fontWeight: '700',
        fontSize: '14px',
        padding: '10px 14px',
        outline: 'none',
        boxSizing: 'border-box',
        cursor: 'pointer'
      }}>
        {options.map(o => <option key={o} style={{background: '#050508'}}>{o}</option>)}
      </select>
    </div>
  );
}

export default function EditProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedGames, setSelectedGames] = useState([]);
  const [activeStatGame, setActiveStatGame] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [uidInputs, setUidInputs] = useState({});
  const [uidLoading, setUidLoading] = useState({});
  const [statMode, setStatMode] = useState({});
  const fileRef = useRef(null);
  const [scanY, setScanY] = useState(0);

  const [basicForm, setBasicForm] = useState({
    display_name: '', bio: '', tagline: '', avatar_url: '', banner_url: '',
    country: 'India', looking_for: 'Team',
    youtube_url: '', instagram_url: '', discord_tag: '', twitter_url: '',
  });
  const [gameData, setGameData] = useState({});
  const [statsData, setStatsData] = useState({});

  // Scan line animation
  useEffect(() => {
    let frame;
    const animate = () => {
      setScanY(y => (y + 0.3) % 100);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => { fetchExisting(); }, []);

  const fetchExisting = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token) { router.push('/login'); return; }
      const [pRes, gRes, sRes] = await Promise.all([
        fetch('http://localhost:3001/api/profiles/me', { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:3001/api/profiles/user/${userId}/games`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:3001/api/profiles/user/${userId}/stats`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (pRes.ok) {
        const p = await pRes.json();
        if (p) setBasicForm({
          display_name: p.display_name || '', bio: p.bio || '',
          tagline: p.tagline || '', avatar_url: p.avatar_url || '',
          banner_url: p.banner_url || '',
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
      }
      if (sRes.ok) {
        const stats = await sRes.json();
        const sd = {};
        stats.forEach(s => { sd[s.game] = s.stats || {}; });
        setStatsData(sd);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleGame = (gameId) => {
    setSelectedGames(prev => prev.includes(gameId) ? prev.filter(g => g !== gameId) : [...prev, gameId]);
    if (!gameData[gameId]) setGameData(prev => ({ ...prev, [gameId]: { role: '', rank: '' } }));
  };

  const handleOCR = async (file, game) => {
    setOcrLoading(true);
    try {
      const Tesseract = (await import('tesseract.js')).default;
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      const parsed = parseStats(text, game);
      setOcrResult({ game, parsed });
      setStatsData(prev => ({ ...prev, [game]: { ...prev[game], ...parsed } }));
    } catch { alert('OCR failed. Enter manually.'); }
    finally { setOcrLoading(false); }
  };

  const parseStats = (text) => {
    const result = {};
    const patterns = [
      { key: 'kd_ratio', regex: /k\/d[\s:]*([0-9.]+)/i },
      { key: 'win_rate', regex: /win\s*rate[\s:]*([0-9.]+)/i },
      { key: 'total_matches', regex: /matches[\s:]*([0-9,]+)/i },
      { key: 'total_kills', regex: /kills[\s:]*([0-9,]+)/i },
      { key: 'headshot', regex: /headshot[\s%:]*([0-9.]+)/i },
      { key: 'wins', regex: /wins[\s:]*([0-9,]+)/i },
      { key: 'damage', regex: /damage[\s:]*([0-9,]+)/i },
    ];
    patterns.forEach(({ key, regex }) => {
      if (!result[key]) { const m = text.match(regex); if (m) result[key] = m[1].trim(); }
    });
    return result;
  };

  const fetchByUID = async (game) => {
    const uid = uidInputs[game]?.trim();
    if (!uid) return;
    setUidLoading(p => ({ ...p, [game]: true }));
    try {
      const res = await fetch(`http://localhost:3001/api/freefire/stats/${uid}`);
      const data = await res.json();
      if (data.br) {
        const q = data.br.quadstats;
        const d = q?.detailedstats || {};
        setStatsData(prev => ({
          ...prev, [game]: {
            ...prev[game],
            kd_ratio: q?.kills && q?.gamesplayed ? (q.kills / q.gamesplayed).toFixed(2) : '',
            win_rate: q?.wins && q?.gamesplayed ? ((q.wins / q.gamesplayed) * 100).toFixed(1) : '',
            total_matches: q?.gamesplayed?.toString() || '',
            total_kills: q?.kills?.toString() || '',
            wins: q?.wins?.toString() || '',
            headshot: d.headshotkills && q?.kills ? ((d.headshotkills / q.kills) * 100).toFixed(1) : '',
          }
        }));
        alert('Stats fetched! Review and save.');
      } else { alert('Player not found!'); }
    } catch { alert('Failed. Check UID.'); }
    finally { setUidLoading(p => ({ ...p, [game]: false })); }
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
    damage: 'Total Damage', avg_damage: 'Avg Damage', rank: 'Current Rank',
  };

  if (loading) return (
    <div style={{minHeight: '100vh', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '104px'}}>
      <div style={{textAlign: 'center'}}>
        <div style={{width: '40px', height: '40px', border: '2px solid rgba(239,68,68,0.2)', borderTop: '2px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px'}}/>
        <div style={{color: '#ef4444', fontFamily: "'Orbitron', sans-serif", fontSize: '11px', letterSpacing: '3px'}}>LOADING...</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{minHeight: '100vh', background: '#050510', color: 'white', fontFamily: "'Rajdhani', sans-serif", paddingTop: '104px', position: 'relative'}}>

      {/* Particle Canvas */}
      <ParticleCanvas/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes rainbowBorder {
          0%{border-color:#ef4444} 16%{border-color:#f97316} 32%{border-color:#fbbf24}
          48%{border-color:#10b981} 64%{border-color:#00ffff} 80%{border-color:#6366f1} 100%{border-color:#ef4444}
        }
        @keyframes glowPulse {
          0%,100%{box-shadow:0 0 20px rgba(239,68,68,0.3)}
          50%{box-shadow:0 0 40px rgba(239,68,68,0.6),0 0 60px rgba(0,255,255,0.2)}
        }
        @keyframes scanMove {
          0%{top:0%} 100%{top:100%}
        }
        @keyframes neonFlicker {
          0%,95%,100%{opacity:1} 96%{opacity:0.4} 98%{opacity:0.8}
        }
        .step-active { animation: glowPulse 2s infinite; }
        .fu { animation: fadeUp 0.4s ease both; }
        .cyber-grid {
          background-image: linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239,68,68,0.02) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        input::placeholder, textarea::placeholder { color: #1a1a2e; }
        select option { background: #050510; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#ef4444, #00ffff); }
      `}</style>

      {/* Scan line */}
      <div style={{
        position: 'fixed', left: 0, right: 0, height: '1px',
        top: `${scanY}%`,
        background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.15), rgba(239,68,68,0.3), rgba(0,255,255,0.15), transparent)',
        pointerEvents: 'none', zIndex: 1
      }}/>

      {/* Grid overlay */}
      <div className="cyber-grid" style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0}}/>

      <div style={{position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto', padding: '32px 24px'}}>

        {/* HEADER */}
        <div className="fu" style={{marginBottom: '40px'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              <div style={{
                width: '48px', height: '48px',
                background: 'linear-gradient(135deg, #ef4444, #7c3aed)',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px',
                boxShadow: '0 0 25px rgba(239,68,68,0.5)',
                animation: 'glowPulse 2s infinite'
              }}>👤</div>
              <div>
                <h1 style={{fontFamily: "'Orbitron', sans-serif", fontWeight: '900', fontSize: '22px', color: '#fff', letterSpacing: '3px', margin: 0, animation: 'neonFlicker 5s infinite'}}>
                  EDIT PROFILE
                </h1>
                <p style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'rgba(0,255,255,0.5)', letterSpacing: '2px', margin: 0}}>
                  // BUILD YOUR ESPORTS IDENTITY
                </p>
              </div>
            </div>
            <button onClick={() => router.push(`/profile/${localStorage.getItem('userId')}`)}
              style={{
                padding: '8px 20px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none', borderRadius: '8px', color: 'white',
                fontFamily: "'Orbitron', sans-serif", fontWeight: '700',
                fontSize: '10px', letterSpacing: '2px', cursor: 'pointer',
                boxShadow: '0 0 20px rgba(16,185,129,0.4)'
              }}>
              👁 VIEW PROFILE
            </button>
          </div>
        </div>

        {/* STEPS */}
        <div className="fu" style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', animationDelay: '0.1s'}}>
          {[{n:1,label:'BASIC INFO',icon:'👤'},{n:2,label:'GAMES',icon:'🎮'},{n:3,label:'STATS',icon:'📊'}].map((s, i) => (
            <div key={s.n} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <div
                onClick={() => step > s.n && setStep(s.n)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  cursor: step > s.n ? 'pointer' : 'default',
                  background: step === s.n
                    ? 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(0,255,255,0.1))'
                    : step > s.n ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)',
                  border: step === s.n
                    ? '1px solid rgba(239,68,68,0.5)'
                    : step > s.n ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: step === s.n ? '0 0 20px rgba(239,68,68,0.2)' : 'none',
                  transition: 'all 0.3s'
                }}>
                <div style={{
                  width: '28px', height: '28px',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Orbitron', sans-serif", fontWeight: '900', fontSize: '11px',
                  background: step === s.n
                    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                    : step > s.n ? '#10b981' : '#0a0a1a',
                  border: `1px solid ${step >= s.n ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: step === s.n ? '0 0 15px rgba(239,68,68,0.6)' : 'none',
                  color: 'white'
                }}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <div>
                  <div style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', fontWeight: '900', letterSpacing: '2px', color: step >= s.n ? '#fff' : '#374151'}}>{s.label}</div>
                  <div style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '8px', color: step === s.n ? 'rgba(0,255,255,0.5)' : 'rgba(255,255,255,0.2)'}}>{s.icon} step {s.n}/3</div>
                </div>
              </div>
              {i < 2 && (
                <div style={{width: '40px', height: '1px', background: step > s.n ? 'linear-gradient(90deg, #ef4444, #10b981)' : 'rgba(255,255,255,0.05)'}}/>
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="fu" style={{display: 'flex', flexDirection: 'column', gap: '20px', animationDelay: '0.2s'}}>

            <TiltCard color="#ef4444" style={{padding: '24px'}}>
              <div style={{marginBottom: '16px'}}>
                <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', fontWeight: '900', color: 'rgba(239,68,68,0.6)', letterSpacing: '3px'}}>// IDENTITY</span>
                <div style={{height: '1px', background: 'linear-gradient(90deg, rgba(239,68,68,0.4), transparent)', marginTop: '6px'}}/>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <CyberInput label="DISPLAY NAME *" placeholder="e.g. JARVIS FF" value={basicForm.display_name} onChange={e => setBasicForm(p => ({...p, display_name: e.target.value}))} color="#ef4444"/>
                <CyberInput label="TAGLINE" placeholder="Born to Frag 🔥" value={basicForm.tagline} onChange={e => setBasicForm(p => ({...p, tagline: e.target.value}))} color="#ef4444"/>
                <div style={{gridColumn: '1/-1'}}>
                  <CyberInput label="BIO" placeholder="Tell your story..." value={basicForm.bio} onChange={e => setBasicForm(p => ({...p, bio: e.target.value}))} multiline color="#ef4444"/>
                </div>
                <CyberSelect label="COUNTRY" value={basicForm.country} onChange={e => setBasicForm(p => ({...p, country: e.target.value}))} options={COUNTRIES} color="#ef4444"/>
                <CyberSelect label="LOOKING FOR" value={basicForm.looking_for} onChange={e => setBasicForm(p => ({...p, looking_for: e.target.value}))} options={LOOKING_FOR} color="#ef4444"/>
                <CyberInput label="AVATAR URL" placeholder="https://..." value={basicForm.avatar_url} onChange={e => setBasicForm(p => ({...p, avatar_url: e.target.value}))} color="#ef4444"/>
                <CyberInput label="BANNER URL" placeholder="https://..." value={basicForm.banner_url} onChange={e => setBasicForm(p => ({...p, banner_url: e.target.value}))} color="#ef4444"/>
              </div>
            </TiltCard>

            <TiltCard color="#a78bfa" style={{padding: '24px'}}>
              <div style={{marginBottom: '16px'}}>
                <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', fontWeight: '900', color: 'rgba(167,139,250,0.6)', letterSpacing: '3px'}}>// SOCIAL LINKS</span>
                <div style={{height: '1px', background: 'linear-gradient(90deg, rgba(167,139,250,0.4), transparent)', marginTop: '6px'}}/>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <CyberInput label="▶ YOUTUBE" placeholder="youtube.com/@channel" value={basicForm.youtube_url} onChange={e => setBasicForm(p => ({...p, youtube_url: e.target.value}))} color="#a78bfa"/>
                <CyberInput label="📷 INSTAGRAM" placeholder="instagram.com/profile" value={basicForm.instagram_url} onChange={e => setBasicForm(p => ({...p, instagram_url: e.target.value}))} color="#ec4899"/>
                <CyberInput label="💬 DISCORD" placeholder="username#0000" value={basicForm.discord_tag} onChange={e => setBasicForm(p => ({...p, discord_tag: e.target.value}))} color="#6366f1"/>
                <CyberInput label="🐦 TWITTER/X" placeholder="twitter.com/handle" value={basicForm.twitter_url} onChange={e => setBasicForm(p => ({...p, twitter_url: e.target.value}))} color="#00ffff"/>
              </div>
            </TiltCard>

            <button onClick={saveBasic} disabled={saving || !basicForm.display_name.trim()}
              style={{
                width: '100%', padding: '14px',
                background: basicForm.display_name.trim()
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                  : '#0a0a1a',
                border: `1px solid ${basicForm.display_name.trim() ? '#ef4444' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '10px', color: basicForm.display_name.trim() ? 'white' : '#374151',
                fontFamily: "'Orbitron', sans-serif", fontWeight: '900', fontSize: '12px',
                letterSpacing: '3px', cursor: basicForm.display_name.trim() ? 'pointer' : 'not-allowed',
                boxShadow: basicForm.display_name.trim() ? '0 0 25px rgba(239,68,68,0.4)' : 'none',
                transition: 'all 0.3s'
              }}>
              {saving ? '⟳ SAVING...' : 'NEXT → SELECT GAMES ⚡'}
            </button>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="fu" style={{display: 'flex', flexDirection: 'column', gap: '20px', animationDelay: '0.2s'}}>

            <TiltCard color="#00ffff" style={{padding: '24px'}}>
              <div style={{marginBottom: '20px'}}>
                <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', fontWeight: '900', color: 'rgba(0,255,255,0.6)', letterSpacing: '3px'}}>// SELECT YOUR GAMES</span>
                <div style={{height: '1px', background: 'linear-gradient(90deg, rgba(0,255,255,0.4), transparent)', marginTop: '6px'}}/>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px'}}>
                {GAMES.map(g => (
                  <div key={g.id} onClick={() => toggleGame(g.id)}
                    style={{
                      padding: '20px 16px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      background: selectedGames.includes(g.id) ? g.color + '15' : '#080812',
                      border: `2px solid ${selectedGames.includes(g.id) ? g.color : 'rgba(255,255,255,0.05)'}`,
                      boxShadow: selectedGames.includes(g.id) ? `0 0 25px ${g.color}40` : 'none',
                      transition: 'all 0.3s',
                      transform: selectedGames.includes(g.id) ? 'scale(1.03)' : 'scale(1)',
                      position: 'relative', overflow: 'hidden'
                    }}>
                    {selectedGames.includes(g.id) && (
                      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${g.color}, transparent)`}}/>
                    )}
                    <div style={{fontSize: '36px', marginBottom: '8px', filter: selectedGames.includes(g.id) ? `drop-shadow(0 0 12px ${g.color})` : 'none'}}>{g.icon}</div>
                    <p style={{fontFamily: "'Orbitron', sans-serif", fontWeight: '900', fontSize: '11px', color: 'white', margin: '0 0 6px', letterSpacing: '1px'}}>{g.id}</p>
                    {selectedGames.includes(g.id)
                      ? <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '8px', color: g.color, letterSpacing: '2px'}}>✓ SELECTED</span>
                      : <span style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#374151'}}>click to select</span>
                    }
                  </div>
                ))}
              </div>
            </TiltCard>

            {selectedGames.map(gameId => {
              const g = GAMES.find(x => x.id === gameId);
              return (
                <TiltCard key={gameId} color={g.color} style={{padding: '24px'}}>
                  <div style={{marginBottom: '16px'}}>
                    <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', fontWeight: '900', color: g.color + 'aa', letterSpacing: '3px'}}>{g.icon} // {gameId.toUpperCase()} DETAILS</span>
                    <div style={{height: '1px', background: `linear-gradient(90deg, ${g.color}40, transparent)`, marginTop: '6px'}}/>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                    <CyberSelect label="ROLE" value={gameData[gameId]?.role || ''} onChange={e => setGameData(p => ({...p, [gameId]: {...p[gameId], role: e.target.value}}))} options={['Select Role', ...g.roles]} color={g.color}/>
                    <CyberSelect label="HIGHEST RANK" value={gameData[gameId]?.rank || ''} onChange={e => setGameData(p => ({...p, [gameId]: {...p[gameId], rank: e.target.value}}))} options={['Select Rank', ...g.ranks]} color={g.color}/>
                  </div>
                </TiltCard>
              );
            })}

            <div style={{display: 'flex', gap: '12px'}}>
              <button onClick={() => setStep(1)}
                style={{padding: '12px 24px', background: '#080812', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#ef4444', fontFamily: "'Orbitron', sans-serif", fontWeight: '700', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer'}}>
                ← BACK
              </button>
              <button onClick={saveGames} disabled={saving || selectedGames.length === 0}
                style={{
                  flex: 1, padding: '14px',
                  background: selectedGames.length > 0 ? 'linear-gradient(135deg, #ef4444, #dc2626)' : '#0a0a1a',
                  border: `1px solid ${selectedGames.length > 0 ? '#ef4444' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '10px', color: selectedGames.length > 0 ? 'white' : '#374151',
                  fontFamily: "'Orbitron', sans-serif", fontWeight: '900', fontSize: '12px',
                  letterSpacing: '3px', cursor: selectedGames.length > 0 ? 'pointer' : 'not-allowed',
                  boxShadow: selectedGames.length > 0 ? '0 0 25px rgba(239,68,68,0.4)' : 'none',
                  transition: 'all 0.3s'
                }}>
                {saving ? '⟳ SAVING...' : `NEXT → ADD STATS (${selectedGames.length} games) ⚡`}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div className="fu" style={{display: 'flex', flexDirection: 'column', gap: '20px', animationDelay: '0.2s'}}>

            {/* Game tabs */}
            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
              {selectedGames.map(gameId => {
                const g = GAMES.find(x => x.id === gameId);
                return (
                  <button key={gameId} onClick={() => setActiveStatGame(gameId)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontFamily: "'Orbitron', sans-serif", fontWeight: '700', fontSize: '10px', letterSpacing: '2px',
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: activeStatGame === gameId ? g.color + '20' : '#080812',
                      border: `1px solid ${activeStatGame === gameId ? g.color : 'rgba(255,255,255,0.05)'}`,
                      color: activeStatGame === gameId ? g.color : '#374151',
                      boxShadow: activeStatGame === gameId ? `0 0 20px ${g.color}30` : 'none'
                    }}>
                    {g.icon} {gameId}
                  </button>
                );
              })}
            </div>

            {activeStatGame && (() => {
              const g = GAMES.find(x => x.id === activeStatGame);
              const mode = statMode[activeStatGame];
              return (
                <TiltCard color={g.color} style={{padding: '24px'}}>
                  <div style={{marginBottom: '20px'}}>
                    <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', fontWeight: '900', color: g.color + 'aa', letterSpacing: '3px'}}>{g.icon} // {activeStatGame.toUpperCase()} STATS</span>
                    <div style={{height: '1px', background: `linear-gradient(90deg, ${g.color}40, transparent)`, marginTop: '6px'}}/>
                  </div>

                  {/* Mode selector */}
                  {!mode ? (
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px'}}>
                      {[
                        {m:'uid', icon:'🔢', title:'ENTER UID', sub:'Auto fetch stats', badge:'QUICK → AUTO FETCH', bg: g.color + '10', border: g.color + '30', badgeBg: g.color + '20', badgeColor: g.color},
                        {m:'ocr', icon:'📸', title:'SCREENSHOT', sub:'Upload & OCR extract', badge:'OCR → AUTO EXTRACT', bg:'rgba(99,102,241,0.08)', border:'rgba(99,102,241,0.3)', badgeBg:'rgba(99,102,241,0.2)', badgeColor:'#6366f1'},
                      ].map(b => (
                        <button key={b.m} onClick={() => setStatMode(p => ({...p, [activeStatGame]: b.m}))}
                          style={{
                            padding: '20px 16px', borderRadius: '12px', textAlign: 'center',
                            background: b.bg, border: `1px solid ${b.border}`, cursor: 'pointer',
                            transition: 'all 0.25s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                          <div style={{fontSize: '28px', marginBottom: '8px'}}>{b.icon}</div>
                          <div style={{fontFamily: "'Orbitron', sans-serif", fontWeight: '900', fontSize: '11px', color: 'white', marginBottom: '4px', letterSpacing: '1px'}}>{b.title}</div>
                          <div style={{fontSize: '11px', color: '#4b5563', marginBottom: '10px'}}>{b.sub}</div>
                          <div style={{padding: '4px 8px', borderRadius: '6px', background: b.badgeBg, color: b.badgeColor, fontFamily: "'Orbitron', sans-serif", fontSize: '8px', letterSpacing: '2px'}}>{b.badge}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div style={{marginBottom: '20px', padding: '16px', borderRadius: '10px', background: '#080812', border: `1px solid ${g.color}20`}}>
                      <button onClick={() => setStatMode(p => ({...p, [activeStatGame]: null}))}
                        style={{background: 'none', border: 'none', color: '#6b7280', fontWeight: '700', fontSize: '12px', cursor: 'pointer', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                        ← BACK TO OPTIONS
                      </button>

                      {mode === 'uid' && (
                        <div>
                          <label style={{display: 'block', fontFamily: "'Orbitron', sans-serif", fontSize: '9px', color: g.color + 'aa', letterSpacing: '3px', marginBottom: '8px'}}>ENTER UID</label>
                          <div style={{display: 'flex', gap: '8px'}}>
                            <input
                              value={uidInputs[activeStatGame] || ''}
                              onChange={e => setUidInputs(p => ({...p, [activeStatGame]: e.target.value}))}
                              onKeyDown={e => e.key === 'Enter' && fetchByUID(activeStatGame)}
                              placeholder="Enter your UID..."
                              style={{flex: 1, background: '#050510', border: `1px solid ${g.color}30`, borderRadius: '8px', color: 'white', padding: '10px 14px', fontFamily: "'Rajdhani', sans-serif", fontSize: '14px', outline: 'none'}}
                            />
                            <button onClick={() => fetchByUID(activeStatGame)} disabled={uidLoading[activeStatGame]}
                              style={{padding: '10px 16px', borderRadius: '8px', background: g.color, border: 'none', color: 'white', fontFamily: "'Orbitron', sans-serif", fontWeight: '900', fontSize: '11px', cursor: 'pointer', boxShadow: `0 0 15px ${g.color}50`}}>
                              {uidLoading[activeStatGame] ? '⟳' : '🔍 FETCH'}
                            </button>
                          </div>
                        </div>
                      )}

                      {mode === 'ocr' && (
                        <div>
                          <label style={{display: 'block', fontFamily: "'Orbitron', sans-serif", fontSize: '9px', color: '#6366f1aa', letterSpacing: '3px', marginBottom: '8px'}}>UPLOAD SCREENSHOT</label>
                          <input ref={fileRef} type="file" accept="image/*" style={{display: 'none'}}
                            onChange={async e => { if (e.target.files[0]) await handleOCR(e.target.files[0], activeStatGame); }}/>
                          <label onClick={() => fileRef.current?.click()}
                            style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', borderRadius: '10px', background: '#050510', border: '2px dashed rgba(99,102,241,0.3)', cursor: 'pointer'}}>
                            {ocrLoading
                              ? <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
                                  <div style={{width: '32px', height: '32px', border: '2px solid rgba(99,102,241,0.2)', borderTop: '2px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite'}}/>
                                  <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: '#6366f1', letterSpacing: '2px'}}>SCANNING...</span>
                                </div>
                              : <>
                                  <div style={{fontSize: '32px', marginBottom: '8px'}}>📲</div>
                                  <div style={{fontFamily: "'Orbitron', sans-serif", fontWeight: '900', fontSize: '11px', color: 'white', marginBottom: '4px'}}>TAP TO UPLOAD</div>
                                  <div style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: '#4b5563'}}>// stats auto extracted via OCR</div>
                                </>
                            }
                            {ocrResult?.game === activeStatGame && !ocrLoading && (
                              <div style={{marginTop: '10px', fontFamily: "'Orbitron', sans-serif", fontSize: '9px', color: '#10b981', letterSpacing: '2px'}}>✓ {Object.keys(ocrResult.parsed).length} STATS EXTRACTED!</div>
                            )}
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Stats grid */}
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px'}}>
                    {Object.entries(STAT_LABELS).map(([key, label]) => (
                      <div key={key} style={{borderRadius: '8px', padding: '10px', background: '#080812', border: `1px solid ${g.color}15`, position: 'relative', overflow: 'hidden'}}>
                        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${g.color}40, transparent)`}}/>
                        <label style={{display: 'block', fontFamily: "'Orbitron', sans-serif", fontSize: '8px', fontWeight: '900', color: g.color + '80', letterSpacing: '2px', marginBottom: '6px'}}>{label}</label>
                        <input
                          placeholder="—"
                          value={statsData[activeStatGame]?.[key] || ''}
                          onChange={e => setStatsData(prev => ({...prev, [activeStatGame]: {...prev[activeStatGame], [key]: e.target.value}}))}
                          style={{width: '100%', background: 'transparent', border: 'none', color: 'white', fontFamily: "'Rajdhani', sans-serif", fontWeight: '700', fontSize: '14px', outline: 'none', boxSizing: 'border-box'}}
                        />
                      </div>
                    ))}
                  </div>

                  <button onClick={() => saveStats(activeStatGame)} disabled={saving}
                    style={{
                      width: '100%', padding: '12px',
                      background: `linear-gradient(135deg, ${g.color}, ${g.color}bb)`,
                      border: 'none', borderRadius: '10px', color: 'white',
                      fontFamily: "'Orbitron', sans-serif", fontWeight: '900', fontSize: '11px',
                      letterSpacing: '3px', cursor: 'pointer',
                      boxShadow: `0 0 25px ${g.color}40`, transition: 'all 0.3s'
                    }}>
                    {saving ? '⟳ SAVING...' : `💾 SAVE ${activeStatGame.toUpperCase()} STATS`}
                  </button>
                </TiltCard>
              );
            })()}

            <div style={{display: 'flex', gap: '12px'}}>
              <button onClick={() => setStep(2)}
                style={{padding: '12px 24px', background: '#080812', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#ef4444', fontFamily: "'Orbitron', sans-serif", fontWeight: '700', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer'}}>
                ← BACK
              </button>
              <button onClick={() => router.push(`/profile/${localStorage.getItem('userId')}`)}
                style={{
                  flex: 1, padding: '14px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none', borderRadius: '10px', color: 'white',
                  fontFamily: "'Orbitron', sans-serif", fontWeight: '900', fontSize: '12px',
                  letterSpacing: '3px', cursor: 'pointer',
                  boxShadow: '0 0 25px rgba(16,185,129,0.4)', transition: 'all 0.3s'
                }}>
                ✓ VIEW MY PROFILE →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
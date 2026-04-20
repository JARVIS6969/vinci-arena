'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ── Floating particle field ───────────────────────────────────────────────────
function ParticleField() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    let W = c.width = window.innerWidth;
    let H = c.height = window.innerHeight;
    const onResize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    window.addEventListener('resize', onResize);

    const COLS = ['#ef4444','#00ffff','#a855f7','#fbbf24'];
    const pts = Array.from({length: 55}, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.3 + 0.4,
      col: COLS[Math.floor(Math.random() * COLS.length)],
      phase: Math.random() * Math.PI * 2,
      freq: 0.018 + Math.random() * 0.025,
    }));

    let frame = 0, raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, W, H);
      frame++;
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const alpha = 0.25 + 0.5 * Math.abs(Math.sin(frame * p.freq + p.phase));
        // glow halo
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        g.addColorStop(0, p.col + 'aa'); g.addColorStop(1, p.col + '00');
        ctx.globalAlpha = alpha * 0.35;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
        // core dot
        ctx.globalAlpha = alpha;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col; ctx.fill();
        ctx.globalAlpha = 1;
      });
      // connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = pts[i].col;
            ctx.globalAlpha = (1 - d / 100) * 0.07;
            ctx.lineWidth = 0.6; ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={ref} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }} />;
}

// ── Game selector card ────────────────────────────────────────────────────────
const GAMES = [
  { id:'Free Fire', icon:'🔥', color:'#ef4444', shadow:'rgba(239,68,68,0.5)', desc:'Battle Royale · India #1' },
  { id:'BGMI',      icon:'🎯', color:'#f97316', shadow:'rgba(249,115,22,0.5)',  desc:'Battle Royale · Tactical' },
  { id:'Valorant',  icon:'⚡', color:'#818cf8', shadow:'rgba(129,140,248,0.5)', desc:'Tactical FPS · 5v5' },
];

const REGIONS = ['India','Global','Asia','Europe','Americas'];

export default function CreateSquadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name:'', tag:'', bio:'', game:'Free Fire', region:'India' });
  const [focusedField, setFocusedField] = useState(null);
  const [scanY, setScanY] = useState(20);

  // scan line
  useEffect(() => {
    let raf;
    const animate = () => { setScanY(y => (y + 0.22) % 100); raf = requestAnimationFrame(animate); };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const activeGame = GAMES.find(g => g.id === form.game);
  const ac = activeGame?.color || '#ef4444';
  const asg = activeGame?.shadow || 'rgba(239,68,68,0.4)';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Squad name is required'); return; }
    setError(''); setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }
      const res = await fetch('http://localhost:3001/api/squads', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) router.push(`/squads/${data.id}`);
      else setError(data.error || 'Failed to create squad');
    } catch { setError('Connection error. Try again.'); }
    finally { setLoading(false); }
  };

  const inputStyle = (field) => ({
    width: '100%',
    background: focusedField === field ? 'rgba(8,8,18,0.95)' : 'rgba(5,5,16,0.8)',
    border: `1px solid ${focusedField === field ? ac : 'rgba(255,255,255,0.07)'}`,
    borderRadius: 10,
    color: '#f1f5f9',
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
    fontSize: 15,
    padding: '13px 16px',
    outline: 'none',
    transition: 'all 0.25s',
    boxShadow: focusedField === field ? `0 0 0 1px ${ac}30, 0 0 20px ${ac}12` : 'none',
    boxSizing: 'border-box',
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#040410',
      color: '#f1f5f9',
      paddingTop: 104,
      paddingBottom: 80,
      fontFamily: "'Rajdhani', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;900&family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0%,100% { box-shadow: 0 0 0 0 ${ac}00; }
          50%      { box-shadow: 0 0 0 6px ${ac}18; }
        }
        @keyframes neonFlicker {
          0%,92%,100% { opacity: 1; }
          94% { opacity: 0.6; }
          96% { opacity: 1; }
          98% { opacity: 0.7; }
        }
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #1e293b; }
        select option { background: #040410; }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-thumb { background: ${ac}; border-radius: 2px; }
        .field-label {
          display: block;
          font-family: 'Orbitron', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.2);
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .game-card {
          transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
          cursor: pointer;
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          overflow: hidden;
        }
        .game-card:hover { transform: translateY(-2px); }
        .submit-btn {
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .submit-btn:not(:disabled):hover {
          transform: translateY(-2px);
          filter: brightness(1.15);
        }
        .submit-btn:not(:disabled):active {
          transform: scale(0.98);
        }
      `}</style>

      <ParticleField />

      {/* Subtle grid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(0,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.018) 1px,transparent 1px)',
        backgroundSize: '48px 48px',
      }}/>

      {/* Ambient glow behind form */}
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse, ${ac}08 0%, transparent 70%)`,
        transition: 'background 0.4s',
      }}/>

      {/* Scan line */}
      <div style={{
        position: 'fixed', top: `${scanY}%`, left: 0, right: 0,
        height: '1px', pointerEvents: 'none', zIndex: 1,
        background: `linear-gradient(90deg, transparent, ${ac}18, rgba(0,255,255,0.12), ${ac}18, transparent)`,
      }}/>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>

        {/* ── Page Title ── */}
        <div style={{ marginBottom: 36, animation: 'fadeSlideUp 0.5s ease both' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <div style={{ width:28, height:1, background:`linear-gradient(90deg,transparent,${ac})` }}/>
            <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:ac, letterSpacing:4, opacity:0.7 }}>// SQUAD FORMATION</span>
          </div>
          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 32, fontWeight: 900, margin: 0,
            color: '#fff', letterSpacing: 1,
            textShadow: `0 0 40px ${ac}50, 0 0 80px ${ac}20`,
            animation: 'neonFlicker 6s infinite',
            transition: 'text-shadow 0.4s',
          }}>
            Build Your Squad
          </h1>
          <p style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:'#334155', marginTop:8, letterSpacing:1 }}>
            Choose your game · Name your team · Dominate
          </p>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            padding: '12px 18px', borderRadius: 10, marginBottom: 20,
            background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.3)',
            fontSize: 13, color: '#ef4444', fontFamily:"'Share Tech Mono',monospace",
            animation: 'fadeSlideUp 0.3s ease',
          }}>⚠ {error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:0 }}>

          {/* ── GAME SELECTOR — top, most impactful ── */}
          <div style={{
            background: 'rgba(8,8,20,0.8)',
            border: `1px solid ${ac}20`,
            borderRadius: 16, padding: 22, marginBottom: 16,
            position: 'relative', overflow: 'hidden',
            animation: 'fadeSlideUp 0.5s ease 0.05s both',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'1.5px', background:`linear-gradient(90deg,transparent,${ac},rgba(0,255,255,0.6),${ac},transparent)`, transition:'background 0.4s' }}/>
            {/* corner brackets */}
            {[['top:8px','left:8px','borderTop','borderLeft'],['top:8px','right:8px','borderTop','borderRight']].map(([t,s,b1,b2],i)=>(
              <div key={i} style={{position:'absolute',[t.split(':')[0]]:t.split(':')[1],[s.split(':')[0]]:s.split(':')[1],width:14,height:14,[b1]:`1.5px solid ${ac}70`,[b2]:`1.5px solid ${ac}70`}}/>
            ))}
            <label className="field-label" style={{ marginBottom:14 }}>Select Game</label>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {GAMES.map(g => {
                const sel = form.game === g.id;
                return (
                  <div key={g.id} className="game-card"
                    onClick={() => setForm(p => ({...p, game:g.id}))}
                    style={{
                      background: sel ? `${g.color}12` : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${sel ? g.color + '60' : 'rgba(255,255,255,0.06)'}`,
                      boxShadow: sel ? `0 0 24px ${g.shadow}20, inset 0 0 20px ${g.color}05` : 'none',
                    }}>
                    {/* left colored bar */}
                    <div style={{ position:'absolute', left:0, top:0, bottom:0, width:2, background:sel?g.color:'transparent', borderRadius:'2px 0 0 2px', transition:'background 0.2s' }}/>
                    <span style={{ fontSize:22, filter:sel?`drop-shadow(0 0 8px ${g.color})`:'', transition:'filter 0.2s', flexShrink:0 }}>{g.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:12, fontWeight:700, color:sel?g.color:'#94a3b8', letterSpacing:1, transition:'color 0.2s' }}>{g.id}</div>
                      <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'#334155', marginTop:2 }}>{g.desc}</div>
                    </div>
                    {sel && (
                      <div style={{ width:20, height:20, borderRadius:'50%', background:g.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, flexShrink:0, boxShadow:`0 0 12px ${g.shadow}` }}>✓</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── NAME + TAG ROW ── */}
          <div style={{
            background: 'rgba(8,8,20,0.8)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16, padding: 22, marginBottom: 16,
            position: 'relative', overflow:'hidden',
            animation: 'fadeSlideUp 0.5s ease 0.1s both',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:`linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)` }}/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 140px', gap:16 }}>
              <div>
                <label className="field-label">Squad Name *</label>
                <input
                  placeholder="e.g. VORTEX XTREME"
                  value={form.name}
                  onChange={e => setForm(p=>({...p,name:e.target.value}))}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle('name')}
                  required
                />
              </div>
              <div>
                <label className="field-label">Tag (5 max)</label>
                <input
                  placeholder="VXRT"
                  value={form.tag}
                  onChange={e => setForm(p=>({...p,tag:e.target.value.toUpperCase().slice(0,5)}))}
                  onFocus={() => setFocusedField('tag')}
                  onBlur={() => setFocusedField(null)}
                  maxLength={5}
                  style={{...inputStyle('tag'), textAlign:'center', letterSpacing:3, fontFamily:"'Orbitron',sans-serif", fontSize:13, fontWeight:700}}
                />
              </div>
            </div>
          </div>

          {/* ── BIO + REGION ROW ── */}
          <div style={{
            background: 'rgba(8,8,20,0.8)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16, padding: 22, marginBottom: 20,
            position: 'relative', overflow:'hidden',
            animation: 'fadeSlideUp 0.5s ease 0.15s both',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:`linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)` }}/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 160px', gap:16 }}>
              <div>
                <label className="field-label">Bio (optional)</label>
                <textarea
                  placeholder="Tell the world about your squad — playstyle, goals, scrim schedule..."
                  value={form.bio}
                  onChange={e => setForm(p=>({...p,bio:e.target.value}))}
                  onFocus={() => setFocusedField('bio')}
                  onBlur={() => setFocusedField(null)}
                  rows={4}
                  style={{...inputStyle('bio'), resize:'vertical', lineHeight:1.6}}
                />
              </div>
              <div>
                <label className="field-label">Region *</label>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {REGIONS.map(r => {
                    const sel = form.region === r;
                    return (
                      <div key={r} onClick={()=>setForm(p=>({...p,region:r}))}
                        style={{
                          padding:'8px 12px', borderRadius:8, cursor:'pointer',
                          background: sel?`${ac}12`:'rgba(255,255,255,0.02)',
                          border:`1px solid ${sel?ac+'50':'rgba(255,255,255,0.05)'}`,
                          fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                          color:sel?ac:'#475569', transition:'all 0.15s',
                          display:'flex', alignItems:'center', justifyContent:'space-between',
                        }}>
                        {r}
                        {sel&&<span style={{fontSize:9,color:ac}}>✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── SUBMIT ── */}
          <div style={{ animation: 'fadeSlideUp 0.5s ease 0.2s both' }}>
            <button type="submit" disabled={loading || !form.name.trim()} className="submit-btn"
              style={{
                width: '100%', padding: '16px 0', borderRadius: 12,
                fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: 13, letterSpacing: 2,
                cursor: form.name.trim() && !loading ? 'pointer' : 'not-allowed',
                border: 'none',
                background: form.name.trim()
                  ? `linear-gradient(135deg, ${ac} 0%, ${ac}cc 50%, rgba(0,255,255,0.6) 100%)`
                  : 'rgba(255,255,255,0.04)',
                color: form.name.trim() ? '#fff' : '#1e293b',
                boxShadow: form.name.trim() ? `0 0 40px ${asg}40, 0 8px 32px ${asg}20` : 'none',
                transition: 'all 0.3s',
                animation: form.name.trim() ? 'pulseRing 3s infinite' : 'none',
              }}>
              {loading ? (
                <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12 }}>
                  <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.25)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'inline-block' }}/>
                  FORMING SQUAD...
                </span>
              ) : form.name.trim() ? `⚡ CREATE ${form.name.toUpperCase()}` : 'ENTER SQUAD NAME FIRST'}
            </button>

            {/* Info strip */}
            <div style={{ display:'flex', gap:20, justifyContent:'center', marginTop:14, flexWrap:'wrap' }}>
              {['You become leader','Max 7 members','Apply system built-in'].map((t,i) => (
                <span key={i} style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'#1e293b', display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ color:`${ac}50`, fontSize:8 }}>●</span>{t}
                </span>
              ))}
            </div>

            <div style={{ textAlign:'center', marginTop:16 }}>
              <button type="button" onClick={()=>router.push('/squads')} style={{ background:'none', border:'none', color:'#1e293b', fontFamily:"'Share Tech Mono',monospace", fontSize:10, cursor:'pointer', letterSpacing:1, transition:'color 0.2s' }}
                onMouseEnter={e=>e.target.style.color='#475569'}
                onMouseLeave={e=>e.target.style.color='#1e293b'}>
                ← Back to Squads
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
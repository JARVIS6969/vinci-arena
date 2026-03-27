'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const GAME_CONFIG = {
  'Free Fire': { icon: '🔥', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
  'BGMI':      { icon: '🎯', color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)' },
  'Valorant':  { icon: '⚡', color: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.25)' },
};

const ACH_TYPE_CONFIG = {
  tournament_win: { icon: '🏆', color: '#fbbf24', label: 'TOURNAMENT WIN' },
  milestone:      { icon: '⭐', color: '#a78bfa', label: 'MILESTONE'      },
  rank:           { icon: '🎖️', color: '#22d3ee', label: 'RANK'           },
  special:        { icon: '💎', color: '#10b981', label: 'SPECIAL'        },
};

export default function AchievementsPage() {
  const router = useRouter();
  const params = useParams();
  const [profile, setProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', achievement_type: 'tournament_win',
    date_achieved: '', game: 'Free Fire', image_url: '', certificate_url: ''
  });

  useEffect(() => {
    setCurrentUserId(localStorage.getItem('userId') || '');
    fetchAll();
  }, [params.userId]);

  const fetchAll = async () => {
    try {
      const token = localStorage.getItem('token');
      const h = { Authorization: `Bearer ${token}` };
      const [pR, tR] = await Promise.all([
        fetch(`http://localhost:3001/api/profiles/user/${params.userId}`, { headers: h }),
        fetch(`http://localhost:3001/api/tournaments`, { headers: h }),
      ]);
      if (pR.ok) {
        const p = await pR.json();
        setProfile(p);
        setAchievements(p?.achievements || []);
      }
      if (tR.ok) setTournaments(await tR.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/profiles/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowAddForm(false);
        setForm({ title:'', description:'', achievement_type:'tournament_win', date_achieved:'', game:'Free Fire', image_url:'', certificate_url:'' });
        fetchAll();
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const isOwner = currentUserId && String(currentUserId) === String(params.userId);
  const filtered = activeFilter === 'all' ? achievements : achievements.filter(a => a.achievement_type === activeFilter);

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#07070f', display:'flex', alignItems:'center', justifyContent:'center', paddingTop:'166px' }}>
      <div style={{ color:'#ef4444', fontFamily:"'Orbitron',sans-serif", fontSize:'12px', letterSpacing:'3px' }}>LOADING...</div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#07070f', color:'#fff', fontFamily:"'Rajdhani',sans-serif", paddingTop:'166px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#ef4444}
        @keyframes scan{0%{top:-2px;opacity:0}5%{opacity:.07}95%{opacity:.04}100%{top:100%;opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes shine{0%,100%{transform:translateX(-100%)}50%{transform:translateX(200%)}}
        .scan-fx{position:absolute;left:0;right:0;height:1px;pointer-events:none;z-index:10;
          background:linear-gradient(90deg,transparent,rgba(239,68,68,.6),rgba(0,255,255,.3),transparent);
          animation:scan 7s linear infinite}
        .fu{animation:fadeUp .5s ease both}
        .grid-bg{background-image:linear-gradient(rgba(239,68,68,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(239,68,68,.04) 1px,transparent 1px);background-size:44px 44px}
        .ach-card{transition:all .3s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden;cursor:default}
        .ach-card:hover{transform:translateY(-4px)}
        .ach-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent,var(--ac),transparent);opacity:0;transition:opacity .3s}
        .ach-card:hover::before{opacity:1}
        .filter-btn{transition:all .2s;cursor:pointer;border:none}
        .filter-btn:hover{transform:translateY(-1px)}
        .tourn-row{transition:all .2s;cursor:pointer;border-radius:10px}
        .tourn-row:hover{transform:translateX(4px);background:rgba(251,191,36,0.08)!important}
        .c{position:absolute;width:11px;height:11px;border-style:solid;pointer-events:none}
        .tl{top:6px;left:6px;border-width:2px 0 0 2px}
        .tr{top:6px;right:6px;border-width:2px 2px 0 0}
        .bl{bottom:6px;left:6px;border-width:0 0 2px 2px}
        .br{bottom:6px;right:6px;border-width:0 2px 2px 0}
        .neon-input{background:#0a0a0a;border:1px solid rgba(239,68,68,0.25);border-radius:8px;color:white;font-family:'Rajdhani';font-weight:600;font-size:14px;padding:10px 14px;width:100%;outline:none;transition:all 0.2s}
        .neon-input:focus{border-color:rgba(239,68,68,0.6);box-shadow:0 0 12px rgba(239,68,68,0.15)}
        .neon-input::placeholder{color:#2a2a2a}
        .neon-select{background:#0a0a0a;border:1px solid rgba(239,68,68,0.25);border-radius:8px;color:white;font-family:'Rajdhani';font-weight:700;font-size:14px;padding:10px 14px;width:100%;outline:none}
      `}</style>

      <div className="grid-bg" style={{ minHeight:'100vh' }}>

        {/* ── HEADER ── */}
        <div style={{ position:'relative', padding:'24px 24px 0', maxWidth:'1280px', margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
              <button onClick={() => router.push(`/profile/${params.userId}`)}
                style={{ background:'rgba(0,0,0,0.6)', border:'1px solid rgba(239,68,68,0.3)', color:'#ef4444', padding:'7px 16px', borderRadius:'8px', fontFamily:"'Orbitron',monospace", fontSize:'10px', letterSpacing:'2px', cursor:'pointer' }}>
                ← BACK
              </button>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
                  <span style={{ fontSize:'28px' }}>🏆</span>
                  <h1 style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:'24px', textShadow:'0 0 30px rgba(251,191,36,0.5)', margin:0, letterSpacing:'2px' }}>
                    ACHIEVEMENTS
                  </h1>
                </div>
                {profile?.display_name && (
                  <p style={{ fontFamily:"'Orbitron',monospace", fontSize:'10px', color:'rgba(255,255,255,0.4)', letterSpacing:'2px', margin:0 }}>
                    {profile.display_name.toUpperCase()} · {achievements.length} TOTAL
                  </p>
                )}
              </div>
            </div>

            {isOwner && (
              <button onClick={() => setShowAddForm(true)}
                style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:'10px', letterSpacing:'2px', padding:'10px 22px', borderRadius:'10px', background:'linear-gradient(135deg,#fbbf24,#f59e0b)', color:'#000', border:'none', cursor:'pointer', boxShadow:'0 0 25px rgba(251,191,36,0.5)' }}>
                + ADD ACHIEVEMENT
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'24px' }}>
            {[
              { id:'all',           label:'ALL',           color:'#fff',    count: achievements.length },
              { id:'tournament_win',label:'🏆 WINS',       color:'#fbbf24', count: achievements.filter(a=>a.achievement_type==='tournament_win').length },
              { id:'milestone',     label:'⭐ MILESTONE',  color:'#a78bfa', count: achievements.filter(a=>a.achievement_type==='milestone').length },
              { id:'rank',          label:'🎖️ RANK',       color:'#22d3ee', count: achievements.filter(a=>a.achievement_type==='rank').length },
              { id:'special',       label:'💎 SPECIAL',    color:'#10b981', count: achievements.filter(a=>a.achievement_type==='special').length },
            ].map(f => (
              <button key={f.id} className="filter-btn" onClick={() => setActiveFilter(f.id)}
                style={{ padding:'7px 16px', fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:'9px', letterSpacing:'1px', borderRadius:'8px', background:activeFilter===f.id?`${f.color}18`:'rgba(255,255,255,0.04)', border:`1px solid ${activeFilter===f.id?f.color:'rgba(255,255,255,0.07)'}`, color:activeFilter===f.id?f.color:'#6b7280', boxShadow:activeFilter===f.id?`0 0 15px ${f.color}30`:'none' }}>
                {f.label} <span style={{ opacity:.6 }}>({f.count})</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 24px 48px' }}>

          {/* ── ACHIEVEMENTS GRID ── */}
          {filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 20px', border:'1px dashed rgba(251,191,36,0.15)', borderRadius:'20px' }}>
              <div style={{ fontSize:'60px', marginBottom:'16px', opacity:.4 }}>🏆</div>
              <p style={{ fontFamily:"'Orbitron',monospace", color:'#374151', fontSize:'12px', letterSpacing:'3px', marginBottom:'8px' }}>NO ACHIEVEMENTS YET</p>
              <p style={{ color:'#4b5563', fontSize:'13px', fontWeight:600 }}>Start competing to earn your first achievement!</p>
              {isOwner && (
                <button onClick={() => setShowAddForm(true)} style={{ marginTop:'20px', fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:'10px', letterSpacing:'2px', padding:'10px 22px', borderRadius:'10px', background:'linear-gradient(135deg,#fbbf24,#f59e0b)', color:'#000', border:'none', cursor:'pointer' }}>
                  + ADD FIRST ACHIEVEMENT
                </button>
              )}
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'16px' }}>
              {filtered.map((a, i) => {
                const tc = ACH_TYPE_CONFIG[a.achievement_type] || ACH_TYPE_CONFIG.special;
                const gc = GAME_CONFIG[a.game];
                return (
                  <div key={i} className="ach-card fu" style={{'--ac': tc.color, animationDelay:`${i*60}ms`, padding:'20px', borderRadius:'16px', background:'#050505', border:`1px solid ${tc.color}20`}}>
                    <div className="scan-fx"/>
                    <div className="c tl" style={{borderColor:tc.color}}/><div className="c br" style={{borderColor:`${tc.color}60`}}/>

                    {/* Achievement image */}
                    {a.image_url ? (
                      <div style={{ height:'160px', borderRadius:'10px', overflow:'hidden', marginBottom:'14px', border:`1px solid ${tc.color}20` }}>
                        <img src={a.image_url} alt={a.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      </div>
                    ) : (
                      <div style={{ height:'120px', borderRadius:'10px', marginBottom:'14px', display:'flex', alignItems:'center', justifyContent:'center', background:`linear-gradient(135deg,${tc.color}12,${tc.color}06)`, border:`1px solid ${tc.color}20` }}>
                        <span style={{ fontSize:'52px', filter:`drop-shadow(0 0 15px ${tc.color})` }}>{tc.icon}</span>
                      </div>
                    )}

                    {/* Type + game badges */}
                    <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'10px' }}>
                      <span style={{ fontFamily:"'Orbitron',monospace", fontSize:'8px', fontWeight:900, padding:'3px 10px', borderRadius:'99px', background:`${tc.color}18`, border:`1px solid ${tc.color}35`, color:tc.color }}>
                        {tc.icon} {tc.label}
                      </span>
                      {gc && (
                        <span style={{ fontFamily:"'Orbitron',monospace", fontSize:'8px', fontWeight:900, padding:'3px 10px', borderRadius:'99px', background:gc.bg, border:`1px solid ${gc.border}`, color:gc.color }}>
                          {gc.icon} {a.game}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:'14px', color:'#fff', marginBottom:'8px', textShadow:`0 0 15px ${tc.color}40` }}>{a.title}</h3>

                    {/* Description */}
                    {a.description && (
                      <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'12px', lineHeight:1.6, fontWeight:600, marginBottom:'12px' }}>{a.description}</p>
                    )}

                    {/* Footer */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto', paddingTop:'10px', borderTop:`1px solid ${tc.color}15` }}>
                      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'11px', color:'#4b5563' }}>
                        {a.date_achieved ? new Date(a.date_achieved).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}) : '—'}
                      </span>
                      {a.certificate_url && (
                        <a href={a.certificate_url} target="_blank" rel="noreferrer"
                          style={{ fontFamily:"'Orbitron',monospace", fontSize:'8px', fontWeight:900, padding:'4px 12px', borderRadius:'6px', background:`${tc.color}18`, border:`1px solid ${tc.color}35`, color:tc.color, textDecoration:'none' }}>
                          📜 CERT
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── TOURNAMENTS SECTION ── */}
          {tournaments.length > 0 && (
            <div style={{ marginTop:'40px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
                <div style={{ flex:1, height:'1px', background:'linear-gradient(90deg,rgba(251,191,36,0.4),transparent)' }}/>
                <p style={{ fontFamily:"'Orbitron',monospace", fontSize:'10px', fontWeight:900, color:'rgba(251,191,36,0.7)', letterSpacing:'3px' }}>//  TOURNAMENT HISTORY</p>
                <div style={{ flex:1, height:'1px', background:'linear-gradient(90deg,transparent,rgba(251,191,36,0.4))' }}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'10px' }}>
                {tournaments.map((t, i) => {
                  const gc = GAME_CONFIG[t.game];
                  return (
                    <div key={t.id} className="tourn-row fu" style={{ animationDelay:`${i*40}ms`, display:'flex', alignItems:'center', gap:'12px', padding:'12px 14px', background:'#050505', border:'1px solid rgba(251,191,36,0.15)' }}
                      onClick={() => router.push(`/tournaments/${t.id}`)}>
                      <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:'rgba(251,191,36,0.12)', border:'1px solid rgba(251,191,36,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>🏆</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontWeight:900, fontSize:'13px', color:'#fff', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.name}</p>
                        <div style={{ display:'flex', gap:'8px', marginTop:'3px' }}>
                          {gc && <span style={{ fontSize:'10px', fontWeight:700, color:gc.color }}>{gc.icon} {t.game}</span>}
                          <span style={{ fontSize:'10px', color:'#4b5563' }}>{new Date(t.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span style={{ color:'#374151', fontSize:'16px' }}>›</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── ADD ACHIEVEMENT MODAL ── */}
      {showAddForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>
          <div style={{ background:'#050505', border:'1px solid rgba(251,191,36,0.3)', borderRadius:'20px', padding:'28px', maxWidth:'560px', width:'100%', maxHeight:'90vh', overflowY:'auto', position:'relative' }}>
            <div className="scan-fx"/>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:'16px', color:'#fff', margin:0 }}>ADD ACHIEVEMENT</h2>
              <button onClick={() => setShowAddForm(false)} style={{ background:'none', border:'none', color:'#6b7280', fontSize:'20px', cursor:'pointer', lineHeight:1 }}>✕</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              <div>
                <label style={{ fontFamily:"'Orbitron',monospace", fontSize:'9px', color:'#6b7280', letterSpacing:'2px', display:'block', marginBottom:'6px' }}>TITLE *</label>
                <input className="neon-input" placeholder="e.g. 1st Place - Summer Championship" value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} />
              </div>
              <div>
                <label style={{ fontFamily:"'Orbitron',monospace", fontSize:'9px', color:'#6b7280', letterSpacing:'2px', display:'block', marginBottom:'6px' }}>DESCRIPTION</label>
                <textarea className="neon-input" rows={3} placeholder="Describe your achievement..." value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} style={{ resize:'none' }}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div>
                  <label style={{ fontFamily:"'Orbitron',monospace", fontSize:'9px', color:'#6b7280', letterSpacing:'2px', display:'block', marginBottom:'6px' }}>TYPE</label>
                  <select className="neon-select" value={form.achievement_type} onChange={e => setForm(p=>({...p,achievement_type:e.target.value}))}>
                    <option value="tournament_win">Tournament Win</option>
                    <option value="milestone">Milestone</option>
                    <option value="rank">Rank Achievement</option>
                    <option value="special">Special</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily:"'Orbitron',monospace", fontSize:'9px', color:'#6b7280', letterSpacing:'2px', display:'block', marginBottom:'6px' }}>GAME</label>
                  <select className="neon-select" value={form.game} onChange={e => setForm(p=>({...p,game:e.target.value}))}>
                    <option>Free Fire</option>
                    <option>BGMI</option>
                    <option>Valorant</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontFamily:"'Orbitron',monospace", fontSize:'9px', color:'#6b7280', letterSpacing:'2px', display:'block', marginBottom:'6px' }}>DATE ACHIEVED *</label>
                <input type="date" className="neon-input" value={form.date_achieved} onChange={e => setForm(p=>({...p,date_achieved:e.target.value}))} />
              </div>
              <div>
                <label style={{ fontFamily:"'Orbitron',monospace", fontSize:'9px', color:'#6b7280', letterSpacing:'2px', display:'block', marginBottom:'6px' }}>IMAGE URL (optional)</label>
                <input className="neon-input" placeholder="https://..." value={form.image_url} onChange={e => setForm(p=>({...p,image_url:e.target.value}))} />
              </div>
              <div>
                <label style={{ fontFamily:"'Orbitron',monospace", fontSize:'9px', color:'#6b7280', letterSpacing:'2px', display:'block', marginBottom:'6px' }}>CERTIFICATE URL (optional)</label>
                <input className="neon-input" placeholder="https://..." value={form.certificate_url} onChange={e => setForm(p=>({...p,certificate_url:e.target.value}))} />
              </div>
              <div style={{ display:'flex', gap:'10px', marginTop:'6px' }}>
                <button onClick={handleSubmit} disabled={saving || !form.title.trim() || !form.date_achieved}
                  style={{ flex:1, padding:'12px', borderRadius:'10px', fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:'11px', letterSpacing:'2px', background:'linear-gradient(135deg,#fbbf24,#f59e0b)', color:'#000', border:'none', cursor:'pointer', boxShadow:'0 0 20px rgba(251,191,36,0.4)', opacity: saving||!form.title.trim()||!form.date_achieved ? 0.5 : 1 }}>
                  {saving ? '⟳ SAVING...' : '💾 SAVE ACHIEVEMENT'}
                </button>
                <button onClick={() => setShowAddForm(false)}
                  style={{ padding:'12px 20px', borderRadius:'10px', fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:'11px', background:'#0a0a0a', border:'1px solid rgba(255,255,255,0.1)', color:'#6b7280', cursor:'pointer' }}>
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

const C = {
  red:'#ef4444', cyan:'#00ffff', purple:'#a855f7',
  gold:'#fbbf24', green:'#00ff88', orange:'#f97316',
  bg:'#050510', card:'#0a0a1a', card2:'#0d0d20',
};

function ScanLine() {
  const [y, setY] = useState(0);
  useEffect(() => { const id = setInterval(() => setY(p => (p + 0.4) % 110), 20); return () => clearInterval(id); }, []);
  return <div style={{ position:'fixed', top:`${y}%`, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent,rgba(0,255,255,0.13),rgba(239,68,68,0.18),transparent)', zIndex:1, pointerEvents:'none' }}/>;
}

export default function SquadApplyPage() {
  const router = useRouter();
  const params = useParams();
  const squadId = params.id;

  const [squad, setSquad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [focused, setFocused] = useState(false);

  useEffect(() => { fetchSquad(); }, [squadId]);

  const fetchSquad = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }
      const res = await fetch(`http://localhost:3001/api/squads/${squadId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setSquad(await res.json());
      else router.push('/squads');
    } catch { router.push('/squads'); }
    finally { setLoading(false); }
  };

  const handleApply = async () => {
    setError('');
    if (!message.trim()) { setError('Write a short message about yourself first.'); return; }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/squads/${squadId}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to send request'); return; }
      setDone(true);
    } catch { setError('Something went wrong. Try again.'); }
    finally { setSubmitting(false); }
  };

  const gameColors = { 'Free Fire': C.red, 'BGMI': C.orange, 'Valorant': '#6366f1' };
  const gameColor = gameColors[squad?.game] || C.purple;
  const activeMembers = squad?.squad_members?.filter(m => m.is_active) || [];
  const openSlots = Math.max(0, 7 - activeMembers.length);

  if (loading) return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', paddingTop:104 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:40, height:40, border:`2px solid rgba(239,68,68,0.2)`, borderTopColor:C.red, borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:C.bg, color:'#e2e8f0', paddingTop:104, paddingBottom:60, position:'relative', fontFamily:"'Rajdhani',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@500;600&family=Share+Tech+Mono&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        *{box-sizing:border-box}
        textarea::placeholder{color:#1e293b}
      `}</style>

      <ScanLine />

      {/* Cyber grid */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(0,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,255,0.025) 1px,transparent 1px)', backgroundSize:'40px 40px' }}/>

      <div style={{ maxWidth:560, margin:'0 auto', padding:'0 20px', position:'relative', zIndex:2 }}>

        {/* Back button */}
        <button onClick={() => router.push(`/squads/${squadId}`)} style={{ marginBottom:24, padding:'6px 16px', borderRadius:8, background:'transparent', border:'1px solid rgba(0,255,255,0.2)', color:C.cyan, fontFamily:"'Orbitron',sans-serif", fontSize:10, cursor:'pointer', letterSpacing:1 }}>
          ← Back to Squad
        </button>

        {/* SUCCESS STATE */}
        {done ? (
          <div style={{ background:C.card, border:'1px solid rgba(0,255,136,0.3)', borderRadius:16, padding:40, textAlign:'center', animation:'fadeUp .5s ease' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
            <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:18, fontWeight:900, color:C.green, marginBottom:8, letterSpacing:1 }}>Request Sent!</h2>
            <p style={{ fontSize:13, color:'#64748b', fontFamily:"'Share Tech Mono',monospace", marginBottom:24 }}>
              Your join request has been sent to <span style={{ color:'#fff' }}>{squad?.name}</span>.<br/>
              The squad leader will review it soon.
            </p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button onClick={() => router.push(`/squads/${squadId}`)} style={{ padding:'10px 22px', borderRadius:10, background:`rgba(0,255,136,0.1)`, border:`1px solid rgba(0,255,136,0.3)`, color:C.green, fontFamily:"'Orbitron',sans-serif", fontSize:10, cursor:'pointer', letterSpacing:1 }}>
                View Squad
              </button>
              <button onClick={() => router.push('/squads')} style={{ padding:'10px 22px', borderRadius:10, background:'rgba(0,255,255,0.05)', border:'1px solid rgba(0,255,255,0.2)', color:C.cyan, fontFamily:"'Orbitron',sans-serif", fontSize:10, cursor:'pointer', letterSpacing:1 }}>
                Browse More
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Squad Preview Card */}
            {squad && (
              <div style={{ background:C.card, border:`1px solid ${gameColor}25`, borderRadius:16, padding:20, marginBottom:20, position:'relative', overflow:'hidden', animation:'fadeUp .4s ease' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${gameColor},transparent)` }}/>
                <div style={{ position:'absolute', top:6, left:6, width:10, height:10, borderTop:`1.5px solid ${gameColor}60`, borderLeft:`1.5px solid ${gameColor}60` }}/>

                <p style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, color:`${gameColor}80`, letterSpacing:3, marginBottom:12 }}>// APPLYING TO JOIN</p>

                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                  <div style={{ width:52, height:52, borderRadius:12, background:`${gameColor}18`, border:`1.5px solid ${gameColor}44`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Orbitron',sans-serif", fontSize:14, fontWeight:900, color:gameColor, flexShrink:0 }}>
                    {(squad.tag || squad.name || '?').slice(0,3).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:16, fontWeight:900, color:'#fff' }}>{squad.name}</div>
                    <div style={{ display:'flex', gap:6, marginTop:5 }}>
                      <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20, background:`${gameColor}18`, color:gameColor, border:`1px solid ${gameColor}40`, fontFamily:"'Share Tech Mono',monospace" }}>{squad.game}</span>
                      {squad.region && <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20, background:'rgba(168,85,247,0.1)', color:C.purple, border:'1px solid rgba(168,85,247,0.3)', fontFamily:"'Share Tech Mono',monospace" }}>{squad.region}</span>}
                    </div>
                  </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                  {[
                    { val: squad.elo_rating || '—', lbl:'ELO', color:C.red },
                    { val: `${activeMembers.length}/7`, lbl:'Members', color:C.cyan },
                    { val: openSlots > 0 ? `${openSlots} open` : 'Full', lbl:'Slots', color: openSlots > 0 ? C.green : C.red },
                  ].map(s => (
                    <div key={s.lbl} style={{ background:'rgba(255,255,255,0.025)', borderRadius:8, padding:'8px 4px', textAlign:'center', border:'1px solid rgba(0,255,255,0.06)' }}>
                      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:14, fontWeight:900, color:s.color }}>{s.val}</div>
                      <div style={{ fontSize:9, color:'#475569', fontFamily:"'Share Tech Mono',monospace", marginTop:2 }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>

                {openSlots === 0 && (
                  <div style={{ marginTop:12, padding:'8px 12px', borderRadius:8, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', fontSize:12, color:C.red, fontFamily:"'Share Tech Mono',monospace" }}>
                    ⚠ This squad is currently full. You can still send a request — leader may free a slot.
                  </div>
                )}
              </div>
            )}

            {/* Application Form */}
            <div style={{ background:C.card, border:'1px solid rgba(0,255,255,0.08)', borderRadius:16, padding:24, animation:'fadeUp .5s ease .1s both', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(0,255,255,0.2),rgba(239,68,68,0.25),transparent)' }}/>

              <p style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, color:'rgba(0,255,255,0.6)', letterSpacing:3, marginBottom:16 }}>// YOUR APPLICATION</p>

              <label style={{ display:'block', fontFamily:"'Orbitron',sans-serif", fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:3, marginBottom:8 }}>
                MESSAGE TO SQUAD LEADER *
              </label>
              <textarea
                rows={5}
                placeholder="Tell them about yourself — your role, rank, playstyle, availability, why you want to join this squad..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                  width:'100%', borderRadius:10, padding:'12px 14px',
                  background: focused ? '#080812' : '#050508',
                  border:`1px solid ${focused ? 'rgba(0,255,255,0.35)' : 'rgba(0,255,255,0.12)'}`,
                  color:'#e2e8f0', fontFamily:"'Rajdhani',sans-serif", fontWeight:600,
                  fontSize:14, outline:'none', resize:'vertical',
                  boxShadow: focused ? '0 0 16px rgba(0,255,255,0.08)' : 'none',
                  transition:'all .2s',
                }}
              />
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, marginBottom:20 }}>
                <span style={{ fontSize:10, color:'#334155', fontFamily:"'Share Tech Mono',monospace" }}>Be specific — your role, rank, game hours</span>
                <span style={{ fontSize:10, color: message.length > 400 ? C.red : '#334155', fontFamily:"'Share Tech Mono',monospace" }}>{message.length}/500</span>
              </div>

              {/* Tips */}
              <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(251,191,36,0.04)', border:'1px solid rgba(251,191,36,0.15)', marginBottom:20 }}>
                <p style={{ fontFamily:"'Orbitron',sans-serif", fontSize:8, color:'rgba(251,191,36,0.6)', letterSpacing:2, marginBottom:6 }}>// TIPS FOR A STRONG APPLICATION</p>
                {['Mention your in-game role (IGL / Fragger / Sniper / Support)', 'Share your rank and K/D ratio', 'State your availability (daily / weekends)', 'Tell them what you bring to the team'].map((tip, i) => (
                  <div key={i} style={{ display:'flex', gap:8, fontSize:11, color:'#64748b', marginBottom:4, fontFamily:"'Rajdhani',sans-serif", fontWeight:500 }}>
                    <span style={{ color:'rgba(251,191,36,0.5)', flexShrink:0 }}>→</span>
                    {tip}
                  </div>
                ))}
              </div>

              {error && (
                <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', fontSize:12, color:C.red, fontFamily:"'Share Tech Mono',monospace", marginBottom:16 }}>
                  ⚠ {error}
                </div>
              )}

              <button
                onClick={handleApply}
                disabled={submitting || !message.trim()}
                style={{
                  width:'100%', padding:'13px 0', borderRadius:10, cursor: message.trim() ? 'pointer' : 'not-allowed',
                  background: message.trim() ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'rgba(255,255,255,0.03)',
                  border:`1px solid ${message.trim() ? C.red : 'rgba(255,255,255,0.06)'}`,
                  color: message.trim() ? '#fff' : '#334155',
                  fontFamily:"'Orbitron',sans-serif", fontWeight:900, fontSize:11, letterSpacing:2,
                  boxShadow: message.trim() ? '0 0 25px rgba(239,68,68,0.35)' : 'none',
                  transition:'all .2s',
                }}>
                {submitting ? '⟳ Sending...' : 'Send Join Request →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
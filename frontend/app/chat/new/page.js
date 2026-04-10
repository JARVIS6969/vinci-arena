'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL, getToken, getUserId } from '@/app/utils/chat';
import '@/app/chat/chat.css';

const NEON = ['#ef4444','#f97316','#fbbf24','#10b981','#00ffff','#6366f1','#a78bfa','#ec4899'];

function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const particles = Array.from({length: 50}, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.25,
      col: NEON[Math.floor(Math.random() * NEON.length)],
      bp: Math.random() * Math.PI * 2,
      br: 0.02 + Math.random() * 0.03,
    }));
    let frame = 0, id;
    const loop = () => {
      id = requestAnimationFrame(loop); frame++;
      ctx.clearRect(0, 0, c.width, c.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
        const op = 0.2 + 0.5 * Math.abs(Math.sin(frame * p.br + p.bp));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, p.col + '99'); g.addColorStop(1, p.col + '00');
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.globalAlpha = op * 0.25; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col; ctx.globalAlpha = op; ctx.fill();
        ctx.globalAlpha = 1;
      });
      particles.forEach((a, i) => particles.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 100) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = a.col; ctx.globalAlpha = (1 - d / 100) * 0.06;
          ctx.lineWidth = 0.5; ctx.stroke(); ctx.globalAlpha = 1;
        }
      }));
    };
    loop();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0}}/>;
}

export default function NewChatPage() {
  const router = useRouter();
  const [tab, setTab] = useState('dm');
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [groupSearch, setGroupSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [scanY, setScanY] = useState(0);

  useEffect(() => {
    fetchUsers();
    let frame;
    const animate = () => { setScanY(y => (y + 0.2) % 100); frame = requestAnimationFrame(animate); };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) setUsers(await res.json());
    } catch (err) { console.error(err); }
  };

  const startDM = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ message: '👋 Hey!', receiver_id: userId }),
      });
      if (res.ok) {
        const convRes = await fetch(`${API_URL}/api/chat/conversations`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        if (convRes.ok) {
          const data = await convRes.json();
          const myId = getUserId();
          const dm = data.dms.find(d =>
            (d.user1_id === myId && d.user2_id === userId) ||
            (d.user2_id === myId && d.user1_id === userId)
          );
          if (dm) router.push(`/chat/dm/${dm.id}`);
        }
      }
    } catch (err) { console.error(err); }
  };

  const createGroup = async () => {
    if (!groupName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/chat/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name: groupName, description: groupDesc }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/chat/group/${data.id}`);
      }
    } catch (err) { console.error(err); }
    finally { setCreating(false); }
  };

  const searchGroups = async (query) => {
    setGroupSearch(query);
    if (!query.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`${API_URL}/api/chat/groups/search?query=${query}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) setSearchResults(await res.json());
    } catch (err) { console.error(err); }
    finally { setSearching(false); }
  };

  const joinGroup = async (groupCode) => {
    setJoining(true);
    try {
      const res = await fetch(`${API_URL}/api/chat/groups/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ group_code: groupCode }),
      });
      const data = await res.json();
      if (res.ok) router.push(`/chat/group/${data.group.id}`);
      else alert(data.error || 'Failed to join');
    } catch (err) { console.error(err); }
    finally { setJoining(false); }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

  const tabs = [
    { id: 'dm',     label: '💬 DIRECT',      color: '#ef4444' },
    { id: 'create', label: '➕ CREATE GROUP', color: '#a855f7' },
    { id: 'find',   label: '🔍 FIND GROUP',   color: '#00ffff' },
  ];

  const inputStyle = (color = '#00ffff') => ({
    width: '100%',
    background: 'rgba(8,8,24,0.8)',
    border: `1px solid ${color}25`,
    borderRadius: '8px',
    color: '#e2e8f0',
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: '600',
    fontSize: '13px',
    padding: '10px 14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s',
    backdropFilter: 'blur(10px)'
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050510',
      color: '#e2e8f0',
      fontFamily: "'Rajdhani', sans-serif",
      paddingTop: '104px',
      position: 'relative'
    }}>
      <ParticleCanvas/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        .cyber-grid {
          background-image:
            linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239,68,68,0.02) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .user-row { transition: all 0.2s; cursor: pointer; position: relative; overflow: hidden; }
        .user-row:hover { background: rgba(239,68,68,0.06) !important; border-color: rgba(239,68,68,0.35) !important; transform: translateX(4px); }
        .group-row { transition: all 0.2s; }
        .group-row:hover { background: rgba(0,255,255,0.05) !important; border-color: rgba(0,255,255,0.3) !important; }
        input:focus { border-color: rgba(0,255,255,0.4) !important; box-shadow: 0 0 15px rgba(0,255,255,0.1) !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#ef4444, #00ffff); }
      `}</style>

      {/* Scan line */}
      <div style={{
        position: 'fixed', left: 0, right: 0, height: '1px',
        top: `${scanY}%`,
        background: 'linear-gradient(90deg,transparent,rgba(0,255,255,0.15),rgba(239,68,68,0.2),rgba(0,255,255,0.15),transparent)',
        pointerEvents: 'none', zIndex: 1
      }}/>

      {/* Cyber grid */}
      <div className="cyber-grid" style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0}}/>

      {/* CONTENT */}
      <div style={{position:'relative',zIndex:2}}>

        {/* HEADER */}
        <div style={{
          borderBottom: '1px solid rgba(0,255,255,0.1)',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          background: 'rgba(8,8,24,0.95)',
          backdropFilter: 'blur(10px)',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:'1.5px',background:'linear-gradient(90deg,#ef4444,#f97316,#fbbf24,#10b981,#00ffff,#6366f1,#a78bfa,#ef4444)'}}/>
          <button onClick={() => router.push('/chat')} style={{
            background: 'rgba(0,255,255,0.05)',
            border: '1px solid rgba(0,255,255,0.2)',
            borderRadius: '8px', color: '#00ffff',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '10px', fontWeight: '700',
            letterSpacing: '2px', padding: '7px 14px',
            cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,255,255,0.05)'}>
            ← BACK
          </button>
          <div>
            <h1 style={{
              fontFamily: "'Orbitron', sans-serif", fontSize: '15px',
              fontWeight: '900', color: '#00ffff', letterSpacing: '4px',
              textShadow: '0 0 15px rgba(0,255,255,0.5)', margin: 0
            }}>NEW CHAT</h1>
            <p style={{
              fontFamily: "'Share Tech Mono', monospace", fontSize: '10px',
              color: 'rgba(0,255,255,0.3)', margin: 0, letterSpacing: '2px'
            }}>// initiate communication channel</p>
          </div>
        </div>

        <div style={{padding: '24px'}}>
          <div style={{maxWidth: '560px', margin: '0 auto'}}>

            {/* TABS */}
            <div style={{
              display: 'flex', gap: '4px', marginBottom: '24px',
              background: 'rgba(8,8,24,0.8)',
              border: '1px solid rgba(0,255,255,0.1)',
              borderRadius: '10px', padding: '4px',
              backdropFilter: 'blur(10px)',
              animation: 'fadeUp 0.3s ease both'
            }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  flex: 1, padding: '9px 4px', borderRadius: '8px',
                  fontFamily: "'Orbitron', sans-serif", fontWeight: '700',
                  fontSize: '9px', letterSpacing: '1px',
                  background: tab === t.id ? `${t.color}12` : 'transparent',
                  color: tab === t.id ? t.color : 'rgba(255,255,255,0.2)',
                  border: tab === t.id ? `1px solid ${t.color}30` : '1px solid transparent',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: tab === t.id ? `0 0 15px ${t.color}15` : 'none'
                }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* DM TAB */}
            {tab === 'dm' && (
              <div style={{animation: 'fadeUp 0.3s ease both'}}>
                <div style={{position: 'relative', marginBottom: '12px'}}>
                  <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#ef4444',fontSize:'12px'}}>🔍</span>
                  <input
                    placeholder="// SEARCH PLAYERS..."
                    value={searchUser}
                    onChange={e => setSearchUser(e.target.value)}
                    style={{...inputStyle('#ef4444'), paddingLeft: '34px'}}
                  />
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                  {filteredUsers.map((user, idx) => (
                    <div key={user.id} className="user-row"
                      onClick={() => startDM(user.id)}
                      style={{
                        display:'flex',alignItems:'center',gap:'12px',
                        padding:'12px 14px',
                        background:'rgba(8,8,24,0.8)',
                        border:'1px solid rgba(239,68,68,0.1)',
                        borderRadius:'10px',
                        backdropFilter:'blur(10px)',
                        animation:`fadeUp 0.3s ease ${idx*0.04}s both`
                      }}>
                      <div style={{
                        width:'40px',height:'40px',
                        background:'linear-gradient(135deg,#ef4444,#7c3aed)',
                        borderRadius:'8px',flexShrink:0,
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontFamily:"'Orbitron',sans-serif",fontWeight:'900',
                        fontSize:'15px',color:'white',
                        boxShadow:'0 0 12px rgba(239,68,68,0.3)'
                      }}>{user.name?.[0]?.toUpperCase()||'?'}</div>
                      <div style={{flex:1}}>
                        <p style={{fontFamily:"'Orbitron',sans-serif",fontWeight:'700',fontSize:'12px',color:'#e2e8f0',margin:0,letterSpacing:'1px'}}>{user.name}</p>
                        <p style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'10px',color:'rgba(255,255,255,0.25)',margin:0}}>{user.email}</p>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
                        <div style={{width:'6px',height:'6px',background:'#00ff88',borderRadius:'50%',boxShadow:'0 0 6px #00ff88'}}/>
                        <span style={{color:'rgba(239,68,68,0.5)',fontSize:'12px',fontFamily:"'Orbitron',sans-serif"}}>→</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CREATE GROUP TAB */}
            {tab === 'create' && (
              <div style={{display:'flex',flexDirection:'column',gap:'16px',animation:'fadeUp 0.3s ease both'}}>
                <div style={{
                  background:'rgba(8,8,24,0.8)',
                  border:'1px solid rgba(168,85,247,0.2)',
                  borderRadius:'12px',padding:'20px',
                  backdropFilter:'blur(10px)',
                  position:'relative',overflow:'hidden'
                }}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:'1px',background:'linear-gradient(90deg,transparent,#a855f7,transparent)'}}/>
                  <div style={{position:'absolute',top:'6px',left:'6px',width:'10px',height:'10px',borderTop:'1.5px solid rgba(168,85,247,0.5)',borderLeft:'1.5px solid rgba(168,85,247,0.5)'}}/>
                  <div style={{position:'absolute',bottom:'6px',right:'6px',width:'10px',height:'10px',borderBottom:'1.5px solid rgba(0,255,255,0.3)',borderRight:'1.5px solid rgba(0,255,255,0.3)'}}/>

                  <div style={{marginBottom:'14px'}}>
                    <label style={{display:'block',fontFamily:"'Orbitron',sans-serif",fontSize:'9px',color:'rgba(168,85,247,0.6)',letterSpacing:'3px',marginBottom:'8px'}}>//  GROUP NAME *</label>
                    <input
                      placeholder="e.g. VINCI SQUAD FF"
                      value={groupName}
                      onChange={e => setGroupName(e.target.value)}
                      style={inputStyle('#a855f7')}
                    />
                  </div>
                  <div>
                    <label style={{display:'block',fontFamily:"'Orbitron',sans-serif",fontSize:'9px',color:'rgba(168,85,247,0.6)',letterSpacing:'3px',marginBottom:'8px'}}>//  DESCRIPTION</label>
                    <input
                      placeholder="What's this squad about?"
                      value={groupDesc}
                      onChange={e => setGroupDesc(e.target.value)}
                      style={inputStyle('#a855f7')}
                    />
                  </div>
                </div>

                <div style={{
                  background:'rgba(168,85,247,0.04)',
                  border:'1px solid rgba(168,85,247,0.12)',
                  borderRadius:'8px',padding:'12px 14px'
                }}>
                  <p style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'11px',color:'rgba(168,85,247,0.4)',margin:0}}>
                    // a unique group code will be auto-generated for invites
                  </p>
                </div>

                <button onClick={createGroup} disabled={!groupName.trim()||creating}
                  style={{
                    width:'100%',padding:'13px',
                    background:groupName.trim()?'linear-gradient(135deg,#1a0a2e,#0a0a2e)':'rgba(8,8,24,0.8)',
                    border:`1px solid ${groupName.trim()?'rgba(168,85,247,0.4)':'rgba(255,255,255,0.05)'}`,
                    borderRadius:'10px',
                    color:groupName.trim()?'#a855f7':'rgba(255,255,255,0.2)',
                    fontFamily:"'Orbitron',sans-serif",fontWeight:'700',
                    fontSize:'11px',letterSpacing:'3px',
                    cursor:groupName.trim()?'pointer':'not-allowed',
                    boxShadow:groupName.trim()?'0 0 20px rgba(168,85,247,0.2)':'none',
                    transition:'all 0.3s',
                    backdropFilter:'blur(10px)'
                  }}>
                  {creating?'// CREATING...':'⚡ CREATE SQUAD'}
                </button>
              </div>
            )}

            {/* FIND GROUP TAB */}
            {tab === 'find' && (
              <div style={{display:'flex',flexDirection:'column',gap:'16px',animation:'fadeUp 0.3s ease both'}}>

                {/* JOIN BY CODE */}
                <div style={{
                  background:'rgba(8,8,24,0.8)',
                  border:'1px solid rgba(0,255,255,0.15)',
                  borderRadius:'12px',padding:'20px',
                  backdropFilter:'blur(10px)',
                  position:'relative',overflow:'hidden'
                }}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:'1px',background:'linear-gradient(90deg,transparent,#00ffff,transparent)'}}/>
                  <div style={{position:'absolute',top:'6px',left:'6px',width:'10px',height:'10px',borderTop:'1.5px solid rgba(0,255,255,0.5)',borderLeft:'1.5px solid rgba(0,255,255,0.5)'}}/>

                  <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:'9px',color:'rgba(0,255,255,0.5)',letterSpacing:'3px',marginBottom:'12px'}}>// JOIN BY CODE</p>
                  <div style={{display:'flex',gap:'8px'}}>
                    <input
                      placeholder="ENTER CODE e.g. ABC123"
                      value={joinCode}
                      onChange={e => setJoinCode(e.target.value.toUpperCase())}
                      style={{
                        flex:1,background:'rgba(5,5,16,0.9)',
                        border:'1px solid rgba(0,255,255,0.2)',
                        borderRadius:'8px',color:'#00ffff',
                        fontFamily:"'Share Tech Mono',monospace",
                        fontWeight:'700',fontSize:'15px',
                        padding:'10px 14px',outline:'none',
                        letterSpacing:'4px',boxSizing:'border-box'
                      }}
                    />
                    <button onClick={() => joinGroup(joinCode)}
                      disabled={!joinCode.trim()||joining}
                      style={{
                        padding:'10px 20px',
                        background:'rgba(0,255,255,0.08)',
                        border:'1px solid rgba(0,255,255,0.3)',
                        borderRadius:'8px',color:'#00ffff',
                        fontFamily:"'Orbitron',sans-serif",fontWeight:'700',
                        fontSize:'10px',letterSpacing:'2px',
                        cursor:'pointer',flexShrink:0,
                        boxShadow:'0 0 15px rgba(0,255,255,0.1)'
                      }}>
                      {joining?'...':'JOIN'}
                    </button>
                  </div>
                </div>

                {/* SEARCH BY NAME */}
                <div>
                  <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:'9px',color:'rgba(0,255,255,0.5)',letterSpacing:'3px',marginBottom:'10px'}}>// SEARCH BY NAME</p>
                  <div style={{position:'relative',marginBottom:'10px'}}>
                    <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#00ffff',fontSize:'12px'}}>🔍</span>
                    <input
                      placeholder="// SEARCH GROUP NAME..."
                      value={groupSearch}
                      onChange={e => searchGroups(e.target.value)}
                      style={{...inputStyle('#00ffff'),paddingLeft:'34px'}}
                    />
                  </div>
                  {searching && (
                    <div style={{display:'flex',justifyContent:'center',padding:'16px'}}>
                      <div style={{width:'24px',height:'24px',border:'2px solid rgba(0,255,255,0.1)',borderTop:'2px solid #00ffff',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
                    </div>
                  )}
                  <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                    {searchResults.map((group, idx) => (
                      <div key={group.id} className="group-row"
                        style={{
                          display:'flex',alignItems:'center',gap:'12px',
                          padding:'12px 14px',
                          background:'rgba(8,8,24,0.8)',
                          border:'1px solid rgba(0,255,255,0.1)',
                          borderRadius:'10px',
                          backdropFilter:'blur(10px)',
                          animation:`fadeUp 0.3s ease ${idx*0.04}s both`
                        }}>
                        <div style={{
                          width:'40px',height:'40px',
                          background:'linear-gradient(135deg,#7c3aed,#2563eb)',
                          borderRadius:'8px',flexShrink:0,
                          display:'flex',alignItems:'center',justifyContent:'center',
                          fontFamily:"'Orbitron',sans-serif",fontWeight:'900',
                          fontSize:'15px',color:'white',
                          boxShadow:'0 0 12px rgba(168,85,247,0.3)'
                        }}>{group.name?.[0]?.toUpperCase()}</div>
                        <div style={{flex:1}}>
                          <p style={{fontFamily:"'Orbitron',sans-serif",fontWeight:'700',fontSize:'12px',color:'#e2e8f0',margin:0}}>{group.name}</p>
                          <p style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'10px',color:'rgba(255,255,255,0.25)',margin:0}}>{group.description||'// no description'}</p>
                          <p style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'10px',color:'#00ffff',margin:0,letterSpacing:'2px'}}>CODE: {group.group_code}</p>
                        </div>
                        <button onClick={() => joinGroup(group.group_code)} disabled={joining}
                          style={{
                            padding:'6px 14px',
                            background:'rgba(0,255,255,0.08)',
                            border:'1px solid rgba(0,255,255,0.3)',
                            borderRadius:'6px',color:'#00ffff',
                            fontFamily:"'Orbitron',sans-serif",fontWeight:'700',
                            fontSize:'9px',letterSpacing:'2px',cursor:'pointer'
                          }}>JOIN</button>
                      </div>
                    ))}
                    {groupSearch && !searching && searchResults.length === 0 && (
                      <p style={{textAlign:'center',fontFamily:"'Share Tech Mono',monospace",fontSize:'11px',color:'rgba(255,255,255,0.2)',padding:'16px'}}>
                        // no groups found
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
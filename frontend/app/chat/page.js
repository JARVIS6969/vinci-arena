'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchConversations, timeAgo } from '@/app/utils/chat';
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

export default function ChatHubPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState({ dms: [], groups: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [scanY, setScanY] = useState(0);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';

  useEffect(() => {
    loadConversations();
    let frame;
    const animate = () => { setScanY(y => (y + 0.2) % 100); frame = requestAnimationFrame(animate); };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const loadConversations = async () => {
    const data = await fetchConversations();
    setConversations(data);
    setLoading(false);
  };

  const totalCount = conversations.dms.length + conversations.groups.length;
  const tabs = [
    { id: 'all',    label: 'ALL',    count: totalCount },
    { id: 'dms',    label: 'DIRECT', count: conversations.dms.length },
    { id: 'groups', label: 'GROUPS', count: conversations.groups.length },
  ];

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
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 15px rgba(0,255,255,0.2)} 50%{box-shadow:0 0 30px rgba(0,255,255,0.5)} }
        @keyframes neonFlicker { 0%,95%,100%{opacity:1} 96%{opacity:0.4} 98%{opacity:0.8} }
        .cyber-grid {
          background-image:
            linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239,68,68,0.02) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .conv-card {
          transition: all 0.25s cubic-bezier(.16,1,.3,1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .conv-card:hover { transform: translateY(-3px) scale(1.005); }
        .conv-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #00ffff, transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .conv-card:hover::before { opacity: 1; }
        .tab-btn { transition: all 0.2s; cursor: pointer; border: none; }
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
      <div style={{position:'relative', zIndex:2}}>

        {/* HEADER */}
        <div style={{
          borderBottom: '1px solid rgba(0,255,255,0.1)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(8,8,24,0.95)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Rainbow top line */}
          <div style={{position:'absolute',top:0,left:0,right:0,height:'1.5px',background:'linear-gradient(90deg,#ef4444,#f97316,#fbbf24,#10b981,#00ffff,#6366f1,#a78bfa,#ef4444)'}}/>

          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{
              width:'38px',height:'38px',
              background:'linear-gradient(135deg,#0a0a20,#150520)',
              border:'1px solid rgba(0,255,255,0.3)',
              borderRadius:'10px',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:'18px',
              boxShadow:'0 0 20px rgba(0,255,255,0.2)',
              animation:'glowPulse 3s infinite'
            }}>💬</div>
            <div>
              <h1 style={{
                fontFamily:"'Orbitron',sans-serif",
                fontSize:'15px',fontWeight:'900',
                color:'#00ffff',letterSpacing:'4px',
                textShadow:'0 0 15px rgba(0,255,255,0.6)',
                margin:0,animation:'neonFlicker 5s infinite'
              }}>MESSAGES</h1>
              <p style={{
                fontFamily:"'Share Tech Mono',monospace",
                fontSize:'10px',color:'rgba(0,255,255,0.4)',
                margin:0,letterSpacing:'2px'
              }}>// {totalCount} ACTIVE CHANNELS</p>
            </div>
          </div>

          <Link href="/chat/new">
            <button style={{
              padding:'9px 22px',
              background:'linear-gradient(135deg,#1a0010,#0a001a)',
              border:'1px solid rgba(239,68,68,0.4)',
              borderRadius:'8px',color:'#ef4444',
              fontFamily:"'Orbitron',sans-serif",
              fontWeight:'700',fontSize:'10px',letterSpacing:'2px',
              cursor:'pointer',
              boxShadow:'0 0 15px rgba(239,68,68,0.2)',
              transition:'all 0.2s'
            }}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 0 25px rgba(239,68,68,0.5)';e.currentTarget.style.background='rgba(239,68,68,0.1)'}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow='0 0 15px rgba(239,68,68,0.2)';e.currentTarget.style.background='linear-gradient(135deg,#1a0010,#0a001a)'}}>
              ⚡ NEW CHAT
            </button>
          </Link>
        </div>

        {/* BODY */}
        <div style={{padding:'24px'}}>
          <div style={{maxWidth:'700px',margin:'0 auto'}}>

            {/* TABS */}
            <div style={{
              display:'flex',gap:'4px',marginBottom:'24px',
              background:'rgba(8,8,24,0.8)',
              border:'1px solid rgba(0,255,255,0.1)',
              borderRadius:'10px',padding:'4px',
              backdropFilter:'blur(10px)'
            }}>
              {tabs.map(tab => (
                <button key={tab.id}
                  className="tab-btn"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex:1,padding:'10px',borderRadius:'8px',
                    fontFamily:"'Orbitron',sans-serif",
                    fontWeight:'700',fontSize:'10px',letterSpacing:'2px',
                    background:activeTab===tab.id
                      ?'linear-gradient(135deg,rgba(0,255,255,0.1),rgba(239,68,68,0.05))'
                      :'transparent',
                    color:activeTab===tab.id?'#00ffff':'rgba(0,255,255,0.25)',
                    border:activeTab===tab.id
                      ?'1px solid rgba(0,255,255,0.3)'
                      :'1px solid transparent',
                    boxShadow:activeTab===tab.id?'0 0 15px rgba(0,255,255,0.1)':'none',
                    display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',
                    transition:'all 0.2s'
                  }}>
                  {tab.label}
                  <span style={{
                    padding:'1px 7px',borderRadius:'4px',fontSize:'9px',fontWeight:'900',
                    background:activeTab===tab.id?'rgba(0,255,255,0.15)':'rgba(255,255,255,0.04)',
                    color:activeTab===tab.id?'#00ffff':'rgba(255,255,255,0.2)'
                  }}>{tab.count}</span>
                </button>
              ))}
            </div>

            {/* LOADING */}
            {loading ? (
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'80px 0',gap:'16px'}}>
                <div style={{width:'40px',height:'40px',border:'2px solid rgba(0,255,255,0.1)',borderTop:'2px solid #00ffff',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
                <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:'10px',color:'rgba(0,255,255,0.4)',letterSpacing:'3px'}}>LOADING...</p>
              </div>

            ) : totalCount === 0 ? (
              <div style={{textAlign:'center',padding:'80px 0'}}>
                <div style={{fontSize:'52px',marginBottom:'16px',filter:'drop-shadow(0 0 20px rgba(0,255,255,0.3))'}}>💬</div>
                <p style={{
                  fontFamily:"'Orbitron',sans-serif",fontSize:'16px',
                  color:'rgba(0,255,255,0.4)',letterSpacing:'3px',marginBottom:'8px',
                  animation:'neonFlicker 4s infinite'
                }}>NO CHANNELS ACTIVE</p>
                <p style={{
                  fontFamily:"'Share Tech Mono',monospace",fontSize:'11px',
                  color:'rgba(255,255,255,0.2)',marginBottom:'28px'
                }}>// start communicating with your squad</p>
                <Link href="/chat/new">
                  <button style={{
                    padding:'12px 36px',
                    background:'linear-gradient(135deg,#1a0010,#0a001a)',
                    border:'1px solid rgba(239,68,68,0.4)',
                    borderRadius:'8px',color:'#ef4444',
                    fontFamily:"'Orbitron',sans-serif",
                    fontWeight:'700',fontSize:'11px',letterSpacing:'3px',
                    cursor:'pointer',boxShadow:'0 0 25px rgba(239,68,68,0.25)'
                  }}>⚡ INITIATE CHAT</button>
                </Link>
              </div>

            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>

                {/* DMs */}
                {(activeTab==='all'||activeTab==='dms') && conversations.dms.length > 0 && (
                  <div>
                    {activeTab==='all' && (
                      <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px',marginTop:'4px'}}>
                        <div style={{height:'1px',flex:1,background:'linear-gradient(90deg,rgba(239,68,68,0.5),transparent)'}}/>
                        <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                          <div style={{width:'5px',height:'5px',background:'#ef4444',borderRadius:'50%',boxShadow:'0 0 6px #ef4444'}}/>
                          <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:'9px',color:'rgba(239,68,68,0.7)',letterSpacing:'3px'}}>DIRECT</span>
                          <div style={{width:'5px',height:'5px',background:'#ef4444',borderRadius:'50%',boxShadow:'0 0 6px #ef4444'}}/>
                        </div>
                        <div style={{height:'1px',flex:1,background:'linear-gradient(270deg,rgba(239,68,68,0.5),transparent)'}}/>
                      </div>
                    )}
                    {conversations.dms.map((dm, idx) => {
                      const other = dm.user1_id === userId ? dm.user2 : dm.user1;
                      return (
                        <Link key={dm.id} href={`/chat/dm/${dm.id}`}>
                          <div className="conv-card" style={{
                            background:'linear-gradient(135deg,rgba(8,8,24,0.9),rgba(5,5,15,0.95))',
                            border:'1px solid rgba(239,68,68,0.15)',
                            borderRadius:'12px',padding:'14px 16px',
                            marginBottom:'8px',
                            backdropFilter:'blur(10px)',
                            animation:`fadeUp 0.3s ease ${idx*0.05}s both`
                          }}>
                            {/* Corner brackets */}
                            <div style={{position:'absolute',top:'6px',left:'6px',width:'10px',height:'10px',borderTop:'1.5px solid rgba(239,68,68,0.4)',borderLeft:'1.5px solid rgba(239,68,68,0.4)'}}/>
                            <div style={{position:'absolute',bottom:'6px',right:'6px',width:'10px',height:'10px',borderBottom:'1.5px solid rgba(0,255,255,0.3)',borderRight:'1.5px solid rgba(0,255,255,0.3)'}}/>

                            <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                              <div style={{position:'relative',flexShrink:0}}>
                                <div style={{
                                  width:'48px',height:'48px',
                                  background:'linear-gradient(135deg,#ef4444,#7c3aed)',
                                  borderRadius:'10px',
                                  display:'flex',alignItems:'center',justifyContent:'center',
                                  fontFamily:"'Orbitron',sans-serif",fontWeight:'900',
                                  fontSize:'18px',color:'white',
                                  boxShadow:'0 0 20px rgba(239,68,68,0.35)'
                                }}>{other?.name?.[0]?.toUpperCase()||'?'}</div>
                                <div style={{
                                  position:'absolute',bottom:'-2px',right:'-2px',
                                  width:'12px',height:'12px',
                                  background:'#00ff88',borderRadius:'50%',
                                  border:'2px solid #050510',
                                  boxShadow:'0 0 8px #00ff88',
                                  animation:'pulseDot 2s infinite'
                                }}/>
                              </div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}>
                                  <p style={{
                                    fontFamily:"'Orbitron',sans-serif",fontWeight:'700',
                                    fontSize:'13px',color:'#e2e8f0',margin:0,letterSpacing:'1px'
                                  }}>{other?.name?.toUpperCase()||'UNKNOWN'}</p>
                                  <span style={{
                                    fontFamily:"'Share Tech Mono',monospace",
                                    fontSize:'10px',color:'rgba(0,255,255,0.3)'
                                  }}>{timeAgo(dm.last_message_at)}</span>
                                </div>
                                <p style={{
                                  fontFamily:"'Share Tech Mono',monospace",
                                  fontSize:'11px',color:'rgba(255,255,255,0.3)',
                                  margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'
                                }}>{dm.last_message||'// no messages yet'}</p>
                              </div>
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',flexShrink:0}}>
                                <span style={{color:'rgba(239,68,68,0.5)',fontSize:'14px'}}>→</span>
                                <span style={{
                                  fontFamily:"'Share Tech Mono',monospace",
                                  fontSize:'8px',color:'rgba(0,255,255,0.3)',letterSpacing:'1px'
                                }}>DM</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* GROUPS */}
                {(activeTab==='all'||activeTab==='groups') && conversations.groups.length > 0 && (
                  <div>
                    {activeTab==='all' && (
                      <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px',marginTop:'8px'}}>
                        <div style={{height:'1px',flex:1,background:'linear-gradient(90deg,rgba(168,85,247,0.5),transparent)'}}/>
                        <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                          <div style={{width:'5px',height:'5px',background:'#a855f7',borderRadius:'50%',boxShadow:'0 0 6px #a855f7'}}/>
                          <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:'9px',color:'rgba(168,85,247,0.7)',letterSpacing:'3px'}}>GROUPS</span>
                          <div style={{width:'5px',height:'5px',background:'#a855f7',borderRadius:'50%',boxShadow:'0 0 6px #a855f7'}}/>
                        </div>
                        <div style={{height:'1px',flex:1,background:'linear-gradient(270deg,rgba(168,85,247,0.5),transparent)'}}/>
                      </div>
                    )}
                    {conversations.groups.map((group, idx) => (
                      <Link key={group.id} href={`/chat/group/${group.id}`}>
                        <div className="conv-card" style={{
                          background:'linear-gradient(135deg,rgba(8,8,24,0.9),rgba(5,5,15,0.95))',
                          border:'1px solid rgba(168,85,247,0.15)',
                          borderRadius:'12px',padding:'14px 16px',
                          marginBottom:'8px',
                          backdropFilter:'blur(10px)',
                          animation:`fadeUp 0.3s ease ${idx*0.05}s both`
                        }}>
                          {/* Corner brackets */}
                          <div style={{position:'absolute',top:'6px',left:'6px',width:'10px',height:'10px',borderTop:'1.5px solid rgba(168,85,247,0.4)',borderLeft:'1.5px solid rgba(168,85,247,0.4)'}}/>
                          <div style={{position:'absolute',bottom:'6px',right:'6px',width:'10px',height:'10px',borderBottom:'1.5px solid rgba(0,255,255,0.3)',borderRight:'1.5px solid rgba(0,255,255,0.3)'}}/>

                          <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                            <div style={{
                              width:'48px',height:'48px',
                              background:'linear-gradient(135deg,#7c3aed,#2563eb)',
                              borderRadius:'10px',flexShrink:0,
                              display:'flex',alignItems:'center',justifyContent:'center',
                              fontFamily:"'Orbitron',sans-serif",fontWeight:'900',
                              fontSize:'18px',color:'white',
                              boxShadow:'0 0 20px rgba(168,85,247,0.35)'
                            }}>{group.name?.[0]?.toUpperCase()||'?'}</div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}>
                                <p style={{
                                  fontFamily:"'Orbitron',sans-serif",fontWeight:'700',
                                  fontSize:'13px',color:'#e2e8f0',margin:0,letterSpacing:'1px'
                                }}>{group.name?.toUpperCase()}</p>
                                <span style={{
                                  fontFamily:"'Share Tech Mono',monospace",
                                  fontSize:'10px',color:'rgba(168,85,247,0.4)'
                                }}>{timeAgo(group.created_at)}</span>
                              </div>
                              <p style={{
                                fontFamily:"'Share Tech Mono',monospace",
                                fontSize:'11px',color:'rgba(168,85,247,0.35)',margin:0
                              }}>// {group.group_chat_members?.[0]?.count||0} members · {group.description||'group channel'}</p>
                            </div>
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',flexShrink:0}}>
                              <span style={{color:'rgba(168,85,247,0.5)',fontSize:'14px'}}>→</span>
                              <span style={{
                                fontFamily:"'Share Tech Mono',monospace",
                                fontSize:'8px',color:'rgba(168,85,247,0.3)',letterSpacing:'1px'
                              }}>GRP</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
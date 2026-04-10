'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    const particles = Array.from({length: 60}, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
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
  return <canvas ref={ref} style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0}}/>;
}

export default function MarketplacePage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeGame, setActiveGame] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('');
  const [scanY, setScanY] = useState(0);

  // Scan line
  useEffect(() => {
    let frame;
    const animate = () => { setScanY(y => (y + 0.2) % 100); frame = requestAnimationFrame(animate); };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'Player');
    fetchJobs();
  }, [activeCategory, activeGame]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeGame !== 'all') params.append('game', activeGame);
      if (activeCategory !== 'all') params.append('job_type', activeCategory);
      const res = await fetch(`http://localhost:3001/api/marketplace/jobs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
        if (data.length > 0) setSelectedJob(data[0]);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { id: 'all', name: 'All Opportunities', icon: '⚡' },
    { id: 'player', name: 'Players Wanted', icon: '👤' },
    { id: 'squad', name: 'Squad Recruit', icon: '👥' },
    { id: 'content_creator', name: 'Content Creator', icon: '🎥' },
    { id: 'coach', name: 'Coach Needed', icon: '🎓' },
    { id: 'analyst', name: 'Game Analyst', icon: '📊' },
  ];

  const games = [
    { id: 'all', name: 'All Games', icon: '🎮' },
    { id: 'Free Fire', name: 'Free Fire', icon: '🔥' },
    { id: 'BGMI', name: 'BGMI', icon: '🎯' },
    { id: 'Valorant', name: 'Valorant', icon: '⚡' },
  ];

  const jobTypeConfig = {
    player: { icon: '👤', color: '#3b82f6', gradient: 'linear-gradient(135deg,#2563eb,#06b6d4)' },
    squad: { icon: '👥', color: '#10b981', gradient: 'linear-gradient(135deg,#059669,#10b981)' },
    content_creator: { icon: '🎥', color: '#ec4899', gradient: 'linear-gradient(135deg,#db2777,#f43f5e)' },
    coach: { icon: '🎓', color: '#a855f7', gradient: 'linear-gradient(135deg,#7c3aed,#a855f7)' },
    analyst: { icon: '📊', color: '#f97316', gradient: 'linear-gradient(135deg,#ea580c,#ef4444)' },
  };

  const getConfig = (type) => jobTypeConfig[type] || { icon: '💼', color: '#ef4444', gradient: 'linear-gradient(135deg,#ef4444,#7c3aed)' };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div style={{
      height: 'calc(100vh - 104px)',
      marginTop: '104px',
      background: '#050510',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: "'Rajdhani', sans-serif",
      position: 'relative'
    }}>
      <ParticleCanvas/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(239,68,68,0.3)} 50%{box-shadow:0 0 40px rgba(239,68,68,0.6)} }
        @keyframes neonFlicker { 0%,95%,100%{opacity:1} 96%{opacity:0.4} 98%{opacity:0.8} }
        .cyber-grid {
          background-image: linear-gradient(rgba(0,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239,68,68,0.015) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#ef4444,#00ffff); }
        .job-card { transition: all 0.25s cubic-bezier(.16,1,.3,1); }
        .job-card:hover { transform: translateY(-2px); }
        .sidebar-btn { transition: all 0.2s; border: none; cursor: pointer; }
        .sidebar-btn:hover { transform: translateX(3px); }
      `}</style>

      {/* Scan line */}
      <div style={{
        position: 'fixed', left: 0, right: 0, height: '1px',
        top: `${scanY}%`,
        background: 'linear-gradient(90deg,transparent,rgba(0,255,255,0.1),rgba(239,68,68,0.2),rgba(0,255,255,0.1),transparent)',
        pointerEvents: 'none', zIndex: 1
      }}/>

      {/* Cyber grid overlay */}
      <div className="cyber-grid" style={{position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0}}/>

      {/* SUB HEADER */}
      <div style={{
        position: 'relative', zIndex: 10,
        background: 'rgba(5,5,16,0.95)',
        borderBottom: '1px solid rgba(239,68,68,0.15)',
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', gap: '12px',
        flexShrink: 0,
        backdropFilter: 'blur(10px)'
      }}>
        {/* Rainbow top line */}
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,#ef4444,#f97316,#fbbf24,#10b981,#00ffff,#6366f1,#a78bfa,#ef4444)'}}/>

        <div style={{flex: 1, maxWidth: '440px', position: 'relative'}}>
          <span style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#ef4444', fontSize: '13px'}}>🔍</span>
          <input
            type="text"
            placeholder="// SEARCH OPPORTUNITIES..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', background: '#080812',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px', paddingLeft: '34px', paddingRight: '12px',
              paddingTop: '8px', paddingBottom: '8px',
              color: 'white', fontSize: '11px',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '1px', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
          <span style={{width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 8px #4ade80', display: 'inline-block', animation: 'glowPulse 2s infinite'}}/>
          <span style={{color: '#4ade80', fontSize: '11px', fontWeight: '700', fontFamily: "'Orbitron', sans-serif", letterSpacing: '2px'}}>{jobs.length} LIVE</span>
        </div>

        <div style={{marginLeft: 'auto', display: 'flex', gap: '8px'}}>
          <Link href="/marketplace/my-applications">
            <button style={{
              background: '#080812', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', color: '#9ca3af',
              padding: '8px 16px', fontFamily: "'Orbitron', sans-serif",
              fontWeight: '700', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#9ca3af'; }}>
              📋 MY ACTIVITY
            </button>
          </Link>
          <Link href="/marketplace/post">
            <button style={{
              background: 'linear-gradient(135deg,#ef4444,#dc2626)',
              border: 'none', borderRadius: '8px', color: 'white',
              padding: '8px 18px', fontFamily: "'Orbitron', sans-serif",
              fontWeight: '900', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer',
              boxShadow: '0 0 20px rgba(239,68,68,0.4)', animation: 'glowPulse 3s infinite'
            }}>
              ⚡ POST JOB
            </button>
          </Link>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex: 1, display: 'flex', overflow: 'hidden', position: 'relative', zIndex: 2}}>

        {/* LEFT SIDEBAR */}
        <div style={{
          width: '220px', flexShrink: 0,
          background: 'rgba(5,5,16,0.9)',
          borderRight: '1px solid rgba(239,68,68,0.1)',
          display: 'flex', flexDirection: 'column',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Corner brackets on sidebar */}
          <div style={{position: 'absolute', top: '60px', left: 0, width: '8px', height: '8px', borderTop: '2px solid rgba(239,68,68,0.4)', borderLeft: '2px solid rgba(239,68,68,0.4)'}}/>

          <div style={{padding: '14px 12px', borderBottom: '1px solid rgba(239,68,68,0.08)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px'}}>
              <div style={{width: '4px', height: '4px', background: '#00ffff', borderRadius: '50%', boxShadow: '0 0 6px #00ffff'}}/>
              <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', fontWeight: '900', color: 'rgba(0,255,255,0.5)', letterSpacing: '3px'}}>//  GAMES</span>
            </div>
            {games.map(game => (
              <button key={game.id}
                className="sidebar-btn"
                onClick={() => setActiveGame(game.id)}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '8px 12px', borderRadius: '6px',
                  marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px',
                  background: activeGame === game.id ? 'rgba(239,68,68,0.12)' : 'transparent',
                  border: activeGame === game.id ? '1px solid rgba(239,68,68,0.35)' : '1px solid transparent',
                  color: activeGame === game.id ? '#fca5a5' : '#4b5563',
                  fontFamily: "'Rajdhani', sans-serif", fontWeight: '700',
                  fontSize: '11px', letterSpacing: '1px',
                  boxShadow: activeGame === game.id ? '0 0 10px rgba(239,68,68,0.15)' : 'none'
                }}>
                <span>{game.icon}</span>
                <span>{game.name.toUpperCase()}</span>
                {activeGame === game.id && <span style={{marginLeft: 'auto', color: '#ef4444', fontSize: '10px'}}>▶</span>}
              </button>
            ))}
          </div>

          <div style={{flex: 1, overflowY: 'auto', padding: '12px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px'}}>
              <div style={{width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%', boxShadow: '0 0 6px #ef4444'}}/>
              <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', fontWeight: '900', color: 'rgba(239,68,68,0.5)', letterSpacing: '3px'}}>//  ROLES</span>
            </div>
            {categories.map(cat => {
              const count = cat.id === 'all' ? jobs.length : jobs.filter(j => j.job_type === cat.id).length;
              return (
                <button key={cat.id}
                  className="sidebar-btn"
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '8px 12px', borderRadius: '6px',
                    marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px',
                    background: activeCategory === cat.id ? 'rgba(239,68,68,0.12)' : 'transparent',
                    border: activeCategory === cat.id ? '1px solid rgba(239,68,68,0.35)' : '1px solid transparent',
                    color: activeCategory === cat.id ? 'white' : '#4b5563',
                    fontFamily: "'Rajdhani', sans-serif", fontWeight: '700',
                    fontSize: '11px', letterSpacing: '1px'
                  }}>
                  <span>{cat.icon}</span>
                  <span style={{flex: 1}}>{cat.name.toUpperCase()}</span>
                  {count > 0 && (
                    <span style={{
                      padding: '1px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: '900',
                      background: activeCategory === cat.id ? '#ef4444' : 'rgba(255,255,255,0.05)',
                      color: activeCategory === cat.id ? 'white' : '#374151'
                    }}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* User */}
          <div style={{padding: '12px', borderTop: '1px solid rgba(239,68,68,0.08)', background: 'rgba(5,5,16,0.95)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <div style={{
                width: '34px', height: '34px',
                background: 'linear-gradient(135deg,#ef4444,#7c3aed)',
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Orbitron', sans-serif", fontWeight: '900', fontSize: '14px', color: 'white',
                boxShadow: '0 0 12px rgba(239,68,68,0.4)', flexShrink: 0
              }}>{userName[0]?.toUpperCase()}</div>
              <div>
                <p style={{fontFamily: "'Orbitron', sans-serif", fontWeight: '900', fontSize: '10px', color: 'white', letterSpacing: '1px', margin: 0}}>{userName.toUpperCase()}</p>
                <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px'}}>
                  <span style={{width: '5px', height: '5px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 5px #4ade80', display: 'inline-block'}}/>
                  <span style={{fontSize: '9px', color: '#4ade80', fontFamily: "'Share Tech Mono', monospace"}}>ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER FEED */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
          <div style={{
            padding: '10px 16px',
            borderBottom: '1px solid rgba(239,68,68,0.08)',
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(5,5,16,0.7)',
            backdropFilter: 'blur(10px)', flexShrink: 0
          }}>
            <div style={{width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%', boxShadow: '0 0 8px #ef4444'}}/>
            <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '10px', fontWeight: '900', color: '#ef4444', letterSpacing: '2px', animation: 'neonFlicker 6s infinite'}}>
              ⚡ {activeCategory === 'all' ? 'ALL OPPORTUNITIES' : activeCategory.toUpperCase().replace('_', ' ')}
            </span>
            <span style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: '#374151'}}>// {filteredJobs.length} results</span>
          </div>

          <div style={{flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {loading ? (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '16px'}}>
                <div style={{width: '48px', height: '48px', border: '2px solid rgba(239,68,68,0.2)', borderTop: '2px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite'}}/>
                <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: 'rgba(239,68,68,0.5)', letterSpacing: '3px'}}>LOADING DATA...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '16px'}}>
                <div style={{fontSize: '52px'}}>💀</div>
                <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '16px', color: '#ef4444', fontWeight: '900', letterSpacing: '3px', animation: 'neonFlicker 4s infinite'}}>NO RESULTS</p>
                <p style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: '#374151'}}>// try different filters</p>
                <Link href="/marketplace/post">
                  <button style={{background: 'linear-gradient(135deg,#ef4444,#dc2626)', border: 'none', borderRadius: '8px', color: 'white', padding: '10px 24px', fontFamily: "'Orbitron', sans-serif", fontWeight: '900', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 0 20px rgba(239,68,68,0.4)'}}>⚡ POST NOW</button>
                </Link>
              </div>
            ) : filteredJobs.map((job, idx) => {
              const config = getConfig(job.job_type);
              const isSelected = selectedJob?.id === job.id;
              return (
                <div key={job.id}
                  className="job-card"
                  onClick={() => setSelectedJob(job)}
                  style={{
                    background: isSelected ? 'rgba(239,68,68,0.06)' : 'rgba(8,8,18,0.8)',
                    border: isSelected ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.04)',
                    borderRadius: '12px', padding: '16px', cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 25px rgba(239,68,68,0.15), inset 0 0 20px rgba(239,68,68,0.03)' : 'none',
                    backdropFilter: 'blur(10px)',
                    position: 'relative', overflow: 'hidden',
                    animation: `fadeUp 0.3s ease ${idx * 0.05}s both`
                  }}>
                  {/* Top neon line when selected */}
                  {isSelected && <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px', background: 'linear-gradient(90deg,transparent,#ef4444,#00ffff,#ef4444,transparent)'}}/>}
                  {/* Corner brackets when selected */}
                  {isSelected && <>
                    <div style={{position: 'absolute', top: '6px', left: '6px', width: '10px', height: '10px', borderTop: '1.5px solid #ef4444', borderLeft: '1.5px solid #ef4444'}}/>
                    <div style={{position: 'absolute', top: '6px', right: '6px', width: '10px', height: '10px', borderTop: '1.5px solid #00ffff', borderRight: '1.5px solid #00ffff'}}/>
                  </>}

                  <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '10px',
                      background: config.gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px', flexShrink: 0,
                      boxShadow: isSelected ? `0 0 15px ${config.color}50` : 'none'
                    }}>{config.icon}</div>

                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px'}}>
                        <h3 style={{fontFamily: "'Rajdhani', sans-serif", fontWeight: '900', fontSize: '14px', color: isSelected ? 'white' : '#d1d5db', letterSpacing: '1px', margin: 0}}>{job.title}</h3>
                        <span style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: '#374151', flexShrink: 0}}>{timeAgo(job.created_at)}</span>
                      </div>
                      <p style={{fontSize: '11px', color: '#4b5563', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'Rajdhani', sans-serif"}}>{job.description}</p>
                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px'}}>
                        <span style={{background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.2)', fontFamily: "'Orbitron', sans-serif", fontWeight: '700', letterSpacing: '1px'}}>{job.game}</span>
                        <span style={{background: config.color + '15', color: config.color, fontSize: '10px', padding: '2px 8px', borderRadius: '4px', border: `1px solid ${config.color}30`, fontFamily: "'Orbitron', sans-serif", fontWeight: '700', letterSpacing: '1px'}}>{job.job_type.replace('_', ' ').toUpperCase()}</span>
                        {job.budget_type && <span style={{background: 'rgba(16,185,129,0.08)', color: '#4ade80', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(16,185,129,0.2)', fontFamily: "'Orbitron', sans-serif", fontWeight: '700', letterSpacing: '1px'}}>{job.budget_type.toUpperCase()}</span>}
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Link href={`/profile/${job.posted_by}`} onClick={e => e.stopPropagation()}>
                          <span style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: '#374151', cursor: 'pointer'}}>
                            BY <span style={{color: '#ef4444', fontWeight: '700'}}>{job.users?.name?.toUpperCase() || 'ANONYMOUS'}</span>
                          </span>
                        </Link>
                        <span style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: '#374151'}}>{job.applications_count || 0} APPLICANTS</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(239,68,68,0.15)'}}>
                      <Link href={`/marketplace/jobs/${job.id}`}>
                        <button style={{
                          width: '100%', background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                          border: 'none', borderRadius: '8px', color: 'white',
                          padding: '10px', fontFamily: "'Orbitron', sans-serif",
                          fontWeight: '900', fontSize: '11px', letterSpacing: '2px',
                          cursor: 'pointer', boxShadow: '0 0 15px rgba(239,68,68,0.4)'
                        }}>VIEW & APPLY →</button>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL */}
        {selectedJob && (
          <div style={{
            width: '290px', flexShrink: 0,
            background: 'rgba(5,5,16,0.92)',
            borderLeft: '1px solid rgba(239,68,68,0.1)',
            display: 'flex', flexDirection: 'column',
            overflowY: 'auto',
            backdropFilter: 'blur(10px)',
            position: 'relative'
          }}>
            {/* Rainbow line */}
            <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px', background: 'linear-gradient(90deg,#ef4444,#f97316,#fbbf24,#10b981,#00ffff,#6366f1)'}}/>
            {/* Corner brackets */}
            <div style={{position: 'absolute', top: '8px', right: '8px', width: '12px', height: '12px', borderTop: '1.5px solid rgba(0,255,255,0.4)', borderRight: '1.5px solid rgba(0,255,255,0.4)'}}/>
            <div style={{position: 'absolute', bottom: '8px', left: '8px', width: '12px', height: '12px', borderBottom: '1.5px solid rgba(239,68,68,0.3)', borderLeft: '1.5px solid rgba(239,68,68,0.3)'}}/>

            <div style={{padding: '16px', borderBottom: '1px solid rgba(239,68,68,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px'}}>
                <div style={{width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%', boxShadow: '0 0 6px #ef4444'}}/>
                <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', fontWeight: '900', color: 'rgba(239,68,68,0.6)', letterSpacing: '3px'}}>//  JOB DETAILS</span>
              </div>
              {(() => {
                const config = getConfig(selectedJob.job_type);
                return (
                  <>
                    <div style={{
                      width: '100%', height: '80px', borderRadius: '10px',
                      background: config.gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '36px', marginBottom: '12px',
                      boxShadow: `0 0 20px ${config.color}40`,
                      position: 'relative', overflow: 'hidden'
                    }}>
                      <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 4px)'}}/>
                      {config.icon}
                    </div>
                    <h2 style={{fontFamily: "'Rajdhani', sans-serif", fontWeight: '900', fontSize: '15px', color: 'white', letterSpacing: '1px', margin: '0 0 4px'}}>{selectedJob.title}</h2>
                    <p style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: '#4b5563', marginBottom: '10px'}}>BY {selectedJob.users?.name?.toUpperCase() || 'ANONYMOUS'}</p>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                      <span style={{background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.2)', fontFamily: "'Orbitron', sans-serif", fontWeight: '700'}}>{selectedJob.game}</span>
                      <span style={{background: config.color + '15', color: config.color, fontSize: '10px', padding: '2px 8px', borderRadius: '4px', border: `1px solid ${config.color}30`, fontFamily: "'Orbitron', sans-serif", fontWeight: '700'}}>{selectedJob.job_type.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  </>
                );
              })()}
            </div>

            <div style={{padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px'}}>
              <div>
                <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px'}}>
                  <div style={{width: '3px', height: '3px', background: '#ef4444', borderRadius: '50%'}}/>
                  <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '8px', fontWeight: '900', color: 'rgba(239,68,68,0.6)', letterSpacing: '3px'}}>//  DESCRIPTION</span>
                </div>
                <p style={{fontFamily: "'Rajdhani', sans-serif", fontSize: '12px', color: '#9ca3af', lineHeight: '1.6'}}>{selectedJob.description}</p>
              </div>
              {selectedJob.requirements && (
                <div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px'}}>
                    <div style={{width: '3px', height: '3px', background: '#00ffff', borderRadius: '50%'}}/>
                    <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '8px', fontWeight: '900', color: 'rgba(0,255,255,0.5)', letterSpacing: '3px'}}>//  REQUIREMENTS</span>
                  </div>
                  <p style={{fontFamily: "'Rajdhani', sans-serif", fontSize: '12px', color: '#9ca3af', lineHeight: '1.6'}}>{selectedJob.requirements}</p>
                </div>
              )}
              <div>
                <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px'}}>
                  <div style={{width: '3px', height: '3px', background: '#a78bfa', borderRadius: '50%'}}/>
                  <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '8px', fontWeight: '900', color: 'rgba(167,139,250,0.5)', letterSpacing: '3px'}}>//  INFO</span>
                </div>
                {[
                  { label: 'GAME', value: selectedJob.game },
                  { label: 'ROLE', value: selectedJob.job_type.replace('_', ' ').toUpperCase() },
                  { label: 'COMPENSATION', value: selectedJob.budget_type?.toUpperCase() || 'N/A' },
                  { label: 'EXPERIENCE', value: selectedJob.experience_level?.toUpperCase() || 'N/A' },
                  { label: 'APPLICANTS', value: `${selectedJob.applications_count || 0} PLAYERS` },
                  { label: 'POSTED', value: new Date(selectedJob.created_at).toLocaleDateString() },
                ].map(({ label, value }) => (
                  <div key={label} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.03)'}}>
                    <span style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#374151', letterSpacing: '1px'}}>{label}</span>
                    <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: 'white', fontWeight: '700'}}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{padding: '16px', borderTop: '1px solid rgba(239,68,68,0.08)'}}>
              <Link href={`/marketplace/jobs/${selectedJob.id}`}>
                <button style={{
                  width: '100%',
                  background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                  border: 'none', borderRadius: '10px', color: 'white',
                  padding: '13px', fontFamily: "'Orbitron', sans-serif",
                  fontWeight: '900', fontSize: '12px', letterSpacing: '3px',
                  cursor: 'pointer', boxShadow: '0 0 25px rgba(239,68,68,0.5)',
                  marginBottom: '8px', animation: 'glowPulse 3s infinite'
                }}>⚡ APPLY NOW</button>
              </Link>
              <p style={{textAlign: 'center', fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: '#374151'}}>{selectedJob.applications_count || 0} players already applied</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
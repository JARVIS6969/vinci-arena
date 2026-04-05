'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MarketplacePage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeGame, setActiveGame] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('');

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
    } catch (err) {
      console.error('Fetch jobs error:', err);
    } finally {
      setLoading(false);
    }
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
    player: { icon: '👤', color: 'from-blue-600 to-cyan-600', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    squad: { icon: '👥', color: 'from-green-600 to-emerald-600', badge: 'bg-green-500/20 text-green-300 border-green-500/30' },
    content_creator: { icon: '🎥', color: 'from-pink-600 to-rose-600', badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
    coach: { icon: '🎓', color: 'from-purple-600 to-violet-600', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    analyst: { icon: '📊', color: 'from-orange-600 to-red-600', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  };

  const getConfig = (type) => jobTypeConfig[type] || { icon: '💼', color: 'from-red-600 to-purple-600', badge: 'bg-red-500/20 text-red-300 border-red-500/30' };

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
      background: '#07070f',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: "'Rajdhani', 'Orbitron', sans-serif"
    }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;700;900&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #ef4444; border-radius: 2px; }
        .neon-border { box-shadow: 0 0 10px rgba(239,68,68,0.3), inset 0 0 10px rgba(239,68,68,0.05); }
        .neon-border-active { box-shadow: 0 0 15px rgba(239,68,68,0.6), 0 0 30px rgba(239,68,68,0.3), inset 0 0 15px rgba(239,68,68,0.1); }
        .card-hover { transition: all 0.2s ease; }
        .card-hover:hover { transform: translateY(-2px); }
        .pulse-dot { animation: pulseDot 2s infinite; }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>

      {/* SUB HEADER */}
      <div style={{
        background: '#080810',
        borderBottom: '1px solid rgba(239,68,68,0.2)',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0
      }}>
        <div style={{flex: 1, maxWidth: '480px', position: 'relative'}}>
          <span style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#ef4444'}}>🔍</span>
          <input
            type="text"
            placeholder="SEARCH OPPORTUNITIES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#0a0a0a',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '6px',
              paddingLeft: '32px',
              paddingRight: '12px',
              paddingTop: '7px',
              paddingBottom: '7px',
              color: 'white',
              fontSize: '11px',
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: '700',
              letterSpacing: '1px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
          <span style={{width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 6px #4ade80', display: 'inline-block'}}/>
          <span style={{color: '#4ade80', fontSize: '11px', fontWeight: '700', fontFamily: "'Orbitron', sans-serif", letterSpacing: '2px'}}>{jobs.length} LIVE</span>
        </div>
        <div style={{marginLeft: 'auto', display: 'flex', gap: '8px'}}>
          <Link href="/marketplace/my-applications">
            <button style={{
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: '#9ca3af',
              padding: '7px 14px',
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: '700',
              fontSize: '10px',
              letterSpacing: '2px',
              cursor: 'pointer'
            }}>📋 MY ACTIVITY</button>
          </Link>
          <Link href="/marketplace/post">
            <button style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              padding: '7px 16px',
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: '900',
              fontSize: '10px',
              letterSpacing: '2px',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(239,68,68,0.4)'
            }}>+ POST JOB</button>
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{flex: 1, display: 'flex', overflow: 'hidden'}}>

        {/* LEFT SIDEBAR */}
        <div style={{
          width: '224px',
          background: '#07070f',
          borderRight: '1px solid rgba(239,68,68,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          <div style={{padding: '12px', borderBottom: '1px solid rgba(239,68,68,0.15)'}}>
            <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', fontWeight: '900', color: 'rgba(239,68,68,0.7)', letterSpacing: '3px', marginBottom: '8px'}}>//  GAMES</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
              {games.map((game) => (
                <button key={game.id} onClick={() => setActiveGame(game.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: '700',
                    fontSize: '11px',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: activeGame === game.id ? 'rgba(239,68,68,0.15)' : 'transparent',
                    border: activeGame === game.id ? '1px solid rgba(239,68,68,0.5)' : '1px solid transparent',
                    color: activeGame === game.id ? '#fca5a5' : '#6b7280',
                    transition: 'all 0.2s'
                  }}>
                  <span>{game.icon}</span>
                  <span>{game.name.toUpperCase()}</span>
                  {activeGame === game.id && <span style={{marginLeft: 'auto', color: '#ef4444'}}>▶</span>}
                </button>
              ))}
            </div>
          </div>

          <div style={{flex: 1, overflowY: 'auto', padding: '12px'}}>
            <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', fontWeight: '900', color: 'rgba(239,68,68,0.7)', letterSpacing: '3px', marginBottom: '8px'}}>//  ROLES</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
              {categories.map((cat) => {
                const count = cat.id === 'all' ? jobs.length : jobs.filter(j => j.job_type === cat.id).length;
                return (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: '700',
                      fontSize: '11px',
                      letterSpacing: '1px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: activeCategory === cat.id ? 'rgba(239,68,68,0.15)' : 'transparent',
                      border: activeCategory === cat.id ? '1px solid rgba(239,68,68,0.5)' : '1px solid transparent',
                      color: activeCategory === cat.id ? 'white' : '#6b7280',
                      transition: 'all 0.2s'
                    }}>
                    <span>{cat.icon}</span>
                    <span style={{flex: 1}}>{cat.name.toUpperCase()}</span>
                    {count > 0 && (
                      <span style={{
                        fontSize: '10px',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontWeight: '900',
                        background: activeCategory === cat.id ? '#ef4444' : '#1f2937',
                        color: activeCategory === cat.id ? 'white' : '#6b7280'
                      }}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* USER */}
          <div style={{padding: '12px', borderTop: '1px solid rgba(239,68,68,0.15)', background: '#050508'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <div style={{
                width: '32px', height: '32px',
                background: 'linear-gradient(135deg, #ef4444, #7c3aed)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: '900',
                fontSize: '13px',
                color: 'white',
                boxShadow: '0 0 10px rgba(239,68,68,0.4)',
                flexShrink: 0
              }}>
                {userName[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{fontFamily: "'Orbitron', sans-serif", fontWeight: '900', fontSize: '11px', color: 'white', letterSpacing: '1px', margin: 0}}>{userName.toUpperCase()}</p>
                <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px'}}>
                  <span className="pulse-dot" style={{width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%', display: 'inline-block'}}/>
                  <span style={{fontSize: '10px', color: '#4ade80', fontWeight: '700'}}>ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER FEED */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'rgba(10,10,20,0.5)'}}>
          <div style={{
            padding: '8px 16px',
            borderBottom: '1px solid rgba(239,68,68,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0,0,0,0.3)',
            flexShrink: 0
          }}>
            <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '10px', fontWeight: '900', color: '#ef4444', letterSpacing: '2px'}}>
              ⚡ {activeCategory === 'all' ? 'ALL OPPORTUNITIES' : activeCategory.toUpperCase().replace('_', ' ')}
            </span>
            <span style={{fontSize: '11px', color: '#4b5563'}}>— {filteredJobs.length} results</span>
          </div>

          <div style={{flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {loading ? (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px'}}>
                <div style={{width: '48px', height: '48px', border: '2px solid rgba(239,68,68,0.3)', borderTop: '2px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite'}}/>
                <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: 'rgba(239,68,68,0.6)', letterSpacing: '3px'}}>LOADING DATA...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px'}}>
                <div style={{fontSize: '48px'}}>💀</div>
                <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '16px', color: '#ef4444', fontWeight: '900', letterSpacing: '3px'}}>NO RESULTS FOUND</p>
                <p style={{fontSize: '11px', color: '#4b5563', letterSpacing: '1px'}}>Try different filters or post your own opportunity</p>
                <Link href="/marketplace/post">
                  <button style={{background: '#ef4444', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', fontFamily: "'Orbitron', sans-serif", fontWeight: '900', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 0 15px rgba(239,68,68,0.4)'}}>+ POST NOW</button>
                </Link>
              </div>
            ) : filteredJobs.map((job) => {
              const config = getConfig(job.job_type);
              const isSelected = selectedJob?.id === job.id;
              return (
                <div key={job.id} onClick={() => setSelectedJob(job)}
                  className={`card-hover ${isSelected ? 'neon-border-active' : 'neon-border'}`}
                  style={{
                    background: '#0a0a14',
                    border: isSelected ? '1px solid rgba(239,68,68,0.8)' : '1px solid #1f2937',
                    borderRadius: '10px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                  <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                    <div className={`bg-gradient-to-br ${config.color}`}
                      style={{width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0}}>
                      {config.icon}
                    </div>
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px'}}>
                        <h3 style={{fontFamily: "'Rajdhani', sans-serif", fontWeight: '900', fontSize: '14px', color: 'white', letterSpacing: '1px', margin: 0}}>{job.title}</h3>
                        <span style={{fontSize: '10px', color: '#4b5563', fontWeight: '700', flexShrink: 0}}>{timeAgo(job.created_at)}</span>
                      </div>
                      <p style={{fontSize: '11px', color: '#6b7280', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{job.description}</p>
                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px'}}>
                        <span style={{background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.2)', fontWeight: '700'}}>{job.game}</span>
                        <span className={config.badge} style={{fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: '700'}}>{job.job_type.replace('_', ' ').toUpperCase()}</span>
                        {job.budget_type && <span style={{background: 'rgba(34,197,94,0.1)', color: '#4ade80', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(34,197,94,0.2)', fontWeight: '700'}}>{job.budget_type.toUpperCase()}</span>}
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Link href={`/profile/${job.posted_by}`} onClick={e => e.stopPropagation()}>
                          <span style={{fontSize: '11px', color: '#4b5563', cursor: 'pointer'}}>BY <span style={{color: '#ef4444', fontWeight: '700'}}>{job.users?.name?.toUpperCase() || 'ANONYMOUS'}</span></span>
                        </Link>
                        <span style={{fontSize: '10px', color: '#4b5563', fontWeight: '700'}}>{job.applications_count || 0} APPLICANTS</span>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(239,68,68,0.2)'}}>
                      <Link href={`/marketplace/jobs/${job.id}`}>
                        <button style={{width: '100%', background: '#ef4444', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', fontFamily: "'Orbitron', sans-serif", fontWeight: '900', fontSize: '11px', letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 0 10px rgba(239,68,68,0.4)'}}>VIEW & APPLY →</button>
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
            width: '300px',
            background: '#07070f',
            borderLeft: '1px solid rgba(239,68,68,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            flexShrink: 0
          }}>
            <div style={{padding: '16px', borderBottom: '1px solid rgba(239,68,68,0.15)'}}>
              <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', fontWeight: '900', color: 'rgba(239,68,68,0.7)', letterSpacing: '3px', marginBottom: '12px'}}>//  JOB DETAILS</p>
              {(() => {
                const config = getConfig(selectedJob.job_type);
                return (
                  <>
                    <div className={`bg-gradient-to-br ${config.color}`}
                      style={{width: '100%', height: '80px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', marginBottom: '12px'}}>
                      {config.icon}
                    </div>
                    <h2 style={{fontFamily: "'Rajdhani', sans-serif", fontWeight: '900', fontSize: '15px', color: 'white', letterSpacing: '1px', margin: '0 0 4px'}}>{selectedJob.title}</h2>
                    <p style={{fontSize: '11px', color: '#6b7280', fontWeight: '700', marginBottom: '10px'}}>BY {selectedJob.users?.name?.toUpperCase() || 'ANONYMOUS'}</p>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                      <span style={{background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.2)', fontWeight: '700'}}>{selectedJob.game}</span>
                      <span className={config.badge} style={{fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: '700'}}>{selectedJob.job_type.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  </>
                );
              })()}
            </div>

            <div style={{padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div>
                <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', fontWeight: '900', color: 'rgba(239,68,68,0.7)', letterSpacing: '3px', marginBottom: '8px'}}>//  DESCRIPTION</p>
                <p style={{fontSize: '11px', color: '#9ca3af', lineHeight: '1.6'}}>{selectedJob.description}</p>
              </div>
              {selectedJob.requirements && (
                <div>
                  <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', fontWeight: '900', color: 'rgba(239,68,68,0.7)', letterSpacing: '3px', marginBottom: '8px'}}>//  REQUIREMENTS</p>
                  <p style={{fontSize: '11px', color: '#9ca3af', lineHeight: '1.6'}}>{selectedJob.requirements}</p>
                </div>
              )}
              <div>
                <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', fontWeight: '900', color: 'rgba(239,68,68,0.7)', letterSpacing: '3px', marginBottom: '8px'}}>//  INFO</p>
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  {[
                    { label: 'GAME', value: selectedJob.game },
                    { label: 'ROLE', value: selectedJob.job_type.replace('_', ' ').toUpperCase() },
                    { label: 'COMPENSATION', value: selectedJob.budget_type?.toUpperCase() || 'N/A' },
                    { label: 'EXPERIENCE', value: selectedJob.experience_level?.toUpperCase() || 'N/A' },
                    { label: 'APPLICANTS', value: `${selectedJob.applications_count || 0} PLAYERS` },
                    { label: 'POSTED', value: new Date(selectedJob.created_at).toLocaleDateString() },
                  ].map(({ label, value }) => (
                    <div key={label} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #111'}}>
                      <span style={{fontSize: '10px', color: '#4b5563', fontWeight: '700', letterSpacing: '1px'}}>{label}</span>
                      <span style={{fontSize: '11px', color: 'white', fontWeight: '900'}}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{padding: '16px', borderTop: '1px solid rgba(239,68,68,0.15)'}}>
              <Link href={`/marketplace/jobs/${selectedJob.id}`}>
                <button style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '6px',
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: '900',
                  fontSize: '12px',
                  letterSpacing: '2px',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(239,68,68,0.5)',
                  marginBottom: '8px'
                }}>⚡ APPLY NOW</button>
              </Link>
              <p style={{textAlign: 'center', fontSize: '10px', color: '#374151', fontWeight: '700'}}>{selectedJob.applications_count || 0} players already applied</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
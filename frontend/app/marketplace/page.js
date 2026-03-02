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
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden" style={{fontFamily: "'Rajdhani', 'Orbitron', sans-serif"}}>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;700;900&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #ef4444; border-radius: 2px; }
        .neon-red { text-shadow: 0 0 10px #ef4444, 0 0 20px #ef4444, 0 0 40px #ef4444; }
        .neon-border { box-shadow: 0 0 10px rgba(239,68,68,0.3), inset 0 0 10px rgba(239,68,68,0.05); }
        .neon-border-active { box-shadow: 0 0 15px rgba(239,68,68,0.6), 0 0 30px rgba(239,68,68,0.3), inset 0 0 15px rgba(239,68,68,0.1); }
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .scan-line { background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239,68,68,0.015) 2px, rgba(239,68,68,0.015) 4px); }
        .card-hover { transition: all 0.2s ease; }
        .card-hover:hover { transform: translateY(-2px); }
        .glitch { animation: glitch 3s infinite; }
        @keyframes glitch {
          0%, 90%, 100% { text-shadow: 0 0 10px #ef4444, 0 0 20px #ef4444; }
          92% { text-shadow: -2px 0 #00ffff, 2px 0 #ef4444; }
          94% { text-shadow: 2px 0 #00ffff, -2px 0 #ef4444; }
          96% { text-shadow: 0 0 10px #ef4444, 0 0 20px #ef4444; }
        }
        .pulse-dot { animation: pulseDot 2s infinite; }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>

      {/* TOP BAR */}
      <div className="h-14 bg-black border-b border-red-500/30 flex items-center px-4 z-50 relative" style={{boxShadow: '0 0 20px rgba(239,68,68,0.2)'}}>
        <div className="absolute inset-0 scan-line pointer-events-none opacity-50" />
        <div className="flex items-center gap-3 flex-1">
          <button onClick={() => router.push('/esports')} className="text-red-400 hover:text-red-300 transition font-bold text-lg mr-1">←</button>
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center" style={{boxShadow: '0 0 15px rgba(239,68,68,0.7)'}}>
            <span className="text-sm">⚡</span>
          </div>
          <h1 className="text-base font-black tracking-widest glitch" style={{fontFamily: "'Orbitron', sans-serif", color: '#ef4444'}}>VINCI MARKET</h1>
          <div className="ml-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full pulse-dot inline-block" />
            <span className="text-xs text-green-400 font-bold">{jobs.length} LIVE</span>
          </div>
        </div>
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 text-sm">🔍</span>
            <input
              type="text"
              placeholder="SEARCH OPPORTUNITIES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-950 border border-red-500/30 rounded pl-9 pr-4 py-2 text-xs font-bold tracking-wider text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition"
              style={{fontFamily: "'Rajdhani', sans-serif"}}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/marketplace/my-applications">
            <button className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-red-500/50 text-gray-300 hover:text-white px-3 py-1.5 rounded font-bold text-xs tracking-wider transition">
              📋 MY APPS
            </button>
          </Link>
          <Link href="/marketplace/post">
            <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded font-black text-xs tracking-widest transition" style={{boxShadow: '0 0 15px rgba(239,68,68,0.5)'}}>
              + POST JOB
            </button>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden grid-bg">
        {/* LEFT SIDEBAR */}
        <div className="w-56 bg-black border-r border-red-500/20 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-red-500/20">
            <p className="text-xs font-black tracking-widest text-red-500/70 mb-2" style={{fontFamily: "'Orbitron', sans-serif"}}>// GAMES</p>
            <div className="space-y-0.5">
              {games.map((game) => (
                <button key={game.id} onClick={() => setActiveGame(game.id)}
                  className={`w-full text-left px-3 py-2 rounded font-bold text-xs tracking-wider transition flex items-center gap-2 ${
                    activeGame === game.id ? 'bg-red-600/20 border border-red-500/60 text-red-300' : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300 border border-transparent'
                  }`}>
                  <span>{game.icon}</span>
                  <span>{game.name.toUpperCase()}</span>
                  {activeGame === game.id && <span className="ml-auto text-red-500">▶</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <p className="text-xs font-black tracking-widest text-red-500/70 mb-2" style={{fontFamily: "'Orbitron', sans-serif"}}>// ROLES</p>
            <div className="space-y-0.5">
              {categories.map((cat) => {
                const count = cat.id === 'all' ? jobs.length : jobs.filter(j => j.job_type === cat.id).length;
                return (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded font-bold text-xs tracking-wider transition border ${
                      activeCategory === cat.id ? 'bg-red-600/20 border-red-500/60 text-white' : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300 border-transparent'
                    }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name.toUpperCase()}</span>
                      </div>
                      {count > 0 && (
                        <span className={`text-xs px-1.5 py-0.5 rounded font-black ${activeCategory === cat.id ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}>{count}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="p-3 border-t border-red-500/20 bg-black">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-purple-600 rounded flex items-center justify-center font-black text-sm" style={{boxShadow: '0 0 10px rgba(239,68,68,0.4)'}}>
                {userName[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-black text-xs tracking-wider text-white">{userName.toUpperCase()}</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full pulse-dot" />
                  <span className="text-xs text-green-400 font-bold">ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER FEED */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-950/30">
          <div className="px-4 py-2 border-b border-red-500/20 flex items-center justify-between bg-black/50">
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-black text-xs tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>
                ⚡ {activeCategory === 'all' ? 'ALL OPPORTUNITIES' : activeCategory.toUpperCase().replace('_', ' ')}
              </span>
              <span className="text-gray-600 text-xs">— {filteredJobs.length} results</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                <p className="text-red-500/60 text-xs tracking-widest font-bold" style={{fontFamily: "'Orbitron', sans-serif"}}>LOADING DATA...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="text-5xl">💀</div>
                <p className="text-red-500 font-black text-lg tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>NO RESULTS FOUND</p>
                <p className="text-gray-600 text-xs tracking-wider">Try different filters or post your own opportunity</p>
                <Link href="/marketplace/post">
                  <button className="mt-2 bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded font-black text-xs tracking-widest transition" style={{boxShadow: '0 0 15px rgba(239,68,68,0.4)'}}>+ POST NOW</button>
                </Link>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const config = getConfig(job.job_type);
                const isSelected = selectedJob?.id === job.id;
                return (
                  <div key={job.id} onClick={() => setSelectedJob(job)}
                    className={`card-hover bg-gray-950 border rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected ? 'border-red-500/80 neon-border-active' : 'border-gray-800 hover:border-red-500/40 neon-border'
                    }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
                        {config.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-black text-sm tracking-wide text-white leading-tight">{job.title}</h3>
                          <span className="text-xs text-gray-600 flex-shrink-0 font-bold">{timeAgo(job.created_at)}</span>
                        </div>
                        <p className="text-gray-500 text-xs mb-2 line-clamp-1">{job.description}</p>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="bg-red-500/10 text-red-400 text-xs px-2 py-0.5 rounded border border-red-500/20 font-bold tracking-wider">{job.game}</span>
                          <span className={`text-xs px-2 py-0.5 rounded border font-bold tracking-wider ${config.badge}`}>{job.job_type.replace('_', ' ').toUpperCase()}</span>
                          {job.budget_type && <span className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded border border-green-500/20 font-bold tracking-wider">{job.budget_type.toUpperCase()}</span>}
                        </div>
                        <div className="flex items-center justify-between">
                          <Link href={`/profile/${job.posted_by}`} onClick={e => e.stopPropagation()}>
  <span className="text-xs text-gray-600 hover:text-red-400 transition cursor-pointer">BY <span className="text-red-400 font-bold hover:underline">{job.users?.name?.toUpperCase() || 'ANONYMOUS'}</span></span>
</Link>
                          <span className="text-xs text-gray-600 font-bold">{job.applications_count || 0} APPLICANTS</span>
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-red-500/20">
                        <Link href={`/marketplace/jobs/${job.id}`}>
                          <button className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded font-black text-xs tracking-widest transition" style={{boxShadow: '0 0 10px rgba(239,68,68,0.4)'}}>VIEW & APPLY →</button>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        {selectedJob && (
          <div className="w-80 bg-black border-l border-red-500/20 overflow-y-auto flex flex-col">
            <div className="p-4 border-b border-red-500/20">
              <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// JOB DETAILS</p>
              {(() => {
                const config = getConfig(selectedJob.job_type);
                return (
                  <>
                    <div className={`w-full h-24 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center text-4xl mb-4`}>
                      {config.icon}
                    </div>
                    <h2 className="font-black text-base tracking-wide text-white mb-1">{selectedJob.title}</h2>
                    <p className="text-xs text-gray-500 font-bold mb-3">BY {selectedJob.users?.name?.toUpperCase() || 'ANONYMOUS'}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="bg-red-500/10 text-red-400 text-xs px-2 py-0.5 rounded border border-red-500/20 font-bold">{selectedJob.game}</span>
                      <span className={`text-xs px-2 py-0.5 rounded border font-bold ${config.badge}`}>{selectedJob.job_type.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="p-4 space-y-4 flex-1">
              <div>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-2" style={{fontFamily: "'Orbitron', sans-serif"}}>// DESCRIPTION</p>
                <p className="text-gray-400 text-xs leading-relaxed">{selectedJob.description}</p>
              </div>
              {selectedJob.requirements && (
                <div>
                  <p className="text-xs font-black tracking-widest text-red-500/70 mb-2" style={{fontFamily: "'Orbitron', sans-serif"}}>// REQUIREMENTS</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{selectedJob.requirements}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-2" style={{fontFamily: "'Orbitron', sans-serif"}}>// INFO</p>
                <div className="space-y-2">
                  {[
                    { label: 'GAME', value: selectedJob.game },
                    { label: 'ROLE', value: selectedJob.job_type.replace('_', ' ').toUpperCase() },
                    { label: 'COMPENSATION', value: selectedJob.budget_type?.toUpperCase() || 'N/A' },
                    { label: 'EXPERIENCE', value: selectedJob.experience_level?.toUpperCase() || 'N/A' },
                    { label: 'APPLICANTS', value: `${selectedJob.applications_count || 0} PLAYERS` },
                    { label: 'POSTED', value: new Date(selectedJob.created_at).toLocaleDateString() },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-1.5 border-b border-gray-900">
                      <span className="text-xs text-gray-600 font-bold tracking-wider">{label}</span>
                      <span className="text-xs text-white font-black">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-red-500/20">
              <Link href={`/marketplace/jobs/${selectedJob.id}`}>
                <button className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded font-black text-sm tracking-widest transition mb-2" style={{boxShadow: '0 0 20px rgba(239,68,68,0.5)'}}>
                  ⚡ APPLY NOW
                </button>
              </Link>
              <p className="text-center text-xs text-gray-700 font-bold">{selectedJob.applications_count || 0} players already applied</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

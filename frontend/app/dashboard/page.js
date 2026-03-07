'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    if (!token) { router.push('/login'); return; }
    setUserName(name);
    fetchTournaments();
  }, [router]);

  const fetchTournaments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/tournaments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setTournaments(await res.json());
    } catch (err) { console.error(err); }
  };

  const features = [
    { icon: '🎨', label: 'Vinci Studio', sub: 'Create graphics', href: '/studio', color: '#ef4444', live: true },
    { icon: '🏆', label: 'Tournaments', sub: tournaments.length + ' created', href: '/tournaments/create', color: '#eab308', live: true },
    { icon: '💼', label: 'Marketplace', sub: 'Jobs & opportunities', href: '/marketplace', color: '#8b5cf6', live: true },
    { icon: '👥', label: 'Squads', sub: 'Create & manage teams', href: '/squads', color: '#06b6d4', live: true },
    { icon: '👤', label: 'My Profile', sub: 'Achievements & clips', href: '/profile', color: '#10b981', live: true },
    { icon: '💬', label: 'Chat', sub: 'DMs & Groups', href: '/chat', color: '#f97316', live: true },
    { icon: '📊', label: 'Rankings', sub: 'Global leaderboards', href: '/rankings', color: '#6366f1', live: false },
  ];

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif", paddingTop: '44px'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .shimmer { background: linear-gradient(90deg, #ef4444, #f97316, #ef4444); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s linear infinite; }
        .feature-row { transition: all 0.2s ease; border-left: 2px solid transparent; }
        .feature-row:hover { background: rgba(239,68,68,0.05); border-left-color: #ef4444; }
        .main-card { transition: all 0.3s ease; }
        .main-card:hover { transform: translateY(-3px); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #ef4444; border-radius: 2px; }
        .search-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(239,68,68,0.2); border-radius: 50px; color: white; font-family: 'Rajdhani'; font-weight: 600; font-size: 13px; padding: 8px 20px; outline: none; transition: all 0.2s; width: 400px; }
        .search-input:focus { border-color: rgba(239,68,68,0.5); box-shadow: 0 0 15px rgba(239,68,68,0.1); }
        .search-input::placeholder { color: #4b5563; }
      `}</style>

      <div className="border-b border-red-500/10 bg-black sticky top-[104px] z-40 px-6 py-2 flex items-center justify-center">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm"></span>
          <input className="search-input pl-10" placeholder="Search tournaments, players, jobs..."
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && search.trim()) {
                const q = search.toLowerCase();
                if (q.includes('job') || q.includes('market')) router.push('/marketplace');
                else if (q.includes('squad')) router.push('/squads');
                else if (q.includes('chat')) router.push('/chat');
                else if (q.includes('studio')) router.push('/studio');
                else if (q.includes('profile')) router.push('/profile');
                else router.push('/tournaments/create');
              }
            }}
          />
        </div>
      </div>

      <div className="grid-bg min-h-screen">
        <div className="flex">

          <div className="w-64 min-h-screen border-r border-red-500/10 bg-black/40 flex flex-col sticky top-[104px] h-screen overflow-y-auto flex-shrink-0">
            <div className="p-4 border-b border-red-500/10">
              <p className="text-xs text-gray-600 font-black tracking-widest mb-1">WELCOME BACK</p>
              <p className="font-black text-white text-sm tracking-wider" style={{fontFamily: "'Orbitron', sans-serif"}}>
                {userName?.toUpperCase() || 'PLAYER'}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-bold">ONLINE</span>
              </div>
            </div>

            <div className="p-3 flex-1">
              <p className="text-xs font-black tracking-widest text-gray-700 mb-3 px-2" style={{fontFamily: "'Orbitron', sans-serif"}}>//  FEATURES</p>
              {features.map((f, i) => (
                <Link href={f.href} key={i}>
                  <div className="feature-row flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer mb-1">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                      style={{background: f.color + '15', border: '1px solid ' + f.color + '30'}}>
                      {f.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-xs text-white">{f.label}</p>
                      <p className="text-xs text-gray-600 truncate">{f.sub}</p>
                    </div>
                    <span className={'text-xs px-1.5 py-0.5 rounded font-black ' + (f.live ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500')}
                      style={{fontSize: '9px'}}>
                      {f.live ? 'LIVE' : 'SOON'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="p-4 border-t border-red-500/10">
              <p className="text-xs font-black tracking-widest text-gray-700 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>//  MY STATS</p>
              <div className="grid grid-cols-2 gap-2">
                {[['🏆', tournaments.length, 'Tournaments'], ['🎮', '—', 'Matches']].map(([icon, val, label]) => (
                  <div key={label} className="bg-gray-950 border border-gray-800 rounded-lg p-2 text-center">
                    <div className="text-lg">{icon}</div>
                    <div className="font-black text-red-400 text-sm">{val}</div>
                    <div className="text-xs text-gray-600 font-bold">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">

            <div className="main-card relative overflow-hidden rounded-2xl p-6 mb-4 cursor-pointer"
              style={{background: 'linear-gradient(135deg, #1a0000, #0a0010, #00050d)', border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 0 40px rgba(239,68,68,0.1)'}}
              onClick={() => router.push('/studio')}>
              <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(rgba(239,68,68,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px'}} />
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-15" style={{background: 'radial-gradient(circle, #ef4444, transparent)', filter: 'blur(30px)'}} />
              <div className="relative flex items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 mb-3">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-400 text-xs font-black tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>CREATIVE SUITE</span>
                  </div>
                  <h2 className="font-black text-2xl text-white mb-2" style={{fontFamily: "'Orbitron', sans-serif"}}>
                    <span className="shimmer">VINCI STUDIO</span>
                  </h2>
                  <p className="text-gray-400 text-sm font-bold mb-3 max-w-md">Create point tables, winner certificates, tournament banners and MVP cards. Professional esports graphics in seconds.</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['📊 Point Tables', '🏆 Certificates', '🎨 Banners', '⚡ MVP Cards'].map(f => (
                      <span key={f} className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-full font-bold">{f}</span>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-xl font-black text-xs tracking-widest transition"
                    style={{boxShadow: '0 0 20px rgba(239,68,68,0.4)'}}>
                    🎨 OPEN VINCI STUDIO →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                  {[
                    {icon: '📊', label: 'POINT TABLE', color: '#ef4444'},
                    {icon: '🏆', label: 'CERTIFICATE', color: '#eab308'},
                    {icon: '🎨', label: 'BANNER', color: '#8b5cf6'},
                    {icon: '⚡', label: 'MVP CARD', color: '#06b6d4'},
                  ].map(tool => (
                    <div key={tool.label} className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1"
                      style={{background: '#0a0a0a', border: '1px solid ' + tool.color + '30'}}>
                      <span className="text-2xl">{tool.icon}</span>
                      <span className="font-black" style={{color: tool.color, fontFamily: "'Orbitron', sans-serif", fontSize: '7px'}}>{tool.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="main-card relative overflow-hidden rounded-2xl p-6 cursor-pointer"
              style={{background: 'linear-gradient(135deg, #0d0005, #0a0000, #050010)', border: '1px solid rgba(239,68,68,0.25)', boxShadow: '0 0 40px rgba(239,68,68,0.08)'}}
              onClick={() => router.push('/esports')}>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #ef4444, transparent)', filter: 'blur(30px)'}} />
              <div className="relative flex items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 mb-3">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-400 text-xs font-black tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>ESPORTS ECOSYSTEM</span>
                  </div>
                  <h2 className="font-black text-2xl text-white mb-2" style={{fontFamily: "'Orbitron', sans-serif"}}>ESPORTS HUB</h2>
                  <p className="text-gray-400 text-sm font-bold mb-3 max-w-md">Find teams, hire coaches, join squads and build your esports career. India's first grassroots esports platform.</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['💼 Marketplace', '👥 Squads', '👤 Profiles', '📊 Rankings (Soon)'].map(f => (
                      <span key={f} className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-full font-bold">{f}</span>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-xl font-black text-xs tracking-widest transition"
                    style={{boxShadow: '0 0 20px rgba(239,68,68,0.4)'}}>
                    🚀 EXPLORE ESPORTS HUB →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                  {[
                    {icon: '💼', label: 'MARKETPLACE', color: '#8b5cf6', live: true},
                    {icon: '👥', label: 'SQUADS', color: '#06b6d4', live: true},
                    {icon: '👤', label: 'PROFILES', color: '#10b981', live: true},
                    {icon: '📊', label: 'RANKINGS', color: '#6366f1', live: false},
                  ].map(tool => (
                    <div key={tool.label} className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1"
                      style={{background: '#0a0a0a', border: '1px solid ' + tool.color + '30'}}>
                      <span className="text-2xl">{tool.icon}</span>
                      <span className="font-black" style={{color: tool.color, fontFamily: "'Orbitron', sans-serif", fontSize: '7px'}}>{tool.label}</span>
                      <span className="font-black" style={{fontSize: '7px', color: tool.live ? '#10b981' : '#eab308'}}>{tool.live ? '● LIVE' : '● SOON'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
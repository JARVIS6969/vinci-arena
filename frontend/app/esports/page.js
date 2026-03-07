'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EsportsHubPage() {
  const router = useRouter();

  const features = [
    { icon: '💼', title: 'MARKETPLACE', desc: 'Find jobs, hire coaches & analysts. Post opportunities and get discovered.', href: '/marketplace', color: '#ef4444', glow: 'rgba(239,68,68,0.4)', tag: 'LIVE', features: ['Post jobs', 'Apply for roles', 'Accept/Reject players'] },
    { icon: '👥', title: 'SQUADS', desc: 'Create your team, manage members and compete together in tournaments.', href: '/squads', color: '#f97316', glow: 'rgba(249,115,22,0.4)', tag: 'LIVE', features: ['Create squad', 'Manage roster', 'Squad chat'] },
    { icon: '👤', title: 'PLAYER PROFILES', desc: 'Build your gaming portfolio. Showcase achievements, clips and stats.', href: '/profile', color: '#dc2626', glow: 'rgba(220,38,38,0.4)', tag: 'LIVE', features: ['Achievements', 'Gameplay clips', 'Public profile'] },
    { icon: '📊', title: 'RANKINGS', desc: 'Global and India leaderboards. See who is the best player in your region.', href: '/rankings', color: '#b91c1c', glow: 'rgba(185,28,28,0.4)', tag: 'SOON', features: ['Player rankings', 'Squad rankings', 'Game-wise leaderboard'] },
  ];

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .scan-line { background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239,68,68,0.01) 2px, rgba(99,102,241,0.01) 4px); }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
       .shimmer { background: linear-gradient(90deg, #FF6A00, #FF8C00, #FF6A00); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s linear infinite; }
        .feature-card { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .feature-card:hover { transform: translateY(-6px); }
        @keyframes glow-pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        .glow-pulse { animation: glow-pulse 3s infinite; }
      `}</style>

      {/* HERO */}
      <div className="relative overflow-hidden scan-line" style={{background: 'linear-gradient(135deg, #00000a 0%, #000 50%, #0a0005 100%)', minHeight: '400px'}}>
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-5 glow-pulse" style={{background: 'radial-gradient(circle, #ef4444, transparent)', filter: 'blur(60px)'}} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-5 glow-pulse" style={{background: 'radial-gradient(circle, #dc2626, transparent)', filter: 'blur(60px)', animationDelay: '1.5s'}} />

        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-black tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>ESPORTS ECOSYSTEM</span>
          </div>

          <h1 className="font-black mb-4 leading-none" style={{fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(40px, 8vw, 80px)'}}>
            <span className="shimmer">ESPORTS</span>
            <span className="text-white"> HUB</span>
          </h1>
          <p className="text-gray-400 text-lg font-bold max-w-2xl mx-auto mb-8">
            India's first grassroots esports platform. Find teams, hire coaches, build your career and climb the rankings.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap mb-10">
            <Link href="/marketplace">
              <button className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-black text-sm tracking-widest transition"
                style={{boxShadow: '0 0 30px rgba(99,102,241,0.3)'}}>
                🚀 EXPLORE HUB
              </button>
            </Link>
            <Link href="/profile">
              <button className="flex items-center gap-2 bg-transparent border border-gray-700 hover:border-red-500/50 text-gray-400 hover:text-white px-8 py-3 rounded-xl font-black text-sm tracking-widest transition">
                👤 MY PROFILE
              </button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[['500+', 'PLAYERS'], ['50+', 'SQUADS'], ['100+', 'JOB POSTS'], ['FREE', 'TO JOIN']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="font-black text-xl" style={{color: '#FF6A00', fontFamily: "'Orbitron', sans-serif"}}>{val}</div>
                <div className="text-xs text-gray-600 font-black tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* FEATURES GRID */}
        <div className="mb-12">
          <div className="mb-8">
            <p className="text-xs font-black tracking-widest text-indigo-500/70 mb-1" style={{fontFamily: "'Orbitron', sans-serif"}}>// WHAT WE OFFER</p>
            <h2 className="font-black text-2xl text-white" style={{fontFamily: "'Orbitron', sans-serif"}}>PLATFORM FEATURES</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.title} className="feature-card rounded-2xl p-5 border relative overflow-hidden cursor-pointer"
                style={{background: '#050505', borderColor: f.color + '30', boxShadow: `0 0 20px ${f.glow}10`}}
                onClick={() => f.tag === 'LIVE' && router.push(f.href)}>
                <div className="absolute inset-0 opacity-5" style={{background: `radial-gradient(circle at top right, ${f.color}, transparent)`}} />
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`}} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{background: f.color + '15', border: `1px solid ${f.color}30`}}>
                        {f.icon}
                      </div>
                      <div>
                        <h3 className="font-black text-sm text-white tracking-wider" style={{fontFamily: "'Orbitron', sans-serif"}}>{f.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded border font-black ${f.tag === 'LIVE' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'}`}>
                          {f.tag}
                        </span>
                      </div>
                    </div>
                    {f.tag === 'LIVE' && <span className="text-xs font-black tracking-wider" style={{color: f.color}}>OPEN →</span>}
                  </div>

                  <p className="text-gray-500 text-xs font-bold mb-3">{f.desc}</p>

                  <div className="flex flex-wrap gap-2">
                    {f.features.map((feat, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded font-bold" style={{background: f.color + '10', color: f.color, border: `1px solid ${f.color}20`}}>
                        ▸ {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* JOIN CTA */}
        <div className="rounded-2xl p-8 text-center relative overflow-hidden"
          style={{background: 'linear-gradient(135deg, #00000a, #05000f)', border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 0 40px rgba(239,68,68,0.1)'}}>
          <div className="grid-bg absolute inset-0 opacity-30" />
          <div className="relative">
            <div className="text-4xl mb-4">🏆</div>
            <h2 className="font-black text-2xl mb-2 text-white" style={{fontFamily: "'Orbitron', sans-serif"}}>READY TO GO PRO?</h2>
            <p className="text-gray-400 font-bold mb-6 max-w-lg mx-auto">Join thousands of Indian esports players already on VINCI-ARENA. Build your profile, find your team, and start competing.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/marketplace">
                <button className="text-white px-8 py-3 rounded-xl font-black text-sm tracking-widest transition"
                  style={{background: 'linear-gradient(135deg, #FF3B3B, #FF7A18)', boxShadow: '0 0 25px rgba(255,59,59,0.5)'}}>
                  💼 BROWSE MARKETPLACE
                </button>
              </Link>
              <Link href="/squads">
                <button className="border border-gray-700 hover:border-red-500/50 text-gray-300 hover:text-white px-8 py-3 rounded-xl font-black text-sm tracking-widest transition">
                  👥 FIND A SQUAD
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
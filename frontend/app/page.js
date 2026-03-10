'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    if (token) {
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUserName(null);
    router.push('/');
  };

  // RIPPLE EFFECT FUNCTION
  const createRipple = (event) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* EPIC BACKGROUND IMAGE */}
      <div 
      className="fixed inset-0 bg-cover bg-center bg-no-repeat"
style={{
  backgroundImage: 'url(/dashboard-bg.png)',
  backgroundColor: '#1a0000',
          opacity: 0.8,
          filter: 'brightness(0.7)'
        }}
      ></div>
      
      {/* DARK OVERLAY */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>

      {/* CONTENT */}
      <div className="relative z-10">
        {/* HEADER - NOW WITH HOVER EFFECT */}
        

        {/* HERO SECTION */}
        <div className="relative">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              {/* INTRODUCING TAG */}
              <div className="flex justify-center mb-12">
                <div className="tag-box">
                  <div className="tag">
                    <span className="flex items-center gap-2">
                      <img src="/vinci-symbol.jpg" alt="" className="w-4 h-4 object-contain inline-block" />
                      INTRODUCING ▸ VINCI-ARENA
                    </span>
                  </div>
                </div>
              </div>

              {/* MAIN HEADING - ALL WITH GRADIENT NOW */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-4 leading-tight drop-shadow-2xl">
                <span className="block vinci-gradient-text cursor-pointer">
                  Welcome to
                </span>
                <span className="block vinci-gradient-text cursor-pointer">
                  VINCI-ARENA
                </span>
              </h1>

              {/* SUB HEADING - WITH CUSTOM RED GRADIENT */}
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 drop-shadow-xl leading-normal py-4">
                <span className="vinci-gradient-secondary cursor-pointer pb-2">
                  Manage Esports Like a Pro
                </span>
              </h2>

              {/* DESCRIPTION */}
              <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-lg">
                Make your own gaming portfolio. Track matches, calculate points automatically, 
                and export professional standings for Free Fire, BGMI, and Valorant tournaments.
              </p>

              {/* CTA BUTTONS WITH RIPPLE */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {userName ? (
                  <button
                    onClick={(e) => { createRipple(e); router.push('/dashboard'); }}
                    className="professional-button-large ripple-container"
                  >
                    Go to Dashboard ▸
                  </button>
                ) : (
                  <>
                    <button
                      onClick={(e) => { createRipple(e); router.push('/register'); }}
                      className="professional-button-large ripple-container"
                    >
                      Get Dashboard ▸
                    </button>
                    <button
                      onClick={(e) => { createRipple(e); router.push('/login'); }}
                      className="professional-button-outline-large ripple-container"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* FEATURES SECTION */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <p className="text-xs font-black tracking-widest mb-2" style={{fontFamily: "'Orbitron', sans-serif", color: '#ef4444', textShadow: '0 0 20px #ef4444'}}>//  PLATFORM FEATURES</p>
            <h2 className="text-4xl font-black text-white" style={{textShadow: '0 0 40px rgba(239,68,68,0.3)'}}>Everything You Need</h2>
            <p className="text-gray-400 mt-3 font-bold">One platform. Every esports tool you need.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📊', title: 'Point Table Generator', desc: 'Auto-calculate standings for Free Fire, BGMI, Valorant. Export stunning PNG with 40 pro templates.', color: '#ef4444', glow: 'rgba(239,68,68,0.15)', tag: 'FREE', tagColor: '#ef4444' },
              { icon: '🏆', title: 'Certificate Generator', desc: 'Instantly create Winner, MVP & Participation certificates. Professional quality in one click.', color: '#f59e0b', glow: 'rgba(245,158,11,0.15)', tag: 'FREE', tagColor: '#f59e0b' },
              { icon: '🛒', title: 'Marketplace', desc: 'Find players, coaches & analysts. Post openings. India biggest esports hiring platform.', color: '#10b981', glow: 'rgba(16,185,129,0.15)', tag: 'LIVE', tagColor: '#10b981' },
              { icon: '💬', title: 'Chat System', desc: 'Real-time DMs and group chats. Built-in team communication with WebSocket technology.', color: '#6366f1', glow: 'rgba(99,102,241,0.15)', tag: 'LIVE', tagColor: '#6366f1' },
              { icon: '👤', title: 'Gaming Profile', desc: 'Build your esports portfolio. Showcase stats, tournaments and achievements to recruiters.', color: '#a855f7', glow: 'rgba(168,85,247,0.15)', tag: 'LIVE', tagColor: '#a855f7' },
              { icon: '🎨', title: 'Vinci Studio', desc: 'All-in-one esports graphic studio. Point tables, certificates, banners — create like a pro.', color: '#DC143C', glow: 'rgba(220,20,60,0.15)', tag: 'NEW', tagColor: '#DC143C' },
            ].map((f, i) => (
              <div key={i} className="relative group cursor-pointer">
                {/* Glow blob */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" style={{background: f.glow}} />
                {/* Card */}
                <div className="relative rounded-2xl p-7 h-full transition-all duration-300 group-hover:translate-y-[-4px]"
                  style={{background: 'linear-gradient(145deg, #0d0d0d, #080808)', border: `1px solid ${f.color}25`, boxShadow: `0 4px 24px ${f.color}10`}}>
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl relative"
                      style={{background: `linear-gradient(135deg, ${f.color}20, ${f.color}08)`, border: `1px solid ${f.color}40`, boxShadow: `0 0 20px ${f.color}30`}}>
                      {f.icon}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{boxShadow: `0 0 25px ${f.color}50`}} />
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full tracking-widest" style={{
                      background: `${f.tagColor}15`,
                      color: f.tagColor,
                      border: `1px solid ${f.tagColor}35`,
                      boxShadow: `0 0 12px ${f.tagColor}25`,
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: '9px'
                    }}>{f.tag}</span>
                  </div>
                  {/* Title */}
                  <h3 className="font-black text-white mb-1.5 tracking-wide" style={{fontFamily: "'Orbitron', sans-serif", fontSize: '13px'}}>{f.title}</h3>
                  {/* Neon underline */}
                  <div className="w-10 h-0.5 mb-3 rounded-full transition-all duration-300 group-hover:w-20" style={{background: `linear-gradient(90deg, ${f.color}, transparent)`}} />
                  {/* Desc */}
                  <p className="text-gray-500 text-sm font-semibold leading-relaxed group-hover:text-gray-400 transition-colors duration-300">{f.desc}</p>
                  {/* Bottom arrow */}
                  <div className="mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-xs font-black tracking-widest" style={{color: f.color, fontFamily: "'Orbitron', sans-serif", fontSize: '9px'}}>EXPLORE</span>
                    <span style={{color: f.color, fontSize: '10px'}}>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUPPORTED GAMES */}
        <div className="bg-black/30 backdrop-blur-sm border-y border-[#DC143C]/30 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-black text-white text-center mb-12 drop-shadow-xl">
              Supported Games
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#DC143C] to-[#A52A2A] rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition"></div>
                <div className="relative bg-black/40 backdrop-blur-lg border border-[#DC143C]/50 rounded-2xl p-8 text-center hover:scale-105 transition hover:border-[#DC143C]/70 shadow-lg shadow-[#DC143C]/20">
                  <div className="text-6xl mb-4">🔥</div>
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Free Fire</h3>
                  <p className="text-gray-200 font-light drop-shadow-md">12 position scoring + kills</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#A52A2A] to-[#8B0000] rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition"></div>
                <div className="relative bg-black/40 backdrop-blur-lg border border-[#A52A2A]/50 rounded-2xl p-8 text-center hover:scale-105 transition hover:border-[#A52A2A]/70 shadow-lg shadow-[#A52A2A]/20">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">BGMI</h3>
                  <p className="text-gray-200 font-light drop-shadow-md">8 position scoring + kills</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000] to-[#DC143C] rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition"></div>
                <div className="relative bg-black/40 backdrop-blur-lg border border-[#8B0000]/50 rounded-2xl p-8 text-center hover:scale-105 transition hover:border-[#8B0000]/70 shadow-lg shadow-[#8B0000]/20">
                  <div className="text-6xl mb-4">⚔️</div>
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Valorant</h3>
                  <p className="text-gray-200 font-light drop-shadow-md">4 position scoring + kills</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-black/30 backdrop-blur-lg border border-[#DC143C]/30 rounded-2xl p-6 hover:border-[#DC143C]/50 transition shadow-lg shadow-[#DC143C]/10">
              <div className="text-5xl font-black bg-gradient-to-r from-[#DC143C] to-[#A52A2A] text-transparent bg-clip-text mb-2 drop-shadow-lg">40</div>
              <div className="text-gray-200 font-light drop-shadow-md">Export Templates</div>
            </div>
            <div className="bg-black/30 backdrop-blur-lg border border-[#A52A2A]/30 rounded-2xl p-6 hover:border-[#A52A2A]/50 transition shadow-lg shadow-[#A52A2A]/10">
              <div className="text-5xl font-black bg-gradient-to-r from-[#A52A2A] to-[#8B0000] text-transparent bg-clip-text mb-2 drop-shadow-lg">3</div>
              <div className="text-gray-200 font-light drop-shadow-md">Games Supported</div>
            </div>
            <div className="bg-black/30 backdrop-blur-lg border border-[#8B0000]/30 rounded-2xl p-6 hover:border-[#8B0000]/50 transition shadow-lg shadow-[#8B0000]/10">
              <div className="text-5xl font-black bg-gradient-to-r from-[#8B0000] to-[#DC143C] text-transparent bg-clip-text mb-2 drop-shadow-lg">∞</div>
              <div className="text-gray-200 font-light drop-shadow-md">Tournaments</div>
            </div>
            <div className="bg-black/30 backdrop-blur-lg border border-[#DC143C]/30 rounded-2xl p-6 hover:border-[#DC143C]/50 transition shadow-lg shadow-[#DC143C]/10">
              <div className="text-5xl font-black bg-gradient-to-r from-[#DC143C] to-[#A52A2A] text-transparent bg-clip-text mb-2 drop-shadow-lg">⚡</div>
              <div className="text-gray-200 font-light drop-shadow-md">Lightning Fast</div>
            </div>
          </div>
        </div>
        {/* VINCI STUDIO BANNER */}
       
        {/* WHY VINCI ARENA */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-xs font-black tracking-widest mb-2" style={{fontFamily: "'Orbitron', sans-serif", color: '#ef4444', textShadow: '0 0 20px #ef4444'}}>//  WHY CHOOSE US</p>
              <h2 className="text-4xl font-black text-white" style={{textShadow: '0 0 40px rgba(239,68,68,0.3)'}}>Why VINCI-ARENA?</h2>
              <p className="text-gray-400 mt-3 font-bold max-w-2xl mx-auto">India's first platform built for grassroots esports organizers and players</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '🆓', title: 'COMPLETELY FREE', desc: 'No subscription. No hidden charges. All core features free forever.', color: '#10b981' },
                { icon: '🇮🇳', title: 'MADE FOR INDIA', desc: 'Built for Free Fire, BGMI and Valorant communities across India.', color: '#ef4444' },
                { icon: '⚡', title: 'NO DESIGN SKILLS', desc: 'Anyone can create professional tournament graphics. No Photoshop needed.', color: '#f97316' },
                { icon: '📱', title: 'SHARE ANYWHERE', desc: 'Download PNG and share on WhatsApp, Instagram, YouTube instantly.', color: '#6366f1' },
              ].map((w, i) => (
                <div key={i} className="p-6 rounded-2xl text-center group cursor-pointer transition-all duration-300 hover:scale-105"
                  style={{background: '#050505', border: `1px solid ${w.color}30`, boxShadow: `0 0 20px ${w.color}10`, transition: 'all 0.3s'}}>
                  <div className="text-4xl mb-4" style={{filter: `drop-shadow(0 0 8px ${w.color})`}}>{w.icon}</div>
                  <h3 className="font-black text-white text-sm mb-2" style={{fontFamily: "'Orbitron', sans-serif", textShadow: `0 0 15px ${w.color}80`}}>{w.title}</h3>
                  <div className="w-8 h-0.5 mx-auto mb-2 rounded" style={{background: `linear-gradient(90deg, transparent, ${w.color}, transparent)`}} />
                  <p className="text-gray-500 text-sm font-bold">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WHO IS THIS FOR */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <p className="text-xs font-black tracking-widest mb-2" style={{fontFamily: "'Orbitron', sans-serif", color: '#ef4444', textShadow: '0 0 20px #ef4444'}}>//  FOR EVERYONE</p>
            <h2 className="text-4xl font-black text-white" style={{textShadow: '0 0 40px rgba(239,68,68,0.3)'}}>Who Is This For?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🎮', title: 'TOURNAMENT ORGANIZERS', color: '#ef4444', points: ['Manage multiple tournaments', 'Auto calculate point tables', 'Export professional graphics', 'Share results instantly'] },
              { icon: '👥', title: 'ESPORTS TEAMS', color: '#f97316', points: ['Create squad profiles', 'Find players via marketplace', 'Build team portfolio', 'Track tournament history'] },
              { icon: '🏆', title: 'PLAYERS', color: '#eab308', points: ['Build gaming portfolio', 'Find job opportunities', 'Get winner certificates', 'Join group chats'] },
            ].map((u, i) => (
              <div key={i} className="p-8 rounded-2xl hover:scale-105 transition-all duration-300"
                style={{background: '#050505', border: `1px solid ${u.color}25`, boxShadow: `0 0 30px ${u.color}08`}}>
                <div className="text-4xl mb-4" style={{filter: `drop-shadow(0 0 10px ${u.color})`}}>{u.icon}</div>
                <h3 className="font-black text-white mb-4" style={{fontFamily: "'Orbitron', sans-serif", fontSize: '13px', textShadow: `0 0 15px ${u.color}80`}}>{u.title}</h3>
                <div className="w-12 h-0.5 mb-4 rounded" style={{background: `linear-gradient(90deg, ${u.color}, transparent)`}} />
                <ul className="space-y-3">
                  {u.points.map((p, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-bold text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background: u.color, boxShadow: `0 0 6px ${u.color}`}} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <p className="text-xs font-black tracking-widest mb-2" style={{fontFamily: "'Orbitron', sans-serif", color: '#ef4444', textShadow: '0 0 20px #ef4444'}}>//  FAQ</p>
            <h2 className="text-4xl font-black text-white" style={{textShadow: '0 0 40px rgba(239,68,68,0.3)'}}>Frequently Asked</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Is VINCI-ARENA completely free?', a: 'Yes! All core features including tournament calculator, point tables, certificates, marketplace and chat are completely free.' },
              { q: 'Which games are supported?', a: 'Free Fire, BGMI and Valorant with game-specific scoring. More games coming soon.' },
              { q: 'Can I export point tables as images?', a: 'Yes! 40 professional templates available. Export beautiful PNG to share on social media or WhatsApp.' },
              { q: 'How do I find players or jobs?', a: 'Visit Marketplace to post jobs, find coaches, analysts or players. Apply directly through the platform.' },
              { q: 'Is there a mobile app?', a: 'Currently a web platform optimized for desktop and mobile browsers. Native app coming soon.' },
            ].map((faq, i) => (
              <div key={i} className="p-5 rounded-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer group"
                style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)', boxShadow: '0 0 20px rgba(239,68,68,0.03)'}}>
                <div className="flex items-start gap-3">
                  <span className="font-black text-xs mt-0.5 px-2 py-0.5 rounded" style={{background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontFamily: "'Orbitron', sans-serif", border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 0 10px rgba(239,68,68,0.2)'}}>Q</span>
                  <div>
                    <p className="font-black text-white text-sm mb-1.5" style={{fontFamily: "'Orbitron', sans-serif", fontSize: '11px'}}>{faq.q}</p>
                    <p className="text-gray-500 text-sm font-bold leading-relaxed">→ {faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative overflow-hidden rounded-3xl p-8 md:p-12"
            style={{background: 'linear-gradient(135deg, #1a0000 0%, #0a0010 50%, #000a1a 100%)', border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 0 60px rgba(239,68,68,0.1)'}}>

            {/* Grid bg */}
            <div className="absolute inset-0 opacity-30 rounded-3xl" style={{backgroundImage: 'linear-gradient(rgba(239,68,68,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />

            {/* Glow blobs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #ef4444, transparent)', filter: 'blur(40px)'}} />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #8b5cf6, transparent)', filter: 'blur(40px)'}} />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5 mb-4">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-400 text-xs font-black tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>NEW FEATURE</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight" style={{fontFamily: "'Orbitron', sans-serif"}}>
                  INTRODUCING<br />
                  <span style={{background: 'linear-gradient(90deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>VINCI STUDIO</span>
                </h2>
                <p className="text-gray-400 font-bold mb-4 max-w-lg">
                  Create professional esports graphics in seconds. Point tables, winner certificates, tournament banners, MVP cards — all in one place.
                </p>
                <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
                  {['📊 Point Tables', '🏆 Certificates', '🎨 Banners', '⚡ MVP Cards'].map(f => (
                    <span key={f} className="text-xs bg-white/5 border border-white/10 text-gray-300 px-3 py-1 rounded-full font-bold">{f}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 justify-center md:justify-start flex-wrap">
                  <button onClick={() => router.push('/studio')}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-black text-sm tracking-widest transition"
                    style={{boxShadow: '0 0 25px rgba(239,68,68,0.5)'}}>
                    🎨 OPEN VINCI STUDIO →
                  </button>
                  <div className="flex items-center gap-4">
                    {[['FREE', 'TO USE'], ['5K+', 'CREATIONS']].map(([val, label]) => (
                      <div key={label} className="text-center">
                        <div className="font-black text-red-400 text-sm" style={{fontFamily: "'Orbitron', sans-serif"}}>{val}</div>
                        <div className="text-xs text-gray-600 font-black tracking-wider">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right - Tool Icons */}
              <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                {[
                  {icon: '📊', label: 'POINT TABLE', color: '#ef4444'},
                  {icon: '🏆', label: 'CERTIFICATE', color: '#eab308'},
                  {icon: '🎨', label: 'BANNER', color: '#8b5cf6'},
                  {icon: '⚡', label: 'MVP CARD', color: '#06b6d4'},
                ].map((tool) => (
                  <div key={tool.label} className="w-28 h-28 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition hover:scale-105"
                    style={{background: '#0a0a0a', border: `1px solid ${tool.color}30`, boxShadow: `0 0 15px ${tool.color}15`}}
                    onClick={() => router.push('/studio')}>
                    <span className="text-3xl">{tool.icon}</span>
                    <span className="text-xs font-black tracking-wider" style={{color: tool.color, fontFamily: "'Orbitron', sans-serif", fontSize: '9px'}}>{tool.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        {!userName && (
          <div className="relative overflow-hidden bg-black/50 backdrop-blur-sm border-y border-[#DC143C]/30">
            <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-2xl">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-200 mb-8 font-light drop-shadow-lg">
                Join now and start managing your tournaments like a pro.
              </p>
              <button
                onClick={(e) => { createRipple(e); router.push('/register'); }}
                className="professional-button-white-large ripple-container"
              >
                Create Free Account ▸
              </button>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="bg-black/60 backdrop-blur-md border-t border-[#DC143C]/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/vinci-symbol.jpg" alt="Vinci-Arena" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-white drop-shadow-lg">VINCI-ARENA</span>
            </div>
            <p className="text-gray-300 mb-4 font-light drop-shadow-md">
              The ultimate tournament calculator for esports
            </p>
            <p className="text-gray-500 text-sm font-light">
              © 2026 Vinci-Arena. Built with Next.js & Supabase.
            </p>
          </div>
        </footer>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .ripple-container {
          position: relative;
          overflow: visible;
        }

        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple-animation 0.6s ease-out;
          pointer-events: none;
        }

        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        .vinci-gradient-text {
          background: linear-gradient(
            45deg,
            #DC143C,
            #FF4500,
            #FFFFFF,
            #A52A2A,
            #8B0000,
            #696969,
            #D2691E,
            #F5DEB3,
            #DC143C
          );
          background-size: 400% 400%;
          animation: vinci-gradient-flow 8s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
          position: relative;
          z-index: 1;
        }

        .vinci-gradient-secondary {
          background: linear-gradient(
            45deg,
            #DC143C,
            #FF6347,
            #FFFFFF,
            #8B4513,
            #B22222,
            #808080,
            #CD853F,
            #FFE4C4,
            #DC143C
          );
          background-size: 400% 400%;
          animation: vinci-gradient-flow 8s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
          position: relative;
          z-index: 1;
        }

        @keyframes vinci-gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .tag-box {
          display: inline-flex;
          justify-content: center;
          align-items: center;
        }

        .tag {
          background: linear-gradient(90deg, 
            rgba(139, 0, 0, 0.15) 0%, 
            rgba(220, 20, 60, 0.25) 50%, 
            rgba(165, 42, 42, 0.15) 100%
          );
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid rgba(220, 20, 60, 0.6);
          border-radius: 50px;
          padding: 12px 24px;
          color: #DC143C;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          box-shadow: 
            0 4px 20px rgba(220, 20, 60, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          display: inline-block;
          white-space: nowrap;
          transition: all 0.3s ease;
        }

        .tag:hover {
          background: linear-gradient(90deg, 
            rgba(139, 0, 0, 0.25) 0%, 
            rgba(220, 20, 60, 0.35) 50%, 
            rgba(165, 42, 42, 0.25) 100%
          );
          border-color: rgba(220, 20, 60, 0.8);
          box-shadow: 
            0 6px 30px rgba(220, 20, 60, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .professional-button {
          background: linear-gradient(90deg, 
            rgba(139, 0, 0, 0.2) 0%, 
            rgba(220, 20, 60, 0.3) 50%, 
            rgba(165, 42, 42, 0.2) 100%
          );
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1.5px solid rgba(220, 20, 60, 0.6);
          border-radius: 50px;
          padding: 12px 24px;
          color: #DC143C;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1px;
          box-shadow: 0 4px 15px rgba(220, 20, 60, 0.2);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .professional-button:hover {
          background: linear-gradient(90deg, 
            rgba(139, 0, 0, 0.3) 0%, 
            rgba(220, 20, 60, 0.4) 50%, 
            rgba(165, 42, 42, 0.3) 100%
          );
          border-color: rgba(220, 20, 60, 0.8);
          box-shadow: 0 6px 25px rgba(220, 20, 60, 0.35);
          transform: translateY(-2px);
        }

        .professional-button:active {
          transform: translateY(0) scale(0.98);
        }

        .professional-button-outline {
          background: transparent;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1.5px solid rgba(220, 20, 60, 0.4);
          border-radius: 50px;
          padding: 12px 24px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .professional-button-outline:hover {
          border-color: rgba(220, 20, 60, 0.7);
          background: rgba(220, 20, 60, 0.1);
          box-shadow: 0 4px 20px rgba(220, 20, 60, 0.2);
          transform: translateY(-2px);
        }

        .professional-button-outline:active {
          transform: translateY(0) scale(0.98);
        }

        .professional-button-large {
          background: linear-gradient(90deg, 
            rgba(139, 0, 0, 0.2) 0%, 
            rgba(220, 20, 60, 0.3) 50%, 
            rgba(165, 42, 42, 0.2) 100%
          );
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 2px solid rgba(220, 20, 60, 0.6);
          border-radius: 50px;
          padding: 16px 40px;
          color: #DC143C;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 1px;
          box-shadow: 0 6px 25px rgba(220, 20, 60, 0.3);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .professional-button-large:hover {
          background: linear-gradient(90deg, 
            rgba(139, 0, 0, 0.3) 0%, 
            rgba(220, 20, 60, 0.4) 50%, 
            rgba(165, 42, 42, 0.3) 100%
          );
          border-color: rgba(220, 20, 60, 0.9);
          box-shadow: 0 8px 35px rgba(220, 20, 60, 0.45);
          transform: translateY(-3px) scale(1.02);
        }

        .professional-button-large:active {
          transform: translateY(0) scale(0.98);
        }

        .professional-button-outline-large {
          background: transparent;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 2px solid rgba(220, 20, 60, 0.5);
          border-radius: 50px;
          padding: 16px 40px;
          color: #ffffff;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 1px;
          box-shadow: 0 4px 20px rgba(220, 20, 60, 0.15);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .professional-button-outline-large:hover {
          border-color: rgba(220, 20, 60, 0.8);
          background: rgba(220, 20, 60, 0.15);
          box-shadow: 0 6px 30px rgba(220, 20, 60, 0.3);
          transform: translateY(-3px) scale(1.02);
        }

        .professional-button-outline-large:active {
          transform: translateY(0) scale(0.98);
        }

        .professional-button-white-large {
          background: #ffffff;
          border: 2px solid transparent;
          border-radius: 50px;
          padding: 16px 40px;
          color: #DC143C;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 1px;
          box-shadow: 0 8px 35px rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .professional-button-white-large:hover {
          background: #f5f5f5;
          box-shadow: 0 10px 45px rgba(255, 255, 255, 0.4);
          transform: translateY(-3px) scale(1.02);
        }

        .professional-button-white-large:active {
          transform: translateY(0) scale(0.98);
        }

        .hover-click-glow {
          position: relative;
          display: inline-block;
          transition: all 0.4s ease;
          user-select: none;
        }

        .hover-click-glow:hover {
          background: linear-gradient(90deg, #DC143C 0%, #A52A2A 50%, #DC143C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 20px rgba(220, 20, 60, 0.8));
        }

        .hover-click-glow:active {
          background: linear-gradient(90deg, #FF1744 0%, #FF5722 50%, #FF1744 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 30px rgba(255, 23, 68, 1));
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}

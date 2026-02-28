'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || '');
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    router.push('/');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@600;700&display=swap');
        .nav-logo:hover .nav-logo-text { color: #ef4444; text-shadow: 0 0 20px rgba(239,68,68,0.8), 0 0 40px rgba(239,68,68,0.4); }
        .nav-logo:hover .nav-logo-icon { box-shadow: 0 0 20px rgba(239,68,68,0.8), 0 0 40px rgba(239,68,68,0.4); }
        .nav-link { position: relative; transition: all 0.2s; }
        .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1px; background: #ef4444; transition: width 0.2s; box-shadow: 0 0 8px rgba(239,68,68,0.8); }
        .nav-link:hover::after { width: 100%; }
        .nav-link:hover { color: #ef4444; text-shadow: 0 0 10px rgba(239,68,68,0.5); }
      `}</style>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 border-b border-red-500/40' : 'bg-black/70 border-b border-red-500/20'
      }`} style={{backdropFilter: 'blur(20px)', boxShadow: scrolled ? '0 0 30px rgba(239,68,68,0.15)' : 'none'}}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="nav-logo flex items-center gap-3 cursor-pointer">
            <div className="nav-logo-icon w-10 h-10 bg-black border border-red-500/50 rounded-lg flex items-center justify-center overflow-hidden transition-all duration-300">
              <img src="/vinci-symbol.jpg" alt="Vinci" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <div className="nav-logo-text font-black tracking-widest text-white transition-all duration-300" style={{fontFamily: "'Orbitron', sans-serif", fontSize: '14px'}}>
                VINCI-ARENA
              </div>
              <div className="text-xs text-red-500 font-bold tracking-wider" style={{fontFamily: "'Rajdhani', sans-serif"}}>
                Track. Calculate. Win.
              </div>
            </div>
          </Link>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard">
              <span className="nav-link text-gray-400 text-xs font-black tracking-widest cursor-pointer" style={{fontFamily: "'Rajdhani', sans-serif"}}>
                DASHBOARD
              </span>
            </Link>
            <Link href="/tournaments/create">
              <span className="nav-link text-gray-400 text-xs font-black tracking-widest cursor-pointer" style={{fontFamily: "'Rajdhani', sans-serif"}}>
                CREATE POINT TABLE
              </span>
            </Link>
            <Link href="/marketplace">
              <span className="nav-link text-gray-400 text-xs font-black tracking-widest cursor-pointer" style={{fontFamily: "'Rajdhani', sans-serif"}}>
                MARKETPLACE
              </span>
            </Link>
            <Link href="/squads">
              <span className="nav-link text-gray-400 text-xs font-black tracking-widest cursor-pointer" style={{fontFamily: "'Rajdhani', sans-serif"}}>
                SQUADS
              </span>
            </Link>
            <Link href="/profile">
              <span className="nav-link text-gray-400 text-xs font-black tracking-widest cursor-pointer" style={{fontFamily: "'Rajdhani', sans-serif"}}>
                PROFILE
              </span>
            </Link>
            <Link href="/chat">
              <span className="nav-link text-gray-400 text-xs font-black tracking-widest cursor-pointer" style={{fontFamily: "'Rajdhani', sans-serif"}}>
                CHAT
              </span>
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {userName ? (
              <>
                <div className="flex items-center gap-2 bg-red-600/10 border border-red-500/30 px-3 py-1.5 rounded-lg">
                  <div className="w-6 h-6 bg-gradient-to-br from-red-600 to-purple-600 rounded flex items-center justify-center font-black text-xs" style={{boxShadow: '0 0 8px rgba(239,68,68,0.4)'}}>
                    {userName[0]?.toUpperCase()}
                  </div>
                  <span className="text-white text-xs font-black tracking-wider" style={{fontFamily: "'Rajdhani', sans-serif"}}>
                    {userName.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-400 text-xs font-black tracking-wider transition border border-gray-800 hover:border-red-500/40 px-3 py-1.5 rounded-lg"
                  style={{fontFamily: "'Rajdhani', sans-serif"}}
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="text-gray-400 hover:text-white text-xs font-black tracking-wider transition px-3 py-1.5" style={{fontFamily: "'Rajdhani', sans-serif"}}>
                    LOGIN
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-red-600 hover:bg-red-500 text-white text-xs font-black tracking-wider px-4 py-1.5 rounded-lg transition" style={{fontFamily: "'Rajdhani', sans-serif", boxShadow: '0 0 15px rgba(239,68,68,0.4)'}}>
                    SIGN UP
                  </button>
                </Link>
              </>
            )}
          </div>

        </div>
      </nav>

      {/* SPACER so content doesn't hide behind fixed navbar */}
      <div className="h-16" />
    </>
  );
}
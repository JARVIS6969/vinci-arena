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
          <h2 className="text-4xl font-black text-white text-center mb-16 drop-shadow-xl">
            Everything You Need
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#DC143C] to-[#A52A2A] rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition"></div>
              <div className="relative bg-black/40 backdrop-blur-lg border border-[#DC143C]/50 rounded-2xl p-8 hover:border-[#DC143C]/70 transition hover:scale-105 shadow-lg shadow-[#DC143C]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#DC143C] to-[#A52A2A] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#DC143C]/50">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Auto Calculate</h3>
                <p className="text-gray-200 font-light drop-shadow-md">
                  Free Fire, BGMI, Valorant scoring. 
                  Add matches, points calculate automatically.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#A52A2A] to-[#8B0000] rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition"></div>
              <div className="relative bg-black/40 backdrop-blur-lg border border-[#A52A2A]/50 rounded-2xl p-8 hover:border-[#A52A2A]/70 transition hover:scale-105 shadow-lg shadow-[#A52A2A]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#A52A2A] to-[#8B0000] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#A52A2A]/50">
                  <span className="text-4xl">🎨</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">23 Templates</h3>
                <p className="text-gray-200 font-light drop-shadow-md">
                  Professional designs to export standings 
                  as beautiful PNG images.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000] to-[#DC143C] rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition"></div>
              <div className="relative bg-black/40 backdrop-blur-lg border border-[#8B0000]/50 rounded-2xl p-8 hover:border-[#8B0000]/70 transition hover:scale-105 shadow-lg shadow-[#8B0000]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8B0000] to-[#DC143C] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#8B0000]/50">
                  <span className="text-4xl">⚡</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Lightning Fast</h3>
                <p className="text-gray-200 font-light drop-shadow-md">
                  Add 12 teams at once. Bulk entry mode. 
                  Get results in seconds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SUPPORTED GAMES */}
        <div className="bg-black/30 backdrop-blur-sm border-y border-[#DC143C]/30 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-black text-white text-center mb-12 drop-shadow-xl">
              Supported Games
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
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
              <div className="text-5xl font-black bg-gradient-to-r from-[#DC143C] to-[#A52A2A] text-transparent bg-clip-text mb-2 drop-shadow-lg">23</div>
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

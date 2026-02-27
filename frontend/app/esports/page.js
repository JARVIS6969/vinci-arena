'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EsportsHubPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      
      {/* HEADER */}
      

      {/* HERO SECTION */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-purple-600/20 to-red-600/20 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="absolute inset-0 bg-red-600 blur-3xl opacity-50 scale-125"></div>
            <div className="relative bg-black/60 backdrop-blur-md p-6 rounded-3xl border border-red-500/30 shadow-2xl">
              <img src="/vinci-logo.jpg" alt="Vinci Logo" className="w-32 h-32 object-contain drop-shadow-2xl" />
            </div>
          </div>

          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-red-500 via-red-600 to-orange-500 bg-clip-text text-transparent">
            ESPORTS HUB
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Your complete platform for squads, rankings, player profiles, and marketplace
          </p>
        </div>
      </div>

      {/* FEATURES GRID - ALL ACTIVE */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* SQUADS - ACTIVE */}
          <Link href="/squads">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
              
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-red-950/60 to-black/60 border-2 border-red-600/60 rounded-3xl p-10 shadow-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:border-red-500">
                
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/50">
                      <span className="text-5xl">👥</span>
                    </div>
                    <span className="bg-green-500/30 border border-green-500 text-green-400 px-4 py-2 rounded-full font-black text-sm shadow-lg shadow-green-500/30 animate-pulse">
                      LIVE
                    </span>
                  </div>

                  <h2 className="text-4xl font-black mb-3">Squads</h2>
                  <p className="text-gray-400 mb-6">Create and manage your esports teams. Build your squad, track performance, and compete together.</p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span> Create squad (up to 4 members)
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span> Manage team members
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span> Track squad stats
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-red-400 font-bold">Explore Squads →</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* PLAYER PROFILES - ACTIVE */}
          <Link href="/profile">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
              
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-blue-950/60 to-black/60 border-2 border-blue-600/60 rounded-3xl p-10 shadow-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:border-blue-500">
                
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/50">
                      <span className="text-5xl">👤</span>
                    </div>
                    <span className="bg-green-500/30 border border-green-500 text-green-400 px-4 py-2 rounded-full font-black text-sm shadow-lg shadow-green-500/30 animate-pulse">
                      LIVE
                    </span>
                  </div>

                  <h2 className="text-4xl font-black mb-3">Player Profiles</h2>
                  <p className="text-gray-400 mb-6">Showcase your achievements, gameplay clips, and build your gaming resume.</p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span> Achievement wall
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span> Gameplay highlights
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span> Performance stats
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-bold">View Profile →</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* MARKETPLACE - ACTIVE */}
          <Link href="/marketplace">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
              
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-green-950/60 to-black/60 border-2 border-green-600/60 rounded-3xl p-10 shadow-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:border-green-500">
                
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/50">
                      <span className="text-5xl">💼</span>
                    </div>
                    <span className="bg-green-500/30 border border-green-500 text-green-400 px-4 py-2 rounded-full font-black text-sm shadow-lg shadow-green-500/30 animate-pulse">
                      LIVE
                    </span>
                  </div>

                  <h2 className="text-4xl font-black mb-3">Marketplace</h2>
                  <p className="text-gray-400 mb-6">Hire players, find opportunities, and connect with sponsors and organizers.</p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span> Browse job listings
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span> Post opportunities
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-green-400">✓</span> Direct messaging
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-bold">Browse Jobs →</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* RANKINGS - COMING LATER */}
          <div className="group relative opacity-60 cursor-not-allowed">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-3xl blur-2xl opacity-20"></div>
            
            <div className="relative backdrop-blur-2xl bg-gradient-to-br from-gray-900/60 to-black/60 border-2 border-gray-700/40 rounded-3xl p-10 shadow-2xl">
              
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-600/40 to-orange-600/40 rounded-2xl flex items-center justify-center">
                    <span className="text-5xl opacity-50">🏆</span>
                  </div>
                  <span className="bg-gray-700/50 border border-gray-600 text-gray-400 px-4 py-2 rounded-full font-black text-sm">
                    COMING LATER
                  </span>
                </div>

                <h2 className="text-4xl font-black mb-3 text-gray-300">Rankings</h2>
                <p className="text-gray-500 mb-6">Global and regional leaderboards. Compare your performance with the best players worldwide.</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-gray-600">○</span> Global leaderboards
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-gray-600">○</span> India rankings
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-gray-600">○</span> ELO rating system
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-bold">When tournaments are live</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER CTA */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-black mb-4">Ready to Get Started?</h2>
        <p className="text-gray-400 mb-8">Join the esports revolution. Create your squad and start competing today.</p>
        <Link href="/squads/create">
          <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-10 py-4 rounded-xl font-black text-lg shadow-2xl shadow-red-600/50 transition-all hover:scale-105 active:scale-95">
            Create Your Squad →
          </button>
        </Link>
      </div>

    </div>
  );
}

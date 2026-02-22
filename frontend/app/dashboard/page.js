'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ChatButton from '@/components/chat/ChatButton';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    if (!token) {
      router.push('/login');
      return;
    }
    setUserName(name);
    fetchTournaments();
  }, [router]);

  const fetchTournaments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/tournaments', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTournaments(data);
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tournament?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/tournaments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        setTournaments(tournaments.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting tournament:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      
      {/* HEADER */}
      <nav className="backdrop-blur-xl bg-black/40 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-purple-600 rounded-lg flex items-center justify-center font-black shadow-lg">
              V
            </div>
            <div>
              <h1 className="text-xl font-black">VINCI-ARENA</h1>
              <p className="text-xs text-gray-400">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full">
              <span className="text-sm font-semibold">👋 {userName}</span>
            </div>
            <button onClick={handleLogout} className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg font-semibold text-sm transition">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* TWO ELITE CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* CARD 1: CREATE POINT TABLE */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition"></div>
            <div className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/95 to-red-950/90 border border-red-600/40 rounded-3xl p-8 shadow-2xl min-h-[800px] flex flex-col">
              
              {/* Card Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-4 shadow-lg shadow-red-600/50">
                  <span className="text-4xl">📊</span>
                </div>
                <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  CREATE POINT TABLE
                </h2>
                <p className="text-red-300/80 text-sm">Tournament Calculator & Points System</p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {['Auto Calculate Points', '3 Games Supported', 'Bulk 12-Team Entry', '40 Export Templates'].map((feature, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-300">✨ {feature}</p>
                  </div>
                ))}
              </div>

              {/* Create Button */}
          <Link href="/tournaments/create">
                  <button className="relative w-full bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-500 hover:via-red-600 hover:to-red-500 text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-red-600/60 transition-all duration-300 hover:shadow-red-500/80 hover:scale-[1.02] active:scale-95 overflow-hidden group/btn">
                    {/* Animated shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-out"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      Create point table
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </span>
                  </button>
                </Link>

              {/* Recent Tournaments */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-blue-300">📋 Your Tournaments</h3>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">{tournaments.length}</span>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : tournaments.length === 0 ? (
                  <div className="text-center py-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <p className="text-gray-400 text-sm">No tournaments yet</p>
                    <p className="text-gray-600 text-xs mt-1">Create your first one above</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {tournaments.map((tournament) => (
                      <div key={tournament.id} className="bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/10 rounded-xl p-4 transition group/item">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-sm mb-1">{tournament.name}</h4>
                            <div className="flex gap-2">
                              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{tournament.game}</span>
                              <span className="text-xs text-gray-500">{new Date(tournament.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition">
                            <Link href={`/tournaments/${tournament.id}`}>
                              <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">
                                View
                              </button>
                            </Link>
                            <button onClick={() => handleDelete(tournament.id)} className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CARD 2: ESPORTS HUB - NETFLIX STYLE */}
          <div className="relative group">
            {/* Netflix-style red glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-700 to-red-900 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
            
            {/* Main card with deep black background */}
            <div className="relative backdrop-blur-2xl bg-gradient-to-br from-black/95 via-red-950/40 to-black/95 border-2 border-red-600/60 rounded-3xl p-8 shadow-2xl overflow-hidden min-h-[800px] flex flex-col">
              
              {/* Subtle animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-red-900/20 opacity-50"></div>
              
              {/* Content */}
              <div className="relative z-10">
                
                {/* Card Header */}
                <div className="text-center mb-8">
                  {/* Logo with dramatic 3D glow */}
                  {/* Premium Logo with Depth */}
                  <div className="relative inline-flex items-center justify-center mb-6">
                    {/* Layered glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 blur-3xl opacity-50 scale-125"></div>
                    <div className="absolute inset-0 bg-red-600 blur-2xl opacity-30 scale-110"></div>
                    
                    {/* Logo with subtle card */}
                    <div className="relative bg-black/60 backdrop-blur-md p-5 rounded-2xl border border-red-500/30 shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-red-500/60">
                      <img 
                        src="/vinci-logo.jpg" 
                        alt="Vinci Logo" 
                        className="w-28 h-28 object-contain drop-shadow-2xl" 
                      />
                    </div>
                  </div>
                  
                  {/* Netflix-style title */}
                  <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-red-500 via-red-600 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl tracking-tight">
                    ESPORTS HUB
                  </h2>
                  <p className="text-gray-300 text-sm font-medium tracking-wide">Squads • Rankings • Profiles • Marketplace</p>
                </div>

                {/* Menu Items - Netflix card style */}
                <div className="space-y-3 mb-8">
                  
                  {/* Squads - LIVE & Clickable */}
                  <Link href="/squads">
                    <div className="group/menu relative bg-gradient-to-r from-red-600/20 via-red-700/20 to-red-600/20 hover:from-red-600/40 hover:via-red-700/40 hover:to-red-600/40 border border-red-500/40 hover:border-red-400/80 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/40 overflow-hidden">
                      
                      {/* Animated shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/menu:translate-x-full transition-transform duration-700 ease-out"></div>
                      
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/60 transform transition-all duration-300 group-hover/menu:rotate-6 group-hover/menu:scale-110">
                            <span className="text-3xl">👥</span>
                          </div>
                          <div>
                            <h3 className="font-black text-lg text-white mb-1 group-hover/menu:text-red-300 transition">Squads</h3>
                            <p className="text-xs text-gray-400">Create & manage teams</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="bg-green-500/30 border border-green-500 text-green-400 text-xs px-3 py-1.5 rounded-full font-black shadow-lg shadow-green-500/30 animate-pulse">LIVE</span>
                          <span className="text-red-400 group-hover/menu:text-white group-hover/menu:translate-x-1 transition-all text-xl">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Rankings - Coming Soon */}
                  <div className="relative bg-gradient-to-r from-gray-900/60 to-gray-800/60 border border-gray-700/40 rounded-2xl p-5 opacity-70">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-yellow-600/40 to-orange-600/40 rounded-xl flex items-center justify-center">
                          <span className="text-3xl opacity-50">🏆</span>
                        </div>
                        <div>
                          <h3 className="font-black text-lg text-gray-300">Rankings</h3>
                          <p className="text-xs text-gray-500">Global & India leaderboards</p>
                        </div>
                      </div>
                      <span className="bg-orange-500/20 border border-orange-500/60 text-orange-400 text-xs px-3 py-1.5 rounded-full font-black">SOON</span>
                    </div>
                  </div>

                  {/* Player Profiles - Coming Soon */}
                  <div className="relative bg-gradient-to-r from-gray-900/60 to-gray-800/60 border border-gray-700/40 rounded-2xl p-5 opacity-70">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600/40 to-cyan-600/40 rounded-xl flex items-center justify-center">
                          <span className="text-3xl opacity-50">👤</span>
                        </div>
                        <div>
                          <h3 className="font-black text-lg text-gray-300">Player Profiles</h3>
                          <p className="text-xs text-gray-500">Achievements & highlights</p>
                        </div>
                      </div>
                      <span className="bg-orange-500/20 border border-orange-500/60 text-orange-400 text-xs px-3 py-1.5 rounded-full font-black">SOON</span>
                    </div>
                  </div>

                  {/* Marketplace - Planned */}
                  <div className="relative bg-gradient-to-r from-gray-900/60 to-gray-800/60 border border-gray-700/40 rounded-2xl p-5 opacity-70">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-600/40 to-emerald-600/40 rounded-xl flex items-center justify-center">
                          <span className="text-3xl opacity-50">💼</span>
                        </div>
                        <div>
                          <h3 className="font-black text-lg text-gray-300">Marketplace</h3>
                          <p className="text-xs text-gray-500">Hire players & find jobs</p>
                        </div>
                      </div>
                      <span className="bg-blue-500/20 border border-blue-500/60 text-blue-400 text-xs px-3 py-1.5 rounded-full font-black">PLANNED</span>
                    </div>
                  </div>

                </div>

                {/* Explore Button - Netflix CTA style */}
                <Link href="/esports">
                  <button className="relative w-full bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-500 hover:via-red-600 hover:to-red-500 text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-red-600/60 transition-all duration-300 hover:shadow-red-500/80 hover:scale-[1.02] active:scale-95 overflow-hidden group/btn">
                    {/* Animated shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-out"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      Explore Esports Hub 
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </span>
                  </button>
                </Link>

              </div>
            </div>
          </div>

        </div>
        <ChatButton />

      </div>
    </div>
  );
}
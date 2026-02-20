'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition"></div>
            <div className="relative backdrop-blur-xl bg-gradient-to-br from-blue-950/90 to-cyan-950/90 border border-blue-500/30 rounded-3xl p-8 shadow-2xl">
              
              {/* Card Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg shadow-blue-500/50">
                  <span className="text-4xl">📊</span>
                </div>
                <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  CREATE POINT TABLE
                </h2>
                <p className="text-blue-300/80 text-sm">Tournament Calculator & Points System</p>
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
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50 hover:scale-105 active:scale-95">
                  + Create New Tournament
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

          {/* CARD 2: ESPORTS HUB */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition"></div>
            <div className="relative backdrop-blur-xl bg-gradient-to-br from-red-950/90 to-purple-950/90 border border-red-500/30 rounded-3xl p-8 shadow-2xl">
              
              {/* Card Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-purple-500 rounded-2xl mb-4 shadow-lg shadow-red-500/50">
                  <span className="text-4xl">🎮</span>
                </div>
                <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                  ESPORTS HUB
                </h2>
                <p className="text-purple-300/80 text-sm">Squads • Rankings • Profiles • Marketplace</p>
              </div>

              {/* Menu Items */}
              <div className="space-y-3 mb-6">
                <Link href="/squads">
                  <div className="group/menu bg-gradient-to-r from-purple-900/50 to-pink-900/50 hover:from-purple-800/60 hover:to-pink-800/60 border border-purple-500/30 hover:border-purple-400/50 rounded-2xl p-4 cursor-pointer transition-all hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-2xl">👥</span>
                        </div>
                        <div>
                          <h3 className="font-bold">Squads</h3>
                          <p className="text-xs text-gray-400">Create & manage teams</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-500/20 border border-green-500/50 text-green-400 text-xs px-2 py-1 rounded-full font-bold">LIVE</span>
                        <span className="text-gray-400 group-hover/menu:text-white transition">→</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/20 rounded-2xl p-4 opacity-60 cursor-not-allowed">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-600/50 to-orange-600/50 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Rankings</h3>
                        <p className="text-xs text-gray-500">Global & India leaderboards</p>
                      </div>
                    </div>
                    <span className="bg-orange-500/20 border border-orange-500/50 text-orange-400 text-xs px-2 py-1 rounded-full font-bold">SOON</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-600/20 rounded-2xl p-4 opacity-60 cursor-not-allowed">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600/50 to-cyan-600/50 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Player Profiles</h3>
                        <p className="text-xs text-gray-500">Achievements & highlights</p>
                      </div>
                    </div>
                    <span className="bg-orange-500/20 border border-orange-500/50 text-orange-400 text-xs px-2 py-1 rounded-full font-bold">SOON</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-600/20 rounded-2xl p-4 opacity-60 cursor-not-allowed">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-600/50 to-emerald-600/50 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">💼</span>
                      </div>
                      <div>
                        <h3 className="font-bold">Marketplace</h3>
                        <p className="text-xs text-gray-500">Hire players & find jobs</p>
                      </div>
                    </div>
                    <span className="bg-blue-500/20 border border-blue-500/50 text-blue-400 text-xs px-2 py-1 rounded-full font-bold">PLANNED</span>
                  </div>
                </div>
              </div>

              {/* Explore Button */}
              <Link href="/esports">
                <button className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-red-500/30 transition-all hover:shadow-red-500/50 hover:scale-105 active:scale-95">
                  Explore Esports Hub →
                </button>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

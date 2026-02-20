'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    
    if (!token) {
      router.push('/login');
      return;
    }

    setUserName(name || 'User');
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/tournaments', {
        headers: { 'Authorization': `Bearer ${token}` }
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
    if (!confirm('Delete this tournament? This cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/tournaments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setTournaments(tournaments.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting tournament:', error);
    }
  };

  const startEdit = (tournament) => {
    setEditingId(tournament.id);
    setEditName(tournament.name);
  };

  const saveEdit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/tournaments/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: editName })
      });

      if (response.ok) {
        setTournaments(tournaments.map(t => 
          t.id === id ? { ...t, name: editName } : t
        ));
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error updating tournament:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    router.push('/');
  };

  const getGameEmoji = (game) => {
    const emojis = {
      'Free Fire': '🔥',
      'BGMI': '🎯',
      'Valorant': '⚔️'
    };
    return emojis[game] || '🎮';
  };

  const getGameColor = (game) => {
    const colors = {
      'Free Fire': 'from-red-500 to-red-700',
      'BGMI': 'from-cyan-500 to-blue-500',
      'Valorant': 'from-pink-500 to-purple-500'
    };
    return colors[game] || 'from-gray-500 to-gray-600';
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
      
      {/* VERY LIGHT OVERLAY */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>

      {/* CONTENT */}
      <div className="relative z-10">
        {/* HEADER - UPDATED WITH VINCI-ARENA */}
        <nav className="bg-black/40 backdrop-blur-md border-b border-red-500/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo - VINCI-ARENA */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center overflow-hidden shadow-lg shadow-red-500/30">
                  <img src="/vinci-symbol.jpg" alt="Vinci-Arena" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <span className="text-xl font-bold text-white tracking-tight group-hover:text-red-400 transition drop-shadow-lg">
                    VINCI-ARENA
                  </span>
                  <p className="text-xs text-red-400 font-medium">Track. Calculate. Win.</p>
                </div>
              </Link>

              {/* Navigation */}
              <div className="flex items-center gap-6">
                <Link href="/dashboard" className="text-white font-semibold hover:text-red-400 transition drop-shadow-lg">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-gray-300 font-medium hover:text-white transition drop-shadow-lg">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 font-medium hover:text-white transition drop-shadow-lg"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight mb-2 drop-shadow-2xl">
                  Welcome back, {userName}
                </h1>
                <p className="text-gray-200 font-normal drop-shadow-lg">
                  Manage your tournaments
                </p>
              </div>
              <Link href="/tournaments/create">
                <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg shadow-red-500/50 hover:shadow-red-400/70 active:scale-95 drop-shadow-xl">
                  ➕ Create Tournament
                </button>
              </Link>
              <Link href="/squads">
                <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg shadow-purple-500/50 hover:shadow-purple-400/70 active:scale-95 drop-shadow-xl">
                  👥 View Squads
                </button>
              </Link>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white drop-shadow-lg">Loading tournaments...</p>
              </div>
            </div>
          ) : tournaments.length === 0 ? (
            /* Empty State */
            <div className="flex items-center justify-center py-20">
              <div className="text-center max-w-md bg-black/50 backdrop-blur-lg border border-red-500/30 rounded-lg p-12 shadow-2xl">
                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/50">
                  <span className="text-5xl">🏆</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">
                  No tournaments yet
                </h3>
                <p className="text-gray-200 mb-8 font-normal drop-shadow-md">
                  Get started by creating your first tournament
                </p>
                <Link href="/tournaments/create">
                  <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg shadow-red-500/50 active:scale-95">
                    Create Your First Tournament
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            /* Tournament Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="group relative bg-black/40 backdrop-blur-lg border border-red-500/30 rounded-lg overflow-hidden hover:border-red-500/60 transition shadow-lg hover:shadow-2xl hover:shadow-red-500/30"
                >
                  {/* Game Badge */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getGameColor(tournament.game)}`}></div>

                  <div className="p-6">
                    {/* Game Icon & Name */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${getGameColor(tournament.game)} rounded-lg flex items-center justify-center text-2xl shadow-lg`}>
                          {getGameEmoji(tournament.game)}
                        </div>
                        <div className="flex-1">
                          {editingId === tournament.id ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full bg-black/60 border border-red-500 text-white px-3 py-1 rounded font-semibold focus:outline-none backdrop-blur-sm"
                              autoFocus
                              onKeyPress={(e) => e.key === 'Enter' && saveEdit(tournament.id)}
                            />
                          ) : (
                            <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-red-400 transition line-clamp-1 drop-shadow-lg">
                              {tournament.name}
                            </h3>
                          )}
                          <p className="text-sm text-gray-300 font-medium drop-shadow-md">{tournament.game}</p>
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-xs text-gray-400 mb-4 font-normal drop-shadow-md">
                      Created {new Date(tournament.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>

                    {/* Actions */}
                    {editingId === tournament.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(tournament.id)}
                          className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition active:scale-95 shadow-lg shadow-red-500/30"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 bg-gray-800/60 hover:bg-gray-700/60 text-white px-4 py-2 rounded-lg text-sm font-semibold transition active:scale-95 backdrop-blur-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/tournaments/${tournament.id}`)}
                          className="flex-1 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-lg text-sm font-semibold transition active:scale-95 shadow-lg"
                        >
                          Open
                        </button>
                        <button
                          onClick={() => startEdit(tournament)}
                          className="bg-gray-800/60 hover:bg-gray-700/60 text-white px-4 py-2 rounded-lg text-sm font-semibold transition active:scale-95 backdrop-blur-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tournament.id)}
                          className="bg-gray-800/60 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition active:scale-95 backdrop-blur-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SquadsPage() {
  const router = useRouter();
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ game: '', region: '' });

  useEffect(() => {
    fetchSquads();
  }, [filter]);

  const fetchSquads = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      const params = new URLSearchParams();
      if (filter.game) params.append('game', filter.game);
      if (filter.region) params.append('region', filter.region);

      const res = await fetch(`http://localhost:3001/api/squads?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setSquads(data);
      }
    } catch (err) {
      console.error('Fetch squads error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      
      {/* Header */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-white transition">
              ← Back
            </button>
            <h1 className="text-2xl font-black">🏆 Squads</h1>
          </div>
          <Link href="/squads/create">
            <button className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-bold transition">
              + Create Squad
            </button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <select 
            value={filter.game}
            onChange={(e) => setFilter({...filter, game: e.target.value})}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="">All Games</option>
            <option value="Free Fire">Free Fire</option>
            <option value="BGMI">BGMI</option>
            <option value="Valorant">Valorant</option>
          </select>

          <select 
            value={filter.region}
            onChange={(e) => setFilter({...filter, region: e.target.value})}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="">All Regions</option>
            <option value="Global">Global</option>
            <option value="India">India</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Americas">Americas</option>
          </select>
        </div>

        {/* Squad Grid */}
        {squads.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-400 text-lg mb-2">No squads found</p>
            <p className="text-gray-600 text-sm mb-6">Be the first to create one!</p>
            <Link href="/squads/create">
              <button className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-bold">
                + Create Squad
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {squads.map((squad) => (
              <Link key={squad.id} href={`/squads/${squad.id}`}>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-red-500/50 hover:scale-105 transition cursor-pointer">
                  
                  {/* Squad Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl font-black">
                      {squad.tag || squad.name[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-lg">{squad.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">{squad.game}</span>
                        <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full">{squad.region}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-black text-red-400">{squad.elo_rating}</p>
                      <p className="text-xs text-gray-500 uppercase">ELO</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-black text-green-400">{squad.total_wins}</p>
                      <p className="text-xs text-gray-500 uppercase">Wins</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-black text-yellow-400">{squad.squad_members?.length || 0}</p>
                      <p className="text-xs text-gray-500 uppercase">Members</p>
                    </div>
                  </div>

                  {/* Members Preview */}
                  {squad.squad_members && squad.squad_members.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <p className="text-xs text-gray-500 mb-2">Members:</p>
                      <div className="flex gap-2 flex-wrap">
                        {squad.squad_members.slice(0, 4).map((member) => (
                          <span key={member.id} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                            {member.users?.name || 'Player'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

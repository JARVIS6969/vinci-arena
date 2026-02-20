'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function SquadProfilePage() {
  const router = useRouter();
  const params = useParams();
  const squadId = params.id;

  const [squad, setSquad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLeader, setIsLeader] = useState(false);

  useEffect(() => {
    fetchSquad();
  }, [squadId]);

  const fetchSquad = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      const res = await fetch(`http://localhost:3001/api/squads/${squadId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setSquad(data);
        
        // Check if current user is leader
        const userId = localStorage.getItem('userId');
        const leader = data.squad_members?.find(m => m.role === 'leader' && m.user_id === userId);
        setIsLeader(!!leader);
      } else {
        router.push('/squads');
      }
    } catch (err) {
      console.error('Fetch squad error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this squad? This cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/squads/${squadId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        alert('Squad deleted successfully');
        router.push('/squads');
      } else {
        alert('Failed to delete squad');
      }
    } catch (err) {
      alert('Error deleting squad');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!squad) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      
      {/* Header */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => router.push('/squads')} className="text-gray-400 hover:text-white transition">
            ← Back to Squads
          </button>
          {isLeader && (
            <div className="flex gap-2">
              <button 
                onClick={() => router.push(`/squads/${squadId}/edit`)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
              >
                ✏️ Edit
              </button>
              <button 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Banner */}
      <div className="relative h-48 bg-gradient-to-r from-red-900 via-purple-900 to-blue-900">
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Profile Header */}
        <div className="relative -mt-20 mb-8">
          <div className="flex items-end gap-6">
            
            {/* Squad Logo */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl flex items-center justify-center text-5xl font-black shadow-2xl border-4 border-gray-950">
                {squad.tag || squad.name[0]}
              </div>
              {squad.verified && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-xl border-4 border-gray-950">
                  ✓
                </div>
              )}
            </div>

            {/* Squad Info */}
            <div className="flex-1 pb-2">
              <h1 className="text-4xl font-black mb-2">{squad.name}</h1>
              <div className="flex gap-3 mb-2">
                <span className="bg-blue-500/20 border border-blue-500 text-blue-400 px-3 py-1 rounded-full text-sm font-bold">
                  {squad.game}
                </span>
                <span className="bg-purple-500/20 border border-purple-500 text-purple-400 px-3 py-1 rounded-full text-sm font-bold">
                  {squad.region}
                </span>
                {isLeader && (
                  <span className="bg-yellow-500/20 border border-yellow-500 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
                    👑 Leader
                  </span>
                )}
              </div>
              {squad.bio && (
                <p className="text-gray-400 text-sm">{squad.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-red-400 mb-2">{squad.elo_rating}</p>
            <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">ELO Rating</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-green-400 mb-2">{squad.total_wins}</p>
            <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Total Wins</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-yellow-400 mb-2">{squad.total_tournaments}</p>
            <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Tournaments</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-purple-400 mb-2">${squad.total_prize_money || 0}</p>
            <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Prize Money</p>
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black">👥 Squad Members</h2>
            {isLeader && (
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition">
                + Invite Member
              </button>
            )}
          </div>

          {squad.squad_members && squad.squad_members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {squad.squad_members
                .filter(m => m.is_active)
                .sort((a, b) => (a.role === 'leader' ? -1 : 1))
                .map((member) => (
                  <div key={member.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-black text-xl">
                      {member.users?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold">{member.users?.name || 'Unknown'}</p>
                        {member.role === 'leader' && (
                          <span className="text-yellow-400 text-sm">👑</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{member.in_game_name || member.role}</p>
                      <p className="text-xs text-gray-600">Joined {new Date(member.joined_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No active members</p>
            </div>
          )}
        </div>

        {/* Tournament History */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-black mb-6">🏆 Tournament History</h2>
          
          {squad.squad_tournaments && squad.squad_tournaments.length > 0 ? (
            <div className="space-y-4">
              {squad.squad_tournaments.map((tournament) => (
                <div key={tournament.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{tournament.tournaments?.name || 'Tournament'}</h3>
                    <p className="text-sm text-gray-400">{tournament.tournaments?.game} • {new Date(tournament.tournament_date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-yellow-400">
                      {tournament.position === 1 ? '🥇' : tournament.position === 2 ? '🥈' : tournament.position === 3 ? '🥉' : `#${tournament.position}`}
                    </p>
                    <p className="text-sm text-gray-400">{tournament.total_points} pts • {tournament.total_kills} kills</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-3">🏆</div>
              <p>No tournament history yet</p>
              <p className="text-sm text-gray-600 mt-1">Participate in tournaments to build your record!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

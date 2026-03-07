'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateTournament() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [game, setGame] = useState('Free Fire');
  const [loading, setLoading] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/tournaments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setTournaments(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoadingTournaments(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { alert('Please enter tournament name'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/tournaments', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, game })
      });
      if (response.ok) {
        const data = await response.json();
        router.push(`/tournaments/${data.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create tournament');
      }
    } catch (error) {
      alert('Error creating tournament');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this tournament?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/tournaments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setTournaments(prev => prev.filter(t => t.id !== id));
    } catch (err) { console.error(err); }
  };

  const gameColors = {
    'Free Fire': '#ef4444',
    'BGMI': '#f97316',
    'Valorant': '#a855f7'
  };

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .neon-input { background: #0a0a0a; border: 1px solid rgba(239,68,68,0.3); border-radius: 10px; color: white; font-family: 'Rajdhani'; font-weight: 600; font-size: 14px; padding: 12px 16px; width: 100%; outline: none; transition: all 0.2s; }
        .neon-input:focus { border-color: rgba(239,68,68,0.7); box-shadow: 0 0 15px rgba(239,68,68,0.2); }
        .neon-select { background: #0a0a0a; border: 1px solid rgba(239,68,68,0.3); border-radius: 10px; color: white; font-family: 'Rajdhani'; font-weight: 700; font-size: 14px; padding: 12px 16px; width: 100%; outline: none; transition: all 0.2s; }
        .neon-select:focus { border-color: rgba(239,68,68,0.7); box-shadow: 0 0 15px rgba(239,68,68,0.2); }
        .tournament-row { transition: all 0.2s ease; }
        .tournament-row:hover { border-color: rgba(239,68,68,0.4) !important; transform: translateX(4px); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #ef4444; border-radius: 2px; }
      `}</style>

      <div className="grid-bg min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-10">

          {/* CREATE POINT TABLE FORM */}
          <div className="rounded-2xl p-6 mb-6" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 0 30px rgba(239,68,68,0.05)'}}>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-2xl"
                style={{boxShadow: '0 0 20px rgba(239,68,68,0.5)'}}>
                📊
              </div>
              <div>
                <h1 className="font-black text-xl text-white tracking-wide" style={{fontFamily: "'Orbitron', sans-serif"}}>CREATE POINT TABLE</h1>
                <p className="text-xs text-gray-600 font-bold tracking-wider">TOURNAMENT CALCULATOR & POINTS SYSTEM</p>
              </div>
            </div>

            {/* Features row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
              {[['⚡', 'Auto Calculate Points'], ['🎮', '3 Games Supported'], ['👥', 'Bulk 12-Team Entry'], ['📤', '40 Export Templates']].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2.5 hover:border-red-500/30 transition">
                  <span className="text-sm">{icon}</span>
                  <span className="text-xs text-gray-400 font-bold">{label}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800 mb-6" />

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black tracking-widest text-red-500/70 mb-2 block" style={{fontFamily: "'Orbitron', sans-serif"}}>
                  TOURNAMENT NAME *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="neon-input"
                  placeholder="e.g. VINCI CUP SEASON 1"
                  onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
                />
              </div>

              <div>
                <label className="text-xs font-black tracking-widest text-red-500/70 mb-2 block" style={{fontFamily: "'Orbitron', sans-serif"}}>
                  SELECT GAME *
                </label>
                <select value={game} onChange={(e) => setGame(e.target.value)} className="neon-select">
                  <option value="Free Fire">🔥 Free Fire</option>
                  <option value="BGMI">🎯 BGMI</option>
                  <option value="Valorant">⚡ Valorant</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !name.trim()}
                  className={`flex-1 py-3.5 rounded-xl font-black text-sm tracking-widest transition ${name.trim() && !loading ? 'text-white' : 'bg-gray-900 text-gray-700 border border-gray-800 cursor-not-allowed'}`}
                  style={name.trim() && !loading ? {background: 'linear-gradient(135deg, #FF3B3B, #FF7A18)', boxShadow: '0 0 25px rgba(255,59,59,0.5)'} : {}}>
                  {loading ? '⟳ CREATING...' : '⚡ CREATE POINT TABLE →'}
                </button>
                <Link href="/dashboard">
                  <button className="px-6 py-3.5 rounded-xl font-black text-xs tracking-widest border border-gray-800 text-gray-500 hover:border-red-500/40 hover:text-gray-300 transition">
                    CANCEL
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* YOUR TOURNAMENTS */}
          <div className="rounded-2xl p-6" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏆</span>
                <h2 className="font-black text-sm text-white tracking-wide" style={{fontFamily: "'Orbitron', sans-serif"}}>YOUR TOURNAMENTS</h2>
                <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2 py-0.5 rounded font-black">{tournaments.length}</span>
              </div>
            </div>

            {loadingTournaments ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
              </div>
            ) : tournaments.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">🏆</div>
                <p className="text-gray-600 font-bold text-sm">No tournaments yet</p>
                <p className="text-gray-700 text-xs mt-1">Create your first tournament above!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tournaments.map(t => (
                  <div key={t.id}
                    className="tournament-row flex items-center gap-3 p-3.5 bg-gray-950 border border-gray-800 rounded-xl cursor-pointer"
                    onClick={() => router.push(`/tournaments/${t.id}`)}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{background: (gameColors[t.game] || '#ef4444') + '20', border: `1px solid ${gameColors[t.game] || '#ef4444'}40`}}>
                      {t.game === 'Free Fire' ? '🔥' : t.game === 'BGMI' ? '🎯' : '⚡'}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-sm text-white">{t.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-black px-2 py-0.5 rounded"
                          style={{background: (gameColors[t.game] || '#ef4444') + '15', color: gameColors[t.game] || '#ef4444', border: `1px solid ${gameColors[t.game] || '#ef4444'}30`}}>
                          {t.game}
                        </span>
                        <span className="text-xs text-gray-600 font-bold">
                          {new Date(t.created_at).toLocaleDateString('en-IN', {day: '2-digit', month: '2-digit', year: 'numeric'})}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/tournaments/${t.id}`); }}
                        className="text-xs text-red-400 hover:text-red-300 font-black tracking-wider transition px-2 py-1 border border-red-500/20 hover:border-red-500/50 rounded-lg">
                        OPEN →
                      </button>
                      <button
                        onClick={(e) => handleDelete(t.id, e)}
                        className="text-gray-700 hover:text-red-400 font-bold text-sm transition px-2">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
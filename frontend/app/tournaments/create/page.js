'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateTournament() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [game, setGame] = useState('Free Fire');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .neon-input { background: #0a0a0a; border: 1px solid rgba(239,68,68,0.3); border-radius: 10px; color: white; font-family: 'Rajdhani'; font-weight: 600; font-size: 14px; padding: 12px 16px; width: 100%; outline: none; transition: all 0.2s; }
        .neon-input:focus { border-color: rgba(239,68,68,0.7); box-shadow: 0 0 15px rgba(239,68,68,0.2); }
        .neon-select { background: #0a0a0a; border: 1px solid rgba(239,68,68,0.3); border-radius: 10px; color: white; font-family: 'Rajdhani'; font-weight: 700; font-size: 14px; padding: 12px 16px; width: 100%; outline: none; transition: all 0.2s; }
        .neon-select:focus { border-color: rgba(239,68,68,0.7); box-shadow: 0 0 15px rgba(239,68,68,0.2); }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .shimmer { background: linear-gradient(90deg, #ef4444, #f97316, #ef4444); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s linear infinite; }
      `}</style>

      <div className="grid-bg min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-10">

          {/* VINCI STUDIO BANNER */}
          <div className="relative overflow-hidden rounded-2xl p-6 mb-8"
            style={{background: 'linear-gradient(135deg, #0d0000, #0a0010, #00050d)', border: '1px solid rgba(239,68,68,0.25)', boxShadow: '0 0 40px rgba(239,68,68,0.08)'}}>

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(rgba(239,68,68,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px'}} />

            {/* Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #ef4444, transparent)', filter: 'blur(30px)'}} />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #8b5cf6, transparent)', filter: 'blur(30px)'}} />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1 mb-3">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-400 text-xs font-black tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>VINCI STUDIO</span>
                </div>
                <h2 className="font-black text-xl text-white mb-2 leading-tight" style={{fontFamily: "'Orbitron', sans-serif"}}>
                  MORE THAN JUST<br />
                  <span className="shimmer">POINT TABLES</span>
                </h2>
                <p className="text-gray-400 text-sm font-bold mb-3">
                  Vinci Studio is your complete esports creative suite. Create certificates, banners, MVP cards and more — all in one place.
                </p>
                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {['📊 Point Tables', '🏆 Certificates', '🎨 Banners', '⚡ MVP Cards', '🎭 Designer Store'].map(f => (
                    <span key={f} className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-full font-bold">{f}</span>
                  ))}
                </div>
                <Link href="/studio">
                  <button className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-xl font-black text-xs tracking-widest transition"
                    style={{boxShadow: '0 0 20px rgba(239,68,68,0.4)'}}>
                    🎨 OPEN VINCI STUDIO →
                  </button>
                </Link>
              </div>

              {/* Right - mini tool grid */}
              <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                {[
                  {icon: '📊', label: 'POINT TABLE', color: '#ef4444', active: true},
                  {icon: '🏆', label: 'CERTIFICATE', color: '#eab308'},
                  {icon: '🎨', label: 'BANNER', color: '#8b5cf6'},
                  {icon: '⚡', label: 'MVP CARD', color: '#06b6d4'},
                ].map(tool => (
                  <div key={tool.label} className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1"
                    style={{background: tool.active ? `rgba(239,68,68,0.1)` : '#0a0a0a', border: `1px solid ${tool.color}${tool.active ? '60' : '20'}`, boxShadow: tool.active ? `0 0 10px ${tool.color}30` : 'none'}}>
                    <span className="text-2xl">{tool.icon}</span>
                    <span className="font-black tracking-wider" style={{color: tool.color, fontFamily: "'Orbitron', sans-serif", fontSize: '7px'}}>{tool.label}</span>
                    {tool.active && <span className="text-green-400 font-black" style={{fontSize: '7px'}}>● ACTIVE</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CREATE POINT TABLE FORM */}
          <div className="rounded-2xl p-6" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 0 30px rgba(239,68,68,0.05)'}}>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-xl"
                style={{boxShadow: '0 0 15px rgba(239,68,68,0.4)'}}>
                📊
              </div>
              <div>
                <h1 className="font-black text-lg text-white tracking-wide" style={{fontFamily: "'Orbitron', sans-serif"}}>POINT TABLE</h1>
                <p className="text-xs text-gray-600 font-bold tracking-wider">TOURNAMENT CALCULATOR</p>
              </div>
            </div>

            {/* Features row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
              {[['⚡', 'Auto Calculate'], ['🎮', '3 Games'], ['👥', '12 Teams'], ['📤', '40 Templates']].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2">
                  <span className="text-sm">{icon}</span>
                  <span className="text-xs text-gray-400 font-bold">{label}</span>
                </div>
              ))}
            </div>

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
                  required
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
                  className={`flex-1 py-3 rounded-xl font-black text-sm tracking-widest transition ${name.trim() && !loading ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-gray-900 text-gray-700 border border-gray-800 cursor-not-allowed'}`}
                  style={name.trim() && !loading ? {boxShadow: '0 0 20px rgba(239,68,68,0.4)'} : {}}>
                  {loading ? '⟳ CREATING...' : '⚡ CREATE POINT TABLE'}
                </button>
                <Link href="/dashboard">
                  <button className="px-6 py-3 rounded-xl font-black text-xs tracking-widest border border-gray-800 text-gray-500 hover:border-red-500/40 hover:text-gray-300 transition">
                    CANCEL
                  </button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
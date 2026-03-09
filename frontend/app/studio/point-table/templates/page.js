'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ALL_TEMPLATES = [
  // FREE FIRE
  { id: 1, name: 'DARK FIRE', game: 'Free Fire', bg: 'linear-gradient(135deg, #0a0000, #1a0000)', accent: '#ef4444', free: true },
  { id: 2, name: 'BLOOD MOON', game: 'Free Fire', bg: 'linear-gradient(135deg, #1a0000, #2a0010)', accent: '#dc2626', free: true },
  { id: 3, name: 'INFERNO', game: 'Free Fire', bg: 'linear-gradient(135deg, #1a0500, #0a0000)', accent: '#f97316', free: true },
  { id: 4, name: 'EMBER', game: 'Free Fire', bg: 'linear-gradient(135deg, #0f0000, #1f0a00)', accent: '#fb923c', free: false },
  { id: 5, name: 'CRIMSON', game: 'Free Fire', bg: 'linear-gradient(135deg, #200000, #100010)', accent: '#e11d48', free: false },
  // BGMI
  { id: 6, name: 'BATTLEGROUND', game: 'BGMI', bg: 'linear-gradient(135deg, #0a0500, #1a0f00)', accent: '#f97316', free: true },
  { id: 7, name: 'DESERT STORM', game: 'BGMI', bg: 'linear-gradient(135deg, #1a1000, #0a0800)', accent: '#eab308', free: true },
  { id: 8, name: 'JUNGLE OPS', game: 'BGMI', bg: 'linear-gradient(135deg, #001a00, #000a00)', accent: '#22c55e', free: true },
  { id: 9, name: 'ARCTIC', game: 'BGMI', bg: 'linear-gradient(135deg, #001020, #000a15)', accent: '#38bdf8', free: false },
  { id: 10, name: 'TACTICAL', game: 'BGMI', bg: 'linear-gradient(135deg, #0a0a0a, #151515)', accent: '#94a3b8', free: false },
  // VALORANT
  { id: 11, name: 'NEON NIGHT', game: 'Valorant', bg: 'linear-gradient(135deg, #000010, #0a0020)', accent: '#6366f1', free: true },
  { id: 12, name: 'PHANTOM', game: 'Valorant', bg: 'linear-gradient(135deg, #05001a, #10002a)', accent: '#a855f7', free: true },
  { id: 13, name: 'SPECTRE', game: 'Valorant', bg: 'linear-gradient(135deg, #000a1a, #001020)', accent: '#06b6d4', free: true },
  { id: 14, name: 'VANDAL', game: 'Valorant', bg: 'linear-gradient(135deg, #1a0010, #0a0020)', accent: '#ec4899', free: false },
  { id: 15, name: 'OPERATOR', game: 'Valorant', bg: 'linear-gradient(135deg, #000510, #050015)', accent: '#8b5cf6', free: false },
  // GENERAL
  { id: 16, name: 'GOLD RUSH', game: 'General', bg: 'linear-gradient(135deg, #0a0800, #1a1000)', accent: '#eab308', free: true },
  { id: 17, name: 'PLATINUM', game: 'General', bg: 'linear-gradient(135deg, #0a0a0a, #141414)', accent: '#e2e8f0', free: true },
  { id: 18, name: 'GALAXY', bg: 'linear-gradient(135deg, #000510, #050020)', accent: '#818cf8', game: 'General', free: true },
  { id: 19, name: 'CYBER', game: 'General', bg: 'linear-gradient(135deg, #001a10, #000a08)', accent: '#10b981', free: false },
  { id: 20, name: 'NEON RED', game: 'General', bg: 'linear-gradient(135deg, #0a0000, #050010)', accent: '#f43f5e', free: false },
];

const GAMES = ['All', 'Free Fire', 'BGMI', 'Valorant', 'General'];

export default function TemplatesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? ALL_TEMPLATES : ALL_TEMPLATES.filter(t => t.game === filter);

  const handleSelect = (template) => {
    localStorage.setItem('selected_template', JSON.stringify(template));
    router.push('/studio/point-table?template=' + template.id);
  };

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif", paddingTop: '44px'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .t-card { transition: all 0.3s ease; }
        .t-card:hover { transform: translateY(-4px); }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #ef4444; }
      `}</style>

      <div className="grid-bg min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8">

          {/* HEADER */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => router.push('/studio/point-table')} className="text-red-400 hover:text-red-300 font-bold text-sm">← BACK</button>
            <div>
              <h1 className="font-black text-xl text-white" style={{fontFamily: "'Orbitron', sans-serif"}}>🎨 TEMPLATES</h1>
              <p className="text-xs text-gray-600 font-bold">{ALL_TEMPLATES.length} TEMPLATES · {ALL_TEMPLATES.filter(t=>t.free).length} FREE</p>
            </div>
          </div>

          {/* FILTER */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {GAMES.map(g => (
              <button key={g} onClick={() => setFilter(g)}
                className="px-4 py-1.5 rounded-full font-black text-xs tracking-widest transition"
                style={filter === g
                  ? {background: 'linear-gradient(135deg, #FF3B3B, #FF7A18)', color: 'white', boxShadow: '0 0 15px rgba(255,59,59,0.4)'}
                  : {background: '#0a0a0a', border: '1px solid rgba(239,68,68,0.2)', color: '#6b7280'}}>
                {g === 'Free Fire' ? '🔥' : g === 'BGMI' ? '🎯' : g === 'Valorant' ? '⚡' : g === 'General' ? '🎨' : '📊'} {g}
              </button>
            ))}
          </div>

          {/* TEMPLATES GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(t => (
              <div key={t.id} className="t-card rounded-2xl overflow-hidden cursor-pointer"
                style={{background: '#050505', border: '1px solid rgba(239,68,68,0.1)'}}
                onClick={() => handleSelect(t)}>
                {/* Preview */}
                <div className="h-32 relative p-3" style={{background: t.bg}}>
                  {/* Mini table preview */}
                  <div style={{background: t.accent+'20', borderRadius: '4px', padding: '4px 6px', marginBottom: '4px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      {['#','TEAM','PTS'].map(h => <span key={h} style={{fontSize: '6px', color: t.accent, fontWeight: 900, fontFamily: 'Orbitron,sans-serif'}}>{h}</span>)}
                    </div>
                  </div>
                  {[['🥇','TEAM ALPHA','24'],['🥈','TEAM BETA','18'],['🥉','TEAM GAMMA','15']].map(([rank,name,pts]) => (
                    <div key={name} style={{display: 'flex', justifyContent: 'space-between', padding: '2px 4px', marginBottom: '2px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px'}}>
                      <span style={{fontSize: '7px', fontWeight: 900}}>{rank}</span>
                      <span style={{fontSize: '7px', color: 'rgba(255,255,255,0.7)', fontWeight: 700}}>{name}</span>
                      <span style={{fontSize: '7px', color: t.accent, fontWeight: 900}}>{pts}</span>
                    </div>
                  ))}
                  {/* Free/Paid badge */}
                  <div className="absolute top-2 right-2">
                    <span className="font-black px-1.5 py-0.5 rounded" style={{fontSize: '8px', background: t.free ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', color: t.free ? '#10b981' : '#ef4444', border: `1px solid ${t.free ? '#10b98140' : '#ef444440'}`}}>
                      {t.free ? 'FREE' : 'PRO'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="font-black text-xs text-white tracking-wider" style={{fontFamily: "'Orbitron', sans-serif"}}>{t.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600 font-bold">{t.game}</span>
                    <span className="text-xs font-black" style={{color: t.accent}}>USE →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
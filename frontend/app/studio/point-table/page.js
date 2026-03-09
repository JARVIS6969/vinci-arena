'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TEMPLATES = [
  { id: 1, name: 'DARK FIRE', bg: 'linear-gradient(135deg, #0a0000, #1a0000)', accent: '#ef4444', text: '#ffffff' },
  { id: 2, name: 'NEON NIGHT', bg: 'linear-gradient(135deg, #000010, #0a0020)', accent: '#6366f1', text: '#ffffff' },
  { id: 3, name: 'GOLD RUSH', bg: 'linear-gradient(135deg, #0a0800, #1a1000)', accent: '#eab308', text: '#ffffff' },
];

const GAMES = ['Free Fire', 'BGMI', 'Valorant'];
const gameIcon = { 'Free Fire': '🔥', 'BGMI': '🎯', 'Valorant': '⚡' };
const gameColors = { 'Free Fire': '#ef4444', 'BGMI': '#f97316', 'Valorant': '#a855f7' };

export default function PointTablePage() {
  const router = useRouter();
  const previewRef = useRef(null);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [formData, setFormData] = useState({
    tournamentName: '', game: 'Free Fire', organizer: '', date: '',
    teamCount: 6,
    teams: Array.from({length: 6}, (_, i) => ({ name: `TEAM ${i+1}`, placement: 0, kills: 0 })),
  });

  useEffect(() => { fetchTournaments(); }, []);

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

  const updateTeam = (idx, field, value) => {
    const updated = [...formData.teams];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormData(prev => ({ ...prev, teams: updated }));
  };

  const updateTeamCount = (count) => {
    const teams = Array.from({length: count}, (_, i) => formData.teams[i] || { name: `TEAM ${i+1}`, placement: 0, kills: 0 });
    setFormData(prev => ({ ...prev, teamCount: count, teams }));
  };

  const getSortedTeams = () => [...formData.teams].map(t => ({
    ...t, total: (parseInt(t.placement) || 0) + (parseInt(t.kills) || 0)
  })).sort((a, b) => b.total - a.total);

  const handleCreate = async () => {
    if (!formData.tournamentName.trim()) { alert('Enter tournament name'); return; }
    setCreating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/tournaments', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.tournamentName, game: formData.game })
      });
      if (res.ok) {
        const data = await res.json();
        fetchTournaments();
        alert('Tournament created! Opening...');
        router.push(`/tournaments/${data.id}`);
      }
    } catch (err) { console.error(err); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this tournament?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/tournaments/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setTournaments(prev => prev.filter(t => t.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleDownload = async () => {
    if (!formData.tournamentName.trim()) { alert('Enter tournament name first'); return; }
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewRef.current, { scale: 2, backgroundColor: null, useCORS: true });
      const link = document.createElement('a');
      link.download = `${formData.tournamentName}-point-table-vinci.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) { console.error(err); }
    finally { setDownloading(false); }
  };

  const template = TEMPLATES.find(t => t.id === selectedTemplate);
  const sortedTeams = getSortedTeams();

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif", paddingTop: '44px'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .neon-input { background: #0a0a0a; border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; color: white; font-family: 'Rajdhani'; font-weight: 600; font-size: 13px; padding: 10px 14px; width: 100%; outline: none; transition: all 0.2s; }
        .neon-input:focus { border-color: rgba(239,68,68,0.6); box-shadow: 0 0 10px rgba(239,68,68,0.15); }
        .neon-input::placeholder { color: #374151; }
        .neon-select { background: #0a0a0a; border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; color: white; font-family: 'Rajdhani'; font-weight: 700; font-size: 13px; padding: 10px 14px; width: 100%; outline: none; }
        .t-row { transition: all 0.2s; }
        .t-row:hover { border-color: rgba(239,68,68,0.4) !important; transform: translateX(3px); }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #ef4444; }
      `}</style>

      <div className="grid-bg min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* HEADER */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/studio">
              <button className="text-red-400 hover:text-red-300 font-bold text-sm">← STUDIO</button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-xl" style={{boxShadow: '0 0 20px rgba(239,68,68,0.5)'}}>📊</div>
              <div>
                <h1 className="font-black text-xl text-white" style={{fontFamily: "'Orbitron', sans-serif"}}>CREATE POINT TABLE</h1>
                <p className="text-xs text-gray-600 font-bold">TOURNAMENT CALCULATOR & GRAPHIC GENERATOR</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* LEFT — FORM */}
            <div className="xl:col-span-1 space-y-4">

              {/* Tournament Info */}
              <div className="rounded-2xl p-5" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-4" style={{fontFamily: "'Orbitron', sans-serif"}}>// TOURNAMENT INFO</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-black text-gray-600 tracking-widest mb-1 block">TOURNAMENT NAME *</label>
                    <input className="neon-input" placeholder="e.g. VINCI CUP SEASON 1"
                      value={formData.tournamentName} onChange={e => setFormData(p => ({...p, tournamentName: e.target.value}))} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-black text-gray-600 tracking-widest mb-1 block">GAME</label>
                      <select className="neon-select" value={formData.game} onChange={e => setFormData(p => ({...p, game: e.target.value}))}>
                        {GAMES.map(g => <option key={g} value={g}>{gameIcon[g]} {g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-600 tracking-widest mb-1 block">DATE</label>
                      <input type="date" className="neon-input" value={formData.date}
                        onChange={e => setFormData(p => ({...p, date: e.target.value}))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-600 tracking-widest mb-1 block">ORGANIZER</label>
                    <input className="neon-input" placeholder="e.g. VINCI ESPORTS"
                      value={formData.organizer} onChange={e => setFormData(p => ({...p, organizer: e.target.value}))} />
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button onClick={handleCreate} disabled={creating || !formData.tournamentName.trim()}
                    className="flex-1 py-2.5 rounded-lg font-black text-xs tracking-widest transition text-white"
                    style={formData.tournamentName.trim() ? {background: 'linear-gradient(135deg, #FF3B3B, #FF7A18)', boxShadow: '0 0 15px rgba(255,59,59,0.4)'} : {background: '#111', color: '#333', cursor: 'not-allowed'}}>
                    {creating ? '⟳ SAVING...' : '⚡ SAVE & TRACK →'}
                  </button>
                  <button onClick={handleDownload} disabled={downloading || !formData.tournamentName.trim()}
                    className="flex-1 py-2.5 rounded-lg font-black text-xs tracking-widest transition border"
                    style={formData.tournamentName.trim() ? {borderColor: 'rgba(239,68,68,0.4)', color: '#ef4444', background: 'rgba(239,68,68,0.05)'} : {borderColor: '#222', color: '#333', cursor: 'not-allowed'}}>
                    {downloading ? '⟳...' : '⬇ DOWNLOAD PNG'}
                  </button>
                </div>
              </div>

              {/* Template */}
              <div className="rounded-2xl p-5" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// GRAPHIC TEMPLATE</p>
                <div className="grid grid-cols-3 gap-2">
                  {TEMPLATES.map(t => (
                    <div key={t.id} onClick={() => setSelectedTemplate(t.id)}
                      className="rounded-xl p-2.5 cursor-pointer transition text-center"
                      style={{background: t.bg, border: `2px solid ${selectedTemplate === t.id ? t.accent : 'transparent'}`, boxShadow: selectedTemplate === t.id ? `0 0 12px ${t.accent}40` : 'none'}}>
                      <div className="w-full h-6 rounded mb-1.5" style={{background: t.accent + '30'}} />
                      <p style={{color: t.accent, fontFamily: "'Orbitron', sans-serif", fontSize: '8px', fontWeight: 900}}>{t.name}</p>
                    {selectedTemplate === t.id && <p style={{color: '#10b981', fontSize: '8px', fontWeight: 900}}>✓ ACTIVE</p>}
                    </div>
                  ))}
                <button 
  onClick={() => {
    if (tournaments.length > 0) {
      router.push(`/tournaments/${tournaments[0].id}/export`);
    } else {
      alert('Pehle tournament save karo! "SAVE & TRACK" button click karo.');
    }
  }}
  className="w-full mt-3 py-2 rounded-lg font-black text-xs tracking-widest transition border border-yellow-500/20 hover:border-yellow-500/50 text-yellow-400 hover:text-yellow-300">
  🎨 MORE TEMPLATES (40) →
</button>
                </div>
              </div>

              {/* Teams */}
              <div className="rounded-2xl p-5" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-black tracking-widest text-red-500/70" style={{fontFamily: "'Orbitron', sans-serif"}}>// TEAMS & SCORES</p>
                  <select className="neon-select" style={{width: 'auto', padding: '4px 8px', fontSize: '11px'}}
                    value={formData.teamCount} onChange={e => updateTeamCount(parseInt(e.target.value))}>
                    {[4,6,8,10,12].map(n => <option key={n} value={n}>{n} TEAMS</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-12 gap-1 mb-2 px-1">
                  {['#','TEAM NAME','PLACE','KILLS'].map((h,i) => (
                    <p key={h} className={`text-xs text-gray-700 font-black ${i===0?'col-span-1':i===1?'col-span-5':'col-span-3'}`}>{h}</p>
                  ))}
                </div>
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {formData.teams.map((team, i) => (
                    <div key={i} className="grid grid-cols-12 gap-1 items-center">
                      <span className="col-span-1 text-xs text-gray-600 font-black text-center">{i+1}</span>
                      <input className="neon-input col-span-5" style={{padding: '6px 8px', fontSize: '11px'}}
                        placeholder={`Team ${i+1}`} value={team.name} onChange={e => updateTeam(i, 'name', e.target.value)} />
                      <input type="number" className="neon-input col-span-3" style={{padding: '6px 8px', fontSize: '11px'}}
                        placeholder="0" value={team.placement || ''} onChange={e => updateTeam(i, 'placement', e.target.value)} />
                      <input type="number" className="neon-input col-span-3" style={{padding: '6px 8px', fontSize: '11px'}}
                        placeholder="0" value={team.kills || ''} onChange={e => updateTeam(i, 'kills', e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MIDDLE — LIVE PREVIEW */}
            <div className="xl:col-span-1">
              <div className="sticky top-24 rounded-2xl p-5" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-black tracking-widest text-red-500/70" style={{fontFamily: "'Orbitron', sans-serif"}}>// LIVE PREVIEW</p>
                  <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded font-black">LIVE</span>
                </div>

                <div ref={previewRef} style={{background: template.bg, borderRadius: '10px', padding: '20px', border: `1px solid ${template.accent}30`}}>
                  <div style={{textAlign: 'center', marginBottom: '12px'}}>
                    <div style={{display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', background: template.accent + '20', border: `1px solid ${template.accent}40`, marginBottom: '8px'}}>
                      <span style={{color: template.accent, fontSize: '9px', fontWeight: 900, fontFamily: 'Orbitron,sans-serif', letterSpacing: '2px'}}>
                        {gameIcon[formData.game]} {formData.game.toUpperCase()}
                      </span>
                    </div>
                    <div style={{fontFamily: 'Orbitron,sans-serif', fontWeight: 900, fontSize: '16px', color: template.text, letterSpacing: '2px', marginBottom: '4px'}}>
                      {formData.tournamentName || 'TOURNAMENT NAME'}
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', gap: '12px'}}>
                      {formData.organizer && <span style={{color: template.accent, fontSize: '10px', fontWeight: 700}}>BY {formData.organizer.toUpperCase()}</span>}
                      {formData.date && <span style={{color: '#6b7280', fontSize: '10px', fontWeight: 700}}>{new Date(formData.date).toLocaleDateString('en-IN')}</span>}
                    </div>
                  </div>

                  <div style={{height: '1px', background: `linear-gradient(90deg,transparent,${template.accent},transparent)`, marginBottom: '12px'}} />

                  <div style={{display: 'grid', gridTemplateColumns: '32px 1fr 60px 60px 60px', gap: '6px', padding: '6px 10px', background: template.accent + '20', borderRadius: '6px', marginBottom: '6px'}}>
                    {['#','TEAM','PLACE','KILLS','TOTAL'].map(h => (
                      <span key={h} style={{fontFamily: 'Orbitron,sans-serif', fontWeight: 900, fontSize: '8px', color: template.accent, letterSpacing: '1px'}}>{h}</span>
                    ))}
                  </div>

                  {sortedTeams.map((team, i) => (
                    <div key={i} style={{display: 'grid', gridTemplateColumns: '32px 1fr 60px 60px 60px', gap: '6px', padding: '6px 10px',
                      background: i === 0 ? template.accent + '15' : i%2===0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                      borderRadius: '5px', marginBottom: '3px', border: i===0 ? `1px solid ${template.accent}30` : '1px solid transparent'}}>
                      <span style={{fontFamily: 'Orbitron,sans-serif', fontWeight: 900, fontSize: '10px', color: i===0?'#FFD700':i===1?'#C0C0C0':i===2?'#CD7F32':template.accent}}>
                        {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}
                      </span>
                      <span style={{fontFamily: 'Orbitron,sans-serif', fontWeight: 700, fontSize: '10px', color: template.text}}>{team.name}</span>
                      <span style={{fontFamily: 'Orbitron,sans-serif', fontWeight: 700, fontSize: '10px', color: template.text, textAlign: 'center'}}>{team.placement||0}</span>
                      <span style={{fontFamily: 'Orbitron,sans-serif', fontWeight: 700, fontSize: '10px', color: template.text, textAlign: 'center'}}>{team.kills||0}</span>
                      <span style={{fontFamily: 'Orbitron,sans-serif', fontWeight: 900, fontSize: '10px', color: template.accent, textAlign: 'center'}}>{team.total}</span>
                    </div>
                  ))}

                  <div style={{marginTop: '12px', height: '1px', background: `linear-gradient(90deg,transparent,${template.accent}50,transparent)`}} />
                  <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '6px'}}>
                    <span style={{fontFamily: 'Orbitron,sans-serif', fontSize: '7px', color: template.accent, fontWeight: 900, letterSpacing: '2px'}}>VINCI-ARENA.PRO</span>
                    <span style={{fontFamily: 'Orbitron,sans-serif', fontSize: '7px', color: '#4b5563', fontWeight: 700}}>VINCI STUDIO</span>
                  </div>
                </div>

                <button onClick={handleDownload} disabled={downloading || !formData.tournamentName.trim()}
                  className="w-full mt-3 py-2.5 rounded-xl font-black text-xs tracking-widest text-white transition"
                  style={formData.tournamentName.trim() ? {background: 'linear-gradient(135deg, #FF3B3B, #FF7A18)', boxShadow: '0 0 15px rgba(255,59,59,0.4)'} : {background: '#111', color: '#333', cursor: 'not-allowed'}}>
                  {downloading ? '⟳ GENERATING...' : '⬇ DOWNLOAD PNG'}
                </button>
              </div>
            </div>

            {/* RIGHT — YOUR TOURNAMENTS */}
            <div className="xl:col-span-1">
              <div className="rounded-2xl p-5" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">🏆</span>
                  <h2 className="font-black text-sm text-white" style={{fontFamily: "'Orbitron', sans-serif"}}>YOUR TOURNAMENTS</h2>
                  <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2 py-0.5 rounded font-black">{tournaments.length}</span>
                </div>

                {loadingTournaments ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                  </div>
                ) : tournaments.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-3xl mb-2">🏆</div>
                    <p className="text-gray-600 font-bold text-sm">No tournaments yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {tournaments.map(t => (
                      <div key={t.id} className="t-row flex items-center gap-2 p-3 bg-gray-950 border border-gray-800 rounded-xl cursor-pointer"
                        onClick={() => router.push(`/tournaments/${t.id}`)}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                          style={{background: (gameColors[t.game]||'#ef4444')+'20', border: `1px solid ${gameColors[t.game]||'#ef4444'}40`}}>
                          {t.game==='Free Fire'?'🔥':t.game==='BGMI'?'🎯':'⚡'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-xs text-white truncate">{t.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs font-black px-1.5 py-0.5 rounded" style={{background: (gameColors[t.game]||'#ef4444')+'15', color: gameColors[t.game]||'#ef4444', fontSize: '10px'}}>{t.game}</span>
                            <span className="text-xs text-gray-700 font-bold">{new Date(t.created_at).toLocaleDateString('en-IN')}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={e=>{e.stopPropagation();router.push(`/tournaments/${t.id}`);}}
                            className="text-xs text-red-400 font-black px-2 py-1 border border-red-500/20 hover:border-red-500/50 rounded-lg transition">
                            OPEN
                          </button>
                          <button onClick={e=>{e.stopPropagation();router.push(`/tournaments/${t.id}/export`);}}
                            className="text-xs text-yellow-400 font-black px-2 py-1 border border-yellow-500/20 hover:border-yellow-500/50 rounded-lg transition">
                            🎨
                          </button>
                          <button onClick={e=>{e.stopPropagation();router.push(`/tournaments/${t.id}/export`);}}
                            className="text-xs text-yellow-400 font-black px-2 py-1 border border-yellow-500/20 hover:border-yellow-500/50 rounded-lg transition">
                            🎨
                          </button>
                          <button onClick={e=>{e.stopPropagation();router.push(`/tournaments/${t.id}/export`);}}
                            className="text-xs text-yellow-400 font-black px-2 py-1 border border-yellow-500/20 hover:border-yellow-500/50 rounded-lg transition">
                            🎨
                          </button>
                          <button onClick={e=>handleDelete(t.id,e)} className="text-gray-700 hover:text-red-400 font-bold text-sm px-1.5 transition">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
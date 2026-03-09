'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CERT_TYPES = [
  { id: 'winner',        label: '🥇 WINNER',        color: '#FFD700', desc: '1st Place Champion',    fields: ['team', 'tournament', 'organizer', 'date', 'prize'] },
  { id: 'second',        label: '🥈 2ND PLACE',      color: '#C0C0C0', desc: '2nd Place',             fields: ['team', 'tournament', 'organizer', 'date', 'prize'] },
  { id: 'third',         label: '🥉 3RD PLACE',      color: '#CD7F32', desc: '3rd Place',             fields: ['team', 'tournament', 'organizer', 'date', 'prize'] },
  { id: 'mvp',           label: '⚡ MVP',             color: '#ef4444', desc: 'Most Valuable Player', fields: ['player', 'team', 'tournament', 'organizer', 'date'] },
  { id: 'participation', label: '🎮 PARTICIPATION',  color: '#6366f1', desc: 'Participation Award',  fields: ['player', 'tournament', 'organizer', 'date'] },
];

const TEMPLATES = [
  { id: 1, name: 'DARK FIRE',   bg: 'linear-gradient(135deg, #0a0000 0%, #1a0005 50%, #0a0010 100%)', accent: '#ef4444' },
  { id: 2, name: 'GOLD ELITE',  bg: 'linear-gradient(135deg, #0a0800 0%, #1a1200 50%, #0a0500 100%)', accent: '#FFD700' },
  { id: 3, name: 'ROYAL NIGHT', bg: 'linear-gradient(135deg, #05001a 0%, #100030 50%, #05001a 100%)', accent: '#a855f7' },
  { id: 4, name: 'CYBER TEAL',  bg: 'linear-gradient(135deg, #001a15 0%, #002a20 50%, #001510 100%)', accent: '#10b981' },
  { id: 5, name: 'ICE STORM',   bg: 'linear-gradient(135deg, #001020 0%, #001a30 50%, #000a15 100%)', accent: '#38bdf8' },
  { id: 6, name: 'CRIMSON',     bg: 'linear-gradient(135deg, #1a0000 0%, #2a0010 50%, #1a0000 100%)', accent: '#f43f5e' },
];

const ORIENTATIONS = [
  { id: 'landscape', label: '🖥 LANDSCAPE', w: 800, h: 500, scale: 0.75, marginBottom: -130 },
  { id: 'portrait',  label: '📱 PORTRAIT',  w: 500, h: 700, scale: 0.60, marginBottom: -280 },
];

const GAMES = ['Free Fire', 'BGMI', 'Valorant', 'General'];
const gameIcon = { 'Free Fire': '🔥', 'BGMI': '🎯', 'Valorant': '⚡', 'General': '🎮' };

export default function CertificatePage() {
  const previewRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [selectedOrientation, setSelectedOrientation] = useState('landscape');
  const [certType, setCertType] = useState('winner');
  const [formData, setFormData] = useState({
    playerName: '', teamName: '', tournamentName: '',
    game: 'Free Fire', organizer: '', date: new Date().toISOString().split('T')[0], prize: '',
  });

  const template = TEMPLATES.find(t => t.id === selectedTemplate);
  const orientation = ORIENTATIONS.find(o => o.id === selectedOrientation);
  const certTypeData = CERT_TYPES.find(c => c.id === certType);
  const accentColor = certTypeData?.color || template.accent;

  const showField = (field) => certTypeData?.fields.includes(field);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewRef.current, { scale: 2, backgroundColor: null, useCORS: true });
      const link = document.createElement('a');
      const name = showField('player') ? formData.playerName : formData.teamName;
      link.download = `${name || 'certificate'}-${certType}-vinci.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) { console.error(err); }
    finally { setDownloading(false); }
  };

  const isLandscape = selectedOrientation === 'landscape';
  const canDownload = showField('player') ? formData.playerName.trim() : formData.teamName.trim();

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif", paddingTop: '44px'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .neon-input { background: #0a0a0a; border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; color: white; font-family: 'Rajdhani'; font-weight: 600; font-size: 13px; padding: 10px 14px; width: 100%; outline: none; transition: all 0.2s; }
        .neon-input:focus { border-color: rgba(239,68,68,0.6); box-shadow: 0 0 10px rgba(239,68,68,0.15); }
        .neon-input::placeholder { color: #374151; }
        .neon-select { background: #0a0a0a; border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; color: white; font-family: 'Rajdhani'; font-weight: 700; font-size: 13px; padding: 10px 14px; width: 100%; outline: none; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #ef4444; }
      `}</style>

      <div className="grid-bg min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/studio"><button className="text-red-400 hover:text-red-300 font-bold text-sm">← STUDIO</button></Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background: 'linear-gradient(135deg, #FFD700, #f97316)', boxShadow: '0 0 20px rgba(234,179,8,0.5)'}}>🏆</div>
                <div>
                  <h1 className="font-black text-xl text-white" style={{fontFamily: "'Orbitron', sans-serif"}}>CERTIFICATE GENERATOR</h1>
                  <p className="text-xs text-gray-600 font-bold">WINNER · MVP · PARTICIPATION · ALL POSITIONS</p>
                </div>
              </div>
            </div>
            <button onClick={handleDownload} disabled={downloading || !canDownload}
              className="px-6 py-2.5 rounded-xl font-black text-xs tracking-widest text-white transition"
              style={canDownload ? {background: 'linear-gradient(135deg, #FF3B3B, #FF7A18)', boxShadow: '0 0 20px rgba(255,59,59,0.4)'} : {background: '#111', color: '#333', cursor: 'not-allowed'}}>
              {downloading ? '⟳ GENERATING...' : '⬇ DOWNLOAD PNG'}
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* LEFT FORM */}
            <div className="space-y-4">

              {/* Cert Type */}
              <div className="rounded-2xl p-5" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// CERTIFICATE TYPE</p>
                <div className="space-y-2">
                  {CERT_TYPES.map(c => (
                    <div key={c.id} onClick={() => setCertType(c.id)}
                      className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition"
                      style={{background: certType === c.id ? c.color+'15' : '#0a0a0a', border: `1px solid ${certType === c.id ? c.color+'50' : 'rgba(255,255,255,0.05)'}`, boxShadow: certType === c.id ? `0 0 10px ${c.color}25` : 'none'}}>
                      <span className="text-lg">{c.label.split(' ')[0]}</span>
                      <div className="flex-1">
                        <p className="font-black text-xs text-white">{c.label.split(' ').slice(1).join(' ')}</p>
                        <p className="font-bold" style={{color: c.color, fontSize: '10px'}}>{c.desc}</p>
                      </div>
                      {certType === c.id && <span className="text-green-400 font-black text-xs">✓</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Fields */}
              <div className="rounded-2xl p-5" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// DETAILS</p>
                <div className="space-y-3">

                  {/* PLAYER NAME — only for MVP & Participation */}
                  {showField('player') && (
                    <div>
                      <label className="text-xs font-black tracking-widest mb-1 block" style={{color: accentColor}}>
                        PLAYER NAME *
                      </label>
                      <input className="neon-input" placeholder="e.g. JARVIS"
                        value={formData.playerName} onChange={e => setFormData(p => ({...p, playerName: e.target.value}))} />
                    </div>
                  )}

                  {/* TEAM NAME — only for Winner/2nd/3rd */}
                  {showField('team') && (
                    <div>
                      <label className="text-xs font-black tracking-widest mb-1 block" style={{color: accentColor}}>
                        TEAM NAME *
                      </label>
                      <input className="neon-input" placeholder="e.g. VINCI ESPORTS"
                        value={formData.teamName} onChange={e => setFormData(p => ({...p, teamName: e.target.value}))} />
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-black text-gray-600 tracking-widest mb-1 block">TOURNAMENT NAME</label>
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
                    {showField('prize') && (
                      <div>
                        <label className="text-xs font-black text-gray-600 tracking-widest mb-1 block">PRIZE (₹)</label>
                        <input className="neon-input" placeholder="e.g. 5000"
                          value={formData.prize} onChange={e => setFormData(p => ({...p, prize: e.target.value}))} />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-black text-gray-600 tracking-widest mb-1 block">ORGANIZER</label>
                      <input className="neon-input" placeholder="e.g. VINCI"
                        value={formData.organizer} onChange={e => setFormData(p => ({...p, organizer: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-600 tracking-widest mb-1 block">DATE</label>
                      <input type="date" className="neon-input" value={formData.date}
                        onChange={e => setFormData(p => ({...p, date: e.target.value}))} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Orientation */}
              <div className="rounded-2xl p-5" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// ORIENTATION</p>
                <div className="grid grid-cols-2 gap-2">
                  {ORIENTATIONS.map(o => (
                    <div key={o.id} onClick={() => setSelectedOrientation(o.id)}
                      className="p-3 rounded-lg cursor-pointer text-center transition"
                      style={{background: selectedOrientation === o.id ? 'rgba(239,68,68,0.1)' : '#0a0a0a', border: `1px solid ${selectedOrientation === o.id ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.05)'}`, boxShadow: selectedOrientation === o.id ? '0 0 10px rgba(239,68,68,0.2)' : 'none'}}>
                      <p className="font-black text-xs text-white">{o.label}</p>
                      <p className="text-xs text-gray-600 font-bold">{o.w}×{o.h}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template */}
              <div className="rounded-2xl p-5" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// TEMPLATE</p>
                <div className="grid grid-cols-3 gap-2">
                  {TEMPLATES.map(t => (
                    <div key={t.id} onClick={() => setSelectedTemplate(t.id)}
                      className="rounded-lg p-2 cursor-pointer text-center transition"
                      style={{background: t.bg, border: `2px solid ${selectedTemplate === t.id ? t.accent : 'transparent'}`, boxShadow: selectedTemplate === t.id ? `0 0 10px ${t.accent}40` : 'none'}}>
                      <div className="w-full h-5 rounded mb-1" style={{background: t.accent+'30'}} />
                      <p style={{color: t.accent, fontSize: '8px', fontWeight: 900, fontFamily: 'Orbitron,sans-serif'}}>{t.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — PREVIEW */}
            <div className="xl:col-span-2">
              <div className="sticky top-24 rounded-2xl p-5" style={{background: '#050505', border: '1px solid rgba(239,68,68,0.15)'}}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-black tracking-widest text-red-500/70" style={{fontFamily: "'Orbitron', sans-serif"}}>// LIVE PREVIEW</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded font-black">LIVE</span>
                    <span className="text-xs text-gray-600 font-bold">{orientation.w}×{orientation.h}px</span>
                  </div>
                </div>

                <div className="flex justify-center overflow-hidden">
                  <div style={{transform: `scale(${orientation.scale})`, transformOrigin: 'top center', marginBottom: `${orientation.marginBottom}px`}}>

                    {/* CERTIFICATE DESIGN */}
                    <div ref={previewRef} style={{
                      width: `${orientation.w}px`, height: `${orientation.h}px`,
                      background: template.bg, position: 'relative', overflow: 'hidden',
                      fontFamily: 'Orbitron, sans-serif',
                    }}>
                      {/* Outer glow border */}
                      <div style={{position: 'absolute', inset: 0, border: `2px solid ${accentColor}40`, borderRadius: '4px'}} />
                      <div style={{position: 'absolute', inset: '8px', border: `1px solid ${accentColor}20`, borderRadius: '2px'}} />

                      {/* Corner ornaments */}
                      {[{t:0,l:0},{t:0,r:0},{b:0,l:0},{b:0,r:0}].map((pos, i) => (
                        <div key={i} style={{
                          position: 'absolute', width: '50px', height: '50px',
                          top: pos.t !== undefined ? '12px' : 'auto',
                          bottom: pos.b !== undefined ? '12px' : 'auto',
                          left: pos.l !== undefined ? '12px' : 'auto',
                          right: pos.r !== undefined ? '12px' : 'auto',
                          borderTop: pos.t !== undefined ? `3px solid ${accentColor}` : 'none',
                          borderBottom: pos.b !== undefined ? `3px solid ${accentColor}` : 'none',
                          borderLeft: pos.l !== undefined ? `3px solid ${accentColor}` : 'none',
                          borderRight: pos.r !== undefined ? `3px solid ${accentColor}` : 'none',
                        }} />
                      ))}

                      {/* Top glow */}
                      <div style={{position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '300px', background: `radial-gradient(circle, ${accentColor}25, transparent)`, filter: 'blur(50px)'}} />

                      {/* Diagonal accent lines */}
                      <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`}} />
                      <div style={{position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`}} />

                      {/* CONTENT */}
                      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: isLandscape ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', padding: isLandscape ? '40px 60px' : '40px 40px', gap: isLandscape ? '40px' : '0'}}>

                        {/* LEFT SIDE — Trophy/Medal */}
                        {isLandscape && (
                          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0}}>
                            <div style={{width: '100px', height: '100px', borderRadius: '50%', background: `radial-gradient(circle, ${accentColor}30, ${accentColor}10)`, border: `3px solid ${accentColor}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', boxShadow: `0 0 30px ${accentColor}40`}}>
                              {certType === 'winner' ? '🥇' : certType === 'second' ? '🥈' : certType === 'third' ? '🥉' : certType === 'mvp' ? '⚡' : '🎮'}
                            </div>
                            <div style={{textAlign: 'center', marginTop: '8px'}}>
                              <div style={{color: accentColor, fontSize: '9px', fontWeight: 900, letterSpacing: '2px'}}>VINCI-ARENA.PRO</div>
                              <div style={{color: 'rgba(255,255,255,0.3)', fontSize: '8px', letterSpacing: '1px'}}>ESPORTS PLATFORM</div>
                            </div>
                          </div>
                        )}

                        {/* RIGHT SIDE — Main content */}
                        <div style={{flex: 1, textAlign: isLandscape ? 'left' : 'center'}}>

                          {/* Game + type badge */}
                          <div style={{display: 'inline-flex', alignItems: 'center', gap: '8px', background: accentColor+'20', border: `1px solid ${accentColor}40`, borderRadius: '20px', padding: '5px 14px', marginBottom: isLandscape ? '12px' : '10px'}}>
                            <span style={{color: accentColor, fontSize: '9px', fontWeight: 900, letterSpacing: '2px'}}>
                              {gameIcon[formData.game]} {formData.game.toUpperCase()}
                            </span>
                          </div>

                          {/* Certificate title */}
                          <div style={{fontWeight: 900, fontSize: isLandscape ? '11px' : '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '4px', marginBottom: '6px', textTransform: 'uppercase'}}>
                            CERTIFICATE OF {certType === 'participation' ? 'PARTICIPATION' : certType === 'mvp' ? 'EXCELLENCE' : 'ACHIEVEMENT'}
                          </div>

                          {/* CONGRATULATIONS */}
                          <div style={{fontWeight: 900, fontSize: isLandscape ? '28px' : '22px', color: '#ffffff', letterSpacing: '2px', marginBottom: '4px', textShadow: `0 0 20px ${accentColor}60`, lineHeight: 1.1}}>
                            {certType === 'participation' ? 'THANK YOU!' : certType === 'mvp' ? 'OUTSTANDING!' : 'CONGRATULATIONS!'}
                          </div>

                          {/* Presented to */}
                          <div style={{color: 'rgba(255,255,255,0.4)', fontSize: '9px', letterSpacing: '3px', marginBottom: '8px'}}>
                            {showField('player') ? 'THIS CERTIFICATE IS AWARDED TO' : 'THIS CERTIFICATE IS AWARDED TO TEAM'}
                          </div>

                          {/* NAME — big */}
                         {/* NAME — big */}
                          <div style={{fontWeight: 900, fontSize: isLandscape ? '32px' : '26px', letterSpacing: '3px', marginBottom: '4px', textShadow: `0 0 25px ${accentColor}80`, color: accentColor === '#FFD700' || accentColor === '#C0C0C0' || accentColor === '#CD7F32' ? accentColor : '#ffffff'}}>
                            {showField('player')
                              ? (formData.playerName || 'PLAYER NAME').toUpperCase()
                              : (formData.teamName || 'TEAM NAME').toUpperCase()
                            }
                          </div>
                          {/* MVP team name */}
                          {certType === 'mvp' && formData.teamName && (
                            <div style={{color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', marginBottom: '4px'}}>
                              TEAM: {formData.teamName.toUpperCase()}
                            </div>
                          )}

                          {/* Achievement line */}
                          <div style={{height: '1px', background: `linear-gradient(90deg, ${isLandscape ? '' : 'transparent, '}${accentColor}80, transparent)`, margin: '10px 0'}} />

                          <div style={{color: 'rgba(255,255,255,0.6)', fontSize: isLandscape ? '10px' : '9px', letterSpacing: '1px', marginBottom: '8px', maxWidth: '400px'}}>
                            {certType === 'participation'
  ? `THANK YOU FOR PARTICIPATING IN ${(formData.tournamentName || 'THE TOURNAMENT').toUpperCase()}. YOUR PRESENCE MADE THIS EVENT SPECIAL!`
  : certType === 'mvp'
  ? `FOR OUTSTANDING PERFORMANCE & EXCEPTIONAL SKILLS IN ${(formData.tournamentName || 'THE TOURNAMENT').toUpperCase()}. YOU MADE YOUR TEAM PROUD!`
  : certType === 'winner'
  ? `FOR CLAIMING VICTORY IN ${(formData.tournamentName || 'THE TOURNAMENT').toUpperCase()}. YOUR SKILLS & TEAMWORK WERE EXCEPTIONAL!`
  : `FOR ACHIEVING ${certTypeData?.desc.toUpperCase()} IN ${(formData.tournamentName || 'THE TOURNAMENT').toUpperCase()}. WELL PLAYED & CONGRATULATIONS!`
}
                          </div>

                          {/* Prize */}
                          {formData.prize && showField('prize') && (
                            <div style={{display: 'inline-flex', alignItems: 'center', gap: '6px', background: accentColor+'20', border: `1px solid ${accentColor}40`, borderRadius: '6px', padding: '4px 12px', marginBottom: '8px'}}>
                              <span style={{color: accentColor, fontWeight: 900, fontSize: '12px', letterSpacing: '2px'}}>🏆 PRIZE: ₹{formData.prize}</span>
                            </div>
                          )}

                          {/* Footer row */}
                          <div style={{display: 'flex', gap: '20px', marginTop: '8px', flexWrap: 'wrap'}}>
                            {formData.organizer && (
                              <div>
                                <div style={{color: 'rgba(255,255,255,0.3)', fontSize: '7px', letterSpacing: '2px', marginBottom: '2px'}}>ORGANIZED BY</div>
                                <div style={{color: accentColor, fontWeight: 900, fontSize: '10px', letterSpacing: '1px'}}>{formData.organizer.toUpperCase()}</div>
                              </div>
                            )}
                            {formData.date && (
                              <div>
                                <div style={{color: 'rgba(255,255,255,0.3)', fontSize: '7px', letterSpacing: '2px', marginBottom: '2px'}}>DATE</div>
                                <div style={{color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: '10px'}}>{new Date(formData.date).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})}</div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Portrait trophy */}
                        {!isLandscape && (
                          <div style={{fontSize: '60px', marginBottom: '8px'}}>{certType === 'winner' ? '🥇' : certType === 'second' ? '🥈' : certType === 'third' ? '🥉' : certType === 'mvp' ? '⚡' : '🎮'}</div>
                        )}
                      </div>

                      {/* Watermark */}
                      <div style={{position: 'absolute', bottom: '14px', right: '20px'}}>
                        <span style={{color: accentColor, fontSize: '7px', fontWeight: 900, letterSpacing: '2px', opacity: 0.5}}>VINCI-ARENA.PRO</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button onClick={handleDownload} disabled={downloading || !canDownload}
                  className="w-full mt-4 py-3 rounded-xl font-black text-sm tracking-widest text-white transition"
                  style={canDownload ? {background: 'linear-gradient(135deg, #FF3B3B, #FF7A18)', boxShadow: '0 0 20px rgba(255,59,59,0.4)'} : {background: '#111', color: '#333', cursor: 'not-allowed'}}>
                  {downloading ? '⟳ GENERATING PNG...' : '⬇ DOWNLOAD CERTIFICATE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
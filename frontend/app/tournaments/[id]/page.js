'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function TournamentPage() {
  const router = useRouter();
  const params = useParams();
  const tournamentId = params.id;
  const exportRef = useRef(null);

  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Add match modes
  const [addMode, setAddMode] = useState(null);
  const [matchForm, setMatchForm] = useState({ match_number:'', team_name:'', position:'', kills:'' });
  const emptyTeams = Array.from({ length: 12 }, () => ({ team_name:'', position:'', kills:'' }));
  const [bulkMatchNumber, setBulkMatchNumber] = useState('');
  const [bulkTeams, setBulkTeams] = useState(emptyTeams);

  // Export modes
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedBg, setSelectedBg] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  const backgrounds = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    name: `Template ${i + 1}`,
    path: `/templates/backgrounds/bg-${i + 1}.jpg`,
  }));

  const POINTS = {
    'Free Fire': {
      placement: {1:12,2:9,3:8,4:7,5:6,6:5,7:4,8:3,9:2,10:1,11:0,12:0},
      killPoints: 1,
      table: ['1st:12','2nd:9','3rd:8','4th:7','5th:6','6th:5','7th:4','8th:3','9th:2','10th:1','11th-12th:0']
    },
    'BGMI': {
      placement: {1:10,2:6,3:5,4:4,5:3,6:2,7:1,8:1,9:0,10:0,11:0,12:0,13:0,14:0,15:0,16:0},
      killPoints: 1,
      table: ['1st:10','2nd:6','3rd:5','4th:4','5th:3','6th:2','7th-8th:1','9th+:0']
    },
    'Valorant': {
      placement: {1:5,2:3,3:2,4:1},
      killPoints: 0,
      table: ['1st:5','2nd:3','3rd:2','4th:1']
    }
  };

  const getPlacementPts = (game, pos) => POINTS[game]?.placement[parseInt(pos)] || 0;
  const getKillPts = (game) => POINTS[game]?.killPoints || 1;
  const calcTotal = (game, pos, kills) => getPlacementPts(game, pos) + (parseInt(kills||0) * getKillPts(game));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchTournament();
    fetchMatches();
  }, [tournamentId]);

  const fetchTournament = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/tournaments/${tournamentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setTournament(await res.json());
      else setError('Tournament not found!');
    } catch { setError('Connection error!'); }
    finally { setLoading(false); }
  };

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/tournaments/${tournamentId}/matches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setMatches(await res.json());
    } catch { console.error('fetch matches error'); }
  };

  const handleAddSingle = async (e) => {
    e.preventDefault(); setError(''); setSubmitLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/tournaments/${tournamentId}/matches`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          match_number: parseInt(matchForm.match_number),
          team_name: matchForm.team_name,
          position: parseInt(matchForm.position),
          kills: parseInt(matchForm.kills) || 0
        })
      });
      if (res.ok) {
        setMatchForm({ match_number:'', team_name:'', position:'', kills:'' });
        setAddMode(null);
        setSuccessMsg('✅ Team added!');
        await fetchMatches();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        const d = await res.json();
        setError(d.error || 'Failed to add');
      }
    } catch { setError('Connection error'); }
    finally { setSubmitLoading(false); }
  };

  const handleAddBulk = async (e) => {
    e.preventDefault(); setError('');
    if (!bulkMatchNumber) { setError('Enter match number!'); return; }
    const filled = bulkTeams.filter(t => t.team_name.trim() && t.position !== '');
    if (filled.length === 0) { setError('Fill at least one team!'); return; }
    const positions = filled.map(t => parseInt(t.position));
    const dup = positions.find((p, i) => positions.indexOf(p) !== i);
    if (dup) { setError(`Duplicate position #${dup}!`); return; }

    setSubmitLoading(true);
    try {
      const token = localStorage.getItem('token');
      let ok = 0;
      for (const team of filled) {
        const res = await fetch(`http://localhost:3001/api/tournaments/${tournamentId}/matches`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            match_number: parseInt(bulkMatchNumber),
            team_name: team.team_name.trim(),
            position: parseInt(team.position),
            kills: parseInt(team.kills) || 0
          })
        });
        if (res.ok) ok++;
      }
      if (ok > 0) {
        setBulkTeams(emptyTeams); setBulkMatchNumber(''); setAddMode(null);
        setSuccessMsg(`✅ Match #${bulkMatchNumber} submitted! ${ok} teams added!`);
        await fetchMatches();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch { setError('Connection error'); }
    finally { setSubmitLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:3001/api/matches/${id}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchMatches();
  };

  // Export as PNG with background
  const handleExportPNG = async () => {
    if (!selectedBg) { alert('Please select a template background first!'); setShowTemplateSelector(true); return; }
    setExportLoading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(exportRef.current, {
        scale: 3, useCORS: true, logging: false, allowTaint: true,
      });
      const link = document.createElement('a');
      link.download = `${tournament?.name}-standings.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export error:', err);
      alert('Export failed! Try again.');
    }
    setExportLoading(false);
  };

  // Export as Text
  const handleExportText = () => {
    let text = `🏆 ${tournament?.name} - ${tournament?.game}\n`;
    text += `${'='.repeat(50)}\n`;
    text += `OVERALL STANDINGS\n`;
    text += `${'='.repeat(50)}\n`;
    text += `RANK | TEAM NAME | MATCHES | BOOYAH | PP | KP | TOTAL\n`;
    text += `${'-'.repeat(50)}\n`;
    sortedStandings.forEach((team, i) => {
      text += `${i+1}. ${team.team_name} | ${team.matches_played} | ${team.booyah} | ${team.placement_points} | ${team.kill_points} | ${team.total_points}\n`;
    });
    text += `\nGenerated by VINCI-ARENA`;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `${tournament?.name}-standings.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  // Standings calculation
  const teamStandings = matches.reduce((acc, m) => {
    if (!acc[m.team_name]) acc[m.team_name] = {
      team_name: m.team_name, total_points: 0, kill_points: 0,
      placement_points: 0, booyah: 0, matches_played: 0
    };
    const pp = getPlacementPts(tournament?.game, m.position);
    const kp = parseInt(m.kills||0) * getKillPts(tournament?.game);
    acc[m.team_name].total_points += pp + kp;
    acc[m.team_name].kill_points += kp;
    acc[m.team_name].placement_points += pp;
    acc[m.team_name].matches_played += 1;
    if (parseInt(m.position) === 1) acc[m.team_name].booyah += 1;
    return acc;
  }, {});
  const sortedStandings = Object.values(teamStandings).sort((a,b) => b.total_points - a.total_points);
  const matchGroups = matches.reduce((acc, m) => {
    if (!acc[m.match_number]) acc[m.match_number] = [];
    acc[m.match_number].push(m);
    return acc;
  }, {});
  const totalMatches = Object.keys(matchGroups).length;

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
    </div>
  );

  if (error && !tournament) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center bg-black/60 border border-red-500/30 rounded-2xl p-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-white mb-4">{error}</h2>
        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push('/dashboard')} className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold">← Dashboard</button>
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold">Re-login</button>
        </div>
      </div>
    </div>
  );

  const gameInfo = POINTS[tournament?.game];

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* SUCCESS TOAST */}
      {successMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-2xl">
          {successMsg}
        </div>
      )}

      {/* TEMPLATE SELECTOR MODAL */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black/90 z-[90] overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">Choose Your Template ({backgrounds.length} Designs)</h2>
              <button onClick={() => setShowTemplateSelector(false)} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold">✕ Close</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {backgrounds.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => { setSelectedBg(bg); setShowTemplateSelector(false); }}
                  className={`relative rounded-xl overflow-hidden h-28 transition transform hover:scale-105 active:scale-95 ${
                    selectedBg?.id === bg.id ? 'ring-4 ring-white scale-105' : 'ring-2 ring-gray-700'
                  }`}
                >
                  <img src={bg.path} alt={bg.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                    <span className="text-white text-xs font-bold drop-shadow-lg">{bg.name}</span>
                  </div>
                  {selectedBg?.id === bg.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <span className="text-black text-xs font-black">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            {selectedBg && (
              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={() => { setShowTemplateSelector(false); handleExportPNG(); }}
                  className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold"
                >
                  ⬇️ Download PNG with {selectedBg.name}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <span className="text-white font-bold text-lg">Tournament Calculator</span>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-white text-sm transition">Home</button>
          <button onClick={() => router.push('/profile')} className="text-gray-400 hover:text-white text-sm transition">Profile</button>
          <button onClick={() => { localStorage.clear(); router.push('/'); }} className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* BACK BUTTON */}
        <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1 transition">
          ← Back to Dashboard
        </button>

        {/* TOURNAMENT HEADER */}
        <div className="mb-6">
          <div className="flex items-start gap-4 mb-3">
            <div>
              <h1 className="text-3xl font-black text-white">{tournament?.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">{tournament?.game}</span>
                <span className="text-gray-500 text-sm">Created {new Date(tournament?.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS - exactly like screenshot */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setAddMode(addMode === 'bulk' ? null : 'bulk')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition active:scale-95"
            >
              Add Match
            </button>
            <button
              onClick={() => router.push(`/tournaments/${tournamentId}/export`)}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition active:scale-95"
            >
              🖼️ Export with Template ({backgrounds.length} Designs)
            </button>
            <button
              onClick={() => { if (!selectedBg) { setShowTemplateSelector(true); } else { handleExportPNG(); } }}
              disabled={exportLoading}
              className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition active:scale-95"
            >
              {exportLoading ? '⏳ Generating...' : '⬇️ Export PNG'}
            </button>
            <button
              onClick={handleExportText}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition active:scale-95"
            >
              📄 Export Text
            </button>
            {selectedBg && (
              <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                <img src={selectedBg.path} alt="" className="w-6 h-6 rounded object-cover" />
                <span className="text-gray-300 text-xs">{selectedBg.name}</span>
                <button onClick={() => setSelectedBg(null)} className="text-gray-500 hover:text-red-400 transition text-xs ml-1">✕</button>
              </div>
            )}
          </div>
        </div>

        {/* POINT SYSTEM INFO */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-blue-400 text-xs font-bold uppercase mb-2">📊 {tournament?.game} Point System:</p>
              <div className="flex flex-wrap gap-2">
                {gameInfo?.table.map((item, i) => (
                  <span key={i} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                    {item.replace(':', ' = ')}pts
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end">
              <span className="text-gray-400 text-sm">{getKillPts(tournament?.game)} point per kill</span>
            </div>
          </div>
        </div>

        {/* ADD MATCH - SINGLE */}
        {addMode === 'single' && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">➕ Add Single Team</h3>
            <form onSubmit={handleAddSingle}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { label:'Match #', key:'match_number', type:'number', placeholder:'1' },
                  { label:'Team Name', key:'team_name', type:'text', placeholder:'Team Alpha' },
                  { label:'Placement', key:'position', type:'number', placeholder:'1' },
                  { label:'Kills', key:'kills', type:'number', placeholder:'0' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase">{f.label}</label>
                    <input type={f.type} value={matchForm[f.key]}
                      onChange={e => setMatchForm({...matchForm, [f.key]: e.target.value})}
                      required min={f.type==='number'?'0':undefined}
                      suppressHydrationWarning
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                      placeholder={f.placeholder} />
                  </div>
                ))}
              </div>
              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
              <div className="flex gap-2">
                <button type="submit" disabled={submitLoading}
                  className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold text-sm transition">
                  {submitLoading ? '⏳ Adding...' : '✅ Add Team'}
                </button>
                <button type="button" onClick={() => setAddMode(null)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                  ✕ Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ADD MATCH - BULK 12 TEAMS */}
        {addMode === 'bulk' && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden mb-6">
            <div className="bg-blue-900/40 border-b border-gray-700 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">Add New Match</h3>
                <p className="text-gray-400 text-xs mt-0.5">Fill team names, placement and kills</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setAddMode('single')} className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-lg text-xs font-semibold transition">+ Add 1 Team</button>
                <button onClick={() => setAddMode(null)} className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-semibold transition">✕ Cancel</button>
              </div>
            </div>

            <form onSubmit={handleAddBulk}>
              <div className="p-5">
                {/* Point system reminder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-blue-400 text-xs font-bold mb-1">🎮 {tournament?.game} Placement Points:</p>
                    <p className="text-gray-400 text-xs">{gameInfo?.table.join(' | ')}</p>
                  </div>
                  <div>
                    <p className="text-blue-400 text-xs font-bold mb-1">🔫 Kill Points:</p>
                    <p className="text-gray-400 text-xs">{getKillPts(tournament?.game)} point per kill</p>
                  </div>
                </div>

                {/* Match Number */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-xs font-semibold mb-1.5 uppercase">Match Number</label>
                  <input type="number" value={bulkMatchNumber}
                    onChange={e => setBulkMatchNumber(e.target.value)}
                    min="1" required suppressHydrationWarning
                    className="w-32 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-center font-bold focus:outline-none focus:border-blue-500"
                    placeholder="1" />
                </div>

                {/* Teams label */}
                <p className="text-gray-400 text-xs font-semibold mb-3 uppercase">
                  Teams ({bulkTeams.filter(t => t.team_name.trim()).length} filled)
                </p>

                {/* Column Headers */}
                <div className="grid grid-cols-12 gap-2 mb-2 px-2">
                  <div className="col-span-1 text-gray-600 text-xs font-bold text-center">#</div>
                  <div className="col-span-5 text-gray-600 text-xs font-bold">Team Name</div>
                  <div className="col-span-3 text-gray-600 text-xs font-bold text-center">Place ⭐</div>
                  <div className="col-span-2 text-gray-600 text-xs font-bold text-center">Kills</div>
                  <div className="col-span-1 text-gray-600 text-xs font-bold text-center">Pts</div>
                </div>

                {/* 12 Team Rows */}
                <div className="space-y-1.5">
                  {bulkTeams.map((team, i) => (
                    <div key={`bulk-${i}`}
                      className={`grid grid-cols-12 gap-2 items-center p-1.5 rounded-lg ${team.team_name ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-gray-800/30'}`}>
                      <div className="col-span-1 flex justify-center">
                        <span className="w-6 h-6 rounded-full bg-gray-800 text-gray-500 flex items-center justify-center text-xs font-bold">{i+1}</span>
                      </div>
                      <div className="col-span-5">
                        <input type="text" value={team.team_name}
                          onChange={e => { const u=[...bulkTeams]; u[i]={...u[i],team_name:e.target.value}; setBulkTeams(u); }}
                          suppressHydrationWarning
                          className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none transition placeholder-gray-600"
                          placeholder="Team Name" />
                      </div>
                      <div className="col-span-3">
                        <div className="relative">
                          <input type="number" value={team.position}
                            onChange={e => { const u=[...bulkTeams]; u[i]={...u[i],position:e.target.value}; setBulkTeams(u); }}
                            min="1" max="16" suppressHydrationWarning
                            className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none transition text-center font-bold"
                            placeholder="#" />
                          {team.position && (
                            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs pointer-events-none">
                              {team.position==1?'🥇':team.position==2?'🥈':team.position==3?'🥉':''}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <input type="number" value={team.kills}
                          onChange={e => { const u=[...bulkTeams]; u[i]={...u[i],kills:e.target.value}; setBulkTeams(u); }}
                          min="0" suppressHydrationWarning
                          className="w-full bg-gray-800 border border-gray-700 focus:border-red-500 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none transition text-center"
                          placeholder="0" />
                      </div>
                      <div className="col-span-1 text-center">
                        {team.position ? (
                          <span className={`font-black text-xs ${team.position==1?'text-yellow-400':team.position==2?'text-gray-300':team.position==3?'text-orange-400':'text-blue-400'}`}>
                            {calcTotal(tournament?.game, team.position, team.kills||0)}
                          </span>
                        ) : <span className="text-gray-700 text-xs">—</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {error && <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-lg p-2"><p className="text-red-400 text-xs">❌ {error}</p></div>}
              </div>

              {/* Submit */}
              <div className="border-t border-gray-700 p-4 flex gap-3">
                <button type="submit" disabled={submitLoading}
                  className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white py-3 rounded-xl font-black text-base transition active:scale-95">
                  {submitLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Submitting...
                    </span>
                  ) : '✅ Submit Match'}
                </button>
                <button type="button" onClick={() => { setBulkTeams(emptyTeams); setBulkMatchNumber(''); setError(''); }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-semibold transition">🔄</button>
                <button type="button" onClick={() => { setAddMode(null); setError(''); setBulkTeams(emptyTeams); }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-semibold transition">✕</button>
              </div>
            </form>
          </div>
        )}

        {/* OVERALL STANDINGS - visible on page */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-6">
          <div className="bg-blue-900/50 border-b border-gray-700 px-5 py-3 flex items-center gap-2">
            <span className="text-blue-400 text-lg">🏆</span>
            <h2 className="text-white font-black text-lg uppercase tracking-wider">Overall Standings</h2>
            <span className="ml-auto text-gray-500 text-xs">{sortedStandings.length} teams · {totalMatches} matches</span>
          </div>

          {sortedStandings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📊</p>
              <p className="text-gray-400">No match data yet!</p>
              <p className="text-gray-600 text-sm mt-1">Click "Add Match" to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-800/40">
                    {['RANK','TEAM NAME','MATCH','BOOYAH','P.P.','K.P.','TOTAL P.'].map((col, i) => (
                      <th key={col} className="px-4 py-3 text-blue-300 text-xs font-bold uppercase tracking-wider text-center border-b border-blue-700/50">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedStandings.map((team, i) => (
                    <tr key={team.team_name}
                      className={`border-b border-gray-800/50 transition hover:bg-gray-800/30 ${
                        i===0?'bg-yellow-500/5':i===1?'bg-gray-400/5':i===2?'bg-orange-500/5':''
                      }`}>
                      <td className="px-4 py-3 text-center">
                        <span className="text-lg">{i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${i===0?'bg-yellow-400':i===1?'bg-gray-400':i===2?'bg-orange-400':'bg-blue-400'}`}></span>
                          <span className="text-white font-semibold text-sm">{team.team_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300 text-sm">{team.matches_played}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-yellow-400 font-bold text-sm">{team.booyah > 0 ? `🏆 ${team.booyah}` : '0'}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-blue-300 font-semibold text-sm">{team.placement_points}</td>
                      <td className="px-4 py-3 text-center text-blue-300 font-semibold text-sm">{team.kill_points}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-2xl font-black ${i===0?'text-yellow-400':i===1?'text-gray-300':i===2?'text-orange-400':'text-white'}`}>
                          {team.total_points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MATCH HISTORY */}
        {Object.keys(matchGroups).length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="bg-gray-800 border-b border-gray-700 px-5 py-3">
              <h2 className="text-white font-bold">📋 Match History</h2>
            </div>
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {Object.keys(matchGroups).sort((a,b)=>parseInt(b)-parseInt(a)).map(matchNum => (
                <div key={matchNum} className="border border-gray-700 rounded-xl overflow-hidden">
                  <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
                    <span className="text-white font-bold text-sm">Match #{matchNum}</span>
                    <span className="text-gray-500 text-xs">{matchGroups[matchNum].length} teams</span>
                  </div>
                  <div className="divide-y divide-gray-800/50">
                    {[...matchGroups[matchNum]].sort((a,b)=>a.position-b.position).map(match => (
                      <div key={match.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-800/30 group transition">
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                            match.position===1?'bg-yellow-500 text-black':match.position===2?'bg-gray-400 text-black':match.position===3?'bg-orange-500 text-black':'bg-gray-700 text-gray-300'
                          }`}>{match.position}</span>
                          <div>
                            <p className="text-white text-sm font-semibold">{match.team_name}</p>
                            <p className="text-gray-500 text-xs">{match.kills} kills</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-blue-400 font-bold text-sm">+{calcTotal(tournament?.game, match.position, match.kills)}</span>
                          <button onClick={() => handleDelete(match.id)}
                            className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition">🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* HIDDEN EXPORT CANVAS with background image */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
        <div
          ref={exportRef}
          style={{
            width: '900px',
            minHeight: '500px',
            backgroundImage: selectedBg ? `url(${selectedBg.path})` : 'none',
            backgroundColor: selectedBg ? undefined : '#0a0a1a',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '50px',
            fontFamily: 'Arial, sans-serif',
            position: 'relative',
          }}
        >
          {/* Dark overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,20,60,0.75) 100%)',
          }}></div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1 style={{ color: '#fff', fontSize: '42px', fontWeight: '900', letterSpacing: '5px', margin: '0 0 6px 0', textTransform: 'uppercase', textShadow: '0 0 30px rgba(100,150,255,0.8)' }}>
                {tournament?.name?.toUpperCase()}
              </h1>
              <p style={{ color: '#60a5fa', fontSize: '14px', fontWeight: '700', letterSpacing: '4px', margin: 0, textTransform: 'uppercase' }}>
                {tournament?.game?.toUpperCase()} — OVERALL STANDINGS
              </p>
              <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)', margin: '14px auto', width: '70%' }}></div>
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(30,60,120,0.8)', borderBottom: '2px solid #3b82f6' }}>
                  {['RANK','TEAM NAME','MATCH','BOOYAH','P.P.','K.P.','TOTAL P.'].map((col,i) => (
                    <th key={col} style={{
                      color: '#93c5fd', fontSize: '11px', fontWeight: '800',
                      letterSpacing: '1.5px', padding: '14px 12px',
                      textAlign: i <= 1 ? 'left' : 'center',
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedStandings.map((team, i) => (
                  <tr key={team.team_name} style={{
                    background: i%2===0 ? 'rgba(15,30,70,0.7)' : 'rgba(10,20,50,0.7)',
                    borderBottom: '1px solid rgba(59,130,246,0.15)'
                  }}>
                    <td style={{ padding: '13px 12px', fontSize: '18px' }}>
                      {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}
                    </td>
                    <td style={{ padding: '13px 12px', color: '#fff', fontSize: '14px', fontWeight: '700' }}>
                      {team.team_name}
                    </td>
                    <td style={{ padding: '13px 12px', textAlign: 'center', color: '#93c5fd', fontSize: '13px' }}>
                      {team.matches_played}
                    </td>
                    <td style={{ padding: '13px 12px', textAlign: 'center', color: '#fbbf24', fontSize: '13px', fontWeight: '700' }}>
                      {team.booyah > 0 ? `🏆 ${team.booyah}` : '0'}
                    </td>
                    <td style={{ padding: '13px 12px', textAlign: 'center', color: '#93c5fd', fontSize: '13px', fontWeight: '600' }}>
                      {team.placement_points}
                    </td>
                    <td style={{ padding: '13px 12px', textAlign: 'center', color: '#93c5fd', fontSize: '13px', fontWeight: '600' }}>
                      {team.kill_points}
                    </td>
                    <td style={{ padding: '13px 12px', textAlign: 'center' }}>
                      <span style={{ color: i===0?'#fbbf24':'#60a5fa', fontSize: '22px', fontWeight: '900' }}>
                        {team.total_points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid rgba(59,130,246,0.3)', paddingTop: '14px' }}>
              <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: '10px', letterSpacing: '3px', margin: 0 }}>
                POWERED BY VINCI-ARENA • TRACK. CALCULATE. WIN.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

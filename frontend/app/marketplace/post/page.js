'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    title: '',
    description: '',
    job_type: '',
    game: '',
    role_needed: '',
    experience_level: '',
    budget_type: '',
    budget_amount: '',
    requirements: '',
  });

  const jobTypes = [
    { id: 'player', label: 'PLAYER', icon: '👤', desc: 'Looking for individual players' },
    { id: 'squad', label: 'SQUAD', icon: '👥', desc: 'Need a full team' },
    { id: 'content_creator', label: 'CONTENT', icon: '🎥', desc: 'Content creator needed' },
    { id: 'coach', label: 'COACH', icon: '🎓', desc: 'Coaching services' },
    { id: 'analyst', label: 'ANALYST', icon: '📊', desc: 'Game analyst needed' },
  ];

  const games = [
    { id: 'Free Fire', label: 'FREE FIRE', icon: '🔥' },
    { id: 'BGMI', label: 'BGMI', icon: '🎯' },
    { id: 'Valorant', label: 'VALORANT', icon: '⚡' },
  ];

  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Pro', 'Any'];
  const budgetTypes = ['Paid', 'Free', 'Revenue Share', 'Sponsorship', 'TBD'];

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/marketplace/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post job');
      setSuccess(true);
      setTimeout(() => router.push('/marketplace'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const step1Valid = form.job_type && form.game;
  const step2Valid = form.title.trim() && form.description.trim();

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" style={{fontFamily: "'Rajdhani', sans-serif"}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');`}</style>
        <div className="text-center">
          <div className="text-7xl mb-6 animate-bounce">✅</div>
          <h2 className="text-3xl font-black tracking-widest mb-2" style={{fontFamily: "'Orbitron', sans-serif", color: '#ef4444', textShadow: '0 0 20px rgba(239,68,68,0.8)'}}>JOB POSTED!</h2>
          <p className="text-gray-400 tracking-wider">Redirecting to marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .neon-input { background: #0a0a0a; border: 1px solid rgba(239,68,68,0.3); border-radius: 6px; color: white; font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 13px; letter-spacing: 0.05em; padding: 10px 14px; width: 100%; transition: all 0.2s; outline: none; }
        .neon-input:focus { border-color: rgba(239,68,68,0.8); box-shadow: 0 0 10px rgba(239,68,68,0.2); }
        .neon-input::placeholder { color: #374151; }
        .select-card { background: #0a0a0a; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 12px; cursor: pointer; transition: all 0.2s; text-align: center; }
        .select-card:hover { border-color: rgba(239,68,68,0.4); background: rgba(239,68,68,0.05); }
        .select-card.active { border-color: rgba(239,68,68,0.8); background: rgba(239,68,68,0.1); box-shadow: 0 0 15px rgba(239,68,68,0.2); }
      `}</style>

      {/* Header */}
      <div className="border-b border-red-500/30 px-6 py-4 flex items-center gap-4" style={{boxShadow: '0 0 20px rgba(239,68,68,0.1)'}}>
        <button onClick={() => router.push('/marketplace')} className="text-red-400 hover:text-red-300 font-bold text-lg transition">←</button>
        <div>
          <h1 className="font-black tracking-widest text-red-500" style={{fontFamily: "'Orbitron', sans-serif", fontSize: '16px', textShadow: '0 0 10px rgba(239,68,68,0.5)'}}>POST A JOB</h1>
          <p className="text-xs text-gray-600 tracking-wider font-bold">FIND YOUR PERFECT TEAMMATE</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded flex items-center justify-center font-black text-xs transition-all ${
                step === s ? 'bg-red-600 text-white' : step > s ? 'bg-green-600 text-white' : 'bg-gray-900 text-gray-600 border border-gray-800'
              }`} style={step === s ? {boxShadow: '0 0 10px rgba(239,68,68,0.5)'} : {}}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-green-600' : 'bg-gray-800'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid-bg min-h-screen">
        <div className="max-w-2xl mx-auto p-6">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <p className="text-xs font-black tracking-widest text-red-500/70" style={{fontFamily: "'Orbitron', sans-serif"}}>// STEP 01 — SELECT TYPE & GAME</p>
              <div>
                <p className="text-xs font-bold tracking-wider text-gray-400 mb-3">WHAT ARE YOU LOOKING FOR?</p>
                <div className="grid grid-cols-5 gap-2">
                  {jobTypes.map(type => (
                    <div key={type.id} className={`select-card ${form.job_type === type.id ? 'active' : ''}`} onClick={() => update('job_type', type.id)}>
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-xs font-black tracking-wider text-white">{type.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider text-gray-400 mb-3">WHICH GAME?</p>
                <div className="grid grid-cols-3 gap-3">
                  {games.map(game => (
                    <div key={game.id} className={`select-card ${form.game === game.id ? 'active' : ''}`} onClick={() => update('game', game.id)}>
                      <div className="text-3xl mb-2">{game.icon}</div>
                      <div className="text-sm font-black tracking-wider text-white">{game.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(2)} disabled={!step1Valid}
                className={`w-full py-3 rounded font-black text-sm tracking-widest transition ${step1Valid ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-gray-900 text-gray-700 cursor-not-allowed border border-gray-800'}`}
                style={step1Valid ? {boxShadow: '0 0 20px rgba(239,68,68,0.4)'} : {}}>
                CONTINUE →
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="text-xs font-black tracking-widest text-red-500/70" style={{fontFamily: "'Orbitron', sans-serif"}}>// STEP 02 — JOB DETAILS</p>
              <div>
                <label className="text-xs font-black tracking-widest text-gray-400 mb-2 block">JOB TITLE *</label>
                <input className="neon-input" placeholder="e.g. LOOKING FOR AGGRESSIVE IGL FOR BGMI RANKED"
                  value={form.title} onChange={e => update('title', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-black tracking-widest text-gray-400 mb-2 block">DESCRIPTION *</label>
                <textarea className="neon-input" style={{minHeight: '100px', resize: 'vertical'}}
                  placeholder="Describe what you're looking for in detail..."
                  value={form.description} onChange={e => update('description', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black tracking-widest text-gray-400 mb-2 block">ROLE NEEDED</label>
                  <input className="neon-input" placeholder="e.g. Sniper, IGL, Support"
                    value={form.role_needed} onChange={e => update('role_needed', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-black tracking-widest text-gray-400 mb-2 block">EXPERIENCE LEVEL</label>
                  <select className="neon-input" value={form.experience_level} onChange={e => update('experience_level', e.target.value)}>
                    <option value="">SELECT LEVEL</option>
                    {experienceLevels.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-black tracking-widest text-gray-400 mb-2 block">REQUIREMENTS</label>
                <textarea className="neon-input" style={{minHeight: '80px', resize: 'vertical'}}
                  placeholder="List specific requirements (rank, age, availability, etc.)"
                  value={form.requirements} onChange={e => update('requirements', e.target.value)} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded font-black text-xs tracking-widest transition text-gray-400">← BACK</button>
                <button onClick={() => setStep(3)} disabled={!step2Valid}
                  className={`flex-1 py-3 rounded font-black text-sm tracking-widest transition ${step2Valid ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-gray-900 text-gray-700 cursor-not-allowed border border-gray-800'}`}
                  style={step2Valid ? {boxShadow: '0 0 20px rgba(239,68,68,0.4)'} : {}}>
                  CONTINUE →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5">
              <p className="text-xs font-black tracking-widest text-red-500/70" style={{fontFamily: "'Orbitron', sans-serif"}}>// STEP 03 — COMPENSATION & REVIEW</p>
              <div>
                <p className="text-xs font-bold tracking-wider text-gray-400 mb-3">COMPENSATION TYPE</p>
                <div className="grid grid-cols-5 gap-2">
                  {budgetTypes.map(type => (
                    <div key={type} className={`select-card ${form.budget_type === type ? 'active' : ''}`} onClick={() => update('budget_type', type)}>
                      <div className="text-xs font-black tracking-wider text-white">{type.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </div>
              {form.budget_type === 'Paid' && (
                <div>
                  <label className="text-xs font-black tracking-widest text-gray-400 mb-2 block">AMOUNT (₹)</label>
                  <input className="neon-input" type="number" placeholder="e.g. 5000"
                    value={form.budget_amount} onChange={e => update('budget_amount', e.target.value)} />
                </div>
              )}
              <div className="bg-gray-950 border border-red-500/30 rounded-lg p-4" style={{boxShadow: '0 0 15px rgba(239,68,68,0.1)'}}>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// PREVIEW</p>
                <h3 className="font-black text-base text-white mb-1">{form.title || 'YOUR JOB TITLE'}</h3>
                <p className="text-xs text-gray-500 mb-3">{form.description || 'Your description...'}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-red-500/10 text-red-400 text-xs px-2 py-0.5 rounded border border-red-500/20 font-bold">{form.game}</span>
                  <span className="bg-purple-500/10 text-purple-400 text-xs px-2 py-0.5 rounded border border-purple-500/20 font-bold">{form.job_type?.replace('_', ' ').toUpperCase()}</span>
                  {form.budget_type && <span className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded border border-green-500/20 font-bold">{form.budget_type.toUpperCase()}</span>}
                  {form.experience_level && <span className="bg-yellow-500/10 text-yellow-400 text-xs px-2 py-0.5 rounded border border-yellow-500/20 font-bold">{form.experience_level.toUpperCase()}</span>}
                </div>
              </div>
              {error && (
                <div className="bg-red-950/50 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-400 text-xs font-bold tracking-wider">⚠ {error.toUpperCase()}</p>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-6 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded font-black text-xs tracking-widest transition text-gray-400">← BACK</button>
                <button onClick={handleSubmit} disabled={loading}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded font-black text-sm tracking-widest transition"
                  style={{boxShadow: '0 0 20px rgba(239,68,68,0.5)'}}>
                  {loading ? '⟳ POSTING...' : '⚡ POST JOB NOW'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
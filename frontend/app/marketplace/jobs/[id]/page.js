'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [message, setMessage] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [params.id]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/marketplace/jobs/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setJob(data);
        const userId = localStorage.getItem('userId');
        if (userId && data.job_applications) {
          const applied = data.job_applications.some(a => String(a.applicant_id) === String(userId));
          setAlreadyApplied(applied);
        }
      }
    } catch (err) {
      console.error('Fetch job error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!message.trim()) { setError('Application message is required'); return; }
    setApplying(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/marketplace/jobs/${params.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message, resume_url: resumeUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply');
      setSuccess(true);
      setShowApplyForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setApplying(false);
    }
  };

  const jobTypeConfig = {
    player: { icon: '👤', color: 'from-blue-600 to-cyan-600' },
    squad: { icon: '👥', color: 'from-green-600 to-emerald-600' },
    content_creator: { icon: '🎥', color: 'from-pink-600 to-rose-600' },
    coach: { icon: '🎓', color: 'from-purple-600 to-violet-600' },
    analyst: { icon: '📊', color: 'from-orange-600 to-red-600' },
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="text-center">
        <div className="text-5xl mb-4">💀</div>
        <p className="font-black tracking-widest text-red-500">JOB NOT FOUND</p>
        <Link href="/marketplace">
          <button className="mt-4 bg-red-600 px-6 py-2 rounded font-black text-xs tracking-widest">← BACK</button>
        </Link>
      </div>
    </div>
  );

  const config = jobTypeConfig[job.job_type] || { icon: '💼', color: 'from-red-600 to-purple-600' };

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .neon-input { background: #0a0a0a; border: 1px solid rgba(239,68,68,0.3); border-radius: 6px; color: white; font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 13px; letter-spacing: 0.05em; padding: 10px 14px; width: 100%; transition: all 0.2s; outline: none; }
        .neon-input:focus { border-color: rgba(239,68,68,0.8); box-shadow: 0 0 10px rgba(239,68,68,0.2); }
        .neon-input::placeholder { color: #374151; }
      `}</style>

      {/* Header */}
      <div className="border-b border-red-500/30 px-6 py-4 flex items-center gap-4" style={{boxShadow: '0 0 20px rgba(239,68,68,0.1)'}}>
        <button onClick={() => router.push('/marketplace')} className="text-red-400 hover:text-red-300 font-bold text-lg">←</button>
        <p className="text-xs font-black tracking-widest text-red-500/70" style={{fontFamily: "'Orbitron', sans-serif"}}>// JOB DETAIL</p>
      </div>

      <div className="grid-bg">
        <div className="max-w-3xl mx-auto p-6">

          {/* Job Header */}
          <div className="bg-gray-950 border border-red-500/30 rounded-xl p-6 mb-6" style={{boxShadow: '0 0 30px rgba(239,68,68,0.1)'}}>
            <div className="flex items-start gap-5">
              <div className={`w-20 h-20 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center text-4xl flex-shrink-0`} style={{boxShadow: '0 0 20px rgba(239,68,68,0.3)'}}>
                {config.icon}
              </div>
              <div className="flex-1">
                <h1 className="font-black text-2xl text-white mb-1 tracking-wide">{job.title}</h1>
                <p className="text-gray-500 text-sm font-bold mb-3">BY {job.users?.name?.toUpperCase() || 'ANONYMOUS'} · {timeAgo(job.created_at)}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-red-500/10 text-red-400 text-xs px-2 py-1 rounded border border-red-500/20 font-black tracking-wider">{job.game}</span>
                  <span className="bg-purple-500/10 text-purple-400 text-xs px-2 py-1 rounded border border-purple-500/20 font-black tracking-wider">{job.job_type.replace('_', ' ').toUpperCase()}</span>
                  {job.budget_type && <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20 font-black tracking-wider">{job.budget_type.toUpperCase()}</span>}
                  {job.experience_level && <span className="bg-yellow-500/10 text-yellow-400 text-xs px-2 py-1 rounded border border-yellow-500/20 font-black tracking-wider">{job.experience_level.toUpperCase()}</span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-3xl font-black text-red-500" style={{textShadow: '0 0 10px rgba(239,68,68,0.5)'}}>{job.applications_count || 0}</div>
                <div className="text-xs text-gray-600 font-bold tracking-wider">APPLICANTS</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Main Content */}
            <div className="col-span-2 space-y-4">
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// DESCRIPTION</p>
                <p className="text-gray-300 text-sm leading-relaxed">{job.description}</p>
              </div>

              {job.requirements && (
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
                  <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// REQUIREMENTS</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{job.requirements}</p>
                </div>
              )}

              {job.role_needed && (
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-5">
                  <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// ROLE NEEDED</p>
                  <p className="text-gray-300 text-sm">{job.role_needed}</p>
                </div>
              )}

              {/* Apply Form */}
              {showApplyForm && (
                <div className="bg-gray-950 border border-red-500/40 rounded-xl p-5" style={{boxShadow: '0 0 20px rgba(239,68,68,0.15)'}}>
                  <p className="text-xs font-black tracking-widest text-red-500 mb-4" style={{fontFamily: "'Orbitron', sans-serif"}}>// YOUR APPLICATION</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-black tracking-widest text-gray-400 mb-2 block">APPLICATION MESSAGE *</label>
                      <textarea className="neon-input" style={{minHeight: '120px', resize: 'vertical'}}
                        placeholder="Tell them why you're the perfect fit. Include your experience, rank, achievements..."
                        value={message} onChange={e => setMessage(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-black tracking-widest text-gray-400 mb-2 block">PROFILE/PORTFOLIO LINK (OPTIONAL)</label>
                      <input className="neon-input" placeholder="e.g. YouTube channel, Twitch, social media..."
                        value={resumeUrl} onChange={e => setResumeUrl(e.target.value)} />
                    </div>
                    {error && (
                      <div className="bg-red-950/50 border border-red-500/50 rounded p-3">
                        <p className="text-red-400 text-xs font-bold tracking-wider">⚠ {error.toUpperCase()}</p>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button onClick={() => setShowApplyForm(false)} className="px-4 py-2.5 bg-gray-900 border border-gray-800 rounded font-black text-xs tracking-widest text-gray-400 hover:bg-gray-800 transition">CANCEL</button>
                      <button onClick={handleApply} disabled={applying}
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded font-black text-sm tracking-widest transition"
                        style={{boxShadow: '0 0 15px rgba(239,68,68,0.4)'}}>
                        {applying ? '⟳ SENDING...' : '⚡ SUBMIT APPLICATION'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-950/50 border border-green-500/50 rounded-xl p-5 text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <p className="font-black text-green-400 tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>APPLICATION SENT!</p>
                  <p className="text-gray-500 text-xs mt-1 tracking-wider mb-3">Good luck, soldier. Check My Applications for status.</p>
                  <Link href="/marketplace/my-applications">
                    <button className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded font-black text-xs tracking-widest transition">VIEW MY APPLICATIONS →</button>
                  </Link>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              {!success && !showApplyForm && (
                <div className="bg-gray-950 border border-red-500/30 rounded-xl p-4" style={{boxShadow: '0 0 15px rgba(239,68,68,0.1)'}}>
                  {alreadyApplied ? (
                    <div className="text-center">
                      <div className="text-2xl mb-2">✅</div>
                      <p className="font-black text-green-400 text-sm tracking-wider">ALREADY APPLIED</p>
                      <Link href="/marketplace/my-applications">
                        <button className="mt-3 w-full bg-gray-800 text-gray-300 py-2 rounded font-black text-xs tracking-widest hover:bg-gray-700 transition">VIEW STATUS →</button>
                      </Link>
                    </div>
                  ) : (
                    <button onClick={() => setShowApplyForm(true)}
                      className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded font-black text-sm tracking-widest transition"
                      style={{boxShadow: '0 0 20px rgba(239,68,68,0.5)'}}>
                      ⚡ APPLY NOW
                    </button>
                  )}
                </div>
              )}

              <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// INFO</p>
                <div className="space-y-3">
                  {[
                    { label: 'GAME', value: job.game },
                    { label: 'TYPE', value: job.job_type.replace('_', ' ').toUpperCase() },
                    { label: 'COMP', value: job.budget_type?.toUpperCase() || 'N/A' },
                    { label: 'EXP', value: job.experience_level?.toUpperCase() || 'N/A' },
                    { label: 'STATUS', value: job.status?.toUpperCase() || 'OPEN' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-xs text-gray-600 font-black tracking-wider">{label}</span>
                      <span className="text-xs text-white font-black">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {job.job_applications?.length > 0 && (
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                  <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// APPLICANTS</p>
                  <div className="space-y-2">
                    {job.job_applications.slice(0, 5).map((app, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-red-600 to-purple-600 rounded flex items-center justify-center text-xs font-black">
                          {app.users?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="text-xs text-gray-400 font-bold">{app.users?.name?.toUpperCase() || 'ANONYMOUS'}</span>
                      </div>
                    ))}
                    {job.job_applications.length > 5 && (
                      <p className="text-xs text-gray-600 font-bold">+{job.job_applications.length - 5} MORE</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
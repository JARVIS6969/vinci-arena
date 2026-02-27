'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MyApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applied');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [appsRes, jobsRes] = await Promise.all([
        fetch('http://localhost:3001/api/marketplace/my-applications', { headers }),
        fetch('http://localhost:3001/api/marketplace/my-jobs', { headers }),
      ]);
      if (appsRes.ok) setApplications(await appsRes.json());
      if (jobsRes.ok) setMyJobs(await jobsRes.json());
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    pending: { label: 'PENDING', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
    reviewed: { label: 'REVIEWED', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    accepted: { label: 'ACCEPTED', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
    rejected: { label: 'REJECTED', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
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

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .card-hover { transition: all 0.2s ease; }
        .card-hover:hover { transform: translateY(-2px); border-color: rgba(239,68,68,0.4) !important; }
      `}</style>

      {/* Header */}
      <div className="border-b border-red-500/30 px-6 py-4 flex items-center gap-4" style={{boxShadow: '0 0 20px rgba(239,68,68,0.1)'}}>
        <button onClick={() => router.push('/marketplace')} className="text-red-400 hover:text-red-300 font-bold text-lg">←</button>
        <div>
          <h1 className="font-black tracking-widest text-red-500" style={{fontFamily: "'Orbitron', sans-serif", fontSize: '16px', textShadow: '0 0 10px rgba(239,68,68,0.5)'}}>MY ACTIVITY</h1>
          <p className="text-xs text-gray-600 tracking-wider font-bold">APPLICATIONS & YOUR JOB POSTINGS</p>
        </div>
        <div className="ml-auto">
          <Link href="/marketplace/post">
            <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-black text-xs tracking-widest transition" style={{boxShadow: '0 0 15px rgba(239,68,68,0.4)'}}>
              + POST JOB
            </button>
          </Link>
        </div>
      </div>

      <div className="grid-bg min-h-screen">
        <div className="max-w-4xl mx-auto p-6">

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-950 border border-gray-800 rounded-lg p-1 w-fit">
            {[
              { id: 'applied', label: 'APPLIED', count: applications.length, icon: '📋' },
              { id: 'posted', label: 'MY JOBS', count: myJobs.length, icon: '📢' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded font-black text-xs tracking-widest transition ${
                  activeTab === tab.id ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
                style={activeTab === tab.id ? {boxShadow: '0 0 10px rgba(239,68,68,0.4)'} : {}}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded text-xs font-black ${activeTab === tab.id ? 'bg-red-800' : 'bg-gray-800 text-gray-500'}`}>{tab.count}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
              <p className="text-red-500/60 text-xs tracking-widest font-bold" style={{fontFamily: "'Orbitron', sans-serif"}}>LOADING DATA...</p>
            </div>
          ) : (
            <>
              {/* APPLIED TAB */}
              {activeTab === 'applied' && (
                <div>
                  {applications.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="text-5xl mb-4">📋</div>
                      <p className="font-black text-gray-600 tracking-widest text-lg" style={{fontFamily: "'Orbitron', sans-serif"}}>NO APPLICATIONS YET</p>
                      <p className="text-gray-700 text-xs mt-2 tracking-wider mb-6">Start applying to opportunities in the marketplace</p>
                      <Link href="/marketplace">
                        <button className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded font-black text-xs tracking-widest transition" style={{boxShadow: '0 0 15px rgba(239,68,68,0.4)'}}>
                          ⚡ BROWSE JOBS
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-3 mb-6">
                        {[
                          { label: 'TOTAL', value: applications.length, color: 'text-white' },
                          { label: 'PENDING', value: applications.filter(a => !a.status || a.status === 'pending').length, color: 'text-yellow-400' },
                          { label: 'ACCEPTED', value: applications.filter(a => a.status === 'accepted').length, color: 'text-green-400' },
                          { label: 'REJECTED', value: applications.filter(a => a.status === 'rejected').length, color: 'text-red-400' },
                        ].map(stat => (
                          <div key={stat.label} className="bg-gray-950 border border-gray-800 rounded-lg p-4 text-center">
                            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                            <div className="text-xs text-gray-600 font-black tracking-widest mt-1">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      {applications.map((app) => {
                        const job = app.job_postings;
                        const status = app.status || 'pending';
                        const sConfig = statusConfig[status] || statusConfig.pending;
                        const jConfig = jobTypeConfig[job?.job_type] || { icon: '💼', color: 'from-red-600 to-purple-600' };
                        return (
                          <div key={app.id} className="card-hover bg-gray-950 border border-gray-800 rounded-xl p-5 transition">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 bg-gradient-to-br ${jConfig.color} rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
                                {jConfig.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-3 mb-1">
                                  <h3 className="font-black text-white tracking-wide text-sm">{job?.title || 'Job Deleted'}</h3>
                                  <span className={`text-xs px-2 py-1 rounded border font-black tracking-wider flex-shrink-0 ${sConfig.color}`}>
                                    {sConfig.label}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-xs font-bold mb-2">
                                  BY {job?.users?.name?.toUpperCase() || 'UNKNOWN'} · {job?.game} · {timeAgo(app.applied_at)}
                                </p>
                                <div className="bg-black/50 border border-gray-800 rounded-lg p-3 mb-3">
                                  <p className="text-xs text-gray-500 font-black tracking-wider mb-1">YOUR MESSAGE:</p>
                                  <p className="text-gray-300 text-xs line-clamp-2">{app.message}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  {job?.id && (
                                    <Link href={`/marketplace/jobs/${job.id}`}>
                                      <button className="text-xs text-red-400 hover:text-red-300 font-black tracking-wider transition">VIEW JOB →</button>
                                    </Link>
                                  )}
                                  <span className="text-gray-800 text-xs">|</span>
                                  <span className="text-xs text-gray-600 font-bold">APPLIED {new Date(app.applied_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* POSTED TAB */}
              {activeTab === 'posted' && (
                <div>
                  {myJobs.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="text-5xl mb-4">📢</div>
                      <p className="font-black text-gray-600 tracking-widest text-lg" style={{fontFamily: "'Orbitron', sans-serif"}}>NO JOBS POSTED</p>
                      <p className="text-gray-700 text-xs mt-2 tracking-wider mb-6">Post your first job to find the perfect teammate</p>
                      <Link href="/marketplace/post">
                        <button className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded font-black text-xs tracking-widest transition" style={{boxShadow: '0 0 15px rgba(239,68,68,0.4)'}}>
                          + POST JOB NOW
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myJobs.map((job) => {
                        const jConfig = jobTypeConfig[job.job_type] || { icon: '💼', color: 'from-red-600 to-purple-600' };
                        const applicants = job.job_applications || [];
                        return (
                          <div key={job.id} className="bg-gray-950 border border-gray-800 rounded-xl p-5">
                            <div className="flex items-start gap-4 mb-4">
                              <div className={`w-12 h-12 bg-gradient-to-br ${jConfig.color} rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
                                {jConfig.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-black text-white tracking-wide text-sm">{job.title}</h3>
                                  <span className={`text-xs px-2 py-1 rounded border font-black tracking-wider ${job.status === 'open' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                                    {job.status?.toUpperCase() || 'OPEN'}
                                  </span>
                                </div>
                                <p className="text-gray-500 text-xs font-bold mb-2">{job.game} · {job.job_type.replace('_', ' ').toUpperCase()} · {timeAgo(job.created_at)}</p>
                                <span className="text-red-400 font-black text-sm">{applicants.length} <span className="text-gray-600 text-xs font-bold">APPLICANTS</span></span>
                              </div>
                            </div>

                            {applicants.length > 0 && (
                              <div className="border-t border-gray-800 pt-4">
                                <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// APPLICANTS</p>
                                <div className="space-y-2">
                                  {applicants.map((app, i) => (
                                    <div key={i} className="flex items-center justify-between bg-black/50 rounded-lg px-3 py-2">
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gradient-to-br from-red-600 to-purple-600 rounded flex items-center justify-center text-xs font-black">
                                          {app.users?.name?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <span className="text-xs text-gray-300 font-bold">{app.users?.name?.toUpperCase() || 'ANONYMOUS'}</span>
                                      </div>
                                      <span className={`text-xs px-2 py-0.5 rounded border font-black ${statusConfig[app.status || 'pending']?.color || statusConfig.pending.color}`}>
                                        {(app.status || 'pending').toUpperCase()}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="mt-3">
                              <Link href={`/marketplace/jobs/${job.id}`}>
                                <button className="w-full bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 py-2 rounded font-black text-xs tracking-widest transition">VIEW JOB →</button>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
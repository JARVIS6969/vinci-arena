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

  const updateStatus = async (appId, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/marketplace/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchData();
      else alert('Failed to update status');
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  const statusConfig = {
    pending: { label: 'PENDING', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
    reviewed: { label: 'REVIEWED', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    accepted: { label: 'ACCEPTED', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
    rejected: { label: 'REJECTED', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // Count total received requests
  const totalReceived = myJobs.reduce((acc, job) => acc + (job.job_applications?.length || 0), 0);
  const pendingReceived = myJobs.reduce((acc, job) => acc + (job.job_applications?.filter(a => !a.status || a.status === 'pending').length || 0), 0);

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .card { transition: all 0.2s ease; }
        .card:hover { border-color: rgba(239,68,68,0.3) !important; }
      `}</style>

      {/* Header */}
      <div className="border-b border-red-500/30 px-6 py-4 flex items-center justify-between" style={{boxShadow: '0 0 20px rgba(239,68,68,0.1)'}}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/marketplace')} className="text-red-400 hover:text-red-300 font-bold text-lg">←</button>
          <div>
            <h1 className="font-black tracking-widest text-red-500" style={{fontFamily: "'Orbitron', sans-serif", fontSize: '16px'}}>MY ACTIVITY</h1>
            <p className="text-xs text-gray-600 tracking-wider font-bold">APPLICATIONS & REQUESTS</p>
          </div>
        </div>
        <Link href="/marketplace/post">
          <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-black text-xs tracking-widest transition" style={{boxShadow: '0 0 15px rgba(239,68,68,0.4)'}}>
            + POST JOB
          </button>
        </Link>
      </div>

      <div className="grid-bg min-h-screen">
        <div className="max-w-3xl mx-auto p-6">

          {/* STATS ROW */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white">{applications.length}</div>
              <div className="text-xs text-gray-600 font-black tracking-wider mt-1">JOBS APPLIED</div>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-red-400">{pendingReceived}</div>
              <div className="text-xs text-gray-600 font-black tracking-wider mt-1">PENDING REQUESTS</div>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-green-400">{applications.filter(a => a.status === 'accepted').length}</div>
              <div className="text-xs text-gray-600 font-black tracking-wider mt-1">ACCEPTED</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-950 border border-gray-800 rounded-lg p-1">
            <button onClick={() => setActiveTab('applied')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-black text-xs tracking-widest transition ${activeTab === 'applied' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              style={activeTab === 'applied' ? {boxShadow: '0 0 10px rgba(239,68,68,0.4)'} : {}}>
              📋 MY APPLICATIONS
              <span className={`px-1.5 py-0.5 rounded text-xs font-black ${activeTab === 'applied' ? 'bg-red-800' : 'bg-gray-800 text-gray-500'}`}>{applications.length}</span>
            </button>
            <button onClick={() => setActiveTab('received')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-black text-xs tracking-widest transition ${activeTab === 'received' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              style={activeTab === 'received' ? {boxShadow: '0 0 10px rgba(239,68,68,0.4)'} : {}}>
              📥 RECEIVED REQUESTS
              {pendingReceived > 0 && <span className="px-1.5 py-0.5 rounded text-xs font-black bg-yellow-500 text-black">{pendingReceived}</span>}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* MY APPLICATIONS TAB */}
              {activeTab === 'applied' && (
                <div className="space-y-3">
                  {applications.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="text-5xl mb-4">📋</div>
                      <p className="font-black text-gray-600 tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>NO APPLICATIONS YET</p>
                      <Link href="/marketplace">
                        <button className="mt-4 bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded font-black text-xs tracking-widest transition">BROWSE JOBS →</button>
                      </Link>
                    </div>
                  ) : applications.map((app) => {
                    const job = app.job_postings;
                    const status = app.status || 'pending';
                    const sConfig = statusConfig[status] || statusConfig.pending;
                    return (
                      <div key={app.id} className="card bg-gray-950 border border-gray-800 rounded-xl p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="font-black text-white text-sm tracking-wide">{job?.title || 'Job Deleted'}</h3>
                            <p className="text-xs text-gray-600 font-bold mt-0.5">
                              {job?.game} · BY {job?.users?.name?.toUpperCase() || 'UNKNOWN'} · {timeAgo(app.applied_at)}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded border font-black tracking-wider flex-shrink-0 ${sConfig.color}`}>
                            {sConfig.label}
                          </span>
                        </div>
                        <div className="bg-black/50 border border-gray-800 rounded-lg p-3 mb-2">
                          <p className="text-xs text-gray-500 font-black tracking-wider mb-1">YOUR MESSAGE:</p>
                          <p className="text-gray-300 text-xs">{app.message}</p>
                        </div>
                        {job?.id && (
                          <Link href={`/marketplace/jobs/${job.id}`}>
                            <button className="text-xs text-red-400 hover:text-red-300 font-black tracking-wider transition">VIEW JOB →</button>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* RECEIVED REQUESTS TAB */}
              {activeTab === 'received' && (
                <div className="space-y-4">
                  {myJobs.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="text-5xl mb-4">📥</div>
                      <p className="font-black text-gray-600 tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>NO JOBS POSTED</p>
                      <Link href="/marketplace/post">
                        <button className="mt-4 bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded font-black text-xs tracking-widest transition">POST A JOB →</button>
                      </Link>
                    </div>
                  ) : myJobs.map((job) => {
                    const applicants = job.job_applications || [];
                    return (
                      <div key={job.id} className="bg-gray-950 border border-gray-800 rounded-xl p-5">
                        {/* Job Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-black text-white text-sm tracking-wide">{job.title}</h3>
                            <p className="text-xs text-gray-600 font-bold">{job.game} · {job.job_type?.replace('_', ' ').toUpperCase()} · {timeAgo(job.created_at)}</p>
                          </div>
                          <span className="text-red-400 font-black text-lg">{applicants.length} <span className="text-gray-600 text-xs">REQUESTS</span></span>
                        </div>

                        {applicants.length === 0 ? (
                          <p className="text-xs text-gray-700 font-bold text-center py-4">No requests yet</p>
                        ) : (
                          <div className="space-y-3">
                            {applicants.map((app, i) => (
                              <div key={i} className="bg-black/50 border border-gray-800 rounded-xl p-4">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-purple-600 rounded-full flex items-center justify-center font-black text-xs">
                                      {app.users?.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                      <p className="font-black text-sm text-white">{app.users?.name?.toUpperCase() || 'UNKNOWN'}</p>
                                      <p className="text-xs text-gray-600">{timeAgo(app.applied_at)}</p>
                                    </div>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded border font-black ${statusConfig[app.status || 'pending']?.color || statusConfig.pending.color}`}>
                                    {(app.status || 'PENDING').toUpperCase()}
                                  </span>
                                </div>

                                {/* Message */}
                                <div className="bg-gray-900 rounded-lg p-3 mb-3">
                                  <p className="text-xs text-gray-500 font-black tracking-wider mb-1">MESSAGE:</p>
                                  <p className="text-gray-300 text-xs">{app.message}</p>
                                </div>

                                {/* Action Buttons */}
                                {(!app.status || app.status === 'pending' || app.status === 'reviewed') && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => updateStatus(app.id, 'accepted')}
                                      className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded font-black text-xs tracking-widest transition"
                                      style={{boxShadow: '0 0 10px rgba(34,197,94,0.3)'}}
                                    >
                                      ✅ ACCEPT
                                    </button>
                                    <button
                                      onClick={() => updateStatus(app.id, 'rejected')}
                                      className="flex-1 bg-gray-800 hover:bg-red-900 border border-gray-700 hover:border-red-500/50 text-gray-300 py-2 rounded font-black text-xs tracking-widest transition"
                                    >
                                      ❌ REJECT
                                    </button>
                                    <Link href={`/profile/${app.applicant_id}`}>
                                      <button className="px-3 py-2 bg-gray-900 border border-gray-700 hover:border-red-500/40 text-gray-400 rounded font-black text-xs tracking-widest transition">
                                        👤 PROFILE
                                      </button>
                                    </Link>
                                  </div>
                                )}

                                {/* Already decided */}
                                {(app.status === 'accepted' || app.status === 'rejected') && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => updateStatus(app.id, 'pending')}
                                      className="text-xs text-gray-600 hover:text-gray-400 font-bold tracking-wider transition"
                                    >
                                      UNDO
                                    </button>
                                    <Link href={`/profile/${app.applicant_id}`}>
                                      <button className="px-3 py-2 bg-gray-900 border border-gray-700 hover:border-red-500/40 text-gray-400 rounded font-black text-xs tracking-widest transition">
                                        👤 VIEW PROFILE
                                      </button>
                                    </Link>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
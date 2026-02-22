'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MarketplacePage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeGame, setActiveGame] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, [activeCategory, activeGame]);

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams();
      if (activeGame !== 'all') params.append('game', activeGame);
      if (activeCategory !== 'all') params.append('job_type', activeCategory);

      const res = await fetch(`http://localhost:3001/api/marketplace/jobs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
        if (data.length > 0 && !selectedJob) setSelectedJob(data[0]);
      }
    } catch (err) {
      console.error('Fetch jobs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Opportunities', icon: '💼', count: jobs.length },
    { id: 'player', name: 'Looking for Players', icon: '👤', count: jobs.filter(j => j.job_type === 'player').length },
    { id: 'squad', name: 'Looking for Squads', icon: '👥', count: jobs.filter(j => j.job_type === 'squad').length },
    { id: 'content_creator', name: 'Content Creators', icon: '🎥', count: jobs.filter(j => j.job_type === 'content_creator').length },
    { id: 'coach', name: 'Coaches', icon: '🎓', count: jobs.filter(j => j.job_type === 'coach').length },
    { id: 'analyst', name: 'Analysts', icon: '📊', count: jobs.filter(j => j.job_type === 'analyst').length },
  ];

  const games = [
    { id: 'all', name: 'All Games', icon: '🎮' },
    { id: 'Free Fire', name: 'Free Fire', icon: '🔥' },
    { id: 'BGMI', name: 'BGMI', icon: '🎯' },
    { id: 'Valorant', name: 'Valorant', icon: '⚡' },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col overflow-hidden">
      
      {/* TOP BAR - Discord Style */}
      <div className="h-16 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 flex items-center px-6 shadow-2xl z-50">
        <div className="flex items-center gap-4 flex-1">
          <button onClick={() => router.push('/esports')} className="text-gray-400 hover:text-white transition">
            ←
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-purple-600 rounded-lg flex items-center justify-center font-black shadow-lg">
              💼
            </div>
            <div>
              <h1 className="text-lg font-black">MARKETPLACE</h1>
              <p className="text-xs text-gray-500">Find opportunities • Connect • Grow</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/marketplace/my-applications">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2">
              📝 My Applications
            </button>
          </Link>
          <Link href="/marketplace/post">
            <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-lg shadow-red-500/30">
              + Post Job
            </button>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR - Discord Style Channels */}
        <div className="w-64 bg-gray-900/60 backdrop-blur-xl border-r border-white/10 flex flex-col overflow-hidden">
          
          {/* Games Section */}
          <div className="p-4 border-b border-white/10">
            <h3 className="text-xs font-black text-gray-500 uppercase mb-3">Games</h3>
            <div className="space-y-1">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setActiveGame(game.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
                    activeGame === game.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span>{game.icon}</span>
                  <span>{game.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Categories Section */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-xs font-black text-gray-500 uppercase mb-3">Categories</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-semibold text-sm transition ${
                    activeCategory === cat.id
                      ? 'bg-red-600/20 border border-red-500 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span className="text-xs">{cat.name}</span>
                    </div>
                    {cat.count > 0 && (
                      <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                        {cat.count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-t border-white/10 bg-gray-900/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center font-black">
                {localStorage.getItem('userName')?.[0] || 'U'}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{localStorage.getItem('userName') || 'User'}</p>
                <p className="text-xs text-green-400">● Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER - LinkedIn Style Feed */}
        <div className="flex-1 flex flex-col bg-gray-950/50 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">💼</div>
                <p className="text-gray-400 text-lg mb-2">No opportunities found</p>
                <p className="text-gray-600 text-sm">Try different filters or post your own!</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`bg-gray-900/60 backdrop-blur-sm border rounded-2xl p-6 cursor-pointer transition-all ${
                    selectedJob?.id === job.id
                      ? 'border-red-500 shadow-lg shadow-red-500/20'
                      : 'border-white/10 hover:border-white/30 hover:bg-gray-900/80'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                      {job.job_type === 'player' ? '👤' : job.job_type === 'squad' ? '👥' : '💼'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-lg mb-2">{job.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">{job.game}</span>
                        <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full capitalize">{job.job_type.replace('_', ' ')}</span>
                        {job.budget_type && (
                          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full capitalize">{job.budget_type}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Posted by <b className="text-white">{job.users?.name || 'Anonymous'}</b></span>
                        <span>{job.applications_count || 0} applicants • {new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANEL - Job Details */}
        {selectedJob && (
          <div className="w-96 bg-gray-900/80 backdrop-blur-xl border-l border-white/10 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-purple-600 rounded-xl flex items-center justify-center text-3xl shadow-lg">
                  {selectedJob.job_type === 'player' ? '👤' : selectedJob.job_type === 'squad' ? '👥' : '💼'}
                </div>
                <div>
                  <h2 className="font-black text-xl mb-1">{selectedJob.title}</h2>
                  <p className="text-sm text-gray-400">{selectedJob.users?.name || 'Anonymous'}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-xs font-black text-gray-500 uppercase mb-2">Description</h3>
                  <p className="text-gray-300 text-sm">{selectedJob.description}</p>
                </div>

                <div>
                  <h3 className="text-xs font-black text-gray-500 uppercase mb-2">Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Game</span>
                      <span className="font-bold">{selectedJob.game}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Type</span>
                      <span className="font-bold capitalize">{selectedJob.job_type.replace('_', ' ')}</span>
                    </div>
                    {selectedJob.budget_type && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Compensation</span>
                        <span className="font-bold capitalize">{selectedJob.budget_type}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Posted</span>
                      <span className="font-bold">{new Date(selectedJob.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link href={`/marketplace/jobs/${selectedJob.id}`}>
                <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 rounded-xl font-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30">
                  Apply Now →
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

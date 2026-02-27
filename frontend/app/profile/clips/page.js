'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClipsPage() {
  const router = useRouter();
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    video_url: '',
    game: 'Free Fire',
    clip_type: 'highlight'
  });

  useEffect(() => {
    fetchClips();
  }, []);

  const fetchClips = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      const res = await fetch('http://localhost:3001/api/profiles/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setClips(data?.gameplay_clips || []);
      }
    } catch (err) {
      console.error('Fetch clips error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Extract YouTube video ID
      let videoUrl = form.video_url;
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const videoId = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
        videoUrl = `https://www.youtube.com/embed/${videoId}`;
      }

      const res = await fetch('http://localhost:3001/api/profiles/clips', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...form, video_url: videoUrl})
      });

      if (res.ok) {
        alert('Clip added!');
        setShowAddForm(false);
        setForm({
          title: '',
          description: '',
          video_url: '',
          game: 'Free Fire',
          clip_type: 'highlight'
        });
        fetchClips();
      } else {
        alert('Failed to add clip');
      }
    } catch (err) {
      console.error('Add clip error:', err);
      alert('Error adding clip');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      
      {/* HEADER */}
      

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Add Clip Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-red-500/30 rounded-3xl p-8 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black">Add Gameplay Clip</h2>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white text-2xl">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                    placeholder="Epic Clutch 1v4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">YouTube URL *</label>
                  <input
                    type="url"
                    value={form.video_url}
                    onChange={(e) => setForm({...form, video_url: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                    placeholder="https://youtube.com/watch?v=..."
                    required
                  />
                  <p className="text-xs text-gray-600 mt-1">Paste YouTube video URL</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                    placeholder="Describe your clip..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Game</label>
                    <select
                      value={form.game}
                      onChange={(e) => setForm({...form, game: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="Free Fire">Free Fire</option>
                      <option value="BGMI">BGMI</option>
                      <option value="Valorant">Valorant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Type</label>
                    <select
                      value={form.clip_type}
                      onChange={(e) => setForm({...form, clip_type: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="highlight">Highlight</option>
                      <option value="clutch">Clutch</option>
                      <option value="funny">Funny</option>
                      <option value="tutorial">Tutorial</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 rounded-xl font-black transition-all hover:scale-105 active:scale-95"
                  >
                    Add Clip
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-bold transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Clips Grid */}
        {clips.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎥</div>
            <h2 className="text-2xl font-black mb-2">No Clips Yet</h2>
            <p className="text-gray-400 mb-6">Show off your best gameplay moments!</p>
            <button onClick={() => setShowAddForm(true)} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-xl font-black transition-all hover:scale-105 active:scale-95">
              + Add First Clip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clips.map((clip) => (
              <div key={clip.id} className="bg-gray-900/50 backdrop-blur-xl border border-white/10 hover:border-red-500/50 rounded-2xl overflow-hidden transition-all hover:scale-105">
                <div className="aspect-video bg-gray-800">
                  <iframe
                    src={clip.video_url}
                    className="w-full h-full"
                    allowFullScreen
                    title={clip.title}
                  ></iframe>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">{clip.game}</span>
                    <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full capitalize">{clip.clip_type}</span>
                  </div>

                  <h3 className="text-lg font-black mb-2">{clip.title}</h3>
                  {clip.description && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{clip.description}</p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>👁️ {clip.views || 0} views</span>
                    <span>❤️ {clip.likes || 0} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

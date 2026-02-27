'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AchievementsPage() {
  const router = useRouter();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    achievement_type: 'tournament_win',
    date_achieved: '',
    game: 'Free Fire',
    image_url: '',
    certificate_url: ''
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      const res = await fetch('http://localhost:3001/api/profiles/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setAchievements(data?.achievements || []);
      }
    } catch (err) {
      console.error('Fetch achievements error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/profiles/achievements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert('Achievement added!');
        setShowAddForm(false);
        setForm({
          title: '',
          description: '',
          achievement_type: 'tournament_win',
          date_achieved: '',
          game: 'Free Fire',
          image_url: '',
          certificate_url: ''
        });
        fetchAchievements();
      } else {
        alert('Failed to add achievement');
      }
    } catch (err) {
      console.error('Add achievement error:', err);
      alert('Error adding achievement');
    }
  };

  const getAchievementIcon = (type) => {
    const icons = {
      tournament_win: '🏆',
      milestone: '⭐',
      rank: '🎖️',
      special: '💎'
    };
    return icons[type] || '🏅';
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
        
        {/* Add Achievement Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-red-500/30 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black">Add Achievement</h2>
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
                    placeholder="e.g., 1st Place - Summer Championship"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                    placeholder="Describe your achievement..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Type</label>
                    <select
                      value={form.achievement_type}
                      onChange={(e) => setForm({...form, achievement_type: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="tournament_win">Tournament Win</option>
                      <option value="milestone">Milestone</option>
                      <option value="rank">Rank Achievement</option>
                      <option value="special">Special</option>
                    </select>
                  </div>

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
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Date Achieved *</label>
                  <input
                    type="date"
                    value={form.date_achieved}
                    onChange={(e) => setForm({...form, date_achieved: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => setForm({...form, image_url: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Certificate URL (Optional)</label>
                  <input
                    type="url"
                    value={form.certificate_url}
                    onChange={(e) => setForm({...form, certificate_url: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                    placeholder="https://example.com/certificate.pdf"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 rounded-xl font-black transition-all hover:scale-105 active:scale-95"
                  >
                    Add Achievement
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

        {/* Achievements Grid */}
        {achievements.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-black mb-2">No Achievements Yet</h2>
            <p className="text-gray-400 mb-6">Start building your trophy case!</p>
            <button onClick={() => setShowAddForm(true)} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-xl font-black transition-all hover:scale-105 active:scale-95">
              + Add First Achievement
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-gray-900/50 backdrop-blur-xl border border-white/10 hover:border-red-500/50 rounded-2xl p-6 transition-all hover:scale-105 cursor-pointer">
                {achievement.image_url ? (
                  <div className="w-full h-48 bg-gray-800 rounded-xl mb-4 overflow-hidden">
                    <img src={achievement.image_url} alt={achievement.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-red-900/40 to-purple-900/40 rounded-xl mb-4 flex items-center justify-center">
                    <span className="text-7xl">{getAchievementIcon(achievement.achievement_type)}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">{achievement.game}</span>
                  <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full capitalize">{achievement.achievement_type.replace('_', ' ')}</span>
                </div>

                <h3 className="text-lg font-black mb-2">{achievement.title}</h3>
                {achievement.description && (
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{achievement.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(achievement.date_achieved).toLocaleDateString()}</span>
                  {achievement.certificate_url && (
                    <a href={achievement.certificate_url} target="_blank" className="text-red-400 hover:text-red-300">
                      📜 Certificate
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

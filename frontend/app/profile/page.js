'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MyProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    display_name: '',
    bio: '',
    primary_game: 'Free Fire',
    avatar_url: '',
    banner_url: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      const res = await fetch('http://localhost:3001/api/profiles/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data) {
          setProfile(data);
          setForm({
            display_name: data.display_name || '',
            bio: data.bio || '',
            primary_game: data.primary_game || 'Free Fire',
            avatar_url: data.avatar_url || '',
            banner_url: data.banner_url || ''
          });
        }
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/profiles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditing(false);
        alert('Profile saved successfully!');
      } else {
        alert('Failed to save profile');
      }
    } catch (err) {
      console.error('Save profile error:', err);
      alert('Error saving profile');
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
      <nav className="backdrop-blur-xl bg-black/40 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-white transition">
            ← Back to Dashboard
          </button>
          <h1 className="text-xl font-black">MY PROFILE</h1>
          <div className="w-32"></div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {!profile && !editing ? (
          // NO PROFILE YET
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <span className="text-6xl">👤</span>
            </div>
            <h2 className="text-3xl font-black mb-4">Create Your Profile</h2>
            <p className="text-gray-400 mb-8">Showcase your gaming achievements and build your esports resume</p>
            <button onClick={() => setEditing(true)} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-8 py-4 rounded-xl font-black text-lg transition-all hover:scale-105 active:scale-95">
              Create Profile →
            </button>
          </div>
        ) : editing ? (
          // EDIT MODE
          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-black mb-6">Edit Profile</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Display Name</label>
                <input
                  type="text"
                  value={form.display_name}
                  onChange={(e) => setForm({...form, display_name: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                  placeholder="ProGamer123"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({...form, bio: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Primary Game</label>
                <select
                  value={form.primary_game}
                  onChange={(e) => setForm({...form, primary_game: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="Free Fire">Free Fire</option>
                  <option value="BGMI">BGMI</option>
                  <option value="Valorant">Valorant</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={handleSave} className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 rounded-xl font-black transition-all hover:scale-105 active:scale-95">
                  Save Profile
                </button>
                <button onClick={() => setEditing(false)} className="px-6 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-bold transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          // VIEW MODE
          <div>
            {/* Profile Header */}
            <div className="relative mb-12">
              <div className="h-48 bg-gradient-to-r from-red-900 via-purple-900 to-blue-900 rounded-3xl"></div>
              <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-purple-600 rounded-2xl flex items-center justify-center text-5xl shadow-2xl border-4 border-gray-950">
                  👤
                </div>
                <div className="pb-4">
                  <h1 className="text-4xl font-black mb-2">{profile.display_name || 'Anonymous'}</h1>
                  <p className="text-gray-400">{profile.primary_game || 'No game selected'}</p>
                </div>
              </div>
              <button onClick={() => setEditing(true)} className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition">
                Edit Profile
              </button>
            </div>

            {/* Bio Section */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mt-20 mb-8">
              <h2 className="text-xl font-black mb-4">About Me</h2>
              <p className="text-gray-300">{profile.bio || 'No bio yet. Click Edit Profile to add one!'}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                <p className="text-3xl font-black text-red-400">{profile.total_tournaments || 0}</p>
                <p className="text-gray-500 text-sm uppercase">Tournaments</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                <p className="text-3xl font-black text-green-400">{profile.total_wins || 0}</p>
                <p className="text-gray-500 text-sm uppercase">Wins</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                <p className="text-3xl font-black text-yellow-400">{profile.total_kills || 0}</p>
                <p className="text-gray-500 text-sm uppercase">Kills</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-6">
              <Link href="/profile/achievements">
                <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white py-6 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/30">
                  🏆 Achievements ({profile.achievements?.length || 0})
                </button>
              </Link>
              <Link href="/profile/clips">
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-6 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/30">
                  🎥 Clips ({profile.gameplay_clips?.length || 0})
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

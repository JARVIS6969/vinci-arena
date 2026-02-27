'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateSquadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    tag: '',
    bio: '',
    game: 'Free Fire',
    region: 'India',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('http://localhost:3001/api/squads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/squads/${data.id}`);
      } else {
        setError(data.error || 'Failed to create squad');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      
      {/* Header */}
      

      <div className="max-w-4xl mx-auto px-6 py-12">
        
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Squad Name */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2 uppercase">
              Squad Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
              placeholder="e.g., Total Gaming Squad"
              required
            />
          </div>

          {/* Squad Tag */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2 uppercase">
              Squad Tag (Optional)
            </label>
            <input
              type="text"
              value={form.tag}
              onChange={(e) => setForm({...form, tag: e.target.value.toUpperCase().slice(0, 5)})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none uppercase"
              placeholder="e.g., TSM"
              maxLength={5}
            />
            <p className="text-xs text-gray-600 mt-1">Short tag (max 5 characters)</p>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2 uppercase">
              Bio (Optional)
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({...form, bio: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
              placeholder="Tell us about your squad..."
              rows={4}
            />
          </div>

          {/* Game & Region */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-400 text-sm font-bold mb-2 uppercase">
                Game *
              </label>
              <select
                value={form.game}
                onChange={(e) => setForm({...form, game: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                required
              >
                <option value="Free Fire">Free Fire</option>
                <option value="BGMI">BGMI</option>
                <option value="Valorant">Valorant</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-bold mb-2 uppercase">
                Region *
              </label>
              <select
                value={form.region}
                onChange={(e) => setForm({...form, region: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                required
              >
                <option value="Global">Global</option>
                <option value="India">India</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Americas">Americas</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white py-4 rounded-lg font-black text-lg transition"
          >
            {loading ? 'Creating...' : '✅ Create Squad'}
          </button>

        </form>

        {/* Info Box */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/50 rounded-xl p-4">
          <p className="text-blue-400 text-sm">
            💡 <strong>Note:</strong> You will be automatically added as the squad leader. You can invite other members after creation.
          </p>
        </div>

      </div>
    </div>
  );
}

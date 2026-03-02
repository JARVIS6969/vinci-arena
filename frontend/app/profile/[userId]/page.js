'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    setCurrentUserId(localStorage.getItem('userId') || '');
    fetchProfile();
  }, [params.userId]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/profiles/${params.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: '👋 Hey!', receiver_id: params.userId }),
      });
      if (res.ok) {
        const convRes = await fetch('http://localhost:3001/api/chat/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (convRes.ok) {
          const data = await convRes.json();
          const userId = localStorage.getItem('userId');
          const dm = data.dms.find(d =>
            (d.user1_id === userId && d.user2_id === params.userId) ||
            (d.user2_id === userId && d.user1_id === params.userId)
          );
          if (dm) router.push(`/chat/dm/${dm.id}`);
        }
      }
    } catch (err) { console.error(err); }
  };

  const gameIcon = { 'Free Fire': '🔥', 'BGMI': '🎯', 'Valorant': '⚡' };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
        <p className="text-red-500/60 text-xs tracking-widest font-bold" style={{fontFamily: "'Orbitron', sans-serif"}}>LOADING PROFILE...</p>
      </div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="text-center">
        <div className="text-6xl mb-4">💀</div>
        <p className="font-black text-red-500 text-xl tracking-widest mb-2" style={{fontFamily: "'Orbitron', sans-serif"}}>PROFILE NOT FOUND</p>
        <p className="text-gray-600 text-xs mb-6">This player hasn't set up their profile yet</p>
        <button onClick={() => router.back()} className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded font-black text-xs tracking-widest transition">← GO BACK</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .neon-border { box-shadow: 0 0 20px rgba(239,68,68,0.15); }
        .achievement-card:hover { transform: translateY(-2px); border-color: rgba(239,68,68,0.5) !important; }
        .achievement-card { transition: all 0.2s; }
      `}</style>

      {/* BANNER */}
      <div className="relative h-48 bg-gradient-to-r from-red-950 via-black to-purple-950 overflow-hidden">
        {profile?.banner_url ? (
          <img src={profile.banner_url} alt="banner" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 grid-bg opacity-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <button onClick={() => router.back()} className="absolute top-4 left-4 text-red-400 hover:text-red-300 font-bold text-sm flex items-center gap-1 bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-sm transition">
          ← BACK
        </button>
      </div>

      {/* PROFILE HEADER */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative -mt-16 mb-6 flex items-end gap-5">

          {/* Avatar */}
          <div className="w-28 h-28 rounded-xl border-4 border-black overflow-hidden flex-shrink-0" style={{boxShadow: '0 0 30px rgba(239,68,68,0.4)'}}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-600 to-purple-600 flex items-center justify-center font-black text-4xl">
                {profile?.display_name?.[0]?.toUpperCase() || profile?.userName?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>

          {/* Name & Info */}
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-black text-2xl tracking-wide" style={{fontFamily: "'Orbitron', sans-serif"}}>
                {profile?.display_name || profile?.userName || 'UNKNOWN PLAYER'}
              </h1>
              {profile?.primary_game && (
                <span className="text-lg">{gameIcon[profile.primary_game]}</span>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {profile?.primary_game && (
                <span className="bg-red-500/10 text-red-400 text-xs px-2 py-1 rounded border border-red-500/20 font-black tracking-wider">
                  {profile.primary_game.toUpperCase()}
                </span>
              )}

              {/* SEND MESSAGE BUTTON */}
              {currentUserId && String(currentUserId) !== String(params.userId) && (
                <button
                  onClick={handleSendMessage}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-lg font-black text-xs tracking-widest transition"
                  style={{boxShadow: '0 0 15px rgba(239,68,68,0.4)'}}
                >
                  💬 SEND MESSAGE
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BIO */}
        {profile?.bio && (
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 mb-6 neon-border">
            <p className="text-xs font-black tracking-widest text-red-500/70 mb-2" style={{fontFamily: "'Orbitron', sans-serif"}}>// BIO</p>
            <p className="text-gray-300 text-sm leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* STATS */}
        {profile?.player_stats?.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// STATS</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {profile.player_stats.map((stat, i) => (
                <div key={i} className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-center neon-border">
                  <div className="text-2xl font-black text-red-500 mb-1" style={{textShadow: '0 0 10px rgba(239,68,68,0.5)'}}>
                    {stat.total_kills || 0}
                  </div>
                  <div className="text-xs text-gray-600 font-black tracking-wider">KILLS</div>
                  <div className="text-xs text-gray-500 mt-1 font-bold">{stat.game}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {profile?.achievements?.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// ACHIEVEMENTS</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {profile.achievements.map((ach, i) => (
                <div key={i} className="achievement-card bg-gray-950 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0" style={{boxShadow: '0 0 10px rgba(234,179,8,0.3)'}}>
                    🏆
                  </div>
                  <div>
                    <p className="font-black text-sm text-white tracking-wide">{ach.title}</p>
                    <p className="text-xs text-gray-500">{ach.description}</p>
                    {ach.game && <span className="text-xs text-red-400 font-bold">{ach.game}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GAMEPLAY CLIPS */}
        {profile?.gameplay_clips?.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// GAMEPLAY CLIPS</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.gameplay_clips.map((clip, i) => (
                <div key={i} className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
                  {clip.youtube_url && (
                    <div className="aspect-video">
                      <iframe
                        src={clip.youtube_url.replace('watch?v=', 'embed/')}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="font-black text-sm text-white">{clip.title}</p>
                    {clip.game && <span className="text-xs text-red-400 font-bold">{clip.game}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!profile?.bio && !profile?.player_stats?.length && !profile?.achievements?.length && !profile?.gameplay_clips?.length && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎮</div>
            <p className="font-black text-gray-600 tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>NO DATA YET</p>
            <p className="text-gray-700 text-xs mt-2">This player hasn't added anything to their profile yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
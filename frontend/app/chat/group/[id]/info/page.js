'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function GroupInfoPage() {
  const router = useRouter();
  const params = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroupInfo();
    fetchMembers();
  }, []);

  const fetchGroupInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/chat/groups/${params.id}/info`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setGroup(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/chat/groups/${params.id}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setMembers(await res.json());
    } catch (err) { console.error(err); }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(group?.group_code || '');
    alert('Code copied!');
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .neon-border { box-shadow: 0 0 20px rgba(239,68,68,0.15); }
      `}</style>

      {/* BANNER */}
      <div className="relative h-40 bg-gradient-to-r from-blue-950 via-black to-purple-950 overflow-hidden grid-bg">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <button onClick={() => router.back()} className="absolute top-4 left-4 text-red-400 hover:text-red-300 font-bold text-sm bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-sm transition">
          ← BACK
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-12">

        {/* GROUP HEADER */}
        <div className="flex items-end gap-4 mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl border-4 border-black flex items-center justify-center font-black text-4xl flex-shrink-0"
            style={{boxShadow: '0 0 30px rgba(99,102,241,0.4)'}}>
            {group?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="pb-2 flex-1">
            <h1 className="font-black text-2xl tracking-wide" style={{fontFamily: "'Orbitron', sans-serif"}}>
              {group?.name?.toUpperCase() || 'GROUP'}
            </h1>
            <p className="text-gray-500 text-sm font-bold">{members.length} MEMBERS</p>
          </div>
        </div>

        {/* GROUP CODE */}
        <div className="bg-gray-950 border border-red-500/30 rounded-xl p-4 mb-4 neon-border">
          <p className="text-xs font-black tracking-widest text-red-500/70 mb-2" style={{fontFamily: "'Orbitron', sans-serif"}}>// GROUP CODE</p>
          <div className="flex items-center justify-between">
            <span className="font-black text-3xl tracking-widest text-red-400" style={{fontFamily: "'Orbitron', sans-serif", letterSpacing: '8px'}}>
              {group?.group_code || 'N/A'}
            </span>
            <button onClick={copyCode} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-black text-xs tracking-widest transition"
              style={{boxShadow: '0 0 10px rgba(239,68,68,0.4)'}}>
              📋 COPY
            </button>
          </div>
          <p className="text-xs text-gray-600 font-bold mt-2">Share this code with others to let them join!</p>
        </div>

        {/* DESCRIPTION */}
        {group?.description && (
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 mb-4">
            <p className="text-xs font-black tracking-widest text-red-500/70 mb-2" style={{fontFamily: "'Orbitron', sans-serif"}}>// DESCRIPTION</p>
            <p className="text-gray-300 text-sm">{group.description}</p>
          </div>
        )}

        {/* MEMBERS */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 mb-4">
          <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// MEMBERS ({members.length})</p>
          <div className="space-y-3">
            {members.map((member, i) => (
              <Link href={`/profile/user/${member.user_id}`} key={i}>
                <div className="flex items-center gap-3 hover:bg-gray-900 p-2 rounded-lg transition cursor-pointer">
                  <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-purple-600 rounded-full flex items-center justify-center font-black text-sm">
                    {member.users?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-sm text-white">{member.users?.name?.toUpperCase()}</p>
                    {member.role === 'admin' && <span className="text-xs text-yellow-500 font-bold">👑 ADMIN</span>}
                  </div>
                  <span className="text-xs text-gray-600 font-bold">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* OPEN CHAT BUTTON */}
        <button onClick={() => router.push(`/chat/group/${params.id}`)}
          className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-xs tracking-widest transition mb-6"
          style={{boxShadow: '0 0 15px rgba(239,68,68,0.4)'}}>
          💬 OPEN CHAT
        </button>
      </div>
    </div>
  );
}
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
  const [copied, setCopied] = useState(false);

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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
        <p className="text-red-500/60 text-xs tracking-widest font-bold" style={{fontFamily: "'Orbitron', sans-serif"}}>LOADING...</p>
      </div>
    </div>
  );

  const adminMember = members.find(m => m.role === 'admin');

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .card { background: #050505; border: 1px solid #1f2937; border-radius: 16px; padding: 20px; margin-bottom: 16px; }
        .card:hover { border-color: rgba(239,68,68,0.2); }
        .member-row:hover { background: rgba(239,68,68,0.05); border-radius: 10px; }
        .code-char { display: inline-block; background: #0a0a0a; border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; width: 44px; height: 52px; line-height: 52px; text-align: center; font-family: 'Orbitron', sans-serif; font-weight: 900; font-size: 20px; color: #ef4444; margin: 0 3px; }
        .scan-line { background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239,68,68,0.01) 2px, rgba(239,68,68,0.01) 4px); }
        @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 20px rgba(239,68,68,0.2); } 50% { box-shadow: 0 0 40px rgba(239,68,68,0.4); } }
        .pulse-glow { animation: pulse-glow 3s infinite; }
      `}</style>

      {/* HERO BANNER */}
      <div className="relative h-52 overflow-hidden scan-line" style={{background: 'linear-gradient(135deg, #0a0014 0%, #000 40%, #00040a 100%)'}}>
        <div className="grid-bg absolute inset-0 opacity-60" />
        
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #6366f1, transparent)'}} />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #ef4444, transparent)'}} />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <button onClick={() => router.back()} className="absolute top-5 left-5 flex items-center gap-2 text-gray-400 hover:text-red-400 font-bold text-sm bg-black/60 px-3 py-2 rounded-lg backdrop-blur-sm border border-gray-800 transition">
          ← BACK
        </button>

        <button onClick={() => router.push(`/chat/group/${params.id}`)} className="absolute top-5 right-5 flex items-center gap-2 text-white font-black text-xs tracking-widest bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition"
          style={{boxShadow: '0 0 15px rgba(239,68,68,0.5)'}}>
          💬 OPEN CHAT
        </button>
      </div>

      {/* GROUP AVATAR + NAME */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="relative -mt-14 mb-6 flex items-end gap-5">
          <div className="w-28 h-28 rounded-2xl border-4 border-black flex items-center justify-center font-black text-5xl flex-shrink-0 pulse-glow"
            style={{background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 0 30px rgba(99,102,241,0.5)'}}>
            {group?.icon_url ? (
              <img src={group.icon_url} alt="icon" className="w-full h-full object-cover rounded-xl" />
            ) : (
              group?.name?.[0]?.toUpperCase() || '?'
            )}
          </div>
          <div className="pb-2 flex-1">
            <h1 className="font-black text-3xl tracking-wide leading-tight" style={{fontFamily: "'Orbitron', sans-serif", textShadow: '0 0 20px rgba(99,102,241,0.3)'}}>
              {group?.name?.toUpperCase() || 'GROUP'}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-gray-500 text-sm font-bold">👥 {members.length} MEMBERS</span>
              {adminMember && <span className="text-gray-600 text-xs font-bold">· CREATED BY {adminMember.users?.name?.toUpperCase()}</span>}
            </div>
          </div>
        </div>

        {/* GROUP CODE CARD */}
        <div className="mb-4 rounded-2xl p-5 border" style={{background: 'linear-gradient(135deg, #0a0a0a, #0d0005)', borderColor: 'rgba(239,68,68,0.4)', boxShadow: '0 0 30px rgba(239,68,68,0.1)'}}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-black tracking-widest text-red-500/70" style={{fontFamily: "'Orbitron', sans-serif"}}>⚡ GROUP CODE</p>
            <button onClick={copyCode}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-black text-xs tracking-widest transition ${copied ? 'bg-green-600 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
              style={{boxShadow: copied ? '0 0 10px rgba(34,197,94,0.4)' : '0 0 10px rgba(239,68,68,0.4)'}}>
              {copied ? '✅ COPIED!' : '📋 COPY CODE'}
            </button>
          </div>
          <div className="flex items-center justify-center gap-1 py-2">
            {(group?.group_code || 'XXXXXX').split('').map((char, i) => (
              <span key={i} className="code-char">{char}</span>
            ))}
          </div>
          <p className="text-xs text-gray-600 font-bold text-center mt-3">Share this code with players to invite them to the group</p>
        </div>

        {/* DESCRIPTION */}
        {group?.description ? (
          <div className="card mb-4">
            <p className="text-xs font-black tracking-widest text-red-500/70 mb-2" style={{fontFamily: "'Orbitron', sans-serif"}}>// ABOUT</p>
            <p className="text-gray-300 text-sm leading-relaxed">{group.description}</p>
          </div>
        ) : (
          <div className="card mb-4 text-center">
            <p className="text-gray-700 text-xs font-bold">No description added</p>
          </div>
        )}

        {/* STATS ROW */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="card text-center" style={{padding: '16px'}}>
            <div className="text-2xl font-black text-indigo-400">{members.length}</div>
            <div className="text-xs text-gray-600 font-black tracking-wider mt-1">MEMBERS</div>
          </div>
          <div className="card text-center" style={{padding: '16px'}}>
            <div className="text-2xl font-black text-red-400">{members.filter(m => m.role === 'admin').length}</div>
            <div className="text-xs text-gray-600 font-black tracking-wider mt-1">ADMINS</div>
          </div>
          <div className="card text-center" style={{padding: '16px'}}>
            <div className="text-xs font-black text-gray-400 mt-1" style={{fontFamily: "'Orbitron', sans-serif"}}>
              {group?.chat_type?.toUpperCase() || 'PUBLIC'}
            </div>
            <div className="text-xs text-gray-600 font-black tracking-wider mt-1">TYPE</div>
          </div>
        </div>

        {/* MEMBERS LIST */}
        <div className="card">
          <p className="text-xs font-black tracking-widest text-red-500/70 mb-4" style={{fontFamily: "'Orbitron', sans-serif"}}>// MEMBERS ({members.length})</p>
          <div className="space-y-1">
            {members.map((member, i) => (
              <Link href={`/profile/user/${member.user_id}`} key={i}>
                <div className="member-row flex items-center gap-3 p-3 cursor-pointer transition">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{background: `linear-gradient(135deg, ${['#dc2626,#9333ea', '#2563eb,#9333ea', '#16a34a,#2563eb', '#ca8a04,#ea580c', '#db2777,#dc2626'][i % 5]})`}}>
                    {member.users?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-sm text-white">{member.users?.name?.toUpperCase()}</p>
                    <p className="text-xs text-gray-600">{member.users?.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {member.role === 'admin' && (
                      <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded font-black">👑 ADMIN</span>
                    )}
                    <span className="text-gray-700 text-xs font-bold">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
} 
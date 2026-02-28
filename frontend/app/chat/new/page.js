'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewChatPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dm');
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const startDM = async (receiverId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: '👋 Hey!', receiver_id: receiverId }),
      });
      if (res.ok) {
        // Get conversations to find the DM id
        const convRes = await fetch('http://localhost:3001/api/chat/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (convRes.ok) {
          const data = await convRes.json();
          const userId = localStorage.getItem('userId');
          const dm = data.dms.find(d =>
            (d.user1_id === userId && d.user2_id === receiverId) ||
            (d.user2_id === userId && d.user1_id === receiverId)
          );
          if (dm) router.push(`/chat/dm/${dm.id}`);
        }
      }
    } catch (err) { console.error(err); }
  };

  const createGroup = async () => {
    if (!groupName.trim()) { setError('Group name is required'); return; }
    setCreating(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/chat/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: groupName, description: groupDesc }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create group');
      router.push(`/chat/group/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally { setCreating(false); }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .neon-input { background: #0a0a0a; border: 1px solid rgba(239,68,68,0.3); border-radius: 6px; color: white; font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 13px; letter-spacing: 0.05em; padding: 10px 14px; width: 100%; transition: all 0.2s; outline: none; }
        .neon-input:focus { border-color: rgba(239,68,68,0.8); box-shadow: 0 0 10px rgba(239,68,68,0.2); }
        .neon-input::placeholder { color: #374151; }
      `}</style>

      {/* Header */}
      <div className="border-b border-red-500/30 px-6 py-4 flex items-center gap-4" style={{boxShadow: '0 0 20px rgba(239,68,68,0.1)'}}>
        <button onClick={() => router.back()} className="text-red-400 hover:text-red-300 font-bold text-lg">←</button>
        <div>
          <h1 className="font-black tracking-widest text-red-500" style={{fontFamily: "'Orbitron', sans-serif", fontSize: '16px', textShadow: '0 0 10px rgba(239,68,68,0.5)'}}>NEW MESSAGE</h1>
          <p className="text-xs text-gray-600 tracking-wider font-bold">START A CONVERSATION</p>
        </div>
      </div>

      <div className="grid-bg min-h-screen">
        <div className="max-w-xl mx-auto p-6">

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-950 border border-gray-800 rounded-lg p-1">
            {[
              { id: 'dm', label: 'DIRECT MESSAGE', icon: '💬' },
              { id: 'group', label: 'CREATE GROUP', icon: '👥' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-black text-xs tracking-widest transition ${
                  activeTab === tab.id ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
                style={activeTab === tab.id ? {boxShadow: '0 0 10px rgba(239,68,68,0.4)'} : {}}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* DM TAB */}
          {activeTab === 'dm' && (
            <div>
              <div className="mb-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 text-sm">🔍</span>
                  <input
                    className="neon-input pl-9"
                    placeholder="SEARCH PLAYERS..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-600 font-black tracking-widest text-sm">NO PLAYERS FOUND</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// SELECT A PLAYER</p>
                  {filteredUsers
                    .filter(u => String(u.id) !== String(currentUserId))
                    .map(user => (
                    <div
                      key={user.id}
                      onClick={() => startDM(String(user.id))}
                      className="flex items-center gap-3 p-3 bg-gray-950 border border-gray-800 hover:border-red-500/40 rounded-xl cursor-pointer transition group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-purple-600 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0" style={{boxShadow: '0 0 8px rgba(239,68,68,0.3)'}}>
                        {user.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-sm text-white tracking-wide">{user.name?.toUpperCase()}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                      <span className="text-red-500 opacity-0 group-hover:opacity-100 transition font-black text-xs tracking-wider">MESSAGE →</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* GROUP TAB */}
          {activeTab === 'group' && (
            <div className="space-y-5">
              <p className="text-xs font-black tracking-widest text-red-500/70" style={{fontFamily: "'Orbitron', sans-serif"}}>// CREATE GROUP CHAT</p>

              <div>
                <label className="text-xs font-black tracking-widest text-gray-400 mb-2 block">GROUP NAME *</label>
                <input
                  className="neon-input"
                  placeholder="e.g. VINCI SQUAD CHAT"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-black tracking-widest text-gray-400 mb-2 block">DESCRIPTION (OPTIONAL)</label>
                <textarea
                  className="neon-input"
                  style={{minHeight: '80px', resize: 'vertical'}}
                  placeholder="What is this group about?"
                  value={groupDesc}
                  onChange={e => setGroupDesc(e.target.value)}
                />
              </div>

              {/* Preview */}
              <div className="bg-gray-950 border border-red-500/20 rounded-xl p-4">
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// PREVIEW</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-black text-lg">
                    {groupName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-black text-white tracking-wide">{groupName || 'GROUP NAME'}</p>
                    <p className="text-xs text-gray-500">{groupDesc || 'No description'}</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-950/50 border border-red-500/50 rounded p-3">
                  <p className="text-red-400 text-xs font-bold tracking-wider">⚠ {error.toUpperCase()}</p>
                </div>
              )}

              <button
                onClick={createGroup}
                disabled={creating || !groupName.trim()}
                className={`w-full py-3 rounded font-black text-sm tracking-widest transition ${
                  groupName.trim()
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-gray-900 text-gray-700 border border-gray-800 cursor-not-allowed'
                }`}
                style={groupName.trim() ? {boxShadow: '0 0 20px rgba(239,68,68,0.4)'} : {}}
              >
                {creating ? '⟳ CREATING...' : '⚡ CREATE GROUP'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
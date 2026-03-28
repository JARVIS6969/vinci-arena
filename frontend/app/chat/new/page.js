'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL, getToken, getUserId } from '@/app/utils/chat';
import '@/app/chat/chat.css';

export default function NewChatPage() {
  const router = useRouter();
  const [tab, setTab] = useState('dm');
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [groupSearch, setGroupSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) setUsers(await res.json());
    } catch (err) { console.error(err); }
  };

  const startDM = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ message: '👋 Hey!', receiver_id: userId }),
      });
      if (res.ok) {
        const convRes = await fetch(`${API_URL}/api/chat/conversations`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        if (convRes.ok) {
          const data = await convRes.json();
          const myId = getUserId();
          const dm = data.dms.find(d =>
            (d.user1_id === myId && d.user2_id === userId) ||
            (d.user2_id === myId && d.user1_id === userId)
          );
          if (dm) router.push(`/chat/dm/${dm.id}`);
        }
      }
    } catch (err) { console.error(err); }
  };

  const createGroup = async () => {
    if (!groupName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/chat/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name: groupName, description: groupDesc }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/chat/group/${data.id}`);
      }
    } catch (err) { console.error(err); }
    finally { setCreating(false); }
  };

  const searchGroups = async (query) => {
    setGroupSearch(query);
    if (!query.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`${API_URL}/api/chat/groups/search?query=${query}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) setSearchResults(await res.json());
    } catch (err) { console.error(err); }
    finally { setSearching(false); }
  };

  const joinGroup = async (groupCode) => {
    setJoining(true);
    try {
      const res = await fetch(`${API_URL}/api/chat/groups/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ group_code: groupCode }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/chat/group/${data.group.id}`);
      } else {
        alert(data.error || 'Failed to join');
      }
    } catch (err) { console.error(err); }
    finally { setJoining(false); }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif", paddingTop: '44px'}}>

      {/* Header */}
      <div className="border-b border-red-500/20 px-6 py-4 flex items-center gap-3">
        <button onClick={() => router.push('/chat')} className="text-red-400 hover:text-red-300 font-bold text-lg">←</button>
        <div>
          <h1 className="font-black tracking-widest text-red-500" style={{fontFamily: "'Orbitron', sans-serif", fontSize: '16px'}}>NEW CHAT</h1>
          <p className="text-xs text-gray-600 font-bold tracking-wider">START A CONVERSATION</p>
        </div>
      </div>

      <div className="grid-bg min-h-screen">
        <div className="max-w-xl mx-auto p-6">

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-950 border border-gray-800 rounded-lg p-1">
            {['dm', 'create', 'find'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded font-black text-xs tracking-widest transition ${tab === t ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                style={tab === t ? {boxShadow: '0 0 10px rgba(239,68,68,0.4)'} : {}}>
                {t === 'dm' ? '💬 DIRECT MSG' : t === 'create' ? '➕ CREATE GROUP' : '🔍 FIND GROUP'}
              </button>
            ))}
          </div>

          {/* DIRECT MESSAGE TAB */}
          {tab === 'dm' && (
            <div>
              <input className="neon-input mb-4" placeholder="SEARCH PLAYERS..."
                value={searchUser} onChange={e => setSearchUser(e.target.value)} />
              <div className="space-y-2">
                {filteredUsers.map(user => (
                  <div key={user.id} onClick={() => startDM(user.id)}
                    className="flex items-center gap-3 p-3 bg-gray-950 border border-gray-800 hover:border-red-500/40 rounded-xl cursor-pointer transition">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-purple-600 rounded-full flex items-center justify-center font-black">
                      {user.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-black text-sm text-white">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                    <div className="ml-auto text-red-400 font-black text-xs">MSG →</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CREATE GROUP TAB */}
          {tab === 'create' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black tracking-widest text-red-500/70 mb-2 block">GROUP NAME *</label>
                <input className="neon-input" placeholder="e.g. VINCI SQUAD FF"
                  value={groupName} onChange={e => setGroupName(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-black tracking-widest text-red-500/70 mb-2 block">DESCRIPTION</label>
                <input className="neon-input" placeholder="What's this group about?"
                  value={groupDesc} onChange={e => setGroupDesc(e.target.value)} />
              </div>
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-600 font-bold">A unique group code will be auto-generated when you create the group!</p>
              </div>
              <button onClick={createGroup} disabled={!groupName.trim() || creating}
                className={`w-full py-3 rounded font-black text-xs tracking-widest transition ${groupName.trim() ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-gray-900 text-gray-700 border border-gray-800 cursor-not-allowed'}`}
                style={groupName.trim() ? {boxShadow: '0 0 15px rgba(239,68,68,0.4)'} : {}}>
                {creating ? 'CREATING...' : '⚡ CREATE GROUP'}
              </button>
            </div>
          )}

          {/* FIND GROUP TAB */}
          {tab === 'find' && (
            <div className="space-y-4">
              <div className="bg-gray-950 border border-red-500/20 rounded-xl p-4">
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-3">// JOIN BY CODE</p>
                <div className="flex gap-2">
                  <input className="neon-input flex-1" placeholder="ENTER GROUP CODE e.g. ABC123"
                    value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    style={{letterSpacing: '4px', fontWeight: '900'}} />
                  <button onClick={() => joinGroup(joinCode)} disabled={!joinCode.trim() || joining}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-black text-xs tracking-widest transition flex-shrink-0"
                    style={{boxShadow: '0 0 10px rgba(239,68,68,0.4)'}}>
                    {joining ? '...' : 'JOIN'}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs font-black tracking-widest text-red-500/70 mb-3">// SEARCH BY NAME</p>
                <input className="neon-input mb-3" placeholder="SEARCH GROUP NAME..."
                  value={groupSearch} onChange={e => searchGroups(e.target.value)} />
                {searching && <div className="flex justify-center py-4"><div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}
                <div className="space-y-2">
                  {searchResults.map(group => (
                    <div key={group.id} className="flex items-center gap-3 p-3 bg-gray-950 border border-gray-800 hover:border-red-500/40 rounded-xl transition">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-black">
                        {group.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-sm text-white">{group.name}</p>
                        <p className="text-xs text-gray-600">{group.description || 'No description'}</p>
                        <p className="text-xs text-red-400 font-black tracking-widest mt-0.5">CODE: {group.group_code}</p>
                      </div>
                      <button onClick={() => joinGroup(group.group_code)} disabled={joining}
                        className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded font-black text-xs tracking-widest transition">
                        JOIN
                      </button>
                    </div>
                  ))}
                  {groupSearch && !searching && searchResults.length === 0 && (
                    <p className="text-center text-gray-600 font-bold text-sm py-4">No groups found</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
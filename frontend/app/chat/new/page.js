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
      if (res.ok) router.push(`/chat/group/${data.group.id}`);
      else alert(data.error || 'Failed to join');
    } catch (err) { console.error(err); }
    finally { setJoining(false); }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

  const tabs = [
    { id: 'dm',     label: '💬 DIRECT',       color: '#ef4444' },
    { id: 'create', label: '➕ CREATE GROUP',  color: '#a855f7' },
    { id: 'find',   label: '🔍 FIND GROUP',    color: '#00ffff' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050510',
      color: '#e2e8f0',
      fontFamily: "'Rajdhani', sans-serif",
      paddingTop: '44px'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        .cyber-grid {
          background-image:
            linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .user-row:hover { background: rgba(239,68,68,0.05) !important; border-color: rgba(239,68,68,0.3) !important; }
        .group-row:hover { background: rgba(0,255,255,0.05) !important; border-color: rgba(0,255,255,0.3) !important; }
        input, textarea { font-family: 'Rajdhani', sans-serif !important; }
      `}</style>

      {/* HEADER */}
      <div style={{
        borderBottom: '1px solid rgba(0,255,255,0.1)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'linear-gradient(135deg, #080818, #050510)'
      }}>
        <button
          onClick={() => router.push('/chat')}
          style={{
            background: 'transparent',
            border: '1px solid rgba(0,255,255,0.2)',
            borderRadius: '6px',
            color: '#00ffff',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '10px',
            padding: '6px 12px',
            cursor: 'pointer',
            letterSpacing: '2px'
          }}>← BACK</button>
        <div>
          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '14px',
            fontWeight: '900',
            color: '#00ffff',
            letterSpacing: '4px',
            textShadow: '0 0 15px rgba(0,255,255,0.5)',
            margin: 0
          }}>NEW CHAT</h1>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px',
            color: 'rgba(0,255,255,0.3)',
            margin: 0,
            letterSpacing: '2px'
          }}>// initiate communication channel</p>
        </div>
      </div>

      <div className="cyber-grid" style={{minHeight: 'calc(100vh - 70px)', padding: '24px'}}>
        <div style={{maxWidth: '560px', margin: '0 auto'}}>

          {/* TABS */}
          <div style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '24px',
            background: '#080818',
            border: '1px solid rgba(0,255,255,0.1)',
            borderRadius: '8px',
            padding: '4px'
          }}>
            {tabs.map(t => (
              <button key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  borderRadius: '6px',
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: '700',
                  fontSize: '9px',
                  letterSpacing: '1px',
                  background: tab === t.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: tab === t.id ? t.color : 'rgba(255,255,255,0.2)',
                  border: tab === t.id ? `1px solid ${t.color}30` : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: tab === t.id ? `0 0 15px ${t.color}15` : 'none'
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* DM TAB */}
          {tab === 'dm' && (
            <div>
              <input
                placeholder="// SEARCH PLAYERS..."
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                style={{
                  width: '100%',
                  background: '#080818',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '6px',
                  color: '#e2e8f0',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: '600',
                  fontSize: '13px',
                  padding: '10px 14px',
                  outline: 'none',
                  marginBottom: '12px',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                {filteredUsers.map(user => (
                  <div key={user.id}
                    className="user-row"
                    onClick={() => startDM(user.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      background: '#080818',
                      border: '1px solid rgba(239,68,68,0.1)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}>
                    <div style={{
                      width: '38px', height: '38px',
                      background: 'linear-gradient(135deg, #ef4444, #7c3aed)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Orbitron', sans-serif",
                      fontWeight: '900',
                      fontSize: '14px',
                      color: 'white',
                      flexShrink: 0
                    }}>
                      {user.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div style={{flex: 1}}>
                      <p style={{fontFamily: "'Orbitron', sans-serif", fontWeight: '700', fontSize: '12px', color: '#e2e8f0', margin: 0, letterSpacing: '1px'}}>{user.name}</p>
                      <p style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.3)', margin: 0}}>{user.email}</p>
                    </div>
                    <span style={{color: 'rgba(239,68,68,0.5)', fontSize: '12px', fontFamily: "'Orbitron', sans-serif"}}>MSG →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CREATE GROUP TAB */}
          {tab === 'create' && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div>
                <label style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', color: 'rgba(168,85,247,0.6)', letterSpacing: '3px', display: 'block', marginBottom: '8px'}}>
                  // GROUP NAME *
                </label>
                <input
                  placeholder="e.g. VINCI SQUAD FF"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#080818',
                    border: '1px solid rgba(168,85,247,0.2)',
                    borderRadius: '6px',
                    color: '#e2e8f0',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: '600',
                    fontSize: '13px',
                    padding: '10px 14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', color: 'rgba(168,85,247,0.6)', letterSpacing: '3px', display: 'block', marginBottom: '8px'}}>
                  // DESCRIPTION
                </label>
                <input
                  placeholder="What's this squad about?"
                  value={groupDesc}
                  onChange={e => setGroupDesc(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#080818',
                    border: '1px solid rgba(168,85,247,0.2)',
                    borderRadius: '6px',
                    color: '#e2e8f0',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: '600',
                    fontSize: '13px',
                    padding: '10px 14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{
                background: 'rgba(168,85,247,0.05)',
                border: '1px solid rgba(168,85,247,0.15)',
                borderRadius: '8px',
                padding: '12px 14px'
              }}>
                <p style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: 'rgba(168,85,247,0.5)', margin: 0}}>
                  // a unique group code will be auto-generated
                </p>
              </div>
              <button
                onClick={createGroup}
                disabled={!groupName.trim() || creating}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: groupName.trim() ? 'linear-gradient(135deg, #1a0a2e, #0a0a2e)' : '#080818',
                  border: `1px solid ${groupName.trim() ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '6px',
                  color: groupName.trim() ? '#a855f7' : 'rgba(255,255,255,0.2)',
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: '700',
                  fontSize: '11px',
                  letterSpacing: '3px',
                  cursor: groupName.trim() ? 'pointer' : 'not-allowed',
                  boxShadow: groupName.trim() ? '0 0 20px rgba(168,85,247,0.2)' : 'none',
                  transition: 'all 0.2s'
                }}>
                {creating ? '// CREATING...' : '⚡ CREATE SQUAD'}
              </button>
            </div>
          )}

          {/* FIND GROUP TAB */}
          {tab === 'find' && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>

              {/* JOIN BY CODE */}
              <div style={{
                background: 'rgba(0,255,255,0.03)',
                border: '1px solid rgba(0,255,255,0.15)',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', color: 'rgba(0,255,255,0.5)', letterSpacing: '3px', marginBottom: '10px'}}>
                  // JOIN BY CODE
                </p>
                <div style={{display: 'flex', gap: '8px'}}>
                  <input
                    placeholder="ENTER CODE e.g. ABC123"
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    style={{
                      flex: 1,
                      background: '#080818',
                      border: '1px solid rgba(0,255,255,0.2)',
                      borderRadius: '6px',
                      color: '#00ffff',
                      fontFamily: "'Share Tech Mono', monospace",
                      fontWeight: '700',
                      fontSize: '14px',
                      padding: '10px 14px',
                      outline: 'none',
                      letterSpacing: '4px'
                    }}
                  />
                  <button
                    onClick={() => joinGroup(joinCode)}
                    disabled={!joinCode.trim() || joining}
                    style={{
                      padding: '10px 20px',
                      background: 'rgba(0,255,255,0.08)',
                      border: '1px solid rgba(0,255,255,0.3)',
                      borderRadius: '6px',
                      color: '#00ffff',
                      fontFamily: "'Orbitron', sans-serif",
                      fontWeight: '700',
                      fontSize: '10px',
                      letterSpacing: '2px',
                      cursor: 'pointer',
                      flexShrink: 0,
                      boxShadow: '0 0 15px rgba(0,255,255,0.1)'
                    }}>
                    {joining ? '...' : 'JOIN'}
                  </button>
                </div>
              </div>

              {/* SEARCH BY NAME */}
              <div>
                <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', color: 'rgba(0,255,255,0.5)', letterSpacing: '3px', marginBottom: '10px'}}>
                  // SEARCH BY NAME
                </p>
                <input
                  placeholder="// SEARCH GROUP NAME..."
                  value={groupSearch}
                  onChange={e => searchGroups(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#080818',
                    border: '1px solid rgba(0,255,255,0.2)',
                    borderRadius: '6px',
                    color: '#e2e8f0',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: '600',
                    fontSize: '13px',
                    padding: '10px 14px',
                    outline: 'none',
                    marginBottom: '10px',
                    boxSizing: 'border-box'
                  }}
                />
                {searching && (
                  <div style={{display: 'flex', justifyContent: 'center', padding: '16px'}}>
                    <div style={{width: '24px', height: '24px', border: '2px solid rgba(0,255,255,0.1)', borderTop: '2px solid #00ffff', borderRadius: '50%', animation: 'spin 1s linear infinite'}}/>
                  </div>
                )}
                <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                  {searchResults.map(group => (
                    <div key={group.id}
                      className="group-row"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        background: '#080818',
                        border: '1px solid rgba(0,255,255,0.1)',
                        borderRadius: '8px',
                        transition: 'all 0.2s'
                      }}>
                      <div style={{
                        width: '38px', height: '38px',
                        background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Orbitron', sans-serif",
                        fontWeight: '900',
                        fontSize: '14px',
                        color: 'white',
                        flexShrink: 0
                      }}>
                        {group.name?.[0]?.toUpperCase()}
                      </div>
                      <div style={{flex: 1}}>
                        <p style={{fontFamily: "'Orbitron', sans-serif", fontWeight: '700', fontSize: '12px', color: '#e2e8f0', margin: 0}}>{group.name}</p>
                        <p style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.3)', margin: 0}}>{group.description || '// no description'}</p>
                        <p style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: '#00ffff', margin: 0, letterSpacing: '2px'}}>CODE: {group.group_code}</p>
                      </div>
                      <button
                        onClick={() => joinGroup(group.group_code)}
                        disabled={joining}
                        style={{
                          padding: '6px 14px',
                          background: 'rgba(0,255,255,0.08)',
                          border: '1px solid rgba(0,255,255,0.3)',
                          borderRadius: '6px',
                          color: '#00ffff',
                          fontFamily: "'Orbitron', sans-serif",
                          fontWeight: '700',
                          fontSize: '9px',
                          letterSpacing: '2px',
                          cursor: 'pointer'
                        }}>JOIN</button>
                    </div>
                  ))}
                  {groupSearch && !searching && searchResults.length === 0 && (
                    <p style={{textAlign: 'center', fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.2)', padding: '16px'}}>
                      // no groups found
                    </p>
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
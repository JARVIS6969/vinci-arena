'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL, getToken, fetchConversations } from '@/app/utils/chat';

export default function ChatPage() {
  const router = useRouter();
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';
  const [conversations, setConversations] = useState({ dms: [], groups: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [groupSearch, setGroupSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [playerSearch, setPlayerSearch] = useState('');
  const [playerResults, setPlayerResults] = useState([]);
  const [searchingPlayer, setSearchingPlayer] = useState(false);
  const [activeTab, setActiveTab] = useState('find');

  useEffect(() => {
    const load = async () => {
      const data = await fetchConversations();
      setConversations(data);
      setLoading(false);
    };
    load();
  }, []);

  const allDMs = conversations.dms || [];
  const allGroups = conversations.groups || [];

  const filteredDMs = filter === 'groups' ? [] : allDMs.filter(dm => {
    const other = dm.user1_id === userId ? dm.user2 : dm.user1;
    return other?.name?.toLowerCase().includes(search.toLowerCase());
  });

  const filteredGroups = filter === 'dms' ? [] : allGroups.filter(g =>
    g.name?.toLowerCase().includes(search.toLowerCase())
  );

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

  const joinGroup = async (code) => {
    setJoining(true);
    try {
      const res = await fetch(`${API_URL}/api/chat/groups/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ group_code: code }),
      });
      const data = await res.json();
      if (res.ok) router.push(`/chat/group/${data.group.id}`);
      else alert(data.error || 'Failed to join');
    } catch (err) { console.error(err); }
    finally { setJoining(false); }
  };

  const searchPlayers = async (query) => {
    setPlayerSearch(query);
    if (!query.trim()) { setPlayerResults([]); return; }
    setSearchingPlayer(true);
    try {
      const res = await fetch(`${API_URL}/api/users?search=${query}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPlayerResults(data.filter(u => u.id !== userId));
      }
    } catch (err) { console.error(err); }
    finally { setSearchingPlayer(false); }
  };

  const startDM = async (targetId) => {
    try {
      const res = await fetch(`${API_URL}/api/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ message: '👋 Hey!', receiver_id: targetId }),
      });
      if (res.ok) {
        const convRes = await fetch(`${API_URL}/api/chat/conversations`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        if (convRes.ok) {
          const data = await convRes.json();
          const dm = data.dms.find(d =>
            (d.user1_id === userId && d.user2_id === targetId) ||
            (d.user2_id === userId && d.user1_id === targetId)
          );
          if (dm) router.push(`/chat/dm/${dm.id}`);
        }
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      paddingTop: '104px',
      background: '#030308',
      color: '#e2e8f0',
      fontFamily: "'Rajdhani', sans-serif",
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        @keyframes statusPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.6; transform:scale(1.3); }
        }
        .nav-btn:hover { background: rgba(168,85,247,0.1) !important; color: #a855f7 !important; }
        .room-row:hover { background: rgba(255,255,255,0.04) !important; border-color: rgba(168,85,247,0.2) !important; }
        .dm-row:hover { background: rgba(0,255,255,0.04) !important; border-color: rgba(0,255,255,0.2) !important; }
        .player-row:hover { background: rgba(239,68,68,0.06) !important; border-color: rgba(239,68,68,0.3) !important; transform: translateX(3px); }
        .group-result:hover { background: rgba(0,255,255,0.05) !important; border-color: rgba(0,255,255,0.3) !important; }
        .tab-btn:hover { color: rgba(255,255,255,0.6) !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.3); border-radius: 2px; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:focus { outline: none; }
      `}</style>

      {/* ── LEFT NAV ── */}
      <div style={{
        width: '64px', flexShrink: 0, height: '100%',
        background: '#020206',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '12px 0 16px', gap: '4px', zIndex: 10
      }}>
        <div onClick={() => router.push('/dashboard')} style={{
          width: '38px', height: '38px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Orbitron', sans-serif", fontWeight: '900',
          fontSize: '14px', color: '#fff',
          boxShadow: '0 0 20px rgba(124,58,237,0.4)',
          cursor: 'pointer', marginBottom: '12px'
        }}>V</div>

        {[
          { icon: '⬡', label: 'Dashboard', path: '/dashboard' },
          { icon: '◈', label: 'Chat', path: '/chat', active: true },
          { icon: '◎', label: 'Squads', path: '/squads' },
          { icon: '↑', label: 'Tournaments', path: '/tournaments' },
          { icon: '⚙', label: 'Settings', path: '/settings' },
        ].map(item => (
          <button key={item.label} className="nav-btn"
            onClick={() => router.push(item.path)}
            title={item.label}
            style={{
              width: '48px', height: '48px', borderRadius: '10px', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: item.active ? 'rgba(124,58,237,0.15)' : 'transparent',
              color: item.active ? '#a855f7' : 'rgba(255,255,255,0.25)',
              fontSize: '18px', transition: 'all 0.2s', position: 'relative'
            }}>
            {item.active && (
              <div style={{
                position: 'absolute', left: '-8px', top: '50%',
                transform: 'translateY(-50%)', width: '3px', height: '20px',
                background: '#a855f7', borderRadius: '2px', boxShadow: '0 0 8px #a855f7'
              }}/>
            )}
            {item.icon}
          </button>
        ))}

        <div style={{ marginTop: 'auto' }}>
          <button onClick={() => router.push('/chat/new')} title="New Chat"
            style={{
              width: '48px', height: '48px', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              color: '#fff', fontSize: '20px', cursor: 'pointer',
              boxShadow: '0 0 20px rgba(124,58,237,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>+</button>
        </div>
      </div>

      {/* ── LEFT PANEL — YOUR SQUADS ── */}
      <div style={{
        width: '280px', flexShrink: 0, height: '100%',
        background: '#050510',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h2 style={{
              fontFamily: "'Orbitron', sans-serif", fontWeight: '800',
              fontSize: '12px', color: '#e2e8f0', letterSpacing: '3px', margin: 0
            }}>CHANNELS</h2>
            <button onClick={() => router.push('/chat/new')} style={{
              width: '26px', height: '26px', borderRadius: '6px',
              border: '1px solid rgba(0,255,255,0.2)',
              background: 'rgba(0,255,255,0.05)', color: '#00ffff',
              fontSize: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>+</button>
          </div>

          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <span style={{
              position: 'absolute', left: '10px', top: '50%',
              transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', fontSize: '11px'
            }}>⌕</span>
            <input placeholder="Search..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px', color: '#e2e8f0',
                fontFamily: "'Rajdhani', sans-serif", fontWeight: '600',
                fontSize: '12px', padding: '7px 10px 7px 28px',
                boxSizing: 'border-box', transition: 'all 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(0,255,255,0.3)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
            />
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            {[['all', 'ALL'], ['groups', 'GROUPS'], ['dms', 'DMs']].map(([id, label]) => (
              <button key={id} onClick={() => setFilter(id)} style={{
                flex: 1, padding: '5px 0', borderRadius: '6px', border: 'none',
                background: filter === id ? 'rgba(0,255,255,0.08)' : 'transparent',
                color: filter === id ? '#00ffff' : 'rgba(255,255,255,0.2)',
                fontFamily: "'Orbitron', sans-serif", fontSize: '8px',
                fontWeight: '700', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.2s'
              }}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <div style={{
                width: '24px', height: '24px',
                border: '2px solid rgba(0,255,255,0.1)',
                borderTop: '2px solid #00ffff',
                borderRadius: '50%', animation: 'spin 1s linear infinite'
              }}/>
            </div>
          ) : (
            <>
              {/* DMs */}
              {filteredDMs.length > 0 && (
                <>
                  <div style={{
                    fontSize: '9px', fontFamily: "'Orbitron', sans-serif",
                    color: 'rgba(0,255,255,0.3)', letterSpacing: '3px',
                    padding: '6px 8px 4px', display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(0,255,255,0.2), transparent)' }}/>
                    DM
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(270deg, rgba(0,255,255,0.2), transparent)' }}/>
                  </div>
                  {filteredDMs.map(dm => {
                    const other = dm.user1_id === userId ? dm.user2 : dm.user1;
                    return (
                      <div key={dm.id} className="dm-row"
                        onClick={() => router.push(`/chat/dm/${dm.id}`)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '9px 10px', borderRadius: '8px', marginBottom: '2px',
                          cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.2s'
                        }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #ef4444, #7c3aed)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: "'Orbitron', sans-serif", fontWeight: '900',
                            fontSize: '14px', color: 'white'
                          }}>{other?.name?.[0]?.toUpperCase() || '?'}</div>
                          <div style={{
                            position: 'absolute', bottom: '-1px', right: '-1px',
                            width: '9px', height: '9px', background: '#00ff88',
                            borderRadius: '50%', border: '1.5px solid #050510',
                            boxShadow: '0 0 6px #00ff88'
                          }}/>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontFamily: "'Rajdhani', sans-serif", fontWeight: '700',
                            fontSize: '13px', color: 'rgba(226,232,240,0.9)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                          }}>{other?.name}</div>
                          <div style={{
                            fontFamily: "'Share Tech Mono', monospace", fontSize: '10px',
                            color: 'rgba(255,255,255,0.2)', overflow: 'hidden',
                            textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                          }}>{dm.last_message || '// no messages'}</div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* GROUPS */}
              {filteredGroups.length > 0 && (
                <>
                  <div style={{
                    fontSize: '9px', fontFamily: "'Orbitron', sans-serif",
                    color: 'rgba(168,85,247,0.3)', letterSpacing: '3px',
                    padding: '10px 8px 4px', display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(168,85,247,0.2), transparent)' }}/>
                    GROUPS
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(270deg, rgba(168,85,247,0.2), transparent)' }}/>
                  </div>
                  {filteredGroups.map(group => (
                    <div key={group.id} className="room-row"
                      onClick={() => router.push(`/chat/group/${group.id}`)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '9px 10px', borderRadius: '8px', marginBottom: '2px',
                        cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.2s'
                      }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Orbitron', sans-serif", fontWeight: '900',
                        fontSize: '14px', color: 'white', flexShrink: 0
                      }}>{group.name?.[0]?.toUpperCase() || '?'}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: "'Rajdhani', sans-serif", fontWeight: '700',
                          fontSize: '13px', color: 'rgba(226,232,240,0.9)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>{group.name}</div>
                        <div style={{
                          fontFamily: "'Share Tech Mono', monospace", fontSize: '10px',
                          color: 'rgba(168,85,247,0.4)', overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>{group.last_message || '// no messages yet'}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {filteredDMs.length === 0 && filteredGroups.length === 0 && (
                <div style={{
                  textAlign: 'center', padding: '40px 16px',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '11px', color: 'rgba(255,255,255,0.15)'
                }}>// no conversations yet</div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── MIDDLE — DISCOVER ── */}
      <div style={{
        flex: 1, height: '100%', background: '#030308',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          height: '56px', background: 'linear-gradient(135deg, #080818, #050510)',
          borderBottom: '1px solid rgba(168,85,247,0.1)',
          display: 'flex', alignItems: 'center', padding: '0 20px', gap: '12px',
          flexShrink: 0
        }}>
          <div style={{
            width: '8px', height: '8px', background: '#a855f7',
            borderRadius: '50%', boxShadow: '0 0 8px #a855f7'
          }}/>
          <p style={{
            fontFamily: "'Orbitron', sans-serif", fontWeight: '900',
            fontSize: '13px', color: '#e2e8f0', letterSpacing: '3px', margin: 0
          }}>DISCOVER</p>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: '10px',
            color: 'rgba(168,85,247,0.4)', margin: 0
          }}>// find groups · join squads · create channels</p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '4px', padding: '12px 20px 0',
          borderBottom: '1px solid rgba(255,255,255,0.04)', flexShrink: 0
        }}>
          {[
            { id: 'find', label: '🔍 FIND GROUP' },
            { id: 'create', label: '➕ CREATE GROUP' },
            { id: 'join', label: '🔑 JOIN BY CODE' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '8px 16px', borderRadius: '6px 6px 0 0',
              border: activeTab === tab.id ? '1px solid rgba(168,85,247,0.3)' : '1px solid transparent',
              borderBottom: activeTab === tab.id ? '1px solid #030308' : '1px solid transparent',
              background: activeTab === tab.id ? 'rgba(168,85,247,0.08)' : 'transparent',
              color: activeTab === tab.id ? '#a855f7' : 'rgba(255,255,255,0.3)',
              fontFamily: "'Orbitron', sans-serif", fontWeight: '700',
              fontSize: '9px', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.2s'
            }}>{tab.label}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

          {/* FIND GROUP */}
          {activeTab === 'find' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeUp 0.2s ease both' }}>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '12px', top: '50%',
                  transform: 'translateY(-50%)', color: '#a855f7', fontSize: '12px'
                }}>🔍</span>
                <input placeholder="// SEARCH GROUP NAME..."
                  value={groupSearch} onChange={e => searchGroups(e.target.value)}
                  style={{
                    width: '100%', background: '#080818',
                    border: '1px solid rgba(168,85,247,0.2)',
                    borderRadius: '8px', color: '#e2e8f0',
                    fontFamily: "'Rajdhani', sans-serif", fontWeight: '600',
                    fontSize: '13px', padding: '10px 14px 10px 34px',
                    boxSizing: 'border-box', transition: 'all 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(168,85,247,0.2)'}
                />
              </div>

              {searching && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                  <div style={{
                    width: '24px', height: '24px',
                    border: '2px solid rgba(168,85,247,0.1)',
                    borderTop: '2px solid #a855f7',
                    borderRadius: '50%', animation: 'spin 1s linear infinite'
                  }}/>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {searchResults.map(group => (
                  <div key={group.id} className="group-result"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 14px', background: 'rgba(8,8,24,0.8)',
                      border: '1px solid rgba(168,85,247,0.1)',
                      borderRadius: '10px', transition: 'all 0.2s'
                    }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Orbitron', sans-serif", fontWeight: '900',
                      fontSize: '16px', color: 'white', flexShrink: 0,
                      boxShadow: '0 0 12px rgba(168,85,247,0.3)'
                    }}>{group.name?.[0]?.toUpperCase()}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontFamily: "'Orbitron', sans-serif", fontWeight: '700',
                        fontSize: '13px', color: '#e2e8f0', margin: '0 0 2px', letterSpacing: '1px'
                      }}>{group.name}</p>
                      <p style={{
                        fontFamily: "'Share Tech Mono', monospace", fontSize: '10px',
                        color: 'rgba(255,255,255,0.25)', margin: '0 0 2px'
                      }}>{group.description || '// no description'}</p>
                      <p style={{
                        fontFamily: "'Share Tech Mono', monospace", fontSize: '10px',
                        color: '#a855f7', margin: 0, letterSpacing: '2px'
                      }}>CODE: {group.group_code}</p>
                    </div>
                    <button onClick={() => joinGroup(group.group_code)} disabled={joining}
                      style={{
                        padding: '7px 16px', background: 'rgba(168,85,247,0.1)',
                        border: '1px solid rgba(168,85,247,0.3)', borderRadius: '6px',
                        color: '#a855f7', fontFamily: "'Orbitron', sans-serif",
                        fontWeight: '700', fontSize: '9px', letterSpacing: '2px',
                        cursor: 'pointer', flexShrink: 0
                      }}>JOIN</button>
                  </div>
                ))}
                {groupSearch && !searching && searchResults.length === 0 && (
                  <p style={{
                    textAlign: 'center', fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '11px', color: 'rgba(255,255,255,0.2)', padding: '20px'
                  }}>// no groups found</p>
                )}
                {!groupSearch && (
                  <div style={{
                    textAlign: 'center', padding: '40px 20px',
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '11px', color: 'rgba(255,255,255,0.15)'
                  }}>// type to search for groups</div>
                )}
              </div>
            </div>
          )}

          {/* CREATE GROUP */}
          {activeTab === 'create' && (
            <CreateGroup router={router} />
          )}

          {/* JOIN BY CODE */}
          {activeTab === 'join' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', animation: 'fadeUp 0.2s ease both' }}>
              <p style={{
                fontFamily: "'Orbitron', sans-serif", fontSize: '9px',
                color: 'rgba(0,255,255,0.5)', letterSpacing: '3px', margin: 0
              }}>// ENTER GROUP CODE</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  placeholder="e.g. ABC123"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  style={{
                    flex: 1, background: '#080818',
                    border: '1px solid rgba(0,255,255,0.2)',
                    borderRadius: '8px', color: '#00ffff',
                    fontFamily: "'Share Tech Mono', monospace",
                    fontWeight: '700', fontSize: '18px',
                    padding: '12px 16px', letterSpacing: '4px',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,255,255,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,255,255,0.2)'}
                />
                <button onClick={() => joinGroup(joinCode)}
                  disabled={!joinCode.trim() || joining}
                  style={{
                    padding: '12px 24px', background: 'rgba(0,255,255,0.08)',
                    border: '1px solid rgba(0,255,255,0.3)', borderRadius: '8px',
                    color: '#00ffff', fontFamily: "'Orbitron', sans-serif",
                    fontWeight: '700', fontSize: '11px', letterSpacing: '2px',
                    cursor: 'pointer', boxShadow: '0 0 15px rgba(0,255,255,0.1)'
                  }}>{joining ? '...' : 'JOIN'}</button>
              </div>
              <p style={{
                fontFamily: "'Share Tech Mono', monospace", fontSize: '10px',
                color: 'rgba(255,255,255,0.2)', margin: 0
              }}>// ask a squad member for their group code to join</p>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL — FIND PLAYERS ── */}
      <div style={{
        width: '260px', flexShrink: 0, height: '100%',
        background: '#050510',
        borderLeft: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        <div style={{
          padding: '16px 14px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.04)', flexShrink: 0
        }}>
          <p style={{
            fontFamily: "'Orbitron', sans-serif", fontSize: '9px',
            color: 'rgba(239,68,68,0.5)', letterSpacing: '3px', margin: '0 0 10px'
          }}>// FIND PLAYERS</p>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: '10px', top: '50%',
              transform: 'translateY(-50%)', color: '#ef4444', fontSize: '11px'
            }}>🔍</span>
            <input placeholder="// SEARCH BY NAME..."
              value={playerSearch} onChange={e => searchPlayers(e.target.value)}
              style={{
                width: '100%', background: '#080818',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '8px', color: '#e2e8f0',
                fontFamily: "'Rajdhani', sans-serif", fontWeight: '600',
                fontSize: '12px', padding: '8px 10px 8px 28px',
                boxSizing: 'border-box', transition: 'all 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(239,68,68,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(239,68,68,0.2)'}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {searchingPlayer && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <div style={{
                width: '20px', height: '20px',
                border: '2px solid rgba(239,68,68,0.1)',
                borderTop: '2px solid #ef4444',
                borderRadius: '50%', animation: 'spin 1s linear infinite'
              }}/>
            </div>
          )}

          {playerResults.map(player => (
            <div key={player.id} className="player-row"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 10px', borderRadius: '8px', marginBottom: '4px',
                background: 'rgba(8,8,24,0.8)',
                border: '1px solid rgba(239,68,68,0.08)',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
              onClick={() => startDM(player.id)}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #ef4444, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Orbitron', sans-serif", fontWeight: '900',
                fontSize: '13px', color: 'white', flexShrink: 0,
                boxShadow: '0 0 10px rgba(239,68,68,0.2)'
              }}>{player.name?.[0]?.toUpperCase() || '?'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: "'Orbitron', sans-serif", fontWeight: '700',
                  fontSize: '11px', color: '#e2e8f0', margin: 0, letterSpacing: '1px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>{player.name}</p>
                <p style={{
                  fontFamily: "'Share Tech Mono', monospace", fontSize: '10px',
                  color: 'rgba(255,255,255,0.25)', margin: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>{player.email}</p>
              </div>
              <span style={{ color: 'rgba(239,68,68,0.4)', fontSize: '12px' }}>→</span>
            </div>
          ))}

          {!playerSearch && (
            <div style={{
              textAlign: 'center', padding: '30px 10px',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '10px', color: 'rgba(255,255,255,0.12)',
              lineHeight: '1.8'
            }}>
              // search by name<br/>
              // click to start DM
            </div>
          )}

          {playerSearch && !searchingPlayer && playerResults.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '20px 10px',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '10px', color: 'rgba(255,255,255,0.15)'
            }}>// no players found</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CREATE GROUP SUB-COMPONENT ──
function CreateGroup({ router }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const create = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/chat/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, description: desc }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/chat/group/${data.id}`);
      }
    } catch (err) { console.error(err); }
    finally { setCreating(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '440px', animation: 'fadeUp 0.2s ease both' }}>
      <div style={{
        background: 'rgba(8,8,24,0.8)',
        border: '1px solid rgba(168,85,247,0.2)',
        borderRadius: '12px', padding: '20px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, #a855f7, transparent)'
        }}/>

        <div style={{ marginBottom: '14px' }}>
          <label style={{
            display: 'block', fontFamily: "'Orbitron', sans-serif",
            fontSize: '9px', color: 'rgba(168,85,247,0.6)',
            letterSpacing: '3px', marginBottom: '8px'
          }}>// GROUP NAME *</label>
          <input placeholder="e.g. VINCI SQUAD FF"
            value={name} onChange={e => setName(e.target.value)}
            style={{
              width: '100%', background: 'rgba(5,5,16,0.9)',
              border: '1px solid rgba(168,85,247,0.2)',
              borderRadius: '8px', color: '#e2e8f0',
              fontFamily: "'Rajdhani', sans-serif", fontWeight: '600',
              fontSize: '13px', padding: '10px 14px',
              boxSizing: 'border-box', transition: 'all 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(168,85,247,0.2)'}
          />
        </div>

        <div>
          <label style={{
            display: 'block', fontFamily: "'Orbitron', sans-serif",
            fontSize: '9px', color: 'rgba(168,85,247,0.6)',
            letterSpacing: '3px', marginBottom: '8px'
          }}>// DESCRIPTION</label>
          <input placeholder="What's this squad about?"
            value={desc} onChange={e => setDesc(e.target.value)}
            style={{
              width: '100%', background: 'rgba(5,5,16,0.9)',
              border: '1px solid rgba(168,85,247,0.2)',
              borderRadius: '8px', color: '#e2e8f0',
              fontFamily: "'Rajdhani', sans-serif", fontWeight: '600',
              fontSize: '13px', padding: '10px 14px',
              boxSizing: 'border-box', transition: 'all 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(168,85,247,0.2)'}
          />
        </div>
      </div>

      <div style={{
        background: 'rgba(168,85,247,0.04)',
        border: '1px solid rgba(168,85,247,0.1)',
        borderRadius: '8px', padding: '10px 14px'
      }}>
        <p style={{
          fontFamily: "'Share Tech Mono', monospace", fontSize: '10px',
          color: 'rgba(168,85,247,0.4)', margin: 0
        }}>// a unique group code will be auto-generated for invites</p>
      </div>

      <button onClick={create} disabled={!name.trim() || creating}
        style={{
          width: '100%', padding: '13px',
          background: name.trim() ? 'linear-gradient(135deg, #1a0a2e, #0a0a2e)' : 'rgba(8,8,24,0.8)',
          border: `1px solid ${name.trim() ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.05)'}`,
          borderRadius: '10px',
          color: name.trim() ? '#a855f7' : 'rgba(255,255,255,0.2)',
          fontFamily: "'Orbitron', sans-serif", fontWeight: '700',
          fontSize: '11px', letterSpacing: '3px',
          cursor: name.trim() ? 'pointer' : 'not-allowed',
          boxShadow: name.trim() ? '0 0 20px rgba(168,85,247,0.2)' : 'none',
          transition: 'all 0.3s'
        }}>
        {creating ? '// CREATING...' : '⚡ CREATE SQUAD'}
      </button>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchConversations, timeAgo } from '@/app/utils/chat';
import '@/app/chat/chat.css';

export default function ChatHubPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState({ dms: [], groups: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';

  useEffect(() => { loadConversations(); }, []);

  const loadConversations = async () => {
    const data = await fetchConversations();
    setConversations(data);
    setLoading(false);
  };

  const totalCount = conversations.dms.length + conversations.groups.length;
  const tabs = [
    { id: 'all',    label: 'ALL',    count: totalCount },
    { id: 'dms',    label: 'DIRECT', count: conversations.dms.length },
    { id: 'groups', label: 'GROUPS', count: conversations.groups.length },
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
        .cyber-grid {
          background-image:
            linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .conv-card:hover {
          border-color: rgba(0,255,255,0.3) !important;
          transform: translateY(-2px);
          transition: all 0.2s;
        }
        .tab-btn { transition: all 0.2s; cursor: pointer; border: none; }
        .tab-btn:hover { opacity: 0.8; }
      `}</style>

      {/* HEADER */}
      <div style={{
        borderBottom: '1px solid rgba(0,255,255,0.1)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #080818, #050510)',
        boxShadow: '0 0 30px rgba(0,255,255,0.05)'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          {/* Icon */}
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #0a0a20, #150520)',
            border: '1px solid rgba(0,255,255,0.3)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            boxShadow: '0 0 15px rgba(0,255,255,0.2)'
          }}>💬</div>
          <div>
            <h1 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '14px',
              fontWeight: '900',
              color: '#00ffff',
              letterSpacing: '4px',
              textShadow: '0 0 15px rgba(0,255,255,0.6)',
              margin: 0
            }}>MESSAGES</h1>
            <p style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '10px',
              color: 'rgba(0,255,255,0.4)',
              margin: 0,
              letterSpacing: '2px'
            }}>// {totalCount} ACTIVE CHANNELS</p>
          </div>
        </div>

        {/* New Chat Button */}
        <Link href="/chat/new">
          <button style={{
            padding: '8px 20px',
            background: 'linear-gradient(135deg, #1a0010, #0a001a)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '6px',
            color: '#ef4444',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: '700',
            fontSize: '10px',
            letterSpacing: '2px',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(239,68,68,0.15)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 25px rgba(239,68,68,0.4)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 15px rgba(239,68,68,0.15)'}>
            + NEW CHAT
          </button>
        </Link>
      </div>

      {/* BODY */}
      <div className="cyber-grid" style={{minHeight: 'calc(100vh - 80px)', padding: '24px'}}>
        <div style={{maxWidth: '680px', margin: '0 auto'}}>

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
            {tabs.map(tab => (
              <button key={tab.id}
                className="tab-btn"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: '700',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  background: activeTab === tab.id
                    ? 'linear-gradient(135deg, #0a0a20, #150520)'
                    : 'transparent',
                  color: activeTab === tab.id ? '#00ffff' : 'rgba(0,255,255,0.3)',
                  border: activeTab === tab.id
                    ? '1px solid rgba(0,255,255,0.3)'
                    : '1px solid transparent',
                  boxShadow: activeTab === tab.id
                    ? '0 0 15px rgba(0,255,255,0.1)'
                    : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                {tab.label}
                <span style={{
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontSize: '9px',
                  background: activeTab === tab.id
                    ? 'rgba(0,255,255,0.15)'
                    : 'rgba(255,255,255,0.05)',
                  color: activeTab === tab.id ? '#00ffff' : 'rgba(255,255,255,0.3)'
                }}>{tab.count}</span>
              </button>
            ))}
          </div>

          {/* LOADING */}
          {loading ? (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px'}}>
              <div style={{
                width: '40px', height: '40px',
                border: '2px solid rgba(0,255,255,0.1)',
                borderTop: '2px solid #00ffff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}/>
              <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: 'rgba(0,255,255,0.4)', letterSpacing: '3px'}}>
                LOADING...
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>

          /* EMPTY */
          ) : totalCount === 0 ? (
            <div style={{textAlign: 'center', padding: '80px 0'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>💬</div>
              <p style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '14px',
                color: 'rgba(0,255,255,0.4)',
                letterSpacing: '3px',
                marginBottom: '8px'
              }}>NO CHANNELS ACTIVE</p>
              <p style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '11px',
                color: 'rgba(255,255,255,0.2)',
                marginBottom: '24px'
              }}>// start communicating with your squad</p>
              <Link href="/chat/new">
                <button style={{
                  padding: '12px 32px',
                  background: 'linear-gradient(135deg, #1a0010, #0a001a)',
                  border: '1px solid rgba(239,68,68,0.4)',
                  borderRadius: '6px',
                  color: '#ef4444',
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: '700',
                  fontSize: '11px',
                  letterSpacing: '3px',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(239,68,68,0.2)'
                }}>⚡ INITIATE CHAT</button>
              </Link>
            </div>

          /* CONVERSATIONS */
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>

              {/* DMs */}
              {(activeTab === 'all' || activeTab === 'dms') && conversations.dms.length > 0 && (
                <div>
                  {activeTab === 'all' && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      marginBottom: '10px', marginTop: '4px'
                    }}>
                      <div style={{height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(239,68,68,0.4), transparent)'}}/>
                      <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', color: 'rgba(239,68,68,0.6)', letterSpacing: '3px'}}>DIRECT</span>
                      <div style={{height: '1px', flex: 1, background: 'linear-gradient(270deg, rgba(239,68,68,0.4), transparent)'}}/>
                    </div>
                  )}
                  {conversations.dms.map(dm => {
                    const other = dm.user1_id === userId ? dm.user2 : dm.user1;
                    return (
                      <Link key={dm.id} href={`/chat/dm/${dm.id}`}>
                        <div className="conv-card" style={{
                          background: 'linear-gradient(135deg, #080818, #05050f)',
                          border: '1px solid rgba(239,68,68,0.15)',
                          borderRadius: '10px',
                          padding: '14px 16px',
                          cursor: 'pointer',
                          marginBottom: '6px',
                          transition: 'all 0.2s'
                        }}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                            {/* Avatar */}
                            <div style={{position: 'relative'}}>
                              <div style={{
                                width: '44px', height: '44px',
                                background: 'linear-gradient(135deg, #ef4444, #7c3aed)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontFamily: "'Orbitron', sans-serif",
                                fontWeight: '900',
                                fontSize: '16px',
                                color: 'white',
                                boxShadow: '0 0 15px rgba(239,68,68,0.3)'
                              }}>
                                {other?.name?.[0]?.toUpperCase() || '?'}
                              </div>
                              {/* Online dot */}
                              <div style={{
                                position: 'absolute', bottom: '-2px', right: '-2px',
                                width: '10px', height: '10px',
                                background: '#00ff88',
                                borderRadius: '50%',
                                border: '2px solid #050510',
                                boxShadow: '0 0 6px #00ff88'
                              }}/>
                            </div>
                            {/* Info */}
                            <div style={{flex: 1, minWidth: 0}}>
                              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px'}}>
                                <p style={{
                                  fontFamily: "'Orbitron', sans-serif",
                                  fontWeight: '700',
                                  fontSize: '12px',
                                  color: '#e2e8f0',
                                  margin: 0,
                                  letterSpacing: '1px'
                                }}>{other?.name?.toUpperCase() || 'UNKNOWN'}</p>
                                <span style={{
                                  fontFamily: "'Share Tech Mono', monospace",
                                  fontSize: '10px',
                                  color: 'rgba(0,255,255,0.3)'
                                }}>{timeAgo(dm.last_message_at)}</span>
                              </div>
                              <p style={{
                                fontFamily: "'Share Tech Mono', monospace",
                                fontSize: '11px',
                                color: 'rgba(255,255,255,0.3)',
                                margin: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>{dm.last_message || '// no messages yet'}</p>
                            </div>
                            <span style={{color: 'rgba(239,68,68,0.5)', fontSize: '12px'}}>→</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* GROUPS */}
              {(activeTab === 'all' || activeTab === 'groups') && conversations.groups.length > 0 && (
                <div>
                  {activeTab === 'all' && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      marginBottom: '10px', marginTop: '8px'
                    }}>
                      <div style={{height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(168,85,247,0.4), transparent)'}}/>
                      <span style={{fontFamily: "'Orbitron', sans-serif", fontSize: '9px', color: 'rgba(168,85,247,0.6)', letterSpacing: '3px'}}>GROUPS</span>
                      <div style={{height: '1px', flex: 1, background: 'linear-gradient(270deg, rgba(168,85,247,0.4), transparent)'}}/>
                    </div>
                  )}
                  {conversations.groups.map(group => (
                    <Link key={group.id} href={`/chat/group/${group.id}`}>
                      <div className="conv-card" style={{
                        background: 'linear-gradient(135deg, #080818, #05050f)',
                        border: '1px solid rgba(168,85,247,0.15)',
                        borderRadius: '10px',
                        padding: '14px 16px',
                        cursor: 'pointer',
                        marginBottom: '6px',
                        transition: 'all 0.2s'
                      }}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                          <div style={{
                            width: '44px', height: '44px',
                            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: "'Orbitron', sans-serif",
                            fontWeight: '900',
                            fontSize: '16px',
                            color: 'white',
                            boxShadow: '0 0 15px rgba(168,85,247,0.3)'
                          }}>
                            {group.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div style={{flex: 1, minWidth: 0}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px'}}>
                              <p style={{
                                fontFamily: "'Orbitron', sans-serif",
                                fontWeight: '700',
                                fontSize: '12px',
                                color: '#e2e8f0',
                                margin: 0,
                                letterSpacing: '1px'
                              }}>{group.name?.toUpperCase()}</p>
                              <span style={{
                                fontFamily: "'Share Tech Mono', monospace",
                                fontSize: '10px',
                                color: 'rgba(168,85,247,0.4)'
                              }}>{timeAgo(group.created_at)}</span>
                            </div>
                            <p style={{
                              fontFamily: "'Share Tech Mono', monospace",
                              fontSize: '11px',
                              color: 'rgba(168,85,247,0.3)',
                              margin: 0
                            }}>// {group.group_chat_members?.[0]?.count || 0} members · {group.description || 'group channel'}</p>
                          </div>
                          <span style={{color: 'rgba(168,85,247,0.5)', fontSize: '12px'}}>→</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
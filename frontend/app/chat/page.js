'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ChatHubPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState({ dms: [], groups: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const timeAgo = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const totalCount = conversations.dms.length + conversations.groups.length;

  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily: "'Rajdhani', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .card-hover { transition: all 0.2s ease; }
        .card-hover:hover { transform: translateY(-2px); border-color: rgba(239,68,68,0.5) !important; }
        .pulse-dot { animation: pulseDot 2s infinite; }
        @keyframes pulseDot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
      `}</style>

      {/* Header */}
      <div className="border-b border-red-500/30 px-6 py-4 flex items-center justify-between" style={{boxShadow: '0 0 20px rgba(239,68,68,0.1)'}}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center" style={{boxShadow: '0 0 15px rgba(239,68,68,0.7)'}}>
            <span className="text-sm">💬</span>
          </div>
          <div>
            <h1 className="font-black tracking-widest text-red-500" style={{fontFamily: "'Orbitron', sans-serif", fontSize: '16px', textShadow: '0 0 10px rgba(239,68,68,0.5)'}}>MESSAGES</h1>
            <p className="text-xs text-gray-600 tracking-wider font-bold">{totalCount} CONVERSATIONS</p>
          </div>
        </div>
        <Link href="/chat/new">
          <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-black text-xs tracking-widest transition" style={{boxShadow: '0 0 15px rgba(239,68,68,0.4)'}}>
            + NEW CHAT
          </button>
        </Link>
      </div>

      <div className="grid-bg min-h-screen">
        <div className="max-w-2xl mx-auto p-6">

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-950 border border-gray-800 rounded-lg p-1">
            {[
              { id: 'all', label: 'ALL', count: totalCount },
              { id: 'dms', label: 'DIRECT', count: conversations.dms.length },
              { id: 'groups', label: 'GROUPS', count: conversations.groups.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-black text-xs tracking-widest transition ${
                  activeTab === tab.id ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
                style={activeTab === tab.id ? {boxShadow: '0 0 10px rgba(239,68,68,0.4)'} : {}}
              >
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded text-xs font-black ${activeTab === tab.id ? 'bg-red-800' : 'bg-gray-800 text-gray-500'}`}>{tab.count}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
              <p className="text-red-500/60 text-xs tracking-widest font-bold" style={{fontFamily: "'Orbitron', sans-serif"}}>LOADING...</p>
            </div>
          ) : totalCount === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">💬</div>
              <p className="font-black text-gray-600 tracking-widest text-lg mb-2" style={{fontFamily: "'Orbitron', sans-serif"}}>NO CONVERSATIONS</p>
              <p className="text-gray-700 text-xs tracking-wider mb-6">Start chatting with other players!</p>
              <Link href="/chat/new">
                <button className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded font-black text-xs tracking-widest transition" style={{boxShadow: '0 0 15px rgba(239,68,68,0.4)'}}>
                  ⚡ START CHATTING
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">

              {/* DMs */}
              {(activeTab === 'all' || activeTab === 'dms') && conversations.dms.length > 0 && (
                <div>
                  {activeTab === 'all' && (
                    <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// DIRECT MESSAGES</p>
                  )}
                  {conversations.dms.map(dm => {
                    const other = dm.user1_id === userId ? dm.user2 : dm.user1;
                    return (
                      <Link key={dm.id} href={`/chat/dm/${dm.id}`}>
                        <div className="card-hover bg-gray-950 border border-gray-800 rounded-xl p-4 cursor-pointer mb-2">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-purple-600 rounded-full flex items-center justify-center font-black text-lg" style={{boxShadow: '0 0 10px rgba(239,68,68,0.3)'}}>
                                {other?.name?.[0]?.toUpperCase() || '?'}
                              </div>
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black pulse-dot" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <p className="font-black text-sm text-white tracking-wide">{other?.name?.toUpperCase() || 'UNKNOWN'}</p>
                                <span className="text-xs text-gray-600 font-bold">{timeAgo(dm.last_message_at)}</span>
                              </div>
                              <p className="text-xs text-gray-500 truncate">{dm.last_message || 'No messages yet'}</p>
                            </div>
                            <span className="text-red-500 text-xs font-black">→</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Groups */}
              {(activeTab === 'all' || activeTab === 'groups') && conversations.groups.length > 0 && (
                <div>
                  {activeTab === 'all' && (
                    <p className="text-xs font-black tracking-widest text-red-500/70 mb-3 mt-4" style={{fontFamily: "'Orbitron', sans-serif"}}>// GROUP CHATS</p>
                  )}
                  {conversations.groups.map(group => (
                    <Link key={group.id} href={`/chat/group/${group.id}`}>
                      <div className="card-hover bg-gray-950 border border-gray-800 rounded-xl p-4 cursor-pointer mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-black text-lg" style={{boxShadow: '0 0 10px rgba(99,102,241,0.3)'}}>
                            {group.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className="font-black text-sm text-white tracking-wide">{group.name?.toUpperCase()}</p>
                              <span className="text-xs text-gray-600 font-bold">{timeAgo(group.created_at)}</span>
                            </div>
                            <p className="text-xs text-gray-500">{group.group_chat_members?.[0]?.count || 0} members · {group.description || 'Group chat'}</p>
                          </div>
                          <span className="text-red-500 text-xs font-black">→</span>
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
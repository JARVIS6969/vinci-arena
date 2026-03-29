'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { io } from 'socket.io-client';
import { API_URL, getToken, getUserId, fetchConversations, handleKeyPress } from '@/app/utils/chat';
import ChatSidebar from '@/app/components/chat/ChatSidebar';
import MessageBubble from '@/app/components/chat/MessageBubble';
import '@/app/chat/chat.css';

const messageCache = new Map();

const avatarColors = [
  'from-red-600 to-purple-600',
  'from-blue-600 to-purple-600',
  'from-green-600 to-blue-600',
  'from-yellow-600 to-orange-600',
  'from-pink-600 to-red-600'
];

export default function GroupChatPage() {
  const router = useRouter();
  const params = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [conversations, setConversations] = useState({ dms: [], groups: [] });
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const userId = getUserId();

  useEffect(() => {
    loadConversations();
    fetchMembers();
    const socket = io(API_URL);
    socketRef.current = socket;
    socket.on('connect', () => {
      socket.emit('join', userId);
      socket.emit('join_room', `group_${params.id}`);
    });
    socket.on('new_message', (msg) => {
      setMessages(prev => {
        const updated = [...prev, msg];
        messageCache.set(params.id, updated);
        return updated;
      });
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (conversations.groups.length > 0) {
      const grp = conversations.groups.find(g => g.id === params.id);
      if (grp) {
        setGroup(grp);
        if (messageCache.has(params.id)) {
          setMessages(messageCache.get(params.id));
          setLoading(false);
        } else {
          fetchMessages();
        }
      }
    }
  }, [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    const data = await fetchConversations();
    setConversations(data);
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chat/messages?group_id=${params.id}&limit=50`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const msgs = await res.json();
        const sorted = msgs.reverse();
        setMessages(sorted);
        messageCache.set(params.id, sorted);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chat/groups/${params.id}/members`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) setMembers(await res.json());
    } catch (err) { console.error(err); }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    const optimisticMsg = {
      id: `temp_${Date.now()}`,
      message: newMessage,
      sender_id: userId,
      sender: { name: localStorage.getItem('userName') },
      created_at: new Date().toISOString(),
      temp: true
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setNewMessage('');
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ message: newMessage, group_id: params.id }),
      });
      if (res.ok) {
        const realMsg = await res.json();
        setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? realMsg : m));
      }
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      paddingTop: '104px',
      background: '#050510',
      color: '#e2e8f0',
      fontFamily: "'Rajdhani', sans-serif",
      overflow: 'hidden'
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
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #050510; }
        ::-webkit-scrollbar-thumb { background: #a855f7; border-radius: 2px; }
        textarea { font-family: 'Rajdhani', sans-serif !important; }
      `}</style>

      {/* SIDEBAR */}
      <ChatSidebar conversations={conversations} activeId={params.id} type="group" />

      {/* MAIN */}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>

        {/* HEADER */}
        <div style={{
          height: '56px',
          background: 'linear-gradient(135deg, #080818, #050510)',
          borderBottom: '1px solid rgba(168,85,247,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          boxShadow: '0 0 20px rgba(168,85,247,0.05)',
          flexShrink: 0
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            {/* Avatar */}
            <div
              onClick={() => router.push(`/chat/group/${params.id}/info`)}
              style={{
                width: '36px', height: '36px',
                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: '900',
                fontSize: '14px',
                color: 'white',
                boxShadow: '0 0 15px rgba(168,85,247,0.4)',
                cursor: 'pointer',
                flexShrink: 0
              }}>
              {group?.name?.[0]?.toUpperCase() || '?'}
            </div>

            <div
              onClick={() => router.push(`/chat/group/${params.id}/info`)}
              style={{cursor: 'pointer'}}>
              <p style={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: '900',
                fontSize: '13px',
                color: '#e2e8f0',
                letterSpacing: '2px',
                margin: 0
              }}>{group?.name?.toUpperCase() || 'LOADING...'}</p>
              <p style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '10px',
                color: 'rgba(168,85,247,0.5)',
                margin: 0,
                letterSpacing: '1px'
              }}>// {members.length} members · tap for info →</p>
            </div>
          </div>

          {/* Members Toggle */}
          <button
            onClick={() => setShowMembers(!showMembers)}
            style={{
              padding: '6px 14px',
              background: showMembers
                ? 'rgba(168,85,247,0.15)'
                : 'transparent',
              border: `1px solid ${showMembers ? 'rgba(168,85,247,0.4)' : 'rgba(168,85,247,0.2)'}`,
              borderRadius: '6px',
              color: showMembers ? '#a855f7' : 'rgba(168,85,247,0.4)',
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: '700',
              fontSize: '10px',
              letterSpacing: '2px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: showMembers ? '0 0 15px rgba(168,85,247,0.2)' : 'none'
            }}>
            👥 SQUAD
          </button>
        </div>

        {/* CHAT BODY */}
        <div style={{flex: 1, display: 'flex', overflow: 'hidden'}}>

          {/* MESSAGES */}
          <div className="cyber-grid" style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {loading ? (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '12px'}}>
                <div style={{width: '32px', height: '32px', border: '2px solid rgba(168,85,247,0.1)', borderTop: '2px solid #a855f7', borderRadius: '50%', animation: 'spin 1s linear infinite'}}/>
                <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: 'rgba(168,85,247,0.4)', letterSpacing: '3px'}}>LOADING...</p>
              </div>
            ) : messages.length === 0 ? (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '12px'}}>
                <div style={{fontSize: '40px'}}>💬</div>
                <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '11px', color: 'rgba(168,85,247,0.4)', letterSpacing: '3px'}}>NO MESSAGES YET</p>
                <p style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.2)'}}>// squad communication channel ready</p>
              </div>
            ) : messages.map((msg) => {
              const colorIdx = members.findIndex(m => m.user_id === msg.sender_id) % avatarColors.length;
              return (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  userId={userId}
                  showName={true}
                  avatarColor={avatarColors[colorIdx >= 0 ? colorIdx : 0]}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* MEMBERS PANEL */}
          {showMembers && (
            <div style={{
              width: '200px',
              background: '#080818',
              borderLeft: '1px solid rgba(168,85,247,0.15)',
              padding: '12px',
              overflowY: 'auto',
              flexShrink: 0
            }}>
              <p style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '9px',
                color: 'rgba(168,85,247,0.5)',
                letterSpacing: '3px',
                marginBottom: '12px'
              }}>// SQUAD</p>
              {members.map((member, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  background: 'rgba(168,85,247,0.05)',
                  border: '1px solid rgba(168,85,247,0.08)'
                }}>
                  <div style={{
                    width: '28px', height: '28px',
                    background: `linear-gradient(135deg, ${['#dc2626,#9333ea','#2563eb,#9333ea','#16a34a,#2563eb','#ca8a04,#ea580c','#db2777,#dc2626'][i % 5]})`,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: '900',
                    fontSize: '10px',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    {member.users?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div style={{flex: 1, minWidth: 0}}>
                    <p style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: '700',
                      fontSize: '11px',
                      color: '#e2e8f0',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{member.users?.name?.toUpperCase()}</p>
                    {member.role === 'admin' && (
                      <span style={{
                        fontSize: '9px',
                        color: '#f59e0b',
                        fontFamily: "'Orbitron', sans-serif",
                        letterSpacing: '1px'
                      }}>👑 ADMIN</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INPUT */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(168,85,247,0.1)',
          background: 'linear-gradient(135deg, #080818, #050510)',
          flexShrink: 0
        }}>
          <div style={{display: 'flex', gap: '10px', alignItems: 'flex-end'}}>
            <textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => handleKeyPress(e, sendMessage)}
              placeholder={`// MESSAGE ${group?.name?.toUpperCase() || 'GROUP'}...`}
              rows={1}
              style={{
                flex: 1,
                background: '#080818',
                border: `1px solid ${newMessage.trim() ? 'rgba(168,85,247,0.3)' : 'rgba(168,85,247,0.1)'}`,
                borderRadius: '6px',
                color: '#e2e8f0',
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: '600',
                fontSize: '13px',
                padding: '10px 14px',
                outline: 'none',
                resize: 'none',
                maxHeight: '100px',
                transition: 'all 0.2s',
                boxShadow: newMessage.trim() ? '0 0 10px rgba(168,85,247,0.08)' : 'none'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={sending || !newMessage.trim()}
              style={{
                padding: '10px 20px',
                background: newMessage.trim()
                  ? 'linear-gradient(135deg, #1a0a2e, #0a0a2e)'
                  : '#080818',
                border: `1px solid ${newMessage.trim() ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '6px',
                color: newMessage.trim() ? '#a855f7' : 'rgba(255,255,255,0.2)',
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: '700',
                fontSize: '10px',
                letterSpacing: '2px',
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                boxShadow: newMessage.trim() ? '0 0 15px rgba(168,85,247,0.2)' : 'none',
                transition: 'all 0.2s',
                flexShrink: 0
              }}>
              {sending ? '...' : '⚡ SEND'}
            </button>
          </div>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px',
            color: 'rgba(168,85,247,0.2)',
            margin: '6px 0 0',
            letterSpacing: '1px'
          }}>// ENTER to send · SHIFT+ENTER new line</p>
        </div>
      </div>
    </div>
  );
}
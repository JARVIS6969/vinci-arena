'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { io } from 'socket.io-client';
import {
  API_URL, getToken, getUserId,
  fetchConversations, handleKeyPress,
  emitTypingStart, emitTypingStop, getParticles
} from '@/app/utils/chat';
import ChatSidebar from '@/app/components/chat/ChatSidebar';
import MessageBubble from '@/app/components/chat/MessageBubble';
import '@/app/chat/chat.css';

const messageCache = new Map();

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
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const userId = getUserId();
  const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') : '';
  const particles = useMemo(() => getParticles(10), []);
  const roomId = `group_${params.id}`;

  const avatarGradients = [
    '#dc2626,#9333ea',
    '#2563eb,#9333ea',
    '#16a34a,#2563eb',
    '#ca8a04,#ea580c',
    '#db2777,#dc2626'
  ];

  useEffect(() => {
    loadConversations();
    fetchMembers();

    const socket = io(API_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join', userId);
      socket.emit('join_room', roomId);
    });

    socket.on('new_message', (msg) => {
      setMessages(prev => {
        const updated = [...prev, msg];
        messageCache.set(params.id, updated);
        return updated;
      });
    });

    socket.on('typing_start', ({ userName: name }) => {
      if (name !== userName) {
        setTypingUser(name);
        setIsTyping(true);
      }
    });

    socket.on('typing_stop', () => {
      setIsTyping(false);
      setTypingUser('');
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

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    emitTypingStart(socketRef.current, roomId, userName);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitTypingStop(socketRef.current, roomId, userName);
    }, 2000);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    emitTypingStop(socketRef.current, roomId, userName);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    const optimisticMsg = {
      id: `temp_${Date.now()}`,
      message: newMessage,
      sender_id: userId,
      sender: { name: userName },
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
        @keyframes floatUp {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.2; }
          100% { transform: translateY(-100vh) translateX(15px); opacity: 0; }
        }
        @keyframes scanLine {
          0%   { top: 0%; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 0.3; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes typingBounce {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50%       { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes msgSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cyber-grid {
          background-image:
            linear-gradient(rgba(168,85,247,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #050510; }
        ::-webkit-scrollbar-thumb { background: #a855f7; border-radius: 2px; }
        textarea { font-family: 'Rajdhani', sans-serif !important; }
        .msg-enter { animation: msgSlideIn 0.2s ease-out forwards; }
        .member-item:hover { background: rgba(168,85,247,0.1) !important; }
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
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Scan beam — purple for groups */}
          <div style={{
            position: 'absolute',
            left: 0, right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.4), rgba(168,85,247,0.7), rgba(168,85,247,0.4), transparent)',
            animation: 'scanLine 10s ease-in-out infinite',
            pointerEvents: 'none'
          }}/>

          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
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

            <div onClick={() => router.push(`/chat/group/${params.id}/info`)} style={{cursor: 'pointer'}}>
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
                margin: 0
              }}>// {members.length} members · tap for info →</p>
            </div>
          </div>

          <button
            onClick={() => setShowMembers(!showMembers)}
            style={{
              padding: '6px 14px',
              background: showMembers ? 'rgba(168,85,247,0.15)' : 'transparent',
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

        {/* BODY */}
        <div style={{flex: 1, display: 'flex', overflow: 'hidden'}}>

          {/* MESSAGES */}
          <div className="cyber-grid" style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            position: 'relative'
          }}>
            {/* Particles */}
            {particles.map(p => (
              <div key={p.id} style={{
                position: 'fixed',
                left: p.left,
                bottom: '0',
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: '50%',
                background: p.color,
                boxShadow: `0 0 4px ${p.color}`,
                animation: `floatUp ${p.duration} ${p.delay} linear infinite`,
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0
              }}/>
            ))}

            {loading ? (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '12px', zIndex: 1}}>
                <div style={{width: '32px', height: '32px', border: '2px solid rgba(168,85,247,0.1)', borderTop: '2px solid #a855f7', borderRadius: '50%', animation: 'spin 1s linear infinite'}}/>
                <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: 'rgba(168,85,247,0.4)', letterSpacing: '3px'}}>LOADING...</p>
              </div>
            ) : messages.length === 0 ? (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '12px', zIndex: 1}}>
                <div style={{fontSize: '40px'}}>💬</div>
                <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '11px', color: 'rgba(168,85,247,0.4)', letterSpacing: '3px'}}>NO MESSAGES YET</p>
                <p style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.2)'}}>// squad communication channel ready</p>
              </div>
            ) : (
              <div style={{zIndex: 1, display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {messages.map((msg, i) => {
                  const colorIdx = members.findIndex(m => m.user_id === msg.sender_id) % avatarGradients.length;
                  return (
                    <div key={msg.id} className="msg-enter" style={{animationDelay: `${i * 0.02}s`}}>
                      <MessageBubble
                        msg={msg}
                        userId={userId}
                        showName={true}
                        avatarColor={avatarGradients[colorIdx >= 0 ? colorIdx : 0]}
                      />
                    </div>
                  );
                })}
              </div>
            )}
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
                marginBottom: '12px',
                margin: '0 0 12px'
              }}>// SQUAD ({members.length})</p>
              {members.map((member, i) => (
                <div key={i}
                  className="member-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    padding: '8px',
                    borderRadius: '6px',
                    background: 'rgba(168,85,247,0.03)',
                    border: '1px solid rgba(168,85,247,0.08)',
                    transition: 'all 0.2s',
                    cursor: 'default'
                  }}>
                  <div style={{
                    width: '28px', height: '28px',
                    background: `linear-gradient(135deg, ${avatarGradients[i % avatarGradients.length]})`,
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
          padding: '10px 16px 12px',
          borderTop: '1px solid rgba(168,85,247,0.1)',
          background: 'linear-gradient(135deg, #080818, #050510)',
          flexShrink: 0
        }}>
          {/* Typing indicator */}
          <div style={{height: '20px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px'}}>
            {isTyping && (
              <>
                <div style={{display: 'flex', gap: '3px', alignItems: 'center'}}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '4px', height: '4px',
                      borderRadius: '50%',
                      background: '#a855f7',
                      boxShadow: '0 0 4px #a855f7',
                      animation: `typingBounce 1.2s ease-in-out infinite`,
                      animationDelay: `${i * 0.15}s`
                    }}/>
                  ))}
                </div>
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '10px',
                  color: 'rgba(168,85,247,0.5)',
                  letterSpacing: '1px'
                }}>{typingUser} is typing...</span>
              </>
            )}
          </div>

          <div style={{display: 'flex', gap: '10px', alignItems: 'flex-end'}}>
            <textarea
              value={newMessage}
              onChange={handleTyping}
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
            color: 'rgba(168,85,247,0.15)',
            margin: '6px 0 0',
            letterSpacing: '1px'
          }}>// ENTER to send · SHIFT+ENTER new line</p>
        </div>
      </div>
    </div>
  );
}
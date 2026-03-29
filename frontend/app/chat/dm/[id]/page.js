'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { io } from 'socket.io-client';
import { API_URL, getToken, getUserId, fetchConversations, handleKeyPress } from '@/app/utils/chat';
import ChatSidebar from '@/app/components/chat/ChatSidebar';
import MessageBubble from '@/app/components/chat/MessageBubble';
import '@/app/chat/chat.css';

const messageCache = new Map();

export default function DMChatPage() {
  const router = useRouter();
  const params = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [conversations, setConversations] = useState({ dms: [], groups: [] });
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const userId = getUserId();

  useEffect(() => {
    loadConversations();
    const socket = io(API_URL);
    socketRef.current = socket;
    socket.on('connect', () => socket.emit('join', userId));
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
    if (conversations.dms.length > 0) {
      const dm = conversations.dms.find(d => d.id === params.id);
      if (dm) {
        const other = dm.user1_id === userId ? dm.user2 : dm.user1;
        setOtherUser(other);
        const otherId = dm.user1_id === userId ? dm.user2_id : dm.user1_id;
        if (socketRef.current) {
          const roomId = [userId, otherId].sort().join('_');
          socketRef.current.emit('join_room', roomId);
        }
        if (messageCache.has(params.id)) {
          setMessages(messageCache.get(params.id));
          setLoading(false);
        } else {
          fetchMessages(otherId);
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

  const fetchMessages = async (otherId) => {
    try {
      const res = await fetch(`${API_URL}/api/chat/messages?receiver_id=${otherId}&limit=50`, {
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

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    const dm = conversations.dms?.find(d => d.id === params.id);
    if (!dm) return;
    const otherId = dm.user1_id === userId ? dm.user2_id : dm.user1_id;
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
        body: JSON.stringify({ message: newMessage, receiver_id: otherId }),
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
        ::-webkit-scrollbar-thumb { background: #00ffff; border-radius: 2px; }
        textarea { font-family: 'Rajdhani', sans-serif !important; }
      `}</style>

      {/* SIDEBAR */}
      <ChatSidebar conversations={conversations} activeId={params.id} type="dm" />

      {/* MAIN */}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>

        {/* HEADER */}
        <div style={{
          height: '56px',
          background: 'linear-gradient(135deg, #080818, #050510)',
          borderBottom: '1px solid rgba(0,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '12px',
          boxShadow: '0 0 20px rgba(0,255,255,0.05)',
          flexShrink: 0
        }}>
          {/* Avatar */}
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #ef4444, #7c3aed)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: '900',
            fontSize: '14px',
            color: 'white',
            boxShadow: '0 0 15px rgba(239,68,68,0.3)',
            flexShrink: 0
          }}>
            {otherUser?.name?.[0]?.toUpperCase() || '?'}
          </div>

          <div style={{flex: 1}}>
            <p style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: '900',
              fontSize: '13px',
              color: '#e2e8f0',
              letterSpacing: '2px',
              margin: 0
            }}>{otherUser?.name?.toUpperCase() || 'LOADING...'}</p>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px'}}>
              <div style={{
                width: '6px', height: '6px',
                background: '#00ff88',
                borderRadius: '50%',
                boxShadow: '0 0 6px #00ff88'
              }}/>
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '10px',
                color: '#00ff88',
                letterSpacing: '1px'
              }}>ONLINE</span>
            </div>
          </div>

          {/* Decorative */}
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px',
            color: 'rgba(0,255,255,0.2)',
            letterSpacing: '2px'
          }}>// DM CHANNEL</div>
        </div>

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
              <div style={{width: '32px', height: '32px', border: '2px solid rgba(0,255,255,0.1)', borderTop: '2px solid #00ffff', borderRadius: '50%', animation: 'spin 1s linear infinite'}}/>
              <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: 'rgba(0,255,255,0.4)', letterSpacing: '3px'}}>LOADING...</p>
            </div>
          ) : messages.length === 0 ? (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '12px'}}>
              <div style={{fontSize: '40px'}}>💬</div>
              <p style={{fontFamily: "'Orbitron', sans-serif", fontSize: '11px', color: 'rgba(0,255,255,0.3)', letterSpacing: '3px'}}>NO MESSAGES YET</p>
              <p style={{fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.2)'}}>// initiate communication</p>
            </div>
          ) : messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} userId={userId} showName={false} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(0,255,255,0.1)',
          background: 'linear-gradient(135deg, #080818, #050510)',
          flexShrink: 0
        }}>
          <div style={{display: 'flex', gap: '10px', alignItems: 'flex-end'}}>
            <textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => handleKeyPress(e, sendMessage)}
              placeholder={`// MESSAGE ${otherUser?.name?.toUpperCase() || ''}...`}
              rows={1}
              style={{
                flex: 1,
                background: '#080818',
                border: `1px solid ${newMessage.trim() ? 'rgba(0,255,255,0.3)' : 'rgba(0,255,255,0.1)'}`,
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
                boxShadow: newMessage.trim() ? '0 0 10px rgba(0,255,255,0.08)' : 'none'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={sending || !newMessage.trim()}
              style={{
                padding: '10px 20px',
                background: newMessage.trim()
                  ? 'linear-gradient(135deg, #1a0010, #0a001a)'
                  : '#080818',
                border: `1px solid ${newMessage.trim() ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '6px',
                color: newMessage.trim() ? '#ef4444' : 'rgba(255,255,255,0.2)',
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: '700',
                fontSize: '10px',
                letterSpacing: '2px',
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                boxShadow: newMessage.trim() ? '0 0 15px rgba(239,68,68,0.2)' : 'none',
                transition: 'all 0.2s',
                flexShrink: 0
              }}>
              {sending ? '...' : '⚡ SEND'}
            </button>
          </div>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px',
            color: 'rgba(0,255,255,0.2)',
            margin: '6px 0 0',
            letterSpacing: '1px'
          }}>// ENTER to send · SHIFT+ENTER new line</p>
        </div>
      </div>
    </div>
  );
}
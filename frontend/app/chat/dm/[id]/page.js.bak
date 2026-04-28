'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  API_URL, getToken, getUserId, fetchConversations
} from '@/app/utils/chat';
import useSocket from '@/app/hooks/useSocket';
import ChatLayout from '@/app/components/chat/ChatLayout';
import MessageList from '@/app/components/chat/MessageList';
import MessageInput from '@/app/components/chat/MessageInput';

const messageCache = new Map();

export default function DMChatPage() {
  const params = useParams();
  const userId = getUserId();
  const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') : '';

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [otherId, setOtherId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [conversations, setConversations] = useState({ dms: [], groups: [] });
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');

  // SOCKET
  const { emitTypingStart, emitTypingStop } = useSocket({
    roomId,
    onNewMessage: (msg) => {
      setMessages(prev => {
        const updated = [...prev, msg];
        messageCache.delete(params.id);
        return updated;
      });
    },
    onTypingStart: (name) => {
      if (name !== userName) {
        setTypingUser(name);
        setIsTyping(true);
      }
    },
    onTypingStop: () => {
      setIsTyping(false);
      setTypingUser('');
    }
  });

  // LOAD CONVERSATIONS
  useEffect(() => {
    const load = async () => {
      const data = await fetchConversations();
      setConversations(data);

      const dm = data.dms?.find(d => d.id === params.id);
      if (dm) {
        const other = dm.user1_id === userId ? dm.user2 : dm.user1;
        const otherUserId = dm.user1_id === userId ? dm.user2_id : dm.user1_id;
        setOtherUser(other);
        setOtherId(otherUserId);

        const room = [userId, otherUserId].sort().join('_');
        setRoomId(room);

        if (messageCache.has(params.id)) {
          setMessages(messageCache.get(params.id));
          setLoading(false);
        } else {
          fetchMessages(otherUserId);
        }
      }
    };
    load();
  }, []);

  const fetchMessages = async (toId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/chat/messages?receiver_id=${toId}&limit=50`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (res.ok) {
        const msgs = await res.json();
        const sorted = msgs.reverse();
        setMessages(sorted);
        messageCache.set(params.id, sorted);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleTyping = (val) => {
    setNewMessage(val);
    emitTypingStart(userName);
    setTimeout(() => emitTypingStop(userName), 2000);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !otherId) return;

    emitTypingStop(userName);

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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ message: newMessage, receiver_id: otherId }),
      });
      if (res.ok) {
        const realMsg = await res.json();
        setMessages(prev => prev.map(m =>
          m.id === optimisticMsg.id ? realMsg : m
        ));
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
      alert('// MESSAGE FAILED — check your connection');
    } finally { setSending(false); }
  };

  return (
    <ChatLayout conversations={conversations} activeId={params.id} type="dm">

      {/* HEADER */}
      <div style={{
        height: '56px',
        background: 'linear-gradient(135deg, #080818, #050510)',
        borderBottom: '1px solid rgba(0,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '12px',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <style>{`
          @keyframes scanLine {
            0%   { top: 0%; opacity: 0; }
            5%   { opacity: 1; }
            95%  { opacity: 0.3; }
            100% { top: 100%; opacity: 0; }
          }
          .scan-beam {
            position: absolute;
            left: 0; right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(0,255,255,0.4), rgba(0,255,255,0.7), rgba(0,255,255,0.4), transparent);
            animation: scanLine 10s ease-in-out infinite;
            pointer-events: none;
          }
        `}</style>

        <div className="scan-beam"/>

        <div style={{
          width: '36px', height: '36px',
          background: 'linear-gradient(135deg, #ef4444, #7c3aed)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: '900', fontSize: '14px', color: 'white',
          boxShadow: '0 0 15px rgba(239,68,68,0.3)',
          flexShrink: 0
        }}>
          {otherUser?.name?.[0]?.toUpperCase() || '?'}
        </div>

        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: '900', fontSize: '13px',
            color: '#e2e8f0', letterSpacing: '2px', margin: 0
          }}>{otherUser?.name?.toUpperCase() || 'LOADING...'}</p>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px',
            color: 'rgba(0,255,255,0.4)',
            margin: 0
          }}>// direct message</p>
        </div>

        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '10px',
          color: 'rgba(0,255,255,0.2)',
          letterSpacing: '2px'
        }}>// DM CHANNEL</div>
      </div>

      {/* MESSAGES */}
      <MessageList
        messages={messages}
        loading={loading}
        userId={userId}
        showName={false}
        accentColor="#00ffff"
      />

      {/* INPUT */}
      <MessageInput
        value={newMessage}
        onChange={handleTyping}
        onSend={sendMessage}
        sending={sending}
        placeholder={`// MESSAGE ${otherUser?.name?.toUpperCase() || ''}...`}
        isTyping={isTyping}
        typingUser={typingUser}
        accentColor="#00ffff"
      />

    </ChatLayout>
  );
}
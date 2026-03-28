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

    socket.on('connect', () => {
      socket.emit('join', userId);
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
    <div className="bg-black text-white flex overflow-hidden"
      style={{fontFamily: "'Rajdhani', sans-serif", height: '100vh', paddingTop: '104px'}}>

      {/* SHARED SIDEBAR */}
      <ChatSidebar
        conversations={conversations}
        activeId={params.id}
        type="dm"
      />

      {/* MAIN CHAT */}
      <div className="flex-1 flex flex-col grid-bg">

        {/* Header */}
        <div className="h-14 bg-black border-b border-red-500/20 flex items-center px-4 gap-3"
          style={{boxShadow: '0 0 20px rgba(239,68,68,0.1)'}}>
          <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-purple-600 rounded-full flex items-center justify-center font-black text-sm">
            {otherUser?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-black text-sm tracking-wider">
              {otherUser?.name?.toUpperCase() || 'LOADING...'}
            </p>
            <p className="text-xs text-green-400 font-bold">● ONLINE</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="text-5xl">💬</div>
              <p className="font-black text-gray-600 tracking-widest"
                style={{fontFamily: "'Orbitron', sans-serif"}}>NO MESSAGES YET</p>
            </div>
          ) : messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              userId={userId}
              showName={false}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-red-500/20 bg-black/50">
          <div className="flex gap-2 items-end">
            <textarea
              className="msg-input flex-1"
              style={{maxHeight: '100px'}}
              placeholder={`MESSAGE ${otherUser?.name?.toUpperCase() || ''}...`}
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => handleKeyPress(e, sendMessage)}
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={sending || !newMessage.trim()}
              className={`px-4 py-2.5 rounded font-black text-xs tracking-widest transition flex-shrink-0 ${newMessage.trim() ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-gray-900 text-gray-700 border border-gray-800 cursor-not-allowed'}`}
              style={newMessage.trim() ? {boxShadow: '0 0 10px rgba(239,68,68,0.4)'} : {}}>
              {sending ? '⟳' : '⚡ SEND'}
            </button>
          </div>
          <p className="text-xs text-gray-700 mt-1 font-bold">
            ENTER to send • SHIFT+ENTER for new line
          </p>
        </div>
      </div>
    </div>
  );
}
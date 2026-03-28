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
    <div className="bg-black text-white flex overflow-hidden"
      style={{fontFamily: "'Rajdhani', sans-serif", height: '100vh', paddingTop: '104px'}}>

      {/* SHARED SIDEBAR */}
      <ChatSidebar
        conversations={conversations}
        activeId={params.id}
        type="group"
      />

      {/* MAIN CHAT */}
      <div className="flex-1 flex flex-col grid-bg">

        {/* Header */}
        <div className="h-14 bg-black border-b border-red-500/20 flex items-center justify-between px-4"
          style={{boxShadow: '0 0 20px rgba(239,68,68,0.1)'}}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 bg-gradient-to-br from-red-600 to-purple-600 rounded-full flex items-center justify-center font-black text-sm cursor-pointer"
              onClick={() => router.push(`/chat/group/${params.id}/info`)}
              style={{boxShadow: '0 0 15px rgba(239,68,68,0.4)'}}>
              {group?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="cursor-pointer group"
              onClick={() => router.push(`/chat/group/${params.id}/info`)}>
              <p className="font-black tracking-wider text-white group-hover:text-red-400 transition"
                style={{fontFamily: "'Orbitron', sans-serif", fontSize: '15px'}}>
                {group?.name?.toUpperCase() || 'LOADING...'}
              </p>
              <p className="text-xs text-gray-600 font-bold group-hover:text-gray-400 transition">
                {members.length} MEMBERS · <span className="text-red-500/50">TAP FOR INFO →</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowMembers(!showMembers)}
            className={`px-3 py-1.5 rounded font-black text-xs tracking-widest transition border ${showMembers ? 'bg-red-600 border-red-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-red-500/40'}`}>
            👥 MEMBERS
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">

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

          {/* Members Panel */}
          {showMembers && (
            <div className="w-48 bg-black border-l border-red-500/20 p-3 overflow-y-auto">
              <p className="text-xs font-black tracking-widest text-red-500/70 mb-3"
                style={{fontFamily: "'Orbitron', sans-serif"}}>// MEMBERS</p>
              {members.map((member, i) => (
                <div key={i} className="flex items-center gap-2 mb-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs bg-gradient-to-br ${avatarColors[i % avatarColors.length]}`}>
                    {member.users?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-black text-xs text-white">
                      {member.users?.name?.toUpperCase()}
                    </p>
                    {member.role === 'admin' && (
                      <span className="text-xs text-yellow-500 font-bold">ADMIN</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-red-500/20 bg-black/50">
          <div className="flex gap-2 items-end">
            <textarea
              className="msg-input flex-1"
              style={{maxHeight: '100px'}}
              placeholder={`MESSAGE ${group?.name?.toUpperCase() || 'GROUP'}...`}
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
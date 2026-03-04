'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { io } from 'socket.io-client';

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
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';

  useEffect(() => {
    fetchConversations();
    fetchMembers();

    const socket = io('http://localhost:3001');
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

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setConversations(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/chat/messages?group_id=${params.id}&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
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
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/chat/groups/${params.id}/members`, {
        headers: { Authorization: `Bearer ${token}` }
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
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: newMessage, group_id: params.id }),
      });
      if (res.ok) {
        const realMsg = await res.json();
        setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? realMsg : m));
      }
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const timeStr = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const avatarColors = ['from-red-600 to-purple-600', 'from-blue-600 to-purple-600', 'from-green-600 to-blue-600', 'from-yellow-600 to-orange-600', 'from-pink-600 to-red-600'];

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden" style={{fontFamily: "'Rajdhani', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        .grid-bg { background-image: linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #ef4444; border-radius: 2px; }
        .msg-input { background: #0a0a0a; border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; color: white; font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 13px; padding: 10px 14px; width: 100%; outline: none; resize: none; transition: all 0.2s; }
        .msg-input:focus { border-color: rgba(239,68,68,0.7); box-shadow: 0 0 10px rgba(239,68,68,0.2); }
        .msg-input::placeholder { color: #374151; }
        .temp-msg { opacity: 0.7; }
      `}</style>

      {/* LEFT SIDEBAR */}
      <div className="w-64 bg-black border-r border-red-500/20 flex flex-col">
        <div className="p-3 border-b border-red-500/20">
          <button onClick={() => router.push('/dashboard')} className="text-red-400 hover:text-red-300 font-bold text-sm mb-2">← BACK</button>
          <p className="text-xs font-black tracking-widest text-red-500" style={{fontFamily: "'Orbitron', sans-serif"}}>// MESSAGES</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-xs font-black tracking-widest text-gray-600 mb-2 px-2">DIRECT MESSAGES</p>
          {conversations.dms?.map(dm => {
            const other = dm.user1_id === userId ? dm.user2 : dm.user1;
            return (
              <Link key={dm.id} href={`/chat/dm/${dm.id}`}>
                <div className="flex items-center gap-2 p-2 rounded-lg cursor-pointer mb-1 hover:bg-gray-900 border border-transparent transition">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-purple-600 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0">
                    {other?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs text-white truncate">{other?.name?.toUpperCase() || 'UNKNOWN'}</p>
                    <p className="text-xs text-gray-600 truncate">{dm.last_message || 'No messages'}</p>
                  </div>
                </div>
              </Link>
            );
          })}
          <p className="text-xs font-black tracking-widest text-gray-600 mb-2 px-2 mt-4">GROUPS</p>
          {conversations.groups?.map(grp => (
            <Link key={grp.id} href={`/chat/group/${grp.id}`}>
              <div className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer mb-1 transition border ${grp.id === params.id ? 'bg-red-600/20 border-red-500/40' : 'hover:bg-gray-900 border-transparent'}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0">
                  {grp.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-xs text-white truncate">{grp.name?.toUpperCase()}</p>
                  <p className="text-xs text-gray-600">Group</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="p-3 border-t border-red-500/20">
          <Link href="/chat/new">
            <button className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded font-black text-xs tracking-widest transition">+ NEW CHAT</button>
          </Link>
        </div>
      </div>

      {/* MAIN CHAT */}
      <div className="flex-1 flex flex-col grid-bg">
        <div className="h-14 bg-black border-b border-red-500/20 flex items-center justify-between px-4" style={{boxShadow: '0 0 20px rgba(239,68,68,0.1)'}}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-black text-sm">
              {group?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-black text-sm tracking-wider cursor-pointer hover:text-red-400 transition"
  onClick={() => router.push(`/chat/group/${params.id}/info`)}>
  {group?.name?.toUpperCase() || 'LOADING...'}
</p>
              <p className="text-xs text-gray-600 font-bold">{members.length} MEMBERS</p>
            </div>
          </div>
          <button onClick={() => setShowMembers(!showMembers)}
            className={`px-3 py-1.5 rounded font-black text-xs tracking-widest transition border ${showMembers ? 'bg-red-600 border-red-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-red-500/40'}`}>
            👥 MEMBERS
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <div className="text-5xl">💬</div>
                <p className="font-black text-gray-600 tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>NO MESSAGES YET</p>
              </div>
            ) : messages.map((msg, i) => {
              const isMe = String(msg.sender_id) === String(userId);
              const colorIdx = members.findIndex(m => m.user_id === msg.sender_id) % avatarColors.length;
              return (
                <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'} ${msg.temp ? 'temp-msg' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 bg-gradient-to-br ${avatarColors[colorIdx >= 0 ? colorIdx : 0]}`}>
                    {msg.sender?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className={`max-w-xs flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
                    {!isMe && <p className="text-xs text-gray-500 font-black px-1">{msg.sender?.name?.toUpperCase()}</p>}
                    <div className={`px-3 py-2 rounded-xl text-sm font-medium ${isMe ? 'bg-red-600 text-white rounded-tr-none' : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-none'}`}
                      style={isMe ? {boxShadow: '0 0 10px rgba(239,68,68,0.3)'} : {}}>
                      {msg.message}
                    </div>
                    <span className="text-xs text-gray-700 font-bold px-1">{msg.temp ? '⏳' : timeStr(msg.created_at)}</span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* MEMBERS PANEL */}
          {showMembers && (
            <div className="w-48 bg-black border-l border-red-500/20 p-3 overflow-y-auto">
              <p className="text-xs font-black tracking-widest text-red-500/70 mb-3" style={{fontFamily: "'Orbitron', sans-serif"}}>// MEMBERS</p>
              {members.map((member, i) => (
                <div key={i} className="flex items-center gap-2 mb-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs bg-gradient-to-br ${avatarColors[i % avatarColors.length]}`}>
                    {member.users?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-black text-xs text-white">{member.users?.name?.toUpperCase()}</p>
                    {member.role === 'admin' && <span className="text-xs text-yellow-500 font-bold">ADMIN</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-red-500/20 bg-black/50">
          <div className="flex gap-2 items-end">
            <textarea className="msg-input flex-1" style={{maxHeight: '100px'}}
              placeholder={`MESSAGE ${group?.name?.toUpperCase() || 'GROUP'}...`}
              value={newMessage} onChange={e => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress} rows={1} />
            <button onClick={sendMessage} disabled={sending || !newMessage.trim()}
              className={`px-4 py-2.5 rounded font-black text-xs tracking-widest transition flex-shrink-0 ${newMessage.trim() ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-gray-900 text-gray-700 border border-gray-800 cursor-not-allowed'}`}
              style={newMessage.trim() ? {boxShadow: '0 0 10px rgba(239,68,68,0.4)'} : {}}>
              {sending ? '⟳' : '⚡ SEND'}
            </button>
          </div>
          <p className="text-xs text-gray-700 mt-1 font-bold">ENTER to send • SHIFT+ENTER for new line</p>
        </div>
      </div>
    </div>
  );
}
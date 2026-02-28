'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

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
  const inputRef = useRef(null);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';
  const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') : '';

  useEffect(() => {
    fetchConversations();
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [params.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        const dm = data.dms.find(d => d.id === params.id);
        if (dm) {
          const other = dm.user1_id === userId ? dm.user2 : dm.user1;
          setOtherUser(other);
        }
      }
    } catch (err) { console.error(err); }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const dm = conversations.dms?.find(d => d.id === params.id);
      if (!dm && conversations.dms?.length === 0) {
        const res = await fetch('http://localhost:3001/api/chat/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const foundDm = data.dms.find(d => d.id === params.id);
          if (foundDm) {
            const other = foundDm.user1_id === userId ? foundDm.user2 : foundDm.user1;
            setOtherUser(other);
            const otherId = foundDm.user1_id === userId ? foundDm.user2_id : foundDm.user1_id;
            const msgRes = await fetch(`http://localhost:3001/api/chat/messages?receiver_id=${otherId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (msgRes.ok) {
              const msgs = await msgRes.json();
              setMessages(msgs.reverse());
            }
          }
        }
      } else if (dm) {
        const otherId = dm.user1_id === userId ? dm.user2_id : dm.user1_id;
        const res = await fetch(`http://localhost:3001/api/chat/messages?receiver_id=${otherId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const msgs = await res.json();
          setMessages(msgs.reverse());
        }
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const dm = conversations.dms?.find(d => d.id === params.id);
      if (!dm) return;
      const otherId = dm.user1_id === userId ? dm.user2_id : dm.user1_id;
      const res = await fetch('http://localhost:3001/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: newMessage, receiver_id: otherId }),
      });
      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const timeStr = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
      `}</style>

      {/* LEFT SIDEBAR - Conversations */}
      <div className="w-64 bg-black border-r border-red-500/20 flex flex-col">
        <div className="p-3 border-b border-red-500/20">
          <button onClick={() => router.push('/dashboard')} className="text-red-400 hover:text-red-300 font-bold text-sm mb-2 flex items-center gap-1">← BACK</button>
          <p className="text-xs font-black tracking-widest text-red-500" style={{fontFamily: "'Orbitron', sans-serif"}}>// MESSAGES</p>
        </div>

        {/* DMs List */}
        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-xs font-black tracking-widest text-gray-600 mb-2 px-2">DIRECT MESSAGES</p>
          {conversations.dms?.map(dm => {
            const other = dm.user1_id === userId ? dm.user2 : dm.user1;
            const isActive = dm.id === params.id;
            return (
              <Link key={dm.id} href={`/chat/dm/${dm.id}`}>
                <div className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer mb-1 transition ${isActive ? 'bg-red-600/20 border border-red-500/40' : 'hover:bg-gray-900 border border-transparent'}`}>
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

          {/* Groups */}
          <p className="text-xs font-black tracking-widest text-gray-600 mb-2 px-2 mt-4">GROUPS</p>
          {conversations.groups?.map(group => (
            <Link key={group.id} href={`/chat/group/${group.id}`}>
              <div className="flex items-center gap-2 p-2 rounded-lg cursor-pointer mb-1 hover:bg-gray-900 border border-transparent transition">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0">
                  {group.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-xs text-white truncate">{group.name?.toUpperCase()}</p>
                  <p className="text-xs text-gray-600">Group</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* New Chat Button */}
        <div className="p-3 border-t border-red-500/20">
          <Link href="/chat/new">
            <button className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded font-black text-xs tracking-widest transition" style={{boxShadow: '0 0 10px rgba(239,68,68,0.4)'}}>
              + NEW CHAT
            </button>
          </Link>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col grid-bg">

        {/* Chat Header */}
        <div className="h-14 bg-black border-b border-red-500/20 flex items-center px-4 gap-3" style={{boxShadow: '0 0 20px rgba(239,68,68,0.1)'}}>
          <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-purple-600 rounded-full flex items-center justify-center font-black text-sm" style={{boxShadow: '0 0 10px rgba(239,68,68,0.4)'}}>
            {otherUser?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-black text-sm tracking-wider">{otherUser?.name?.toUpperCase() || 'LOADING...'}</p>
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
              <p className="font-black text-gray-600 tracking-widest" style={{fontFamily: "'Orbitron', sans-serif"}}>NO MESSAGES YET</p>
              <p className="text-gray-700 text-xs">Send the first message!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = String(msg.sender_id) === String(userId);
              return (
                <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${isMe ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-gradient-to-br from-gray-700 to-gray-800'}`}>
                    {msg.sender?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className={`max-w-xs ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                    <div className={`px-3 py-2 rounded-xl text-sm font-medium ${
                      isMe
                        ? 'bg-red-600 text-white rounded-tr-none'
                        : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-none'
                    }`} style={isMe ? {boxShadow: '0 0 10px rgba(239,68,68,0.3)'} : {}}>
                      {msg.message}
                    </div>
                    <span className="text-xs text-gray-700 font-bold px-1">{timeStr(msg.created_at)}</span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-red-500/20 bg-black/50">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              className="msg-input flex-1"
              style={{maxHeight: '100px'}}
              placeholder={`MESSAGE ${otherUser?.name?.toUpperCase() || ''}...`}
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={sending || !newMessage.trim()}
              className={`px-4 py-2.5 rounded font-black text-xs tracking-widest transition flex-shrink-0 ${
                newMessage.trim()
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : 'bg-gray-900 text-gray-700 border border-gray-800 cursor-not-allowed'
              }`}
              style={newMessage.trim() ? {boxShadow: '0 0 10px rgba(239,68,68,0.4)'} : {}}
            >
              {sending ? '⟳' : '⚡ SEND'}
            </button>
          </div>
          <p className="text-xs text-gray-700 mt-1 font-bold">ENTER to send • SHIFT+ENTER for new line</p>
        </div>
      </div>
    </div>
  );
}
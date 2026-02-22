'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ChatSidebar({ isOpen, onClose }) {
  const [conversations, setConversations] = useState({ dms: [], groups: [] });
  const [activeTab, setActiveTab] = useState('dms');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) fetchConversations();
  }, [isOpen]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('http://localhost:3001/api/chat/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error('Fetch conversations error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      {/* Chat Sidebar - RED THEME */}
      <div className="fixed right-0 top-0 h-full w-96 bg-gray-900 border-l border-red-500/30 shadow-2xl z-50 flex flex-col">
        
        {/* Header */}
        <div className="h-16 bg-gradient-to-r from-gray-900 to-red-950/50 border-b border-red-500/30 flex items-center justify-between px-6">
          <h2 className="text-lg font-black">💬 Messages</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl transition"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-red-500/20 bg-gray-800/50">
          <button
            onClick={() => setActiveTab('dms')}
            className={`flex-1 py-3 font-bold text-sm transition ${
              activeTab === 'dms'
                ? 'text-white border-b-2 border-red-500 bg-red-500/10'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Direct Messages
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-3 font-bold text-sm transition ${
              activeTab === 'groups'
                ? 'text-white border-b-2 border-red-500 bg-red-500/10'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Groups
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
            </div>
          ) : activeTab === 'dms' ? (
            conversations.dms.length === 0 ? (
              <div className="text-center py-20 px-6">
                <div className="text-5xl mb-3">💬</div>
                <p className="text-gray-400 text-sm">No messages yet</p>
                <p className="text-gray-600 text-xs mt-1">Start a conversation!</p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {conversations.dms.map((dm) => {
                  const userId = localStorage.getItem('userId');
                  const otherUser = dm.user1_id === userId ? dm.user2 : dm.user1;
                  
                  return (
                    <Link key={dm.id} href={`/chat/dm/${dm.id}`}>
                      <div className="bg-gray-800/50 hover:bg-red-900/20 border border-white/10 hover:border-red-500/50 rounded-xl p-4 cursor-pointer transition">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center font-black shadow-lg shadow-red-500/30">
                            {otherUser?.name?.[0] || '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm">{otherUser?.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-400 truncate">{dm.last_message || 'No messages'}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )
          ) : (
            conversations.groups.length === 0 ? (
              <div className="text-center py-20 px-6">
                <div className="text-5xl mb-3">👥</div>
                <p className="text-gray-400 text-sm">No groups yet</p>
                <button className="mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition">
                  + Create Group
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {conversations.groups.map((group) => (
                  <Link key={group.id} href={`/chat/group/${group.id}`}>
                    <div className="bg-gray-800/50 hover:bg-red-900/20 border border-white/10 hover:border-red-500/50 rounded-xl p-4 cursor-pointer transition">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center font-black shadow-lg shadow-red-500/30">
                          {group.name?.[0] || '?'}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{group.name}</p>
                          <p className="text-xs text-gray-400">{group.group_chat_members?.[0]?.count || 0} members</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer - New Chat Button */}
        <div className="p-4 border-t border-red-500/30 bg-gray-800/50">
          <Link href="/chat/new">
            <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 rounded-xl font-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30">
              + New Message
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

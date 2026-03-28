'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ChatSidebar({ conversations, activeId, type }) {
  const router = useRouter();
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';

  return (
    <div className="w-64 bg-black border-r border-red-500/20 flex flex-col">
      <div className="p-3 border-b border-red-500/20">
        <button onClick={() => router.push('/dashboard')} className="text-red-400 hover:text-red-300 font-bold text-sm mb-2">← BACK</button>
        <p className="text-xs font-black tracking-widest text-red-500" style={{fontFamily: "'Orbitron', sans-serif"}}>// MESSAGES</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <p className="text-xs font-black tracking-widest text-gray-600 mb-2 px-2">DIRECT MESSAGES</p>
        {conversations.dms?.map(dm => {
          const other = dm.user1_id === userId ? dm.user2 : dm.user1;
          const isActive = type === 'dm' && dm.id === activeId;
          return (
            <Link key={dm.id} href={`/chat/dm/${dm.id}`}>
              <div className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer mb-1 transition border ${isActive ? 'bg-red-600/20 border-red-500/40' : 'hover:bg-gray-900 border-transparent'}`}>
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
        {conversations.groups?.map(group => {
          const isActive = type === 'group' && group.id === activeId;
          return (
            <Link key={group.id} href={`/chat/group/${group.id}`}>
              <div className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer mb-1 transition border ${isActive ? 'bg-red-600/20 border-red-500/40' : 'hover:bg-gray-900 border-transparent'}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0">
                  {group.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-xs text-white truncate">{group.name?.toUpperCase()}</p>
                  <p className="text-xs text-gray-600">Group</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-3 border-t border-red-500/20">
        <Link href="/chat/new">
          <button className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded font-black text-xs tracking-widest transition">+ NEW CHAT</button>
        </Link>
      </div>
    </div>
  );
}

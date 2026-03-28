'use client';

import { timeStr } from '@/app/utils/chat';

export default function MessageBubble({ msg, userId, showName = false, avatarColor = 'from-red-600 to-purple-600' }) {
  const isMe = String(msg.sender_id) === String(userId);

  return (
    <div className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'} ${msg.temp ? 'temp-msg' : ''}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 bg-gradient-to-br ${isMe ? 'from-red-600 to-red-800' : avatarColor}`}>
        {msg.sender?.name?.[0]?.toUpperCase() || '?'}
      </div>
      <div className={`max-w-xs flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
        {showName && !isMe && (
          <p className="text-xs text-gray-500 font-black px-1">
            {msg.sender?.name?.toUpperCase()}
          </p>
        )}
        <div
          className={`px-3 py-2 rounded-xl text-sm font-medium ${isMe ? 'bg-red-600 text-white rounded-tr-none' : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-none'}`}
          style={isMe ? { boxShadow: '0 0 10px rgba(239,68,68,0.3)' } : {}}>
          {msg.message}
        </div>
        <span className="text-xs text-gray-700 font-bold px-1">
          {msg.temp ? '⏳' : timeStr(msg.created_at)}
        </span>
      </div>
    </div>
  );
}

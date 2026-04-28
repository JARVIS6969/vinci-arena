'use client';

import ChatSidebar from './ChatSidebar';

export default function ChatLayout({ conversations, activeId, type, children }) {
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
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        type={type}
      />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {children}
      </div>
    </div>
  );
}
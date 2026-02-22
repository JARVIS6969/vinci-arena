'use client';

import { useState } from 'react';
import ChatSidebar from './ChatSidebar';

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button - RED THEME */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-full shadow-2xl shadow-red-500/50 flex items-center justify-center text-2xl z-30 transition-all hover:scale-110 active:scale-95"
        title="Open Chat"
      >
        💬
      </button>

      {/* Chat Sidebar */}
      <ChatSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

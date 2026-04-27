'use client';

import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';

export default function MessageList({
  messages,
  loading,
  userId,
  showName = false,
  accentColor = '#00ffff',
  avatarGradients = null,
  members = [],
}) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    if (!showScrollBtn) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 200);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollBtn(false);
  };

  const isGrid = accentColor === '#a855f7';

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes floatUp {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.2; }
          100% { transform: translateY(-100vh) translateX(15px); opacity: 0; }
        }
        @keyframes msgSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingBounce {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50%       { transform: translateY(-4px); opacity: 1; }
        }
        .msg-enter { animation: msgSlideIn 0.2s ease-out forwards; }
        .cyber-grid-cyan {
          background-image:
            linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .cyber-grid-purple {
          background-image:
            linear-gradient(rgba(168,85,247,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .scroll-btn:hover { transform: scale(1.1); }
      `}</style>

      {/* MESSAGES SCROLL AREA */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={isGrid ? 'cyber-grid-purple' : 'cyber-grid-cyan'}
        style={{
          height: '100%',
          overflowY: 'auto',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>

        {/* LOADING */}
        {loading ? (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            flex: 1, gap: '12px'
          }}>
            <div style={{
              width: '32px', height: '32px',
              border: `2px solid ${accentColor}18`,
              borderTop: `2px solid ${accentColor}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}/>
            <p style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '10px',
              color: `${accentColor}60`,
              letterSpacing: '3px'
            }}>LOADING...</p>
          </div>

        /* EMPTY STATE */
        ) : messages.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            flex: 1, gap: '12px'
          }}>
            <div style={{ fontSize: '40px' }}>💬</div>
            <p style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '11px',
              color: `${accentColor}50`,
              letterSpacing: '3px'
            }}>NO MESSAGES YET</p>
            <p style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '10px',
              color: 'rgba(255,255,255,0.2)'
            }}>// initiate communication</p>
          </div>

        /* MESSAGES */
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {messages.map((msg, i) => {
              let avatarColor = '#00ffff,#0a1a3e';
              if (avatarGradients && members.length > 0) {
                const idx = members.findIndex(m => m.user_id === msg.sender_id);
                avatarColor = avatarGradients[idx >= 0 ? idx % avatarGradients.length : 0];
              }
              return (
                <div
                  key={msg.id}
                  className="msg-enter"
                  style={{ animationDelay: `${Math.min(i * 0.02, 0.3)}s` }}>
                  <MessageBubble
                    msg={msg}
                    userId={userId}
                    showName={showName}
                    avatarColor={avatarColor}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* SCROLL TO BOTTOM BUTTON */}
      {showScrollBtn && (
        <button
          className="scroll-btn"
          onClick={scrollToBottom}
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#080818',
            border: `1px solid ${accentColor}50`,
            color: accentColor,
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 15px ${accentColor}30`,
            transition: 'transform 0.2s',
            zIndex: 10
          }}>
          ↓
        </button>
      )}
    </div>
  );
}
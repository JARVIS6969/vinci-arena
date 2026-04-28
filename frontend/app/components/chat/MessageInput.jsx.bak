'use client';

import { useRef } from 'react';
import { handleKeyPress } from '@/app/utils/chat';

export default function MessageInput({
  value,
  onChange,
  onSend,
  sending,
  placeholder = '// MESSAGE...',
  isTyping = false,
  typingUser = '',
  accentColor = '#00ffff',
}) {
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    onChange(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
  };

  const handleSend = () => {
    if (!value.trim() || sending) return;
    onSend();
    if (textareaRef.current) {
      textareaRef.current.style.height = '38px';
    }
  };

  const isRed = accentColor === '#ef4444';
  const isPurple = accentColor === '#a855f7';

  return (
    <div style={{
      padding: '10px 16px 12px',
      borderTop: `1px solid ${accentColor}18`,
      background: 'linear-gradient(135deg, #080818, #050510)',
      flexShrink: 0
    }}>

      {/* TYPING INDICATOR */}
      <div style={{
        height: '20px',
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        {isTyping && (
          <>
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '4px', height: '4px',
                  borderRadius: '50%',
                  background: accentColor,
                  boxShadow: `0 0 4px ${accentColor}`,
                  animation: 'typingBounce 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.15}s`
                }}/>
              ))}
            </div>
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '10px',
              color: `${accentColor}80`,
              letterSpacing: '1px'
            }}>{typingUser} is typing...</span>
          </>
        )}
      </div>

      {/* INPUT ROW */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={e => handleKeyPress(e, handleSend)}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: '#080818',
            border: `1px solid ${value.trim() ? accentColor + '50' : accentColor + '18'}`,
            borderRadius: '6px',
            color: '#e2e8f0',
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: '600',
            fontSize: '13px',
            padding: '10px 14px',
            outline: 'none',
            resize: 'none',
            height: '38px',
            maxHeight: '100px',
            transition: 'all 0.2s',
            boxShadow: value.trim() ? `0 0 10px ${accentColor}12` : 'none'
          }}
        />
        <button
          onClick={handleSend}
          disabled={sending || !value.trim()}
          style={{
            padding: '10px 20px',
            background: value.trim()
              ? isRed
                ? 'linear-gradient(135deg, #1a0010, #0a001a)'
                : isPurple
                  ? 'linear-gradient(135deg, #1a0a2e, #0a0a2e)'
                  : 'linear-gradient(135deg, #001a1a, #001010)'
              : '#080818',
            border: `1px solid ${value.trim() ? accentColor + '60' : 'rgba(255,255,255,0.05)'}`,
            borderRadius: '6px',
            color: value.trim() ? accentColor : 'rgba(255,255,255,0.2)',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: '700',
            fontSize: '10px',
            letterSpacing: '2px',
            cursor: value.trim() ? 'pointer' : 'not-allowed',
            boxShadow: value.trim() ? `0 0 15px ${accentColor}30` : 'none',
            transition: 'all 0.2s',
            flexShrink: 0
          }}>
          {sending ? '...' : '⚡ SEND'}
        </button>
      </div>

      <p style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '10px',
        color: `${accentColor}25`,
        margin: '6px 0 0',
        letterSpacing: '1px'
      }}>// ENTER to send · SHIFT+ENTER new line</p>
    </div>
  );
}
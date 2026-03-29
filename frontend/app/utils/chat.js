// Shared Chat Utilities

export const API_URL = 'http://localhost:3001';

// Fetch all conversations
export const fetchConversations = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/chat/conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) return await res.json();
    return { dms: [], groups: [] };
  } catch (err) {
    console.error(err);
    return { dms: [], groups: [] };
  }
};

// Format time
export const timeStr = (date) =>
  new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

// Time ago
export const timeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

// Handle key press (Enter to send)
export const handleKeyPress = (e, sendFn) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendFn();
  }
};

// Get user ID from localStorage
export const getUserId = () =>
  typeof window !== 'undefined'
    ? localStorage.getItem('userId')
    : '';

// Get token from localStorage
export const getToken = () =>
  typeof window !== 'undefined'
    ? localStorage.getItem('token')
    : '';

// Emit typing start
export const emitTypingStart = (socket, roomId, userName) => {
  if (socket && roomId && userName) {
    socket.emit('typing_start', { roomId, userName });
  }
};

// Emit typing stop
export const emitTypingStop = (socket, roomId, userName) => {
  if (socket && roomId && userName) {
    socket.emit('typing_stop', { roomId, userName });
  }
};

// Particle config generator
export const getParticles = (count = 8) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() > 0.5 ? 2 : 1,
    duration: `${8 + Math.random() * 12}s`,
    delay: `${Math.random() * 8}s`,
    color: i % 3 === 0 ? '#00ffff' : i % 3 === 1 ? '#a855f7' : '#ef4444',
    drift: Math.random() > 0.5
  }));
};
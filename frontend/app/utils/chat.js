// Shared Chat Utilities

export const API_URL = 'http://localhost:3001';

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

export const timeStr = (date) =>
  new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

export const timeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export const handleKeyPress = (e, sendFn) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendFn();
  }
};

export const getUserId = () =>
  typeof window !== 'undefined'
    ? localStorage.getItem('userId')
    : '';

export const getToken = () =>
  typeof window !== 'undefined'
    ? localStorage.getItem('token')
    : '';

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { API_URL, getUserId } from '@/app/utils/chat';

export default function useSocket({ roomId, onNewMessage, onTypingStart, onTypingStop }) {
  const socketRef = useRef(null);
  const userId = getUserId();

  useEffect(() => {
    if (!roomId) return;

    const socket = io(API_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join', userId);
      socket.emit('join_room', roomId);
    });

    socket.on('new_message', (msg) => {
      if (onNewMessage) onNewMessage(msg);
    });

    socket.on('typing_start', ({ userName }) => {
      if (onTypingStart) onTypingStart(userName);
    });

    socket.on('typing_stop', () => {
      if (onTypingStop) onTypingStop();
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const emitTypingStart = (userName) => {
    if (socketRef.current && roomId && userName) {
      socketRef.current.emit('typing_start', { roomId, userName });
    }
  };

  const emitTypingStop = (userName) => {
    if (socketRef.current && roomId && userName) {
      socketRef.current.emit('typing_stop', { roomId, userName });
    }
  };

  return { socketRef, emitTypingStart, emitTypingStop };
}
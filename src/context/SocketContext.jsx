import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = process.env.REACT_APP_API_URL || 'https://chatting-app1.onrender.com';

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) { setSocket(null); setIsConnected(false); setOnlineUsers([]); return; }

    const token = localStorage.getItem('token');
    if (!token) return;

    const s = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

    s.on('connect', () => {
      setIsConnected(true);
      s.emit('authenticate', { token });
    });
    s.on('authenticated', () => {});
    s.on('onlineUsers', (users) => setOnlineUsers(users));
    s.on('userOnline', (u) => setOnlineUsers((prev) => {
      if (prev.find((x) => x.userId === u.userId)) return prev;
      return [...prev, u];
    }));
    s.on('userOffline', (u) => setOnlineUsers((prev) => prev.filter((x) => x.userId !== u.userId)));
    s.on('disconnect', () => setIsConnected(false));
    s.on('connect_error', () => setIsConnected(false));

    setSocket(s);
    return () => { s.disconnect(); setSocket(null); setIsConnected(false); };
  }, [user]);

  const joinRoom = useCallback((roomId) => { socket?.emit('joinRoom', { roomId }); }, [socket]);
  const leaveRoom = useCallback((roomId) => { socket?.emit('leaveRoom', { roomId }); }, [socket]);
  const sendMessage = useCallback((roomId, content) => { socket?.emit('sendMessage', { roomId, content }); }, [socket]);
  const emitTyping = useCallback((roomId, isTyping) => { socket?.emit('typing', { roomId, isTyping }); }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers, joinRoom, leaveRoom, sendMessage, emitTyping }}>
      {children}
    </SocketContext.Provider>
  );
};

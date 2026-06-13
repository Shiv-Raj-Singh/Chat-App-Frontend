import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import OnlineUsers from './OnlineUsers';
import API from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';

export default function ChatLayout() {
  const { user } = useAuth();
  const { socket, joinRoom, leaveRoom } = useSocket();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  // Fetch rooms
  useEffect(() => {
    API.get('/rooms').then(({ data }) => {
      if (data.status) {
        setRooms(data.data);
        if (data.data.length > 0) setActiveRoom(data.data[0]);
      }
    }).catch(() => toast.error('Failed to load rooms'));
  }, []);

  // Load messages when room changes
  useEffect(() => {
    if (!activeRoom) return;
    setLoadingMsgs(true);
    setMessages([]);
    API.get(`/rooms/${activeRoom._id}/messages`)
      .then(({ data }) => { if (data.status) setMessages(data.data); })
      .catch(() => {})
      .finally(() => setLoadingMsgs(false));
  }, [activeRoom]);

  // Socket room management
  useEffect(() => {
    if (!socket || !activeRoom) return;
    joinRoom(activeRoom._id);
    return () => leaveRoom(activeRoom._id);
  }, [socket, activeRoom, joinRoom, leaveRoom]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (msg.roomId === activeRoom?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleTyping = ({ roomId, userId, name, isTyping }) => {
      if (roomId !== activeRoom?._id) return;
      setTypingUsers((prev) => {
        if (isTyping) return { ...prev, [userId]: name };
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    };

    const handleUserJoined = ({ name, roomId }) => {
      if (roomId === activeRoom?._id) toast.success(`${name} joined the room`, { duration: 2000 });
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('typing', handleTyping);
    socket.on('userJoined', handleUserJoined);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('typing', handleTyping);
      socket.off('userJoined', handleUserJoined);
    };
  }, [socket, activeRoom]);

  const handleSelectRoom = useCallback((room) => {
    if (activeRoom?._id === room._id) return;
    if (socket && activeRoom) leaveRoom(activeRoom._id);
    setActiveRoom(room);
    setTypingUsers({});
    setSidebarOpen(false);
  }, [socket, activeRoom, leaveRoom]);

  const handleRoomCreated = (room) => {
    setRooms((prev) => [...prev, room]);
    setActiveRoom(room);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-dark-900 flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || true) && (
          <motion.div
            initial={false}
            className={`
              fixed lg:relative inset-y-0 left-0 z-30 lg:z-auto
              w-72 lg:w-72 flex-shrink-0
              transform transition-transform duration-300 ease-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <Sidebar
              rooms={rooms}
              activeRoom={activeRoom}
              user={user}
              onSelectRoom={handleSelectRoom}
              onRoomCreated={handleRoomCreated}
              onClose={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 lg:hidden bg-dark-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-600 transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="font-semibold text-white truncate">
            {activeRoom ? `# ${activeRoom.name}` : 'NexChat'}
          </span>
          <button
            onClick={() => setUsersOpen(!usersOpen)}
            className="ml-auto p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-600 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        <ChatArea
          room={activeRoom}
          messages={messages}
          typingUsers={typingUsers}
          loading={loadingMsgs}
          currentUser={user}
          onToggleUsers={() => setUsersOpen(!usersOpen)}
        />
      </div>

      {/* Online users panel */}
      <AnimatePresence>
        {(usersOpen || typeof window !== 'undefined') && (
          <motion.div
            initial={false}
            className={`
              fixed lg:relative inset-y-0 right-0 z-30 lg:z-auto
              w-60 flex-shrink-0
              transform transition-transform duration-300 ease-out
              ${usersOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}
          >
            <OnlineUsers onClose={() => setUsersOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

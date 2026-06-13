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
  const [memberCounts, setMemberCounts] = useState({}); // roomId → count
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  // Fetch rooms, auto-select from ?room= URL param or default to first
  useEffect(() => {
    API.get('/rooms').then(({ data }) => {
      if (!data.status) return;
      setRooms(data.data);
      const params = new URLSearchParams(window.location.search);
      const roomId = params.get('room');
      const target = roomId
        ? data.data.find((r) => r._id === roomId) || data.data[0]
        : data.data[0];
      if (target) setActiveRoom(target);
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

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (msg.roomId === activeRoom?._id) setMessages((prev) => [...prev, msg]);
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
      if (roomId === activeRoom?._id) toast(`${name} joined`, { icon: '👋', duration: 2000 });
    };

    const handleRoomCreated = (room) => {
      setRooms((prev) => prev.find((r) => r._id === room._id) ? prev : [...prev, room]);
      toast(`New room #${room.name} created`, { icon: room.emoji || '#', duration: 3000 });
    };

    const handleRoomDeleted = ({ roomId }) => {
      setRooms((prev) => {
        const remaining = prev.filter((r) => r._id !== roomId);
        if (activeRoom?._id === roomId && remaining.length > 0) setActiveRoom(remaining[0]);
        return remaining;
      });
      if (activeRoom?._id === roomId) toast.error('This room was deleted', { duration: 4000 });
    };

    const handleKicked = ({ roomId, by }) => {
      if (activeRoom?._id === roomId) {
        toast.error(`You were removed from this room by ${by}`, { duration: 5000 });
        setRooms((prev) => {
          const remaining = prev.filter((r) => r._id !== roomId);
          if (remaining.length > 0) setActiveRoom(remaining[0]);
          return prev;
        });
      }
    };

    const handleJoinError = ({ message }) => toast.error(message, { duration: 4000 });

    const handleMemberCount = ({ roomId, count }) => {
      setMemberCounts((prev) => ({ ...prev, [roomId]: count }));
    };

    // Direct invite from another user
    const handleRoomInvite = ({ roomId, roomName, roomEmoji, from }) => {
      toast.custom((t) => (
        <div className={`flex flex-col gap-2 px-4 py-3 rounded-xl shadow-xl border border-violet-500/30 bg-dark-800 ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
          <p className="text-sm text-slate-200">
            <span className="font-semibold text-violet-400">{from}</span> invited you to join{' '}
            <span className="font-semibold">{roomEmoji || '#'} {roomName}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const room = rooms.find((r) => r._id === roomId);
                if (room) handleSelectRoom(room);
                toast.dismiss(t.id);
              }}
              className="flex-1 py-1.5 rounded-lg text-sm font-medium text-white"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}
            >
              Join Room
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white bg-dark-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      ), { duration: 15000 });
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('typing', handleTyping);
    socket.on('userJoined', handleUserJoined);
    socket.on('roomCreated', handleRoomCreated);
    socket.on('roomDeleted', handleRoomDeleted);
    socket.on('kicked', handleKicked);
    socket.on('joinError', handleJoinError);
    socket.on('memberCount', handleMemberCount);
    socket.on('roomInvite', handleRoomInvite);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('typing', handleTyping);
      socket.off('userJoined', handleUserJoined);
      socket.off('roomCreated', handleRoomCreated);
      socket.off('roomDeleted', handleRoomDeleted);
      socket.off('kicked', handleKicked);
      socket.off('joinError', handleJoinError);
      socket.off('memberCount', handleMemberCount);
      socket.off('roomInvite', handleRoomInvite);
    };
  }, [socket, activeRoom, rooms]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectRoom = useCallback((room) => {
    if (activeRoom?._id === room._id) return;
    if (socket && activeRoom) leaveRoom(activeRoom._id);
    setActiveRoom(room);
    setTypingUsers({});
    setSidebarOpen(false);
  }, [socket, activeRoom, leaveRoom]);

  const handleRoomCreated = useCallback((room) => {
    setRooms((prev) => prev.find((r) => r._id === room._id) ? prev : [...prev, room]);
    setActiveRoom(room);
    setSidebarOpen(false);
  }, []);

  const handleRoomDeleted = useCallback((roomId) => {
    setRooms((prev) => {
      const remaining = prev.filter((r) => r._id !== roomId);
      if (remaining.length > 0) setActiveRoom(remaining[0]);
      return remaining;
    });
  }, []);

  return (
    <div className="h-screen bg-dark-900 flex overflow-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 z-30 lg:z-auto w-72 flex-shrink-0 transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar
          rooms={rooms}
          activeRoom={activeRoom}
          user={user}
          memberCounts={memberCounts}
          onSelectRoom={handleSelectRoom}
          onRoomCreated={handleRoomCreated}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 lg:hidden bg-dark-800">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-600 transition-colors">
            <Menu size={20} />
          </button>
          <span className="font-semibold text-white truncate">
            {activeRoom ? `${activeRoom.emoji || '#'} ${activeRoom.name}` : 'NexChat'}
          </span>
          <button onClick={() => setUsersOpen(!usersOpen)} className="ml-auto p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-600 transition-colors">
            <Menu size={20} />
          </button>
        </div>

        <ChatArea
          room={activeRoom}
          messages={messages}
          typingUsers={typingUsers}
          memberCount={memberCounts[activeRoom?._id] || 0}
          loading={loadingMsgs}
          currentUser={user}
          onToggleUsers={() => setUsersOpen(!usersOpen)}
          onRoomDeleted={handleRoomDeleted}
        />
      </div>

      {/* Online users panel */}
      <div className={`fixed lg:relative inset-y-0 right-0 z-30 lg:z-auto w-60 flex-shrink-0 transform transition-transform duration-300 ease-out ${usersOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <OnlineUsers activeRoom={activeRoom} onClose={() => setUsersOpen(false)} />
      </div>
    </div>
  );
}

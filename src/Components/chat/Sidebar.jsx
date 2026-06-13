import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Plus, X, LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const EMOJI_OPTIONS = ['💬', '🎲', '💻', '🎮', '🎵', '📚', '🌍', '🔥', '💡', '🎯'];

export default function Sidebar({ rooms, activeRoom, user, onSelectRoom, onRoomCreated, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { socket, isConnected } = useSocket();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: '', description: '', emoji: '💬' });

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoom.name.trim()) return toast.error('Room name is required');
    setCreating(true);
    try {
      const { data } = await API.post('/rooms', newRoom);
      if (data.status) {
        onRoomCreated(data.data);
        // broadcast to all other connected clients
        socket?.emit('newRoom', data.data);
        setShowCreateModal(false);
        setNewRoom({ name: '', description: '', emoji: '💬' });
        toast.success(`# ${data.data.name} created!`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create room');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="h-full flex flex-col bg-dark-800 border-r border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-black text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>N</div>
          <div>
            <span className="font-bold text-white text-sm">Nex</span>
            <span className="font-bold text-sm gradient-text">Chat</span>
          </div>
          <div className={`ml-1 w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-slate-600'}`} />
        </div>
        <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Rooms */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        <div className="flex items-center justify-between px-3 mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rooms</span>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-1 rounded-md text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
            title="Create room"
          >
            <Plus size={15} />
          </button>
        </div>

        {rooms.map((room) => {
          const isActive = activeRoom?._id === room._id;
          return (
            <motion.button
              key={room._id}
              onClick={() => onSelectRoom(room)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={`sidebar-item w-full text-left ${isActive ? 'active' : ''}`}
            >
              <span className="text-lg leading-none w-5 text-center flex-shrink-0">
                {room.emoji || '#'}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{room.name}</div>
                {room.description && (
                  <div className="text-xs text-slate-600 truncate">{room.description}</div>
                )}
              </div>
            </motion.button>
          );
        })}

        {rooms.length === 0 && (
          <div className="text-center py-8 text-slate-600 text-sm">
            No rooms yet.<br />
            <button onClick={() => setShowCreateModal(true)} className="text-violet-400 hover:underline mt-1">
              Create the first one
            </button>
          </div>
        )}
      </div>

      {/* User profile footer */}
      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="avatar w-9 h-9 text-sm"
              style={{ background: user?.avatarColor || '#7c3aed' }}
            >
              {initials}
            </div>
            <div className="online-dot" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</div>
            <div className="text-xs text-slate-500 truncate">{user?.email || ''}</div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => navigate('/profile')}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-dark-600 transition-all"
              title="Profile"
            >
              <User size={15} />
            </button>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Create Room Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Create Room</h2>
                <button onClick={() => setShowCreateModal(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateRoom} className="space-y-4">
                {/* Emoji picker */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Room Icon</label>
                  <div className="flex gap-2 flex-wrap">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewRoom({ ...newRoom, emoji })}
                        className={`w-9 h-9 rounded-lg text-lg transition-all ${
                          newRoom.emoji === emoji
                            ? 'bg-violet-500/30 ring-2 ring-violet-500'
                            : 'bg-dark-700 hover:bg-dark-600'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Room Name</label>
                  <div className="relative">
                    <Hash size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value.replace(/\s/g, '-').toLowerCase() })}
                      placeholder="my-awesome-room"
                      className="input-field pl-9"
                      maxLength={50}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description <span className="text-slate-600">(optional)</span></label>
                  <input
                    type="text"
                    value={newRoom.description}
                    onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                    placeholder="What's this room about?"
                    className="input-field"
                    maxLength={200}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn-ghost flex-1 py-2.5">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1 py-2.5" disabled={creating}>
                    {creating ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

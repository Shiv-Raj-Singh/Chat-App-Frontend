import React, { useState } from 'react';
import { X, Wifi, UserMinus, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../api';
import toast from 'react-hot-toast';

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

export default function OnlineUsers({ onClose, activeRoom }) {
  const { socket, onlineUsers, isConnected } = useSocket();
  const { user } = useAuth();
  const [removing, setRemoving] = useState(null);

  const isAdmin = activeRoom && user && (
    activeRoom.creator?._id === user._id ||
    activeRoom.creator?._id?.toString() === user._id?.toString() ||
    activeRoom.creator === user._id
  );

  const handleRemoveUser = async (targetUser) => {
    if (!activeRoom || !socket) return;
    if (!window.confirm(`Remove ${targetUser.name} from #${activeRoom.name}?`)) return;

    setRemoving(targetUser.userId);
    try {
      // Block from room in DB
      await API.post(`/rooms/${activeRoom._id}/block`, { userId: targetUser.userId });
      // Kick from socket room
      socket.emit('kickUser', { roomId: activeRoom._id, userId: targetUser.userId });
      toast.success(`${targetUser.name} removed from this room`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to remove user');
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-dark-800 border-l border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Wifi size={15} className={isConnected ? 'text-emerald-400' : 'text-slate-600'} />
          <span className="text-sm font-semibold text-slate-300">
            Online · <span className="text-emerald-400">{onlineUsers.length}</span>
          </span>
        </div>
        <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Admin badge */}
      {isAdmin && activeRoom && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center gap-2">
          <Shield size={13} className="text-violet-400 flex-shrink-0" />
          <span className="text-xs text-violet-300">You are admin of #{activeRoom.name}</span>
        </div>
      )}

      {/* Users list */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {onlineUsers.length === 0 ? (
          <div className="text-center py-8 text-slate-600 text-sm">No one online yet</div>
        ) : (
          onlineUsers.map((u, i) => {
            const isYou = u.userId === user?._id || u.name === user?.name;
            const isBeingRemoved = removing === u.userId;

            return (
              <motion.div
                key={u.userId || i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-dark-700 transition-colors group"
              >
                <div className="relative flex-shrink-0">
                  <div
                    className="avatar w-8 h-8 text-xs"
                    style={{ background: u.avatarColor || '#7c3aed' }}
                  >
                    {getInitials(u.name)}
                  </div>
                  <div className="online-dot" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-200 truncate">
                    {u.name} {isYou && <span className="text-slate-500 text-xs">(you)</span>}
                  </div>
                </div>

                {/* Kick/remove button — only visible to admin, not for self */}
                {isAdmin && !isYou && activeRoom && (
                  <button
                    onClick={() => handleRemoveUser(u)}
                    disabled={isBeingRemoved}
                    title={`Remove ${u.name} from room`}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                  >
                    {isBeingRemoved ? (
                      <div className="w-3.5 h-3.5 border border-red-400/40 border-t-red-400 rounded-full animate-spin" />
                    ) : (
                      <UserMinus size={14} />
                    )}
                  </button>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-slate-800">
        <p className="text-[10px] text-slate-700 text-center leading-relaxed">
          {isAdmin ? 'Hover a user to manage them' : 'Only users in the same room see each other\'s messages'}
        </p>
      </div>
    </div>
  );
}

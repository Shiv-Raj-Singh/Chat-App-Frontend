import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Hash, Users, Loader, Link2, Trash2, Shield, ChevronDown } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../api';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import toast from 'react-hot-toast';

const COMMON_EMOJIS = ['😊','😂','❤️','🔥','👍','🎉','😍','🙌','💯','✨','🚀','💜','😎','🤩','👏'];

export default function ChatArea({ room, messages, typingUsers, loading, onToggleUsers, onRoomDeleted }) {
  const { user } = useAuth();
  const { socket, sendMessage, emitTyping } = useSocket();
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  // Close admin menu on outside click
  useEffect(() => {
    if (!showAdminMenu) return;
    const close = () => setShowAdminMenu(false);
    window.addEventListener('click', close, { once: true });
    return () => window.removeEventListener('click', close);
  }, [showAdminMenu]);

  const stopTyping = useCallback(() => {
    if (isTypingRef.current && room) {
      emitTyping(room._id, false);
      isTypingRef.current = false;
    }
  }, [room, emitTyping]);

  const handleInput = (e) => {
    setText(e.target.value);
    if (!room) return;
    if (!isTypingRef.current) {
      emitTyping(room._id, true);
      isTypingRef.current = true;
    }
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(stopTyping, 1500);
  };

  const handleSend = useCallback(() => {
    if (!text.trim() || !room) return;
    sendMessage(room._id, text.trim());
    setText('');
    stopTyping();
    clearTimeout(typingTimerRef.current);
    inputRef.current?.focus();
  }, [text, room, sendMessage, stopTyping]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/chat?room=${room._id}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Invite link copied to clipboard!', { icon: '🔗' });
    }).catch(() => {
      toast.error('Failed to copy link');
    });
    setShowAdminMenu(false);
  };

  const handleDeleteRoom = async () => {
    if (!window.confirm(`Delete #${room.name}? This action cannot be undone.`)) return;
    setDeleting(true);
    try {
      await API.delete(`/rooms/${room._id}`);
      socket?.emit('deleteRoom', { roomId: room._id });
      toast.success(`Room #${room.name} deleted`);
      onRoomDeleted?.(room._id);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete room');
    } finally {
      setDeleting(false);
      setShowAdminMenu(false);
    }
  };

  const typingList = Object.values(typingUsers).filter(Boolean);
  const isCreator = room && user && (
    room.creator?._id === user._id ||
    room.creator?._id?.toString() === user._id?.toString() ||
    room.creator === user._id
  );

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <Hash size={48} className="mx-auto mb-4 text-slate-700" />
          <p className="text-slate-500 text-lg font-medium">Select a room to start chatting</p>
          <p className="text-slate-700 text-sm mt-1">Pick a room from the sidebar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-dark-900 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-dark-900 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg bg-dark-700">
            {room.emoji || '#'}
          </div>
          <div>
            <h2 className="font-semibold text-white text-base leading-tight flex items-center gap-2">
              {room.name}
              {isCreator && (
                <span title="You are the admin" className="text-violet-400">
                  <Shield size={12} />
                </span>
              )}
            </h2>
            {room.description && (
              <p className="text-xs text-slate-500 leading-tight">{room.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Invite link button (visible to all) */}
          <button
            onClick={copyInviteLink}
            title="Copy invite link"
            className="p-2 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
          >
            <Link2 size={17} />
          </button>

          {/* Admin menu (only for room creator) */}
          {isCreator && !room.isDefault && (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowAdminMenu(!showAdminMenu); }}
                title="Admin options"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-all flex items-center gap-1"
              >
                <Shield size={17} />
                <ChevronDown size={13} />
              </button>

              <AnimatePresence>
                {showAdminMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-1 w-48 glass-card py-1.5 z-50 shadow-2xl"
                  >
                    <button
                      onClick={copyInviteLink}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-dark-600 hover:text-white transition-colors"
                    >
                      <Link2 size={15} className="text-violet-400" />
                      Copy invite link
                    </button>
                    <div className="border-t border-slate-800 my-1" />
                    <button
                      onClick={handleDeleteRoom}
                      disabled={deleting}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={15} />
                      {deleting ? 'Deleting…' : 'Delete room'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Online users toggle */}
          <button
            onClick={onToggleUsers}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-all"
          >
            <Users size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader size={24} className="text-violet-400 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3">{room.emoji || '💬'}</div>
            <h3 className="font-semibold text-white mb-1">Welcome to #{room.name}</h3>
            <p className="text-slate-500 text-sm">Be the first to say something!</p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => {
              const prev = messages[i - 1];
              const isConsecutive = prev && prev.sender._id === msg.sender._id &&
                (new Date(msg.createdAt) - new Date(prev.createdAt)) < 60000;
              return (
                <MessageBubble
                  key={msg._id}
                  message={msg}
                  isSelf={msg.sender._id === user?._id || msg.sender.name === user?.name}
                  isConsecutive={isConsecutive}
                />
              );
            })}
          </>
        )}

        {typingList.length > 0 && <TypingIndicator users={typingList} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0">
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 p-3 glass rounded-xl flex flex-wrap gap-2"
          >
            {COMMON_EMOJIS.map((e) => (
              <button key={e} onClick={() => insertEmoji(e)}
                className="text-xl hover:scale-125 transition-transform">
                {e}
              </button>
            ))}
          </motion.div>
        )}

        <div className="flex items-end gap-3 bg-dark-700 rounded-2xl px-4 py-3 border border-slate-700 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className={`text-slate-400 hover:text-violet-400 transition-colors mb-0.5 flex-shrink-0 ${showEmoji ? 'text-violet-400' : ''}`}
          >
            <Smile size={20} />
          </button>

          <textarea
            ref={inputRef}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${room.name}`}
            rows={1}
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 resize-none outline-none text-sm leading-relaxed max-h-32"
            style={{ minHeight: '24px' }}
          />

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!text.trim()}
            className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              text.trim()
                ? 'text-white shadow-lg'
                : 'text-slate-600 bg-dark-600 cursor-not-allowed'
            }`}
            style={text.trim() ? { background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' } : {}}
          >
            <Send size={16} />
          </motion.button>
        </div>
        <p className="text-xs text-slate-700 mt-1.5 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

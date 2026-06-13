import React from 'react';
import { motion } from 'framer-motion';

export default function TypingIndicator({ users }) {
  if (!users || users.length === 0) return null;

  const label =
    users.length === 1
      ? `${users[0]} is typing`
      : users.length === 2
      ? `${users[0]} and ${users[1]} are typing`
      : `${users[0]} and ${users.length - 1} others are typing`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="flex items-center gap-3 mt-2"
    >
      {/* Ghost avatar */}
      <div className="w-8 h-8 rounded-full bg-dark-700 flex-shrink-0" />

      <div className="flex items-center gap-2.5 bg-dark-700 px-4 py-3 rounded-2xl rounded-bl-sm">
        <div className="flex gap-1 items-center">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
        <span className="text-xs text-slate-500 italic">{label}…</span>
      </div>
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isYesterday } from 'date-fns';

const formatTime = (date) => {
  const d = new Date(date);
  if (isToday(d)) return format(d, 'h:mm a');
  if (isYesterday(d)) return `Yesterday ${format(d, 'h:mm a')}`;
  return format(d, 'MMM d, h:mm a');
};

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

export default function MessageBubble({ message, isSelf, isConsecutive }) {
  const { sender, content, createdAt } = message;
  const initials = getInitials(sender?.name);
  const color = sender?.avatarColor || '#7c3aed';
  const time = formatTime(createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`flex items-end gap-2.5 group ${isSelf ? 'flex-row-reverse' : ''} ${isConsecutive ? 'mt-0.5' : 'mt-3'}`}
    >
      {/* Avatar — hidden for consecutive messages */}
      <div className="flex-shrink-0 w-8">
        {!isConsecutive ? (
          <div
            className="avatar w-8 h-8 text-xs"
            style={{ background: color }}
            title={sender?.name}
          >
            {initials}
          </div>
        ) : null}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col max-w-[72%] md:max-w-[60%] ${isSelf ? 'items-end' : 'items-start'}`}>
        {/* Name + time (first in a sequence) */}
        {!isConsecutive && (
          <div className={`flex items-baseline gap-2 mb-1 ${isSelf ? 'flex-row-reverse' : ''}`}>
            <span className="text-xs font-semibold text-slate-300">
              {isSelf ? 'You' : sender?.name}
            </span>
            <span className="text-[10px] text-slate-600">{time}</span>
          </div>
        )}

        <div
          className={`relative px-4 py-2.5 text-sm leading-relaxed break-words ${
            isSelf ? 'message-bubble-sent text-white' : 'message-bubble-received text-slate-100'
          }`}
        >
          {content}

          {/* Timestamp on hover */}
          {isConsecutive && (
            <span className={`
              absolute top-1/2 -translate-y-1/2 text-[10px] text-slate-600
              opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none
              ${isSelf ? '-left-16' : '-right-16'}
            `}>
              {format(new Date(createdAt), 'h:mm a')}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

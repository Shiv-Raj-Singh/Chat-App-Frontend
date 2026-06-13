import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, LogOut, Shield, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-dark-700 border border-slate-800">
    <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
      <Icon size={16} className="text-violet-400" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-slate-100 truncate">{value || '—'}</p>
    </div>
  </div>
);

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  const initials = getInitials(user?.name);
  const joinDate = user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Unknown';

  return (
    <div className="min-h-screen bg-dark-900 px-4 py-8">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Back to chat
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Avatar card */}
          <div className="glass-card p-8 text-center mb-5"
            style={{ boxShadow: '0 20px 60px rgba(124,58,237,0.1)' }}>
            <div className="relative inline-block mb-4">
              <div
                className="avatar w-24 h-24 text-3xl mx-auto"
                style={{ background: user?.avatarColor || '#7c3aed' }}
              >
                {initials}
              </div>
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-dark-700" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">{user?.name}</h1>
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-400 px-3 py-1 rounded-full bg-dark-700">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              Online
            </span>
          </div>

          {/* Info */}
          <div className="glass-card p-6 space-y-3 mb-5">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Account Info</h2>
            <InfoRow icon={User} label="Full Name" value={user?.name} />
            <InfoRow icon={Mail} label="Email Address" value={user?.email} />
            <InfoRow icon={Phone} label="Phone Number" value={user?.phone} />
            <InfoRow icon={Shield} label="Gender" value={user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : ''} />
            <InfoRow icon={Calendar} label="Member Since" value={joinDate} />
          </div>

          {/* Actions */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Actions</h2>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-400 border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 transition-all font-medium"
            >
              <LogOut size={18} />
              Sign Out of NexChat
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

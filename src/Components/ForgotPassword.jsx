import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      const { data } = await API.post('/forgotPassword', { email });
      if (data.status) { setSent(true); toast.success('Reset link sent!'); }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] top-[-100px] left-[-200px] opacity-20"
        style={{ background: 'radial-gradient(circle,#7c3aed,transparent)' }} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10">
        <button onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft size={16} /> Back to login
        </button>
        <div className="glass-card p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-black text-white mb-4"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>N</div>
            <h1 className="text-2xl font-bold text-white">Forgot Password?</h1>
            <p className="text-slate-400 text-sm mt-1 text-center">
              Enter your email and we'll send you a reset link.
            </p>
          </div>
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="font-semibold text-white mb-2">Check your email</h3>
              <p className="text-slate-400 text-sm mb-6">We sent a reset link to <strong className="text-violet-400">{email}</strong></p>
              <Link to="/login" className="btn-primary inline-flex">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com" className="input-field pl-10" required />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  : <><Send size={16} /> Send Reset Link</>}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

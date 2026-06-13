import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone || !form.password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back! 🎉');
      navigate('/chat');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Orbs */}
      <div className="orb w-[500px] h-[500px] top-[-100px] left-[-200px] opacity-20"
        style={{ background: 'radial-gradient(circle,#7c3aed,transparent)' }} />
      <div className="orb w-[400px] h-[400px] bottom-[-100px] right-[-150px] opacity-15"
        style={{ background: 'radial-gradient(circle,#06b6d4,transparent)', animationDelay: '3s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Back to home
        </button>

        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-black text-white mb-4"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>N</div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to continue to NexChat</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <><LogIn size={18} /> Sign In</>
              )}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

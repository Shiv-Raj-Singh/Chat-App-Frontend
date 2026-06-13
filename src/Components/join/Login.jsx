import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  // DOM ref for password toggle — zero re-renders when showing/hiding
  const passRef = useRef(null);
  const eyeRef = useRef(null);
  const showPassRef = useRef(false);

  const togglePass = useCallback(() => {
    showPassRef.current = !showPassRef.current;
    if (passRef.current) passRef.current.type = showPassRef.current ? 'text' : 'password';
    if (eyeRef.current) eyeRef.current.textContent = showPassRef.current ? '🙈' : '👁️';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const phone = fd.get('phone')?.trim();
    const password = fd.get('password');

    if (!phone || !password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      await login({ phone, password });
      toast.success('Welcome back!');
      navigate('/chat');
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Static blobs — no animation = no GPU repaint while keyboard is visible */}
      <div className="absolute top-[-100px] left-[-200px] w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle,#7c3aed,transparent)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[-100px] right-[-150px] w-[400px] h-[400px] rounded-full pointer-events-none opacity-15"
        style={{ background: 'radial-gradient(circle,#06b6d4,transparent)', filter: 'blur(80px)' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <button onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft size={16} /> Back to home
        </button>

        <div className="glass-card p-8">
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
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                placeholder="Enter your phone number"
                autoComplete="tel"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                className="input-field"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input
                  ref={passRef}
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="input-field pr-11"
                  required
                />
                <button type="button" ref={eyeRef} onClick={togglePass}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-base leading-none">
                  👁️
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password"
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                Forgot password?
              </Link>
            </div>

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

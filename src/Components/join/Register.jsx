import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

// React.memo + no value/onChange = zero React DOM contact during typing
const Field = React.memo(function Field({ label, name, type, placeholder, inputMode, autoComplete, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <div className="relative">
        {children || (
          <input
            name={name}
            type={type || 'text'}
            placeholder={placeholder}
            inputMode={inputMode}
            autoComplete={autoComplete || 'off'}
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck="false"
            className="input-field"
            required
          />
        )}
      </div>
    </div>
  );
});

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [gender, setGender] = useState('male');
  const [loading, setLoading] = useState(false);

  // Use DOM refs so toggling show/hide password NEVER causes a re-render
  const passRef = useRef(null);
  const cPassRef = useRef(null);
  const eyeRef = useRef(null);
  const showPassRef = useRef(false);

  const togglePass = useCallback(() => {
    showPassRef.current = !showPassRef.current;
    const t = showPassRef.current ? 'text' : 'password';
    if (passRef.current) passRef.current.type = t;
    if (cPassRef.current) cPassRef.current.type = t;
    if (eyeRef.current) eyeRef.current.textContent = showPassRef.current ? '🙈' : '👁️';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const form = {
      name: fd.get('name')?.trim(),
      phone: fd.get('phone')?.trim(),
      email: fd.get('email')?.trim(),
      password: fd.get('password'),
      cPassword: fd.get('cPassword'),
      gender,
    };

    if (!form.name || !form.phone || !form.email || !form.password)
      return toast.error('Please fill in all fields');
    if (form.password !== form.cPassword)
      return toast.error('Passwords do not match');
    if (form.password.length < 8)
      return toast.error('Password must be at least 8 characters');

    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to NexChat');
      navigate('/chat');
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Static gradient blobs — no animation so no GPU repaints while typing */}
      <div className="absolute top-[-100px] right-[-200px] w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle,#7c3aed,transparent)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[-100px] left-[-150px] w-[400px] h-[400px] rounded-full pointer-events-none opacity-15"
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
            <h1 className="text-2xl font-bold text-white">Create account</h1>
            <p className="text-slate-400 text-sm mt-1">Join NexChat and start chatting</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name" name="name" placeholder="John Doe"
              autoComplete="name" />
            <Field label="Phone Number" name="phone" placeholder="9XXXXXXXXX"
              type="tel" inputMode="tel" autoComplete="tel" />
            <Field label="Email Address" name="email" placeholder="john@example.com"
              type="email" inputMode="email" autoComplete="email" />

            {/* Gender — isolated state, doesn't re-render any input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Gender</label>
              <div className="grid grid-cols-3 gap-2">
                {['male', 'female', 'other'].map((g) => (
                  <button key={g} type="button" onClick={() => setGender(g)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-colors capitalize border ${
                      gender === g
                        ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                        : 'border-slate-700 bg-dark-700 text-slate-400 hover:border-slate-600'
                    }`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Password — DOM ref toggle, zero re-renders */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input
                  ref={passRef}
                  name="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className="input-field pr-11"
                  required
                />
                <button type="button" onClick={togglePass}
                  ref={eyeRef}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-base leading-none">
                  👁️
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  ref={cPassRef}
                  name="cPassword"
                  type="password"
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3.5 mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                <><UserPlus size={18} /> Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

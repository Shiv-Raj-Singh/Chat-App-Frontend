import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

// Defined OUTSIDE to prevent focus loss on every keystroke
const InputRow = ({ label, icon: Icon, name, type, placeholder, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
    <div className="relative">
      <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        name={name}
        type={type || 'text'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field pl-10"
        required
      />
    </div>
  </div>
);

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', cPassword: '', gender: 'male' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.password) return toast.error('Please fill in all fields');
    if (form.password !== form.cPassword) return toast.error('Passwords do not match');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to NexChat 🎉');
      navigate('/chat');
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] top-[-100px] right-[-200px] opacity-20"
        style={{ background: 'radial-gradient(circle,#7c3aed,transparent)' }} />
      <div className="orb w-[400px] h-[400px] bottom-[-100px] left-[-150px] opacity-15"
        style={{ background: 'radial-gradient(circle,#06b6d4,transparent)', animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
            <InputRow label="Full Name"     icon={User}  name="name"  placeholder="John Doe"       value={form.name}  onChange={handleChange} />
            <InputRow label="Phone Number"  icon={Phone} name="phone" placeholder="9XXXXXXXXX" type="tel"  value={form.phone} onChange={handleChange} />
            <InputRow label="Email Address" icon={Mail}  name="email" placeholder="john@example.com" type="email" value={form.email} onChange={handleChange} />

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Gender</label>
              <div className="grid grid-cols-3 gap-2">
                {['male', 'female', 'other'].map((g) => (
                  <button key={g} type="button" onClick={() => setForm((prev) => ({ ...prev, gender: g }))}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all capitalize border ${
                      form.gender === g
                        ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                        : 'border-slate-700 bg-dark-700 text-slate-400 hover:border-slate-600'
                    }`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input name="password" type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={handleChange} placeholder="Min. 8 characters" className="input-field pl-10 pr-11" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input name="cPassword" type={showPass ? 'text' : 'password'} value={form.cPassword}
                  onChange={handleChange} placeholder="Repeat your password" className="input-field pl-10" required />
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

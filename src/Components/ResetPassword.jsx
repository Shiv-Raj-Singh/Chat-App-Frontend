import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ password: '', cPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.cPassword) return toast.error('Passwords do not match');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    setLoading(true);
    try {
      const { data } = await API.put(`/resetPassword/${id}`, form);
      if (data.status) {
        toast.success('Password updated! Please login.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] top-[-100px] right-[-200px] opacity-20"
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
            <h1 className="text-2xl font-bold text-white">Reset Password</h1>
            <p className="text-slate-400 text-sm mt-1">Choose a new secure password</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {['password', 'cPassword'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {field === 'password' ? 'New Password' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type={showPass ? 'text' : 'password'} value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    placeholder="Min. 8 characters" className="input-field pl-10 pr-11" required />
                  {field === 'password' && (
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                : 'Reset Password'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

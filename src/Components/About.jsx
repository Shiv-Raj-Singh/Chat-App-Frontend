import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageCircle, Zap, Shield, Users, Hash, Globe, Heart, Mail,
  Send, ArrowLeft, Code, Sparkles, Lock, UserCheck, Bot,
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
};

const features = [
  { icon: Zap,      color: '#f59e0b', title: 'Real-time Messaging',  desc: 'WebSocket-powered instant delivery — no polling, no lag.' },
  { icon: Hash,     color: '#7c3aed', title: 'Topic Rooms',           desc: 'Create rooms with member limits, invite links, and emoji icons.' },
  { icon: Shield,   color: '#10b981', title: 'Secure by Default',     desc: 'JWT authentication and bcrypt-hashed passwords.' },
  { icon: Globe,    color: '#06b6d4', title: 'Live Presence',         desc: 'See who\'s online across all rooms in real time.' },
  { icon: UserCheck, color: '#ec4899', title: 'Admin Controls',       desc: 'Room creators can kick, block, and delete their rooms.' },
  { icon: Bot,      color: '#8b5cf6', title: 'Smart Bots',            desc: 'Friendly bots keep conversations going 24/7.' },
  { icon: Lock,     color: '#ef4444', title: 'Room Privacy',          desc: 'Restrict room size and block unwanted users.' },
  { icon: Code,     color: '#3b82f6', title: 'Modern Stack',          desc: 'React 18 · Node.js · MongoDB · Socket.IO · Tailwind.' },
];

export default function About() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleContact = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      name: fd.get('name')?.trim(),
      email: fd.get('email')?.trim(),
      message: fd.get('message')?.trim(),
    };
    if (!payload.name || !payload.email || !payload.message) {
      return toast.error('Please fill in all fields');
    }
    setLoading(true);
    try {
      await API.post('/contact', payload);
      toast.success('Message sent! We\'ll get back to you soon 🎉');
      e.target.reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 overflow-x-hidden relative">
      {/* Background orbs */}
      <div className="orb w-[500px] h-[500px] top-[-150px] right-[-150px] opacity-15"
        style={{ background: 'radial-gradient(circle,#7c3aed,transparent)' }} />
      <div className="orb w-[400px] h-[400px] bottom-[-100px] left-[-100px] opacity-10"
        style={{ background: 'radial-gradient(circle,#06b6d4,transparent)', animationDelay: '3s' }} />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>N</div>
          <span className="text-lg font-bold text-white">Nex<span className="gradient-text">Chat</span></span>
        </div>
        <button onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
          <ArrowLeft size={15} /> Back to home
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-20 pb-16">
        <motion.div variants={fadeUp} initial="hidden" animate="show"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium text-violet-300"
          style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}>
          <Sparkles size={13} className="text-violet-400" /> About NexChat
        </motion.div>

        <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="show"
          className="text-4xl md:text-6xl font-black text-white mb-5">
          Built for <span className="gradient-text">real connections.</span>
        </motion.h1>

        <motion.p custom={2} variants={fadeUp} initial="hidden" animate="show"
          className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          NexChat is a modern, open real-time chat platform crafted from the ground up — clean design,
          powerful features, and a dark aesthetic that makes conversations feel great.
        </motion.p>
      </section>

      {/* Features grid */}
      <section className="relative z-10 px-6 md:px-12 pb-20 max-w-6xl mx-auto">
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
          What makes NexChat different
        </motion.h2>
        <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-slate-400 text-center mb-10 text-sm">
          Every feature is thoughtfully built, not bolted on.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title} custom={i % 4} variants={fadeUp} initial="hidden"
              whileInView="show" viewport={{ once: true }} whileHover={{ y: -3 }}
              className="glass-card p-5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${f.color}18` }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold text-white text-sm">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Creator / Story */}
      <section className="relative z-10 px-6 md:px-12 pb-20">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="glass-card p-8 md:p-10 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
              <Heart size={28} className="text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">The story</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              NexChat was built by an indie developer who wanted a chat app that was beautiful
              without being bloated, real-time without being complicated, and open without being unsafe.
            </p>
            <p className="text-slate-400 leading-relaxed mb-6">
              Every line — from the WebSocket logic to the glassmorphism cards — was written with care.
              No UI kits. No shortcuts. Just clean code and a dark theme done right.
            </p>
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
              <Code size={14} />
              <span>React · Node.js · Socket.IO · MongoDB · Tailwind CSS</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact form */}
      <section className="relative z-10 px-6 md:px-12 pb-24">
        <div className="max-w-lg mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
                <Mail size={22} className="text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Get in touch</h2>
              <p className="text-slate-400 text-sm text-center">
                Found a bug? Have a suggestion? Want to collaborate? Drop a message — we read everything.
              </p>
            </div>

            <form onSubmit={handleContact} className="glass-card p-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                <input
                  name="name"
                  type="text"
                  defaultValue=""
                  placeholder="John Doe"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input
                  name="email"
                  type="email"
                  defaultValue=""
                  placeholder="john@example.com"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell us what's on your mind…"
                  defaultValue=""
                  className="input-field resize-none"
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending…
                  </span>
                ) : (
                  <><Send size={16} /> Send Message</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 border-t border-slate-800 text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-4 mb-3">
          <button onClick={() => navigate('/')} className="hover:text-slate-300 transition-colors">Home</button>
          <span>·</span>
          <button onClick={() => navigate('/register')} className="hover:text-slate-300 transition-colors">Sign Up</button>
          <span>·</span>
          <button onClick={() => navigate('/login')} className="hover:text-slate-300 transition-colors">Sign In</button>
        </div>
        <span>© 2024 </span>
        <span className="gradient-text font-semibold">NexChat</span>
        <span> — Built with </span>
        <Heart size={12} className="inline text-red-400" />
        <span> for real connections.</span>
      </footer>
    </div>
  );
}

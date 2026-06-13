import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Zap, Shield, Users, ArrowRight, Hash, Globe, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Real-time messages delivered instantly with WebSockets.', color: '#f59e0b' },
  { icon: Shield, title: 'Secure Auth', desc: 'JWT-based authentication keeps your account safe.', color: '#10b981' },
  { icon: Hash, title: 'Multiple Rooms', desc: 'Create and join topic-specific chat rooms freely.', color: '#7c3aed' },
  { icon: Globe, title: 'Always Online', desc: 'See who\'s online with real-time presence indicators.', color: '#06b6d4' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.55, ease: 'easeOut' } }),
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-900 overflow-hidden relative">
      {/* Background orbs */}
      <div className="orb w-[600px] h-[600px] top-[-200px] left-[-200px] opacity-20"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="orb w-[500px] h-[500px] bottom-[-150px] right-[-150px] opacity-15 animation-delay-2000"
        style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', animationDelay: '2s' }} />
      <div className="orb w-[300px] h-[300px] top-[40%] left-[60%] opacity-10"
        style={{ background: 'radial-gradient(circle, #ec4899, transparent)', animationDelay: '4s' }} />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>N</div>
          <span className="text-xl font-bold text-white">Nex<span className="gradient-text">Chat</span></span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          {user ? (
            <button className="btn-primary px-5 py-2.5 text-sm" onClick={() => navigate('/chat')}>
              Open Chat <ArrowRight size={15} />
            </button>
          ) : (
            <>
              <button className="btn-ghost text-sm" onClick={() => navigate('/login')}>Sign In</button>
              <button className="btn-primary text-sm" onClick={() => navigate('/register')}>
                Get Started <ArrowRight size={15} />
              </button>
            </>
          )}
        </motion.div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium text-violet-300"
          style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}
        >
          <Sparkles size={14} className="text-violet-400" />
          Real-time chat, reimagined
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 max-w-4xl"
        >
          Connect.{' '}
          <span className="gradient-text">Chat.</span>
          <br />Celebrate.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed"
        >
          The most beautiful real-time chat experience. Join rooms, meet people, and chat instantly
          with a stunning dark-themed interface built for the modern web.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            className="btn-primary text-base px-8 py-4 text-lg"
            onClick={() => navigate(user ? '/chat' : '/register')}
          >
            <MessageCircle size={20} />
            {user ? 'Open Chat' : 'Start Chatting Free'}
          </button>
          {!user && (
            <button className="btn-ghost text-base px-8 py-4" onClick={() => navigate('/login')}>
              Already have an account?
            </button>
          )}
        </motion.div>

        {/* Mock chat preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-20 w-full max-w-3xl glass-card p-0 overflow-hidden shadow-2xl"
          style={{ boxShadow: '0 40px 100px rgba(124,58,237,0.2)' }}
        >
          {/* Mock header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
            <div className="flex gap-1.5">
              {['#ef4444','#f59e0b','#10b981'].map(c => (
                <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <div className="flex items-center gap-2 ml-3 text-slate-400 text-sm">
              <Hash size={14} />
              <span>general</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              3 online
            </div>
          </div>
          {/* Mock messages */}
          <div className="p-5 space-y-4">
            {[
              { name: 'Alice', color: '#7c3aed', msg: 'Hey everyone! 👋 Just joined NexChat!', sent: false },
              { name: 'Bob', color: '#06b6d4', msg: 'Welcome! This app is super clean 🔥', sent: false },
              { name: 'You', color: '#ec4899', msg: 'Loving the dark theme! Really sleek design 💜', sent: true },
            ].map((m, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className={`flex items-end gap-3 ${m.sent ? 'flex-row-reverse' : ''}`}
              >
                <div className="avatar w-8 h-8 text-xs flex-shrink-0" style={{ background: m.color }}>
                  {m.name[0]}
                </div>
                <div className={m.sent ? 'message-bubble-sent px-4 py-2.5 text-sm text-white max-w-xs' : 'message-bubble-received px-4 py-2.5 text-sm text-slate-100 max-w-xs'}>
                  {!m.sent && <div className="text-xs font-semibold mb-1" style={{ color: m.color }}>{m.name}</div>}
                  {m.msg}
                </div>
              </motion.div>
            ))}
            {/* Typing */}
            <div className="flex items-center gap-3">
              <div className="avatar w-8 h-8 text-xs" style={{ background: '#10b981' }}>C</div>
              <div className="bg-dark-600 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </div>
              <span className="text-xs text-slate-500">Carol is typing…</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
        >
          Everything you need
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-slate-400 text-center mb-12"
        >
          Powerful features wrapped in a beautiful, minimal interface.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass-card p-6 flex flex-col gap-4 cursor-default"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${f.color}20` }}>
                <f.icon size={22} style={{ color: f.color }} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass-card p-12"
          style={{ boxShadow: '0 20px 60px rgba(124,58,237,0.15)' }}
        >
          <Users size={40} className="mx-auto mb-5 text-violet-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to join the conversation?
          </h2>
          <p className="text-slate-400 mb-8">
            Create your free account in seconds and start chatting right away.
          </p>
          <button
            className="btn-primary text-lg px-10 py-4"
            onClick={() => navigate(user ? '/chat' : '/register')}
          >
            {user ? 'Open Chat' : 'Create Free Account'}
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 border-t border-slate-800 text-slate-500 text-sm">
        <span>© 2024 </span>
        <span className="gradient-text font-semibold">NexChat</span>
        <span> — Built with ❤️ for real connections.</span>
      </footer>
    </div>
  );
}

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  Activity, 
  AlertCircle,
  Stethoscope,
  Users
} from 'lucide-react';
import { api } from '../lib/api';
import { User as UserType } from '../types';

interface AuthPageProps {
  onSuccess: (user: UserType) => void;
  onBack: () => void;
}

export default function AuthPage({ onSuccess, onBack }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let user;
      if (isLogin) {
        user = await api.login({ email: formData.email, password: formData.password });
      } else {
        user = await api.register({ ...formData, role });
      }
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      {/* Left Decoration (Desktop Only) */}
      <div className="hidden lg:flex flex-1 bg-teal-600 p-20 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-3 relative z-10">
          <button onClick={onBack} className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center transition-colors">
            <Activity size={24} />
          </button>
          <span className="font-bold text-2xl tracking-tight text-white">CuraHealth</span>
        </div>

        <div className="relative z-10 text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold mb-8 leading-tight"
          >
            Empowering <br /> Better Health <br /> Outcomes.
          </motion.h2>
          <p className="text-teal-100 text-lg max-w-md leading-relaxed">
            Join thousands of specialized medical practitioners and proactive patients in a unified healthcare ecosystem.
          </p>
        </div>

        <div className="relative z-10 flex gap-4">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/5 flex-1">
            <p className="text-white font-bold text-2xl">4.9/5</p>
            <p className="text-teal-100 text-sm">Rating from Google Play</p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/5 flex-1">
            <p className="text-white font-bold text-2xl">100k+</p>
            <p className="text-teal-100 text-sm">Active Patient Directives</p>
          </div>
        </div>
      </div>

      {/* Right Content Surface */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-white lg:bg-transparent">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white">
              <Activity size={24} />
            </div>
            <span className="font-bold text-2xl text-slate-800">CuraHealth</span>
          </div>

          <header className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-slate-500 font-medium">
              {isLogin 
                ? 'Sign in to access your dashboard and records.' 
                : 'Join our healthcare network today.'}
            </p>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <button 
                      type="button"
                      onClick={() => setRole('patient')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        role === 'patient' 
                          ? 'border-teal-600 bg-teal-50 text-teal-700' 
                          : 'border-slate-100 bg-slate-50 text-slate-400 grayscale'
                      }`}
                    >
                      <Users size={24} />
                      <span className="text-xs font-bold uppercase tracking-widest leading-none">I'm a Patient</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setRole('doctor')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        role === 'doctor' 
                          ? 'border-teal-600 bg-teal-50 text-teal-700' 
                          : 'border-slate-100 bg-slate-50 text-slate-400 grayscale'
                      }`}
                    >
                      <Stethoscope size={24} />
                      <span className="text-xs font-bold uppercase tracking-widest leading-none">I'm a Doctor</span>
                    </button>
                  </div>
                )}

                {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. John Doe"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-12 py-3.5 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      required
                      type="email" 
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-12 py-3.5 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                    {isLogin && <button type="button" className="text-xs font-bold text-teal-600 hover:underline">Forgot?</button>}
                  </div>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-12 py-3.5 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-700 text-sm font-medium"
                  >
                    <AlertCircle size={18} className="shrink-0" />
                    {error}
                  </motion.div>
                )}

                <button 
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-teal-100 flex items-center justify-center gap-2 transition-all hover:bg-teal-700 hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Activity className="animate-spin" size={20} />
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                <p className="text-center text-slate-500 text-sm mt-8">
                  {isLogin ? "Don't have an account?" : "Already member?"}{' '}
                  <button 
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-teal-600 font-bold hover:underline"
                  >
                    {isLogin ? 'Sign Up' : 'Log In'}
                  </button>
                </p>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

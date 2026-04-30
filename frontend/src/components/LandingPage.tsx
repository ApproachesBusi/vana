import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Clock, 
  Users, 
  ArrowRight, 
  Activity, 
  Calendar, 
  CreditCard,
  ChevronRight,
  Heart
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onBookNow: () => void;
}

export default function LandingPage({ onGetStarted, onBookNow }: LandingPageProps) {
  const features = [
    {
      title: "Smart Scheduling",
      desc: "Real-time doctor availability and automated booking system for patients.",
      icon: Calendar,
      color: "bg-teal-50 text-teal-600"
    },
    {
      title: "Patient Records",
      desc: "Secure, encrypted storage of medical history, prescriptions, and allergies.",
      icon: Users,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Financial Analytics",
      desc: "Automated billing, insurance tracking, and comprehensive financial reporting.",
      icon: CreditCard,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "AI Voice Scribe",
      desc: "Next-gen speech-to-text dictation for doctors to streamline clinical notes.",
      icon: Activity,
      color: "bg-rose-50 text-rose-600"
    }
  ];

  return (
    <div className="bg-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-100">
              <Activity size={24} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-800">CuraHealth</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <a href="#features" className="hover:text-teal-600 transition-colors">Features</a>
            <a href="#services" className="hover:text-teal-600 transition-colors">Services</a>
            <a href="#contact" className="hover:text-teal-600 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onGetStarted}
              className="text-slate-600 font-bold text-sm hover:text-teal-600 transition-colors"
            >
              Log In
            </button>
            <button 
              onClick={onGetStarted}
              className="bg-teal-600 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-teal-100 transition-all hover:bg-teal-700 hover:scale-105 active:scale-95"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <Heart size={14} /> The Future of Clinic Management
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8">
              A Smarter Way to <span className="text-teal-600">Care</span> for Your Patients.
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10">
              Streamline your medical facility with a comprehensive platform for records, scheduling, billing, and AI-powered clinical notes. Designed for modern healthcare providers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto bg-teal-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-teal-100 flex items-center justify-center gap-2 transition-all hover:bg-teal-700 hover:translate-y-[-2px] active:translate-y-0"
              >
                Get Started Now <ArrowRight size={20} />
              </button>
              <button 
                onClick={onBookNow}
                className="w-full sm:w-auto bg-white text-slate-800 px-8 py-4 rounded-2xl font-bold text-lg border border-slate-200 shadow-sm flex items-center justify-center gap-2 transition-all hover:bg-slate-50"
              >
                Book Appointment
              </button>
            </div>
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 grayscale opacity-50">
              <div className="flex items-center gap-2 font-black text-xl tracking-tighter">TRUSTED CLINICS</div>
              <div className="flex items-center gap-2 font-black text-xl tracking-tighter">MED-CORP</div>
              <div className="flex items-center gap-2 font-black text-xl tracking-tighter">HEALTH-HUB</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200" 
                alt="Modern Hospital Management" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
            </div>
            {/* Float Cards */}
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -left-8 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">SECURE DATA</p>
                <p className="font-bold text-slate-800">HIPAA Compliant</p>
              </div>
            </motion.div>
            <motion.div 
              animate={{ y: [0, 15, 0] }} 
              transition={{ repeat: Infinity, duration: 5, delay: 0.5 }}
              className="absolute -right-8 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">REAL-TIME</p>
                <p className="font-bold text-slate-800">Smart Scheduling</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Unified Healthcare Management</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to run a high-performance clinic, optimized for efficiency and patient satisfaction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:border-teal-200 group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-6 ${f.color}`}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-slate-900 mb-8 leading-tight">Built for Performance and Patient Care.</h2>
            <div className="space-y-6">
              {[
                { title: "Reduced Administrative Load", desc: "Automate 80% of manual entry and record management with our intuitive tools." },
                { title: "Enhanced Data Privacy", desc: "Military-grade encryption for all patient data and communication channels." },
                { title: "Scale with Ease", desc: "From small clinics to multi-branch hospitals, our architecture grows with you." }
              ].map((b, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mt-1">
                    <ChevronRight size={14} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg mb-1">{b.title}</h4>
                    <p className="text-slate-500 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={onGetStarted}
              className="mt-12 group flex items-center gap-2 text-teal-600 font-bold transition-all hover:gap-4"
            >
              Explore all benefits <ArrowRight size={20} />
            </button>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
               <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600" className="rounded-3xl shadow-lg mt-12" alt="Surgery" />
               <img src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=600" className="rounded-3xl shadow-lg" alt="Doctor" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 max-w-4xl leading-[1.1] relative z-10">
            Ready to Transform Your Clinic Operations?
          </h2>
          <p className="text-slate-400 text-xl max-w-2xl mb-12 relative z-10">
            Join 500+ healthcare facilities using CuraHealth to deliver superior patient care today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <button 
              onClick={onGetStarted}
              className="bg-teal-500 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-teal-900/20 hover:bg-teal-400 transition-all"
            >
              Create Your Account
            </button>
            <button className="bg-white/10 text-white px-10 py-4 rounded-2xl font-bold text-lg border border-white/10 hover:bg-white/20 transition-all">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white">
              <Activity size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">CuraHealth</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 CuraHealth Inc. All rights reserved. Professional healthcare solutions.</p>
        </div>
      </footer>
    </div>
  );
}

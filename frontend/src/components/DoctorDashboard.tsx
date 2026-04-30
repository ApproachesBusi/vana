import { 
  Activity, 
  Users, 
  Calendar, 
  CreditCard, 
  Database, 
  Mic, 
  LayoutDashboard,
  LogOut,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppData, User } from '../types';

// Components
import Dashboard from './Dashboard';
import Patients from './Patients';
import Appointments from './Appointments';
import Billing from './Billing';
import Resources from './Resources';
import VoiceNotes from './VoiceNotes';
import { useState } from 'react';

interface DoctorDashboardProps {
  user: User;
  data: AppData;
  onRefresh: () => void;
  onLogout: () => void;
}

type Tab = 'dashboard' | 'patients' | 'appointments' | 'billing' | 'resources' | 'voice';

export default function DoctorDashboard({ user, data, onRefresh, onLogout }: DoctorDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Schedule', icon: Calendar },
    { id: 'billing', label: 'Financials', icon: CreditCard },
    { id: 'resources', label: 'Resources', icon: Database },
    { id: 'voice', label: 'Voice Notes', icon: Mic },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-white border-r border-slate-200 flex flex-col z-20"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-teal-100">
            <Activity size={24} />
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-xl tracking-tight text-slate-800 uppercase">CuraHealth</span>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-teal-600' : 'group-hover:text-slate-700'} />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                {isActive && isSidebarOpen && (
                  <motion.div 
                    layoutId="activeSide"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-600"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            {isSidebarOpen && <span className="font-medium">Collapse Menu</span>}
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-2"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 w-full max-w-md">
            <Search size={18} className="text-slate-400" />
            <input 
              type="search" 
              placeholder="Search patients, records, or help..." 
              className="bg-transparent border-none outline-none w-full text-sm text-slate-600 placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-slate-800 transition-colors p-2 hover:bg-slate-50 rounded-full">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-10 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-teal-100 border-2 border-white shadow-sm overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Profile" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Surface */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              {activeTab === 'dashboard' && <Dashboard data={data} onRefresh={onRefresh} />}
              {activeTab === 'patients' && <Patients data={data} onRefresh={onRefresh} />}
              {activeTab === 'appointments' && <Appointments data={data} onRefresh={onRefresh} />}
              {activeTab === 'billing' && <Billing data={data} onRefresh={onRefresh} />}
              {activeTab === 'resources' && <Resources data={data} onRefresh={onRefresh} />}
              {activeTab === 'voice' && <VoiceNotes data={data} onRefresh={onRefresh} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

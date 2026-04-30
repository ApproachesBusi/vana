/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from './lib/api';
import { AppData, User } from './types';

// Components
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import DoctorDashboard from './components/DoctorDashboard';
import PatientPortal from './components/PatientPortal';

type View = 'landing' | 'auth' | 'dashboard';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
    // Simple session persistence check
    const savedUser = localStorage.getItem('curahealth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('dashboard');
    }
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const allData = await api.getAllData();
      setData(allData);
    } catch (error) {
      console.error("Failed to load initial data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    localStorage.setItem('curahealth_user', JSON.stringify(authenticatedUser));
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('curahealth_user');
    setView('landing');
  };

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <Activity className="w-12 h-12 text-teal-600 animate-pulse" />
          <p className="text-slate-500 font-bold font-sans tracking-widest text-xs uppercase">Initializing CuraHealth...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans text-slate-900">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage 
              onGetStarted={() => setView('auth')} 
              onBookNow={() => setView('auth')} 
            />
          </motion.div>
        )}

        {view === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <AuthPage 
              onSuccess={handleAuthSuccess} 
              onBack={() => setView('landing')} 
            />
          </motion.div>
        )}

        {view === 'dashboard' && user && data && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-screen overflow-hidden"
          >
            {user.role === 'doctor' ? (
              <DoctorDashboard 
                user={user} 
                data={data} 
                onRefresh={loadInitialData} 
                onLogout={handleLogout} 
              />
            ) : (
              <PatientPortal 
                user={user} 
                data={data} 
                onRefresh={loadInitialData} 
                onLogout={handleLogout} 
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

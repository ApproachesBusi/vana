import { useState, FormEvent } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Activity, 
  Plus, 
  LogOut, 
  ChevronRight,
  Stethoscope,
  Heart,
  History,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppData, User, Appointment } from '../types';
import { api } from '../lib/api';
import { format } from 'date-fns';

interface PatientPortalProps {
  user: User;
  data: AppData;
  onRefresh: () => void;
  onLogout: () => void;
}

export default function PatientPortal({ user, data, onRefresh, onLogout }: PatientPortalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'booking'>('overview');
  const patient = data.patients.find(p => p.id === user.patientId);
  const appointments = data.appointments.filter(a => a.patientId === user.patientId);
  
  const [newAppt, setNewAppt] = useState({
    doctorId: 'd1',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    type: 'Check-up',
    reason: ''
  });

  const handleBooking = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.addAppointment({
        patientId: user.patientId!,
        doctorId: newAppt.doctorId,
        date: newAppt.date,
        time: newAppt.time,
        type: newAppt.type,
        status: 'Scheduled'
      });
      alert('Appointment booked successfully!');
      setActiveTab('overview');
      onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      {/* Patient Nav */}
      <nav className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white">
            <Activity size={24} />
          </div>
          <span className="font-bold text-2xl text-slate-800">CuraHealth</span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`font-semibold text-sm transition-colors ${activeTab === 'overview' ? 'text-teal-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('booking')}
            className={`font-semibold text-sm transition-colors ${activeTab === 'booking' ? 'text-teal-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            My Appointments
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <button onClick={onLogout} className="text-rose-500 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full p-8">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900">Hello, {user.name}</h1>
          <p className="text-slate-500 mt-2">Manage your medical journey and health directives.</p>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <button 
                  onClick={() => setActiveTab('booking')}
                  className="bg-teal-600 p-6 rounded-3xl text-white shadow-xl shadow-teal-100 text-left relative overflow-hidden group hover:scale-[1.02] transition-all"
                 >
                   <Plus size={32} className="mb-4 text-teal-200" />
                   <h3 className="text-xl font-bold mb-1">Book Appointment</h3>
                   <p className="text-teal-100 text-sm opacity-80">Choose your preferred doctor and time.</p>
                   <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
                 </button>

                 <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                   <Heart size={32} className="mb-4 text-rose-500" />
                   <h3 className="text-xl font-bold text-slate-800 mb-1">My Health Summary</h3>
                   <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded tracking-widest">{patient?.history || 'N/A'}</span>
                      <span className="px-2 py-1 bg-rose-50 text-rose-600 text-[10px] font-black uppercase rounded tracking-widest">Allergies: {patient?.allergies || 'None'}</span>
                   </div>
                 </div>

                 <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div className="absolute right-0 top-0 p-4 opacity-5">
                      <FileText size={120} />
                   </div>
                   <History size={32} className="mb-4 text-blue-500" />
                   <h3 className="text-xl font-bold text-slate-800 mb-1">Invoices</h3>
                   <p className="text-slate-500 text-sm">View and download your payment history.</p>
                   <button className="mt-4 text-sm font-bold text-teal-600 flex items-center gap-1">
                      View all records <ChevronRight size={16} />
                   </button>
                 </div>
              </div>

              {/* Upcoming Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Calendar className="text-teal-600" /> 
                    Upcoming Visits
                  </h3>
                  <div className="space-y-4">
                    {appointments.filter(a => a.status === 'Scheduled').length === 0 ? (
                      <div className="text-center py-10 opacity-50 italic text-slate-500">No upcoming appointments scheduled.</div>
                    ) : (
                      appointments.filter(a => a.status === 'Scheduled').map(appt => {
                        const doctor = data.doctors.find(d => d.id === appt.doctorId);
                        return (
                          <div key={appt.id} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-teal-200 transition-colors">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm">
                              <Stethoscope size={24} />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-slate-800">{doctor?.name}</p>
                              <p className="text-xs text-slate-500 font-medium">{appt.type} • Room 102</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-800">{format(new Date(appt.date), 'MMM d')}</p>
                              <p className="text-xs text-slate-500">{appt.time}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                    <p className="text-slate-400 mb-6">Our patient support team is available 24/7 for critical medical inquiries.</p>
                    <button className="bg-teal-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-400 transition-colors shadow-lg shadow-teal-900">
                      Contact Support
                    </button>
                    <div className="mt-8 pt-8 border-t border-white/10 flex gap-8">
                       <div>
                         <p className="text-teal-400 font-black text-2xl">24/7</p>
                         <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Care</p>
                       </div>
                       <div>
                         <p className="text-teal-400 font-black text-2xl">98%</p>
                         <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Satisfaction</p>
                       </div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-0 w-2 h-24 bg-teal-500 rounded-full blur-xl group-hover:h-32 transition-all"></div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="booking"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-800">New Booking</h2>
                <button onClick={() => setActiveTab('overview')} className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
              </div>

              <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Choose Specialist</label>
                       <select 
                         required
                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-bold text-slate-700 h-16 appearance-none"
                         value={newAppt.doctorId}
                         onChange={e => setNewAppt({...newAppt, doctorId: e.target.value})}
                       >
                         {data.doctors.map(d => (
                           <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                         ))}
                       </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Date</label>
                         <input 
                           required
                           type="date" 
                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-bold"
                           value={newAppt.date}
                           onChange={e => setNewAppt({...newAppt, date: e.target.value})}
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Preferred Time</label>
                         <input 
                           required
                           type="time" 
                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-bold"
                           value={newAppt.time}
                           onChange={e => setNewAppt({...newAppt, time: e.target.value})}
                         />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Visit Type</label>
                       <div className="grid grid-cols-2 gap-3">
                          {['Check-up', 'Consultation', 'Follow-up', 'Lab Results'].map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setNewAppt({...newAppt, type})}
                              className={`py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                                newAppt.type === type 
                                  ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-md translate-y-[-2px]' 
                                  : 'border-slate-100 bg-white text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Reason for Visit (Medical Context)</label>
                       <textarea 
                         placeholder="Briefly describe your symptoms or reason for the visit..."
                         className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-6 py-6 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium h-48 resize-none"
                         value={newAppt.reason}
                         onChange={e => setNewAppt({...newAppt, reason: e.target.value})}
                       />
                    </div>

                    <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl">
                       <p className="text-amber-800 font-bold text-sm mb-1 flex items-center gap-2 underline decoration-amber-200 underline-offset-4">Booking Policy</p>
                       <p className="text-xs text-amber-700 leading-relaxed">Cancellations must be made at least 24 hours in advance. Failure to attend may result in a consultation fee.</p>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-teal-600 text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-teal-100 transition-all hover:bg-teal-700 hover:scale-[1.01] active:scale-95"
                    >
                      Confirm Booking Request
                    </button>
                 </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="mt-auto py-8 text-center text-slate-400 text-xs bg-slate-50 border-t border-slate-100">
        © 2026 CuraHealth Inc. • Patient Self-Service Portal
      </footer>
    </div>
  );
}

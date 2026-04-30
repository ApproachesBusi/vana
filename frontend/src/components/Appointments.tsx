import { useState, FormEvent } from 'react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity
} from 'lucide-react';
import { AppData, Appointment } from '../types';
import { api } from '../lib/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';

interface AppointmentsProps {
  data: AppData;
  onRefresh: () => void;
}

export default function Appointments({ data, onRefresh }: AppointmentsProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppt, setNewAppt] = useState<Omit<Appointment, "id">>({
    patientId: '',
    doctorId: 'd1',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    type: 'Check-up',
    status: 'Scheduled'
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const appointmentsOnSelectedDay = data.appointments.filter(a => isSameDay(new Date(a.date), selectedDate));

  const handleStatusUpdate = async (id: string, status: Appointment['status']) => {
    try {
      await api.updateAppointment(id, { status });
      onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddAppointment = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.addAppointment(newAppt);
      setShowAddModal(false);
      onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Clinic Scheduler</h1>
          <p className="text-slate-500">Manage doctor availability and patient bookings.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Book Appointment
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="xl:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">{format(currentMonth, 'MMMM yyyy')}</h3>
            <div className="flex gap-2">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <span key={day} className="text-[10px] font-bold text-slate-400 uppercase">{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Empty fills for start of month */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => <div key={`empty-${i}`} />)}
            
            {daysInMonth.map((day, i) => {
              const hasAppts = data.appointments.some(a => isSameDay(new Date(a.date), day));
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedDate(day);
                    setNewAppt({...newAppt, date: format(day, 'yyyy-MM-dd')});
                  }}
                  className={`relative h-10 w-full rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                    isSelected 
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' 
                      : isToday 
                        ? 'bg-teal-50 text-teal-600 border border-teal-100' 
                        : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {format(day, 'd')}
                  {hasAppts && !isSelected && (
                    <div className="absolute bottom-1 w-1 h-1 bg-teal-400 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 space-y-3">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Legend</h4>
             <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
               <div className="w-3 h-3 bg-teal-600 rounded-sm"></div> Selected Date
               <div className="w-3 h-3 bg-teal-50 border border-teal-100 rounded-sm"></div> Today
               <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div> Has Bookings
             </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="text-teal-600" />
              <h3 className="font-bold text-xl text-slate-800">
                Schedule for {format(selectedDate, 'MMM d, yyyy')}
              </h3>
            </div>
            <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              {appointmentsOnSelectedDay.length} Bookings
            </span>
          </div>

          <div className="space-y-4">
            {appointmentsOnSelectedDay.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                <CalendarIcon size={48} className="mx-auto text-slate-300 mb-4" />
                <h4 className="text-slate-800 font-bold mb-1">No appointments scheduled</h4>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">There are no patient bookings recorded for this date. Click 'Book Appointment' to add one.</p>
              </div>
            ) : (
              appointmentsOnSelectedDay.sort((a,b) => a.time.localeCompare(b.time)).map(appt => {
                const patient = data.patients.find(p => p.id === appt.patientId);
                const doctor = data.doctors.find(d => d.id === appt.doctorId);
                return (
                  <div key={appt.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-4 group">
                    <div className="w-16 flex flex-col items-center justify-center border-r border-slate-100 pr-4 shrink-0">
                      <p className="text-lg font-bold text-slate-800">{appt.time}</p>
                      <Clock size={14} className="text-slate-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-800 truncate">{patient?.name || 'Unknown Patient'}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tight ${
                          appt.type === 'Check-up' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                          {appt.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><MapPin size={12} /> Exam Room {Math.floor(Math.random() * 5) + 1}</span>
                        <span className="flex items-center gap-1"><Activity size={12} /> {doctor?.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {appt.status === 'Scheduled' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(appt.id, 'Completed')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                            title="Mark as Completed"
                          >
                            <CheckCircle2 size={20} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(appt.id, 'Cancelled')}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                            title="Cancel Appointment"
                          >
                            <XCircle size={20} />
                          </button>
                        </>
                      )}
                      
                      {appt.status === 'Completed' && (
                        <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                          <CheckCircle2 size={14} /> COMPLETED
                        </span>
                      )}

                      {appt.status === 'Cancelled' && (
                        <span className="flex items-center gap-1.5 text-rose-600 font-bold text-xs bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
                          <XCircle size={14} /> CANCELLED
                        </span>
                      )}

                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="bg-teal-900 rounded-3xl p-6 text-white overflow-hidden relative group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-xl font-bold flex items-center gap-2">
                  <AlertCircle className="text-teal-400" />
                  Staff Capacity Alert
                </h4>
                <p className="text-teal-200 text-sm mt-1 max-w-md">Dr. James Miller is reaching daily appointment limits. Consider redirecting cardio screenings to tomorrow.</p>
              </div>
              <button className="bg-white/10 hover:bg-white/20 transition-colors px-5 py-2.5 rounded-xl text-sm font-bold border border-white/20">
                View Staff Roster
              </button>
            </div>
            {/* Abstract Background pattern */}
            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-teal-800 rounded-full blur-3xl opacity-50 group-hover:bg-teal-700 transition-colors"></div>
          </div>
        </div>
      </div>

       {/* Add Appointment Modal */}
       {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6">New Appointment</h3>
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Patient</label>
                <select 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20"
                  value={newAppt.patientId}
                  onChange={e => setNewAppt({...newAppt, patientId: e.target.value})}
                >
                  <option value="">Select Patient</option>
                  {data.patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Doctor</label>
                 <select 
                   required
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20"
                   value={newAppt.doctorId}
                   onChange={e => setNewAppt({...newAppt, doctorId: e.target.value})}
                 >
                   {data.doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                 </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Date</label>
                    <input 
                      type="date"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20"
                      value={newAppt.date}
                      onChange={e => setNewAppt({...newAppt, date: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Time</label>
                    <input 
                      type="time"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20"
                      value={newAppt.time}
                      onChange={e => setNewAppt({...newAppt, time: e.target.value})}
                    />
                 </div>
              </div>
              <div className="pt-4 flex gap-3">
                 <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">Cancel</button>
                 <button type="submit" className="flex-1 py-3 bg-teal-600 rounded-xl font-bold text-white shadow-lg shadow-teal-100">Save Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

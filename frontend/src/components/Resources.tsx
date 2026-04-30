import { Database, Bed as BedIcon, Home, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AppData } from '../types';

interface ResourcesProps {
  data: AppData;
  onRefresh: () => void;
}

export default function Resources({ data }: ResourcesProps) {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Resource Dashboard</h1>
        <p className="text-slate-500">Monitor bed occupancy, room status, and medical equipment.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bed Management */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BedIcon className="text-teal-600" />
              Inpatient Bed Status
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Floor 1-3</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data.resources.beds.map(bed => (
              <div key={bed.id} className={`p-4 rounded-xl border transition-all ${
                bed.status === 'Available' 
                  ? 'bg-emerald-50 border-emerald-100' 
                  : 'bg-slate-50 border-slate-200 opacity-80'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs font-bold text-slate-500 uppercase">{bed.id}</p>
                  {bed.status === 'Available' ? (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  ) : (
                    <ShieldAlert size={14} className="text-slate-400" />
                  )}
                </div>
                <p className="font-bold text-slate-800 text-sm">{bed.name}</p>
                <p className={`text-[10px] font-black uppercase mt-1 ${
                  bed.status === 'Available' ? 'text-emerald-600' : 'text-slate-500'
                }`}>
                  {bed.status}
                </p>
              </div>
            ))}
            {/* Mocking more beds */}
            {Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="p-4 rounded-xl border bg-emerald-50 border-emerald-100">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold text-slate-500 uppercase">B10{i+3}</p>
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  </div>
                  <p className="font-bold text-slate-800 text-sm">Bed 10{i+3}</p>
                  <p className="text-[10px] font-black uppercase mt-1 text-emerald-600">Available</p>
               </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-slate-800">12</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-emerald-600">8</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Free</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-slate-400">4</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">In Use</p>
              </div>
            </div>
            <button className="text-sm font-bold text-teal-600 hover:underline">Manage Assignments</button>
          </div>
        </section>

        {/* Room Management */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Home className="text-indigo-600" />
              Examination Rooms
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Daily Schedule</span>
          </div>

          <div className="space-y-3">
            {data.resources.rooms.concat([{id: 'r3', name: 'Exam Room 3', status: 'Available'}]).map(room => (
              <div key={room.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    room.status === 'Available' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}></div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{room.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium font-mono uppercase">{room.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-tight ${
                    room.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {room.status}
                  </span>
                  <button className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 rounded transition-colors">Edit</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-3">
             <div className="bg-indigo-600 text-white p-2 rounded-lg">
               <Zap size={18} />
             </div>
             <div>
               <p className="text-sm font-bold text-indigo-900">Efficiency Insight</p>
               <p className="text-xs text-indigo-700">Exam Room 2 has been in use for 4 hours. Status update may be overdue.</p>
             </div>
          </div>
        </section>
      </div>

      {/* Equipment Alerts */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
             <Database className="text-rose-600" />
             Critical Equipment Inventory
           </h3>
           <button className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold border border-slate-200 transition-colors">
             Full Inventory Repot
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
             <div className="flex justify-between items-center mb-4">
               <p className="text-xs font-bold text-slate-500 uppercase">Oxygen Cylinders</p>
               <span className="text-emerald-600 font-bold text-sm">62%</span>
             </div>
             <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
               <div className="bg-emerald-500 h-full transition-all" style={{width: '62%'}}></div>
             </div>
             <p className="text-[10px] text-slate-500 mt-2 font-medium">8 units remaining of 12 required.</p>
           </div>

           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
             <div className="flex justify-between items-center mb-4">
               <p className="text-xs font-bold text-slate-500 uppercase">Surgical Masks</p>
               <span className="text-rose-600 font-bold text-sm">12%</span>
             </div>
             <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
               <div className="bg-rose-500 h-full transition-all" style={{width: '12%'}}></div>
             </div>
             <p className="text-[10px] text-rose-500 mt-2 font-bold">REORDER REQUIRED IMMEDIATELY</p>
           </div>

           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
             <div className="flex justify-between items-center mb-4">
               <p className="text-xs font-bold text-slate-500 uppercase">Defibrillator Units</p>
               <span className="text-emerald-600 font-bold text-sm">100%</span>
             </div>
             <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
               <div className="bg-emerald-500 h-full transition-all" style={{width: '100%'}}></div>
             </div>
             <p className="text-[10px] text-slate-500 mt-2 font-medium">All 4 units fully charged and functional.</p>
           </div>
        </div>
      </section>
    </div>
  );
}

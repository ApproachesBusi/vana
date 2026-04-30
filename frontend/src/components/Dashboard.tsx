import { 
  Users, 
  Calendar, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { AppData } from '../types';

interface DashboardProps {
  data: AppData;
  onRefresh: () => void;
}

export default function Dashboard({ data }: DashboardProps) {
  // Mock trend data
  const revenueData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 200 },
    { name: 'Sun', value: 100 },
  ];

  const appointmentData = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 15 },
    { name: 'Wed', value: 10 },
    { name: 'Thu', value: 18 },
    { name: 'Fri', value: 14 },
    { name: 'Sat', value: 5 },
    { name: 'Sun', value: 2 },
  ];

  const stats = [
    { 
      label: 'Total Patients', 
      value: data.patients.length.toString(), 
      icon: Users, 
      color: 'bg-blue-500', 
      trend: '+12%', 
      isPositive: true 
    },
    { 
      label: 'Appointments', 
      value: data.appointments.length.toString(), 
      icon: Calendar, 
      color: 'bg-teal-500', 
      trend: '+5%', 
      isPositive: true 
    },
    { 
      label: 'Monthly Revenue', 
      value: `$${data.billing.reduce((acc, curr) => acc + curr.amount, 0)}`, 
      icon: DollarSign, 
      color: 'bg-indigo-500', 
      trend: '-2%', 
      isPositive: false 
    },
    { 
      label: 'Clinic Activity', 
      value: '84%', 
      icon: Activity, 
      color: 'bg-rose-500', 
      trend: '+3%', 
      isPositive: true 
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Clinic Overview</h1>
        <p className="text-slate-500">Welcome back, Dr. Wilson. Here's what's happening today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Revenue Stream</h3>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-sm outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#0D9488" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Appointment Load</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#F1F5F9'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity & Next Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Upcoming Appointments</h3>
          <div className="space-y-4">
            {data.appointments.slice(0, 4).map((appt, idx) => {
              const patient = data.patients.find(p => p.id === appt.patientId);
              return (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                    {patient?.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{patient?.name}</p>
                    <p className="text-xs text-slate-500">{appt.type} • {appt.time}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      appt.status === 'Scheduled' ? 'bg-blue-50 text-blue-600' : 'bg-teal-50 text-teal-600'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">System Alerts</h3>
          <div className="space-y-3">
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3">
              <Clock className="text-orange-600 shrink-0" size={20} />
              <div>
                <p className="text-sm font-semibold text-orange-800">Equipment Maintenance Due</p>
                <p className="text-xs text-orange-700 mt-1">Exam Room 2 ultrasound machine needs calibration by end of week.</p>
              </div>
            </div>
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3">
              <Activity className="text-red-600 shrink-0" size={20} />
              <div>
                <p className="text-sm font-semibold text-red-800">Low Inventory: Insulin</p>
                <p className="text-xs text-red-700 mt-1">Stock levels for Insulin are below 15%. Reorder immediately.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

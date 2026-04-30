import { useState, FormEvent } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Download, 
  Plus, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft,
  FileText,
  Clock
} from 'lucide-react';
import { AppData, BillingRecord } from '../types';
import { api } from '../lib/api';

interface BillingProps {
  data: AppData;
  onRefresh: () => void;
}

export default function Billing({ data, onRefresh }: BillingProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBill, setNewBill] = useState<Omit<BillingRecord, "id" | "date">>({
    patientId: '',
    amount: 0,
    status: 'Pending',
    description: ''
  });

  const totalRevenue = data.billing.filter(b => b.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingRevenue = data.billing.filter(b => b.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddBill = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.addBilling(newBill);
      setShowAddModal(false);
      onRefresh();
    } catch (error) {
       console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Financial Management</h1>
          <p className="text-slate-500">Track invoices, payments, and clinic revenue.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all"
        >
          <Plus size={20} />
          Create New Invoice
        </button>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-800">${totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase border-t border-slate-50 pt-3">
            <ArrowUpRight size={14} /> +8.2% from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Payments</p>
              <h3 className="text-2xl font-bold text-slate-800">${pendingRevenue.toLocaleString()}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-amber-600 uppercase border-t border-slate-50 pt-3">
             {data.billing.filter(b => b.status === 'Pending').length} Active Invoices
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Operational Costs</p>
              <h3 className="text-2xl font-bold text-slate-800">$4,250</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase border-t border-slate-50 pt-3">
            <ArrowDownLeft size={14} /> -3.5% optimization
          </div>
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Recent Transactions</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search invoices..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none w-64" />
            </div>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Download size={18} className="text-slate-500" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.billing.map(bill => {
                const patient = data.patients.find(p => p.id === bill.patientId);
                return (
                  <tr key={bill.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">INV-{bill.id.slice(-4).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                          {patient?.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{patient?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{bill.description}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">{bill.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">${bill.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tight ${
                        bill.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all" title="View PDF">
                          <FileText size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all" title="Download">
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

       {/* Add Billing Modal */}
       {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Generate New Invoice</h3>
            <form onSubmit={handleAddBill} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Patient</label>
                <select 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20"
                  value={newBill.patientId}
                  onChange={e => setNewBill({...newBill, patientId: e.target.value})}
                >
                  <option value="">Select Patient</option>
                  {data.patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Description of Service</label>
                 <input 
                   type="text"
                   required
                   placeholder="e.g. Health Check-up, Consultation"
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20"
                   value={newBill.description}
                   onChange={e => setNewBill({...newBill, description: e.target.value})}
                 />
              </div>
              <div>
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Billable Amount ($)</label>
                 <input 
                   type="number"
                   required
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20"
                   value={newBill.amount}
                   onChange={e => setNewBill({...newBill, amount: parseFloat(e.target.value)})}
                 />
              </div>
              <div>
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Payment Status</label>
                 <select 
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20"
                   value={newBill.status}
                   onChange={e => setNewBill({...newBill, status: e.target.value as any})}
                 >
                   <option value="Pending">Pending</option>
                   <option value="Paid">Paid</option>
                 </select>
              </div>
              <div className="pt-4 flex gap-3">
                 <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">Cancel</button>
                 <button type="submit" className="flex-1 py-3 bg-teal-600 rounded-xl font-bold text-white shadow-lg shadow-teal-100">Issue Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

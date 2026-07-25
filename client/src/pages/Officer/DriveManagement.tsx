import React, { useState } from 'react';
import { Calendar, Briefcase, Users, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

export const DriveManagement: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [drives, setDrives] = useState([
    { id: '1', company: 'Microsoft', role: 'SDE-1', status: 'Test', date: '2023-11-15' },
    { id: '2', company: 'Google', role: 'Frontend Engineer', status: 'Interview', date: '2023-11-20' },
  ]);

  const [company, setCompany] = useState('Microsoft');
  const [role, setRole] = useState('');
  const [date, setDate] = useState('');

  const handleCreateDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (company && role && date) {
      setDrives([...drives, { id: Date.now().toString(), company, role, status: 'Eligible Students', date }]);
      setIsCreating(false);
      setCompany('Microsoft');
      setRole('');
      setDate('');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Placement Drive</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Drive Management</h2>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all"
        >
          Create Drive
        </button>
      </div>

      {isCreating && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md animate-in slide-in-from-top-4 fade-in">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Initialize New Drive</h3>
          <form onSubmit={handleCreateDrive} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Select Company</label>
              <select 
                value={company} onChange={(e) => setCompany(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500"
              >
                <option value="Microsoft">Microsoft</option>
                <option value="Google">Google</option>
                <option value="Amazon">Amazon</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Target Role</label>
              <input 
                type="text" required value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. SDE"
                className="w-full mt-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Drive Date</label>
              <input 
                type="date" required value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg shadow-md">Launch Drive</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {drives.map(drive => (
          <div key={drive.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-6 group hover:border-indigo-200 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-500" /> {drive.company}
                </h3>
                <p className="text-sm font-semibold text-slate-500 mt-1">{drive.role} • <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> {drive.date}</span></p>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-full uppercase tracking-wider">{drive.status} Phase</span>
            </div>

            {/* Pipeline progress */}
            <div className="relative pt-4">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full"></div>
              <div className="relative z-10 flex justify-between">
                
                {['Eligible Students', 'Test', 'Interview', 'Offer'].map((step, idx) => {
                  const stages = ['Eligible Students', 'Test', 'Interview', 'Offer'];
                  const currentIdx = stages.indexOf(drive.status);
                  const isCompleted = idx < currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
                        isCompleted ? 'bg-emerald-500 text-white' : 
                        isCurrent ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 scale-110' : 
                        'bg-slate-100 text-slate-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : (idx + 1)}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isCurrent ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}

              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-4 mt-2">
              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Manage Phase <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

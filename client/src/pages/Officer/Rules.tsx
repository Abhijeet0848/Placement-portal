import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export const Rules: React.FC = () => {
  const [minGPA, setMinGPA] = useState(7.0);
  const [allowedBranches, setAllowedBranches] = useState<string[]>(['MCA', 'B.Tech CSE']);
  const [backlogsLimit, setBacklogsLimit] = useState(0);
  const [message, setMessage] = useState('');

  const handleToggleBranch = (branch: string) => {
    if (allowedBranches.includes(branch)) {
      setAllowedBranches(allowedBranches.filter(b => b !== branch));
    } else {
      setAllowedBranches([...allowedBranches, branch]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Campus-wide eligibility rules configuration updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-xs text-emerald-400 font-semibold text-center animate-pulse">
          {message}
        </div>
      )}

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 max-w-xl mx-auto">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-850 pb-3">
          <ShieldCheck className="h-4.5 w-4.5 text-indigo-400" />
          <span>Campus Eligibility Rules</span>
        </h4>

        <p className="text-xs text-slate-400 leading-normal">
          Define base recruitment thresholds for student drives. Profiles not satisfying these rules are flagged during job applications.
        </p>

        <form onSubmit={handleSave} className="space-y-4 pt-2 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Default Minimum CGPA</label>
            <input
              type="number"
              step="0.1"
              value={minGPA}
              onChange={(e) => setMinGPA(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl text-xs glass-input text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Allowed Academic Branches</label>
            <div className="flex flex-wrap gap-2">
              {['MCA', 'B.Tech CSE', 'ECE', 'Mech Eng'].map(branch => {
                const active = allowedBranches.includes(branch);
                return (
                  <button
                    key={branch}
                    type="button"
                    onClick={() => handleToggleBranch(branch)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                      active 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {branch}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maximum Allowed Backlogs</label>
            <input
              type="number"
              value={backlogsLimit}
              onChange={(e) => setBacklogsLimit(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl text-xs glass-input text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/10"
          >
            Save Rules Settings
          </button>
        </form>
      </div>
    </div>
  );
};

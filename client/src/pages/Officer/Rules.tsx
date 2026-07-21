import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export const Rules: React.FC = () => {
  const [minGPA, setMinGPA] = useState(7.0);
  const [allowedBranches, setAllowedBranches] = useState<string[]>(['MCA', 'B.Tech CSE']);
  const [backlogsLimit, setBacklogsLimit] = useState(0);
  const [activeRules, setActiveRules] = useState<{ minGPA: number, branches: string[], backlogs: number } | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('activeRules');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setActiveRules(parsed);
        setMinGPA(parsed.minGPA);
        setAllowedBranches(parsed.branches);
        setBacklogsLimit(parsed.backlogs);
      } catch (e) {
        console.error("Failed to parse saved rules");
      }
    }
  }, []);

  const handleToggleBranch = (branch: string) => {
    if (allowedBranches.includes(branch)) {
      setAllowedBranches(allowedBranches.filter(b => b !== branch));
    } else {
      setAllowedBranches([...allowedBranches, branch]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const rules = { minGPA, branches: allowedBranches, backlogs: backlogsLimit };
    setActiveRules(rules);
    localStorage.setItem('activeRules', JSON.stringify(rules));
    setMessage('Campus-wide eligibility rules configuration updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRemoveRules = () => {
    setMinGPA(0);
    setAllowedBranches([]);
    setBacklogsLimit(0);
    setActiveRules(null);
    localStorage.removeItem('activeRules');
    setMessage('All eligibility rules have been removed.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-semibold text-center animate-pulse max-w-5xl mx-auto">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="h-4.5 w-4.5 text-indigo-500" />
          <span>Campus Eligibility Rules</span>
        </h4>

        <p className="text-xs text-slate-500 leading-normal">
          Define base recruitment thresholds for student drives. Profiles not satisfying these rules are flagged during job applications.
        </p>

        <form onSubmit={handleSave} className="space-y-4 pt-2 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Default Minimum CGPA</label>
            <input
              type="number"
              step="0.1"
              value={minGPA || ''}
              onChange={(e) => setMinGPA(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Allowed Academic Branches</label>
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
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {branch}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Maximum Allowed Backlogs</label>
            <input
              type="number"
              value={backlogsLimit === 0 ? '' : backlogsLimit}
              onChange={(e) => setBacklogsLimit(Number(e.target.value))}
              placeholder="0"
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleRemoveRules}
              className="w-1/3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold transition-all"
            >
              Remove Rules
            </button>
            <button
              type="submit"
              className="w-2/3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10"
            >
              Save Rules Settings
            </button>
          </div>
        </form>
      </div>

      {/* Active Rules Display */}
        <div className="h-full">
          {activeRules ? (
            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 shadow-sm h-full flex flex-col">
              <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-6 border-b border-indigo-100 pb-3 flex items-center space-x-2">
                <ShieldCheck className="h-4.5 w-4.5 text-indigo-500" />
                <span>Currently Enforced Rules</span>
              </h4>
              <div className="space-y-4 text-sm text-slate-700 flex-1">
                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                  <span className="font-medium text-slate-500">Minimum CGPA</span>
                  <span className="font-bold text-slate-900 text-lg">{activeRules.minGPA.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                  <span className="font-medium text-slate-500">Maximum Backlogs</span>
                  <span className="font-bold text-slate-900 text-lg">{activeRules.backlogs}</span>
                </div>
                <div className="flex flex-col bg-white p-3 rounded-xl border border-slate-100 space-y-3">
                  <span className="font-medium text-slate-500">Allowed Academic Branches</span>
                  <div className="flex flex-wrap gap-2">
                    {activeRules.branches.length > 0 ? activeRules.branches.map(b => (
                      <span key={b} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold">{b}</span>
                    )) : (
                      <span className="text-slate-400 italic text-xs">None (All rejected)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col items-center justify-center text-center space-y-3">
              <ShieldCheck className="h-10 w-10 text-slate-300" />
              <p className="text-sm text-slate-500 font-medium">No active eligibility rules are currently enforced.</p>
              <p className="text-xs text-slate-400">All students are eligible by default.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Building2, PlusCircle, Trash2 } from 'lucide-react';

export const ManageCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<string[]>([]);
  const [newCompany, setNewCompany] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCompany = () => {
    if (newCompany.trim()) {
      setCompanies([...companies, newCompany.trim()]);
      setNewCompany('');
      setIsAdding(false);
    }
  };

  const handleRemoveCompany = (companyToRemove: string) => {
    setCompanies(companies.filter(c => c !== companyToRemove));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Manage Companies</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Partner companies</h2>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <PlusCircle className="h-4 w-4" />
            Add company
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <input 
            type="text" 
            placeholder="Enter company name..."
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCompany()}
            className="flex-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            autoFocus
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={handleAddCompany} 
              className="flex-1 sm:flex-none rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              Save
            </button>
            <button 
              onClick={() => setIsAdding(false)} 
              className="flex-1 sm:flex-none rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {companies.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
            <Building2 className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No companies added</h3>
          <p className="text-sm text-slate-500">Add partner companies to see them listed here.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company, index) => (
            <div key={index} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:shadow-md hover:border-indigo-100 group">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 truncate max-w-[150px]">{company}</h3>
              </div>
              <button 
                onClick={() => handleRemoveCompany(company)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Remove company"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

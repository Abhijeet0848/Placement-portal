import React from 'react';
import { Building2, PlusCircle } from 'lucide-react';

export const ManageCompanies: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Manage Companies</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Partner companies</h2>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500">
            <PlusCircle className="h-4 w-4" />
            Add company
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Google, Microsoft, Infosys, TCS</h3>
            <p className="text-sm text-slate-500">Active campus recruiters and hiring partners</p>
          </div>
        </div>
      </div>
    </div>
  );
};

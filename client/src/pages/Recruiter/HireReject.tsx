import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const candidates = [
  { name: 'Kavya Rao', role: 'Product Designer', status: 'Pending' },
  { name: 'Sourav Jain', role: 'Frontend Engineer', status: 'Shortlisted' },
];

export const HireReject: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Hire / Reject</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Decision center</h2>
      </div>

      <div className="space-y-3">
        {candidates.map((candidate) => (
          <div key={candidate.name} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{candidate.name}</p>
                <p className="text-sm text-slate-500">{candidate.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">{candidate.status}</span>
                <button className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Hire
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

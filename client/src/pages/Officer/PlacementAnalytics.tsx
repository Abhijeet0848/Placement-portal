import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

export const PlacementAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">View Placement Analytics</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Placement performance overview</h2>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Overall placement rate</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">84%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Average package</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">11.7 LPA</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Growth</p>
          <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-emerald-700">
            <TrendingUp className="h-5 w-5" />
            +6%
          </p>
        </div>
      </div>
    </div>
  );
};

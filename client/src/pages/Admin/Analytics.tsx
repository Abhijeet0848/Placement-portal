import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

export const AnalyticsPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Analytics</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Admin performance insights</h2>
          </div>
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Active users</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">1,240</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Placement success</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">84%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Weekly growth</p>
          <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-emerald-700">
            <TrendingUp className="h-5 w-5" />
            +12%
          </p>
        </div>
      </div>
    </div>
  );
};

export const Analytics = AnalyticsPanel;

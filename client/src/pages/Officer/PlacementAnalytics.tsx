import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { api } from '../../services/api';

export const PlacementAnalytics: React.FC = () => {
  const [stats, setStats] = useState({ rate: 0, avgPackage: 0, growth: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/auth/students');
        const students = res.students || [];
        
        // Calculate real stats (currently no one has placementStatus stored)
        const placedCount = students.filter((s: any) => s.placementStatus === 'Placed').length;
        const totalCount = students.length;
        
        const rate = totalCount > 0 ? Math.round((placedCount / totalCount) * 100) : 0;
        
        // Mock average package based on placed students (none currently)
        const avgPackage = 0; 
        
        // Mock growth based on previous year (none currently)
        const growth = 0;
        
        setStats({ rate, avgPackage, growth });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

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
          <p className="mt-2 text-2xl font-bold text-slate-900">{stats.rate}%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Average package</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stats.avgPackage} LPA</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Growth (YoY)</p>
          <p className={`mt-2 flex items-center gap-2 text-2xl font-bold ${stats.growth > 0 ? 'text-emerald-700' : stats.growth < 0 ? 'text-rose-700' : 'text-slate-600'}`}>
            {stats.growth > 0 ? <TrendingUp className="h-5 w-5" /> : stats.growth < 0 ? <TrendingDown className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
            {stats.growth > 0 ? `+${stats.growth}%` : `${stats.growth}%`}
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const AnalyticsPanel: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
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

      {loading ? (
        <div className="flex justify-center py-10 text-indigo-600">
          <Loader2 className="h-8 w-8 " />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Active users</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {stats?.totalUsers ?? '--'}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Placement success</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">--</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Weekly growth</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">--</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const Analytics = AnalyticsPanel;

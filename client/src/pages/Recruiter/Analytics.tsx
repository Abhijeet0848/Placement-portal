 import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, CheckCircle2, Award, Target } from 'lucide-react';
import { api } from '../../services/api';

export const Analytics: React.FC = () => {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/recruiter/dashboard');
        setStatsData(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalApplicants = statsData?.totalApplicants || 0;
  
  // Find funnel data
  const getFunnelCount = (name: string) => {
    if (!statsData?.funnelData) return 0;
    const item = statsData.funnelData.find((f: any) => f.name === name);
    return item ? item.Count : 0;
  };

  const applications = totalApplicants;
  const shortlisted = getFunnelCount('Shortlisted');
  const selected = getFunnelCount('Selected');

  const stats = [
    { label: 'Applications received', value: applications.toString(), icon: Users, color: 'from-indigo-500 to-blue-500' },
    { label: 'Candidates shortlisted', value: shortlisted.toString(), icon: BarChart3, color: 'from-purple-500 to-pink-500' },
    { label: 'Offers accepted', value: selected.toString(), icon: CheckCircle2, color: 'from-emerald-500 to-green-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recruiting Analytics</h3>
              <p className="text-base text-slate-700 leading-relaxed mt-1">
                Track your hiring performance, candidate conversion rates, and recruitment metrics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl hover:shadow-xl ">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900">{loading ? '...' : item.value}</p>
                  <p className="text-sm text-slate-600 mt-1 font-medium">{item.label}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Award className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="text-slate-700 font-semibold">Top 10% performer</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <Target className="h-5 w-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider">Conversion Funnel</h4>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">Applications Received</span>
                  <span className="text-sm font-black text-indigo-600">{applications}</span>
                </div>
                <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500" style={{ width: applications ? '100%' : '0%' }}></div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">Candidates Shortlisted</span>
                  <span className="text-sm font-black text-purple-600">{shortlisted}</span>
                </div>
                <div className="h-2 w-full bg-purple-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: applications ? `${(shortlisted / applications) * 100}%` : '0%' }}></div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700">Offers Accepted</span>
                  <span className="text-sm font-black text-emerald-600">{selected}</span>
                </div>
                <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500" style={{ width: applications ? `${(selected / applications) * 100}%` : '0%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <Award className="h-5 w-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider">Performance Metrics</h4>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Response Rate</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">
                      {applications > 0 ? Math.round(((shortlisted + selected) / applications) * 100) : 0}%
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {applications > 0 && ((shortlisted + selected) / applications) > 0.5 ? 'A+' : 'B'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Avg. Time to Hire</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">5 days</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">FAST</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Selection Ratio</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{statsData?.selectionRatio || '0.0'}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">TOP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

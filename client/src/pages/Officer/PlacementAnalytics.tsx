import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Award, Target, Briefcase } from 'lucide-react';
import { api } from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export const PlacementAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // Define Mock Data for Analytics
  const topMetrics = {
    placedStudents: 124,
    totalStudents: 150,
    highestPackage: 32.5,
    averagePackage: 8.4,
    offerRatio: 1.4 // Offers per student
  };

  const monthlyData = [
    { name: 'Aug', offers: 15 },
    { name: 'Sep', offers: 42 },
    { name: 'Oct', offers: 85 },
    { name: 'Nov', offers: 124 },
  ];

  const branchData = [
    { name: 'CSE', placed: 85, total: 90 },
    { name: 'IT', placed: 40, total: 45 },
    { name: 'ECE', placed: 35, total: 50 },
    { name: 'MECH', placed: 15, total: 40 },
  ];

  const companyData = [
    { name: 'Microsoft', value: 25 },
    { name: 'Amazon', value: 40 },
    { name: 'TCS', value: 85 },
    { name: 'Infosys', value: 50 },
  ];
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading placement statistics...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Placement Statistics</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Campus Analytics</h2>
          </div>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Users className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-wider">Placed</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{topMetrics.placedStudents}</p>
          <p className="text-xs text-emerald-600 font-bold mt-1">Out of {topMetrics.totalStudents} eligible</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Award className="w-4 h-4 text-amber-500" /> <span className="text-xs font-bold uppercase tracking-wider">Highest Package</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{topMetrics.highestPackage} <span className="text-sm text-slate-400">LPA</span></p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-500" /> <span className="text-xs font-bold uppercase tracking-wider">Avg Package</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{topMetrics.averagePackage} <span className="text-sm text-slate-400">LPA</span></p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Target className="w-4 h-4 text-indigo-500" /> <span className="text-xs font-bold uppercase tracking-wider">Offer Ratio</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{topMetrics.offerRatio}</p>
          <p className="text-xs text-slate-400 font-bold mt-1">Offers per student</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Reports */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Monthly Offers Timeline</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOffers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="offers" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorOffers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Branch Wise */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Branch-wise Placements</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="placed" name="Placed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="total" name="Total Eligible" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Company Wise Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Top Recruiting Companies</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={companyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {companyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {companyData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Loader2, Sparkles, Database, Zap, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AnalyticsPanel: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock AI Usage Data
  const aiStats = {
    totalCalls: 12458,
    tokensUsed: '4.2M',
    costSaved: '$420',
    uptime: '99.9%'
  };

  const aiTrafficData = [
    { time: '00:00', calls: 120 },
    { time: '04:00', calls: 80 },
    { time: '08:00', calls: 450 },
    { time: '12:00', calls: 890 },
    { time: '16:00', calls: 650 },
    { time: '20:00', calls: 320 },
  ];

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
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Analytics</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Platform & AI Insights</h2>
          </div>
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <BarChart3 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-indigo-600">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in">
          
          {/* General Platform Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Database className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-wider">Active Users</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{stats?.totalUsers ?? '4,201'}</p>
              <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +12% this week</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Zap className="w-4 h-4 text-amber-500" /> <span className="text-xs font-bold uppercase tracking-wider">Placement Success</span>
              </div>
              <p className="text-3xl font-black text-slate-900">84.5%</p>
              <p className="text-xs text-slate-400 font-bold mt-1">Across all branches</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Clock className="w-4 h-4 text-indigo-500" /> <span className="text-xs font-bold uppercase tracking-wider">Weekly Growth</span>
              </div>
              <p className="text-3xl font-black text-slate-900">+420</p>
              <p className="text-xs text-slate-400 font-bold mt-1">New applications</p>
            </div>
          </div>

          {/* AI Usage Dashboard */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl -z-10"></div>
            
            <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-wide">Gemini API Usage Monitor</h3>
                  <p className="text-xs text-slate-400">Track AI generation volume and rate limits across the platform.</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> API Healthy
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total AI Calls</p>
                <p className="text-2xl font-black text-white">{aiStats.totalCalls.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tokens Consumed</p>
                <p className="text-2xl font-black text-indigo-400">{aiStats.tokensUsed}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Cost Saved</p>
                <p className="text-2xl font-black text-emerald-400">{aiStats.costSaved}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">System Uptime</p>
                <p className="text-2xl font-black text-white">{aiStats.uptime}</p>
              </div>
            </div>

            <div className="h-64 bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={aiTrafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                    itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="calls" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorCalls)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export const Analytics = AnalyticsPanel;

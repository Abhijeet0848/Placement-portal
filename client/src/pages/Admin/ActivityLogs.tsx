import React, { useState, useEffect } from 'react';
import { Activity, Clock3, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const ActivityLogsPanel: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/admin/activity-logs');
        setLogs(res.logs);
      } catch (error) {
        console.error('Failed to fetch activity logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Activity Logs</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Portal activity stream</h2>
          </div>
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <Activity className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-10 text-indigo-600">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="rounded-full bg-slate-50 p-4 text-slate-400 mb-4 border-2 border-slate-100">
                <Activity className="h-8 w-8" />
              </div>
              <p className="text-base font-bold text-slate-700">No recent activity</p>
              <p className="text-sm text-slate-500 mt-1">There are no portal activities to show at this time.</p>
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={log._id || i} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                  <Clock3 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{log.user}</p>
                  <p className="text-sm text-slate-600">{log.action}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export const ActivityLogs = ActivityLogsPanel;

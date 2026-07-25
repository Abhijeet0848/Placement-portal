import React, { useState, useEffect } from 'react';
import { Activity, Clock3, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const ActivityLogsPanel: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/admin/activity-logs');
        setLogs(response.logs || []);
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
              <Loader2 className="h-8 w-8 " />
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
              <div key={log._id || i} className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`rounded-xl p-2.5 ${
                    log.severity === 'high' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                    log.severity === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-indigo-50 text-indigo-600 border border-indigo-100'
                  }`}>
                    <Clock3 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-slate-900">{log.user}</p>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                        log.severity === 'high' ? 'bg-rose-100 text-rose-700' :
                        log.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {log.severity || 'info'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium">{log.action}</p>
                  </div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export const ActivityLogs = ActivityLogsPanel;

import React from 'react';
import { Activity, Clock3 } from 'lucide-react';

export const ActivityLogsPanel: React.FC = () => {
  const logs = [
    { time: '08:45 AM', user: 'Sarah Connor', action: 'Sent interview invite to shortlisted candidates' },
    { time: '10:10 AM', user: 'Dr. Ramesh Kumar', action: 'Verified student documents for placement drive' },
    { time: '12:30 PM', user: 'System Admin', action: 'Backed up placement database successfully' }
  ];

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
          {logs.map((log) => (
            <div key={log.time + log.user} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <Clock3 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{log.user}</p>
                <p className="text-sm text-slate-600">{log.action}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ActivityLogs = ActivityLogsPanel;

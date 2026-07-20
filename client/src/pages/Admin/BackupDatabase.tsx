import React from 'react';
import { DatabaseBackup, DownloadCloud } from 'lucide-react';

export const BackupDatabasePanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Backup Database</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Secure your placement records</h2>
          </div>
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <DatabaseBackup className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Last backup</p>
          <p className="mt-2 text-sm text-slate-600">July 18, 2026 at 7:30 PM • Successful</p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500">
            <DownloadCloud className="h-4 w-4" />
            Create backup
          </button>
        </div>
      </div>
    </div>
  );
};

export const BackupDatabase = BackupDatabasePanel;

import React, { useState } from 'react';
import { DatabaseBackup, DownloadCloud, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const BackupDatabasePanel: React.FC = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    setMessage('');
    try {
      const res = await api.post('/admin/backup');
      
      // Trigger browser download
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `placement-portal-backup-${res.timestamp.replace(/[:.]/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setLastBackup(res.timestamp);
      setMessage('Backup created and downloaded successfully!');
    } catch (error: any) {
      setMessage(`Backup failed: ${error.message}`);
    } finally {
      setIsBackingUp(false);
    }
  };
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
          {lastBackup ? (
            <p className="mt-2 text-sm text-emerald-600 font-semibold">
              {new Date(lastBackup).toLocaleString()} • Successful
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-500 italic">No previous backups found.</p>
          )}

          {message && (
            <p className={`mt-2 text-xs font-bold ${message.includes('failed') ? 'text-rose-600' : 'text-emerald-600'}`}>
              {message}
            </p>
          )}

          <button
            onClick={handleCreateBackup}
            disabled={isBackingUp}
            className={`mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 ${isBackingUp ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isBackingUp ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <DownloadCloud className="h-4 w-4" />
            )}
            {isBackingUp ? 'Creating backup...' : 'Create backup'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const BackupDatabase = BackupDatabasePanel;

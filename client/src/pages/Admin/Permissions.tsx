import React from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';

export const PermissionsPanel: React.FC = () => {
  const permissions = [
    { role: 'Student', access: 'Apply jobs, view profile, forum' },
    { role: 'Recruiter', access: 'Create jobs, view candidates, send emails' },
    { role: 'Placement Officer', access: 'Verify docs, manage rules, reports' },
    { role: 'Admin', access: 'Full access to users, logs, backups' }
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Permission Management</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Role-based access control</h2>
          </div>
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <KeyRound className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          {permissions.map((perm) => (
            <div key={perm.role} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-900">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                <h3 className="font-semibold">{perm.role}</h3>
              </div>
              <p className="mt-2 text-sm text-slate-600">{perm.access}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Permissions = PermissionsPanel;

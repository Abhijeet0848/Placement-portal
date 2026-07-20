import React from 'react';
import { BellRing, Send } from 'lucide-react';

export const SendNotices: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <BellRing className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Send Notices</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Campus announcements</h2>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <label className="text-sm font-semibold text-slate-700">Notice title</label>
        <input className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none" defaultValue="Placement drive update" />

        <label className="mt-4 block text-sm font-semibold text-slate-700">Message</label>
        <textarea rows={5} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none" defaultValue="Please review the updated eligibility criteria and prepare your documents for the next drive." />

        <button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500">
          <Send className="h-4 w-4" />
          Broadcast notice
        </button>
      </div>
    </div>
  );
};

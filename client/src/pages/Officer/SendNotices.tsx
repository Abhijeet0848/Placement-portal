import React, { useState } from 'react';
import { BellRing, Send } from 'lucide-react';
import { api } from '../../services/api';

export const SendNotices: React.FC = () => {
  const [title, setTitle] = useState('Placement drive update');
  const [message, setMessage] = useState('Please review the updated eligibility criteria and prepare your documents for the next drive.');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleBroadcast = async () => {
    if (!title || !message) {
      setStatus({ type: 'error', text: 'Title and message are required.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await api.post('/notifications/broadcast', { title, message });
      setStatus({ type: 'success', text: response.message || 'Notice broadcasted successfully!' });
      setTitle('');
      setMessage('');
    } catch (error: any) {
      setStatus({ type: 'error', text: error.response?.data?.message || 'Failed to broadcast notice.' });
    } finally {
      setLoading(false);
    }
  };
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

      {status && (
        <div className={`p-4 rounded-xl text-sm font-semibold text-center ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {status.text}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <label className="text-sm font-semibold text-slate-700">Notice title</label>
        <input 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 transition-all" 
          placeholder="Enter notice title" 
        />

        <label className="mt-4 block text-sm font-semibold text-slate-700">Message</label>
        <textarea 
          rows={5} 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 transition-all" 
          placeholder="Enter your message here..." 
        />

        <button 
          onClick={handleBroadcast}
          disabled={loading}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Send className="h-4 w-4" />
          )}
          {loading ? 'Broadcasting...' : 'Broadcast notice'}
        </button>
      </div>
    </div>
  );
};
